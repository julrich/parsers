# SVG to JSX

## Description
This parser helps you wrap SVG files within a JSX component.

## Interface

```ts
interface parser {
  name: 'svg-to-jsx';
  options: {
    prepend?: string;
    formatConfig?: Partial<{
      exportDefault: boolean;
      variableFormat?: 'camelCase' | 'kebabCase' | 'snakeCase' | 'pascalCase';
      endOfLine: 'auto' | 'lf' | 'crlf' | 'cr';
      tabWidth: number;
      useTabs: boolean;
      singleQuote: boolean;
      isTsx: boolean;
    }>;
    wrapper?: {
      tag?: string;
      className?: string;
    };
  };
}
```

### Options

| Parameter                     | Required | Type                                             | Default     | Description                                                                                               |
| ----------------------------- | -------- | ------------------------------------------------ | ----------- | --------------------------------------------------------------------------------------------------------- |
| `prepend`                     | optional | `string`                                         |             | A string to append at the top of the generated file                                                       |
| `formatConfig.endOfLine`      | optional | `auto` `lf` `crlf` `cr`                          | `auto`      | [Prettier documentation](https://prettier.io/docs/en/options.html#end-of-line)                            |
| `formatConfig.tabWidth`       | optional | `number`                                         | `2`         | [Prettier documentation](https://prettier.io/docs/en/options.html#tab-width)                              |
| `formatConfig.useTabs`        | optional | `boolean`                                        | `true`      | [Prettier documentation](https://prettier.io/docs/en/options.html#tabs)                                   |
| `formatConfig.singleQuote`    | optional | `boolean`                                        | `false`     | [Prettier documentation](https://prettier.io/docs/en/options.html#quotes)                                 |
| `formatConfig.exportDefault`  | optional | `boolean`                                        | `true`      | Defines if the export of the JSX component should be done using default or not.                           |
| `formatConfig.variableFormat` | optional | `camelCase` `kebabCase` `snakeCase` `pascalCase` | `kebabCase` | The case transformation you want to apply to the name of JavaScript variable that will be exported.       |
| `formatConfig.isTsx`          | optional | `boolean`                                        | `false`     | Append `.tsx` extension to the generated files.                                                           |
| `wrapper.tag`                 | optional | `string`                                         |             | An HTML parent tag will be used to wrap the SVG tag.                                                      |
| `wrapper.className`           | optional | `string`                                         |             | A string or a pattern used to set a className attribute on the potential parent tag wrapping the SVG tag. |

## Output
Please keep in mind that this parser generates files. This is why you should always set a folder as the final `path` in your parent rule.

<details open>
<summary>See Do & Don't config examples</summary>

✅ Do
```
// ...
"rules": [
  {
    "name": "Design Tokens / JSX Icons",
    "path": "icons", // <-- path set as a folder
    "parsers": [
      {
        "name": "svg-to-jsx"
      }
    ]
  }
]
```

🚫 Don't
```
// ...
"rules": [
  {
    "name": "Design Tokens / JSX Icons",
    "path": "icons/icons.json", // <-- path set as a file
    "parsers": [
      {
        "name": "svg-to-jsx"
      }
    ]
  }
]
```
</details>

## Types

ℹ️ **Please be aware that, depending on the order you use parsers, their input and output types have to match.**

### Input

Array of object with at least the key `value.url` or `value.content`.

```ts
type input = Array<
  Record<string, any> & {
    type: string;
    name: string;
    value: ({ url?: string } | { content?: string }) & { [key: string]: any };
  }
>;
```

### Output

Input type extended with `value.content` and `value.fileName`

```ts
type output = Array<
  Record<string, any> & {
    type: string;
    value: { content: string; fileName: string; [key: string]: any };
  }
>;
```

### **ℹ️ Good to know**

The content generated by this parser is returned by the `{value.content}` property.
The output will differ according to the `path` you set in your rule:

1. If the `path` targets a directory, the content will be written as a file.
   By default, this file will be named according to the following pattern: `{assetName}.jsx` (assetName pascalCased).
   If the asset object contains a `filename` property (e.g. by using the [name-assets-files-by-pattern](https://github.com/Specifyapp/parsers/tree/master/parsers/name-assets-files-by-pattern) parser), the file will be named after it.
2. If the `path` of your rule targets a file, the content will be written as a JSON object inside it.

## Basic usage

### Config

```jsonc
"parsers": [
  {
    "name": "svg-to-jsx"
  }
  // …
]
```

### Before/After

#### Input

```jsonc
{
  "type": "vector",
  "name": "activity.svg",
  "value": {
    "url": "https://s3-us-west-2.amazonaws.com/figma-alpha-api/img/99b5/b311/257c650341b701d691be78f247b9cf5e"
    //...
  }
  //...
}
```

#### Output

```
{
  "type": "vector",
  "name": "activity",
  "value": {
    "fileName": "Activity.jsx",
    "content": "export default () => (
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M36.6667 20H30L25 35L15 5L10 20H3.33334"
          stroke="black"
          stroke-width="3.33333"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    );",
  },
  // …
}
```

## Complex usage

### Config

```jsonc
"parsers": [
  {
    "name": "svg-to-jsx",
    "options": {
      "prepend": "import React from 'react';",
      "variableFormat": "camelCase",
      "wrapper": {
        "tag": "div",
        "className": "icon-{{name}} icon"
      }
    }
  }
  // …
]
```

### Before/After

#### Input

```jsonc
{
  "type": "vector",
  "name": "activity.svg",
  "value": {
    "url": "https://s3-us-west-2.amazonaws.com/figma-alpha-api/img/99b5/b311/257c650341b701d691be78f247b9cf5e"
    //...
  }
  //...
}
```

#### Output

```
{
  "type": "vector",
  "name": "activity",
  "value": {
    "fileName": "Activity.jsx",
    "content": "import React from "react";
      export const activity = () => (
        <div className="icon-activity icon">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M36.6667 20H30L25 35L15 5L10 20H3.33334"
              stroke="black"
              stroke-width="3.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      );',
  },
  // …
}
```
