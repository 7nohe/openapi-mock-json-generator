import { CLIOptions } from "./cli";
import { parse } from "./parse";

export const generate = async (options: CLIOptions) => {
  const { output, input } = options;
  const doc = await parse(input);
  console.log(doc);
  // TODO: generate mock data
};
