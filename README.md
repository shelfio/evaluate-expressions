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

## Expression Structure

An expression is an object that contains a `joiner` and an array of `rules`. The `joiner` can be either `or` or `and`, and it determines how the rules are combined.
If the `joiner` is `or`, then the expression is true if any of the rules are true.
If the `joiner` is `and`, then the expression is true only if all the rules are true.

Each rule is an object that contains a `variableId`, an `operator`, and a `value`.
The `variableId` is the identifier of the variable that the rule applies to.
The `operator` determines how the variable's value is compared to the rule's `value`.
The available operators are `eq` (equals), `neq` (not equals), `contains`, and `not_contains`.

Here is an example of an expression:

```js
const expression = {
  joiner: 'and',
  rules: [
    {
      variableId: 'variable-id-a',
      operator: 'eq',
      value: 'a',
    },
    {
      variableId: 'variable-id-b',
      operator: 'neq',
      value: 'b',
    },
  ],
};
```

This expression is true if the variable with id `variable-id-a` equals `a` and the variable with id `variable-id-b` does not equal `b`.

## Case Sensitivity

The `evaluateExpression` function takes an optional `options` object as its third argument.
This object can contain a `caseSensitive` property, which determines whether the comparison of string values is case-sensitive or not.
If `caseSensitive` is `true`, then `A` and `a` are considered different values.
If `caseSensitive` is `false` (the default), then `A` and `a` are considered the same value.

Here is an example of how to use the `caseSensitive` option:

```js
const result = evaluateExpression(expression, variablesWithValue, {caseSensitive: true});
```

## Error Handling

The `evaluateExpression` function throws an error if the expression is invalid.
An expression is considered invalid if a rule's operator or compared value is undefined, or if a joiner's left or right value is undefined.
The error message provides information about the cause of the error.

## Publish

```sh
$ git checkout master
$ yarn version
$ yarn publish
$ git push origin master --tags
```

## License

MIT © [Shelf](https://shelf.io)
