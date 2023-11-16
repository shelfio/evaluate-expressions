# evaluate-expressions [![CircleCI](https://dl.circleci.com/status-badge/img/gh/shelfio/evaluate-expressions/tree/master.svg?style=svg)](https://circleci.com/gh/shelfio/evaluate-expressions/tree/master)![](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)

> Evaluate expressions that consist of multiple rules and joiners.
> By evaluating the rules array, the module determines whether the expression is true or false based on the values of the variables and the rules and joiners specified in the input conditions.

[Blog Article](https://medium.com/shelf-io-engineering/taming-the-beast-of-complex-expressions-in-node-js-with-shelf-evaluate-expressions-3b5148518a5f)

## Install

```sh
$ yarn add @shelf/evaluate-expressions
```

# Motivation

The `@shelf/evaluate-expressions` library was created to provide a simple and efficient way to evaluate complex expressions that consist of multiple rules and joiners.
It is designed to be flexible and easy to use, allowing developers to define their own rules and joiners and evaluate them based on the values of the variables.

## Problem It Solves

In many applications, there is a need to evaluate complex expressions based on certain conditions.
These expressions can consist of multiple rules and joiners, and the evaluation of these expressions can be a complex task.
The library simplifies this task by providing a simple and efficient way to evaluate these expressions.
It allows developers to define their own rules and joiners and evaluate them based on the values of the variables.

## Scenarios Where It Could Be Useful

The library can be useful in a variety of scenarios.
For example, it can be used in a rule engine where the rules are defined by the users and need to be evaluated based on certain conditions.
It can also be used in a decision-making system where the decisions are based on complex expressions.
Other potential use cases include data filtering, conditional rendering in UIs, and many more.

## Expression Evaluation

The library uses a recursive approach to handle and evaluate the expressions, allowing it to process complex expressions with an infinite depth of nested rules and joiners.
This recursive descent parsing method is efficient and effective for evaluating complex expressions based on certain conditions

The library processes the input expressions by traversing through the nested structure of rules and joiners, which simplifies the process of evaluating the expressions.
This approach ensures that the expressions are evaluated correctly, regardless of their complexity.

The transformation process involves converting the expressions into binary operators, which are then evaluated using the specified rules and joiners.
This powerful feature makes the library highly flexible and capable of handling a wide range of expression evaluation scenarios.

## Lightweight and No Dependencies

With just <3KB bundle size, the library is designed to be lightweight and has no dependencies.
This makes it an ideal choice for projects where performance is a concern or where the size of the dependencies needs to be kept to a minimum.
It is written in TypeScript, which provides static typing and other advanced features, making the code easier to read and maintain.

## Secure

The library is designed with a strong focus on security.
It does not execute or evaluate any code dynamically, nor does it insert or manipulate any HTML or other web content.
Instead, it evaluates expressions based on the provided rules and joiners, returning a boolean result.

# Usage

## Example Code

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
