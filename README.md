# OpenAPI Mock JSON Generator

> Node.js library that generates mock API responses from an OpenAPI specification file.

## Why

In some cases, using a mock server for testing is overdoing and simply preparing mock JSON data is enough.

You can save time and use practical responses by generating JSON data from the OpenAPI schema automatically.

## Install

```
$ npm install -D @7nohe/openapi-mock-json-generator
```

## Usage

```
$ openapi-json --help

Usage: openapi-json [options]

Generate mock data based on OpenAPI

Options:
  -V, --version               output the version number
  -i, --input <value>         OpenAPI specification, can be a path, url or string content (required)
  -o, --output <value>        Output directory (default: "mocks")
  --max-array-length <value>  Maximum length of array (default: "10")
  -h, --help                  display help for command
```

## Example Usage

### Command

```
$ openapi-json --input ./petstore.yml
```

## License
MIT
