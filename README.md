# evaluate-expressions [![CircleCI](https://circleci.com/gh/shelfio/evaluate-expressions/tree/master.svg?style=svg)](https://circleci.com/gh/shelfio/evaluate-expressions/tree/master)![](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)

> Evaluate expressions that consist of multiple rules and joiners, evaluates the expression using a reverse Polish notation (RPN) array. The RPN array consists of a series of elements that represent the rules and joiners of the expression in a specific order. By evaluating the RPN array, the module determines whether the expression is true or false based on the values of the variables and the rules and joiners specified in the input conditions.

## Install

```
$ yarn add @shelf/evaluate-expressions
```

## Usage

```ts
import type {Expression} from '@shelf/evaluate-expressions';
import {evaluateExpression} from '@shelf/evaluate-expressions';

const expression: Expression = {
  joiner: 'AND',
  rules: [
    {
      joiner: 'OR',
      rules: [
        {
          variableId: 'variable-id-c',
          operator: 'eq',
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
      variableId: 'variable-id-a',
      operator: 'eq',
      value: 'a',
    },
  ],
};

const variablesWithValue = [
  {
    id: 'variable-id-a',
    value: 'a',
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

````

## Publish

```sh
$ git checkout master
$ yarn version
$ yarn publish
$ git push origin master --tags
````

## License

MIT © [Shelf](https://shelf.io)
