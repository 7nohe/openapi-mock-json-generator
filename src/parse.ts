import parser from "@apidevtools/swagger-parser";
import type { OpenAPIV3 } from "openapi-types";

export const parse = async (input: string) => {
  const doc = await parser.bundle(input);
  if ("openapi" in doc && doc.openapi.startsWith("3")) {
    return doc as OpenAPIV3.Document;
  } else {
    throw new Error("Not a valid OpenAPI v3 document");
  }
};
