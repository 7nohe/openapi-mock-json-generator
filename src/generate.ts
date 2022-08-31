import { OpenAPIV3 } from "openapi-types";
import { CLIOptions } from "./cli";
import { parse } from "./parse";
import _ from "lodash";
import { transformJSONSchemaToFakerJson } from "./transform";
import { faker } from "@faker-js/faker";
import { print } from "./print";
import { UsableLocale } from "@faker-js/faker";

faker.seed(1);

export const generate = async (options: CLIOptions) => {
  const { input, locals = 'en' } = options;
  faker.locale = locals;
  const doc = await parse(input);
  const operations = getOperationDefinitions(doc);
  operations.forEach(operation => {
    operation.responses.forEach(response => {
      const fileName = `${operation.method}${operation.path.replace(/\//g, "-")}-${response.code}.json`;
      const json = transformJSONSchemaToFakerJson(options, response.jsonContent);
      print(json, fileName, options);
    })
  })
};

type OperationDefinition = {
  path: string;
  method: string;
  responses: ({
    code: string;
    jsonContent?: OpenAPIV3.MediaTypeObject;
  } & (OpenAPIV3.ResponseObject | OpenAPIV3.ReferenceObject))[];
};

const operationKeys = Object.values(
  OpenAPIV3.HttpMethods
) as OpenAPIV3.HttpMethods[];

function getOperationDefinitions(
  v3Doc: OpenAPIV3.Document
): OperationDefinition[] {
  return Object.entries(v3Doc.paths).flatMap(([path, pathItem]) =>
    !pathItem
      ? []
      : Object.entries(pathItem)
          .filter((arg): arg is [string, OpenAPIV3.OperationObject] =>
            operationKeys.includes(arg[0] as any)
          )
          .map(([method, operation]) => ({
            path,
            method,
            responses: Object.entries(operation.responses).map(
              ([code, response]) => ({
                ...response,
                code,
                jsonContent:
                  "content" in response &&
                  resolveResponseContent(
                    v3Doc,
                    response?.content?.["application/json"]
                  ),
              })
            ),
          }))
  );
}

const resolveResponseContent = (
  v3Doc: OpenAPIV3.Document,
  content?: OpenAPIV3.MediaTypeObject
) => {
  const schema = content?.schema;
  if (schema) {
    return recursiveResolveSchema(v3Doc, schema);
  }
  return content;
};

function recursiveResolveSchema(
  v3Doc: OpenAPIV3.Document,
  schema: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject
) {
  let resolvedSchema =
    "$ref" in schema
      ? (getReference(v3Doc, schema.$ref) as OpenAPIV3.SchemaObject)
      : schema;
  // Resolve 'array' type
  if (resolvedSchema.type === "array") {
    resolvedSchema.items =
      "$ref" in resolvedSchema.items
        ? getReference(v3Doc, resolvedSchema.items.$ref)
        : resolvedSchema.items;
    resolvedSchema.items = recursiveResolveSchema(v3Doc, resolvedSchema.items);
  }

  // Resolve 'object' type
  if (resolvedSchema.type === "object") {
    if (
      !resolvedSchema.properties &&
      typeof resolvedSchema.additionalProperties === "object"
    ) {
      if ("$ref" in resolvedSchema.additionalProperties) {
        resolvedSchema.additionalProperties = recursiveResolveSchema(
          v3Doc,
          getReference(v3Doc, resolvedSchema.additionalProperties.$ref)
        );
      }
    }

    // Resolve 'object' type properties
    if (resolvedSchema.properties) {
      resolvedSchema.properties = Object.entries(
        resolvedSchema.properties
      ).reduce((resolved, [key, value]) => {
        resolved[key] = recursiveResolveSchema(v3Doc, value);
        return resolved;
      }, {} as Record<string, OpenAPIV3.SchemaObject>);
    }
  }

  // Convert allOf keyword object to 'array' type object
  if (resolvedSchema.allOf) {
    resolvedSchema.allOf = resolvedSchema.allOf.map((item) =>
      recursiveResolveSchema(v3Doc, item)
    ) as OpenAPIV3.SchemaObject[];

    resolvedSchema = {
      type: "object",
      ...(resolvedSchema.allOf as OpenAPIV3.SchemaObject[]).reduce(
        (resolved, item) => _.merge(resolved, item),
        {}
      ),
    };
  }
  return resolvedSchema;
}

export function getReference(spec: any, ref: string) {
  const path = ref
    .slice(2)
    .split("/")
    .map((s) => unescape(s.replace(/~1/g, "/").replace(/~0/g, "~")));

  const ret = _.get(spec, path);
  if (typeof ret === "undefined") {
    throw new Error(`Can't find ${path}`);
  }
  return ret;
}
