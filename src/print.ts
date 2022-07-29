import fs from "fs";
import path from "path";
import { CLIOptions } from "./cli";

export function print(result: string, fileName: string, options: CLIOptions) {
  const outputPath = options.output ?? 'mocks';
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
  }

  fs.writeFileSync(path.join(outputPath, fileName), result);
}
