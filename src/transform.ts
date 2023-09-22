import { faker } from "@faker-js/faker";
import { OpenAPIV3 } from "openapi-types";
import { CLIOptions } from "./cli";

export function transformJSONSchemaToFakerJson(
  options: CLIOptions,
  jsonSchema?: OpenAPIV3.SchemaObject,
  key?: string
): object | string | number | boolean {
  if (!jsonSchema) {
    return {};
  }

  if (jsonSchema.example) {
    return jsonSchema.example;
  }

  if (jsonSchema.enum) {
    return faker.helpers.arrayElement(jsonSchema.enum);
  }

  switch (jsonSchema.type) {
    case "string":
      let stringValue = transformStringBasedOnFormat(jsonSchema.format, key);
      // Truncate to max length if specified
      if (jsonSchema.maxLength !== undefined) {
        stringValue = stringValue.slice(0, jsonSchema.maxLength);
      }
      return stringValue;
    case "number":
      return faker.datatype.number({ min: jsonSchema.minimum, max: jsonSchema.maximum });
    case "integer":
      return faker.datatype.number({ min: jsonSchema.minimum, max: jsonSchema.maximum });
    case "boolean":
      return faker.datatype.boolean();
    case "object":
      if (
        !jsonSchema.properties &&
        typeof jsonSchema.additionalProperties === "object"
      ) {
        const keys = [...new Array(Number(options.maxArrayLength)).keys()];

        return Object.fromEntries(keys.map(index => [`${faker.lorem.word()}-${index}`, transformJSONSchemaToFakerJson(
          options,
          jsonSchema.additionalProperties as OpenAPIV3.SchemaObject
        )]));
      }

      return Object.fromEntries(Object.entries(jsonSchema.properties ?? {}).map(([k, v]) => [k, transformJSONSchemaToFakerJson(
        options,
        v as OpenAPIV3.SchemaObject,
        k
      )]));
    case "array":
      // Pick the lower "max items" of the max array length option and the value defined in the schema
      let maxItems: number | undefined = undefined;
      if (options.maxArrayLength !== undefined && jsonSchema.maxItems !== undefined) {
        maxItems = Math.min(options.maxArrayLength, jsonSchema.maxItems);
      } else {
        maxItems = options.maxArrayLength ?? jsonSchema.maxItems;
      }
      // Pick the lower minimum number of items (to avoid min > max if max array length is lower than the min in the schema)
      let minItems: number | undefined = undefined;
      if (maxItems !== undefined && jsonSchema.minItems !== undefined) {
        minItems = Math.min(maxItems, jsonSchema.minItems);
      } else {
        minItems = jsonSchema.minItems;
      }
      return [
        ...new Array(
          faker.datatype.number({ max: maxItems, min: minItems })
        ).keys(),
      ].map((_) =>
        transformJSONSchemaToFakerJson(
          options,
          jsonSchema.items as OpenAPIV3.SchemaObject
        )
      );
    default:
      return "null";
  }
}

/**
 * See https://json-schema.org/understanding-json-schema/reference/string.html#built-in-formats
 */
function transformStringBasedOnFormat(format?: string, key?: string): string {
  if (
    ["date-time", "date", "time"].includes(format ?? "") ||
    key?.toLowerCase().endsWith("_at")
  ) {
    const date = faker.date.past().toISOString();
    if (format === "date") {
      return date.split('T')[0];
    }
    return date;
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
