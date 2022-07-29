import { faker } from "@faker-js/faker";
import { OpenAPIV3 } from "openapi-types";

export function transformJSONSchemaToFakerCode(
  jsonSchema?: OpenAPIV3.SchemaObject,
  key?: string
): string {
  if (!jsonSchema) {
    return "{}";
  }

  if (jsonSchema.example) {
    return JSON.stringify(jsonSchema.example);
  }

  if (Array.isArray(jsonSchema.type)) {
    return faker.helpers.arrayElement([
      jsonSchema.type
        .map((type) => transformJSONSchemaToFakerCode({ ...jsonSchema, type }))
        .join(","),
    ]);
  }

  if (jsonSchema.enum) {
    return faker.helpers.arrayElement(jsonSchema.enum);
  }

  switch (jsonSchema.type) {
    case "string":
      return `"${transformStringBasedOnFormat(jsonSchema.format, key).toString()}"`;
    case "number":
      return `"${faker.datatype.number()}"`;
    case "integer":
      return `"${faker.datatype.number().toString()}"`;
    case "boolean":
      return `"${faker.datatype.boolean().toString()}"`;
    case "object":
      if (
        !jsonSchema.properties &&
        typeof jsonSchema.additionalProperties === "object"
      ) {
        return [...new Array(5).keys()]
          .map((_) => ({
            [faker.lorem.word()]: transformJSONSchemaToFakerCode(
              jsonSchema.additionalProperties as OpenAPIV3.SchemaObject
            ),
          }))
          .reduce((acc, next) => Object.assign(acc, next), {})
          .toString();
      }

      return `{${Object.entries(jsonSchema.properties ?? {})
        .map(([k, v]) => {
          return `${JSON.stringify(k)}: ${transformJSONSchemaToFakerCode(
            v as OpenAPIV3.SchemaObject,
            k
          )}`;
        })
        .join(",\n")}}`;
    case "array":
      return '[' + [...new Array(faker.datatype.number({ max: 20 })).keys()]
        .map((_) =>
          transformJSONSchemaToFakerCode(
            jsonSchema.items as OpenAPIV3.SchemaObject
          )
        ) + ']';
    default:
      return "null";
  }
}

/**
 * See https://json-schema.org/understanding-json-schema/reference/string.html#built-in-formats
 */
function transformStringBasedOnFormat(format?: string, key?: string) {
  if (
    ["date-time", "date", "time"].includes(format ?? "") ||
    key?.toLowerCase().endsWith("_at")
  ) {
    return faker.date.past();
  } else if (format === "uuid") {
    return faker.datatype.uuid();
  } else if (
    ["idn-email", "email"].includes(format ?? "") ||
    key?.toLowerCase().endsWith("email")
  ) {
    return faker.internet.email();
  } else if (["hostname", "idn-hostname"].includes(format ?? "")) {
    return faker.internet.domainName();
  } else if (format === "ipv4") {
    return faker.internet.ip();
  } else if (format === "ipv6") {
    return faker.internet.ipv6();
  } else if (
    ["uri", "uri-reference", "iri", "iri-reference", "uri-template"].includes(
      format ?? ""
    ) ||
    key?.toLowerCase().endsWith("url")
  ) {
    return faker.internet.url();
  } else if (key?.toLowerCase().endsWith("name")) {
    return faker.name.findName();
  } else {
    return faker.lorem.slug(1);
  }
}
