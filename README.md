# evaluate-expressions [![CircleCI](https://dl.circleci.com/status-badge/img/gh/shelfio/evaluate-expressions/tree/master.svg?style=svg)](https://circleci.com/gh/shelfio/evaluate-expressions/tree/master)![](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)

> Evaluate expressions that consist of multiple rules and joiners. By evaluating the RPN array, the module determines whether the expression is true or false based on the values of the variables and the rules and joiners specified in the input conditions.

## Install

```sh
$ yarn add @shelf/evaluate-expressions
```

## Usage

```ts
import type {Expression} from '@shelf/evaluate-expressions';
import {evaluateExpression} from '@shelf/evaluate-expressions';

const expression: Expression = {
  joiner: 'and',
  rules: [
    {
      joiner: 'or',
      rules: [
        {
          variableId: 'variable-id-c',
          operator: 'neq',
          value: 'c',
        },
        {
          variableId: 'variable-id-b',
          operator: 'eq',
          value: 'b',
        },
      ],
    },
    {
      variableId: 'variable-id-b',
      operator: 'not_contains',
      value: 'some',
    },
    {
      variableId: 'variable-id-a',
      operator: 'contains',
      value: 'a',
    },
  ],
};

const variablesWithValue = [
  {
    id: 'variable-id-a',
    value: 'some-a',
  },
  {
    id: 'variable-id-b',
    value: 'b',
  },
  {
    id: 'variable-id-c',
    value: 'c',
  },
];

const result = evaluateExpression(expression, variablesWithValue);

console.log(result); // true
```

## Publish

```sh
$ git checkout master
$ yarn version
$ yarn publish
$ git push origin master --tags
```

## License

MIT © [Shelf](https://shelf.io)
