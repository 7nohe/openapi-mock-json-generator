import { generate } from "./generate";
import { Command } from "commander";
import packageJson from "../package.json";
import type { UsableLocale } from "@faker-js/faker";

export type CLIOptions = {
  input: string;
  output: string;
  maxArrayLength?: number;
  locale?: UsableLocale;
  seed?: number;
};

const program = new Command();

program
  .name("openapi-json")
  .version(packageJson.version)
  .description("Generate mock data based on OpenAPI")
  .requiredOption(
    "-i, --input <value>",
    "OpenAPI specification, can be a path, url or string content (required)"
  )
  .option("-o, --output <value>", "Output directory", "mocks")
  .option("--max-array-length <value>", "Maximum length of array", "10")
  .option(
    "--locale <value>",
    "Specifies the language of the data created by the mock",
    "en"
  )
  .option(
    "-s, --seed <value>",
    "Set a randomness seed",
    "1"
  )
  .parse();

const options = program.opts<CLIOptions>();

generate(options);
