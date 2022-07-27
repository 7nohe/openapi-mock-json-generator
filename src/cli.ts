import { generate } from "./generate";
import { Command } from "commander";
import packageJson from "../package.json";

export type CLIOptions = {
  input: string;
  output: string;
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
  .option("-o, --output <value>", "Output directory", "openapi")
  .parse();

const options = program.opts<CLIOptions>();

generate(options);
