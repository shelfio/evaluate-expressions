import type {Expression} from './types';
import {expressionToRPN} from './evaluation';

const baseExpression: Expression = {
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

const notBinaryExpression: Expression = {
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
        {
          variableId: 'variable-id-d',
          operator: 'eq',
          value: 'd',
        },
      ],
    },
    {
      variableId: 'variable-id-e',
      operator: 'neq',
      value: 'e',
    },
    {
      variableId: 'variable-id-a',
      operator: 'eq',
      value: 'a',
    },
  ],
};

const singleRuleExpression: Expression = {
  rules: [
    {
      variableId: 'variable-id-a',
      operator: 'eq',
      value: 'a',
    },
  ],
};

const variablesValueMap = new Map(
  [
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
      value: 'wrong-value',
    },
    {
      id: 'variable-id-d',
      value: 'wrong-value',
    },
    {
      id: 'variable-id-e',
      value: 'wrong-value',
    },
  ].map(({id, value}) => [id, value])
);

describe('expressionToRPN', () => {
  it('should return `[true]`', () => {
    expect(expressionToRPN(baseExpression, variablesValueMap)).toEqual([true]);
  });

  it('should return `[true]` for expression w/ non-binary operator', () => {
    expect(expressionToRPN(notBinaryExpression, variablesValueMap)).toEqual([true]);
  });

  it('should return `[true]` for single rule when passed correct variable value', () => {
    expect(expressionToRPN(singleRuleExpression, variablesValueMap)).toEqual([true]);
  });

  it('should return `[false]` for single rule when passed wrong variable value', () => {
    const variablesValueMap = new Map([['variable-id-a', 'wrong-value']]);

    const expression: Expression = {
      rules: [
        {
          variableId: 'variable-id-a',
          operator: 'eq',
          value: 'a',
        },
      ],
    };

    expect(expressionToRPN(expression, variablesValueMap)).toEqual([false]);
  });

  const variableValueSomething = new Map([['variable-id-a', 'something']]);

  it('should return `[true]` for expression and `contains` rule', () => {
    const expression: Expression = {
      rules: [
        {
          variableId: 'variable-id-a',
          operator: 'contains',
          value: 'some',
        },
      ],
    };

    expect(expressionToRPN(expression, variableValueSomething)).toEqual([true]);
  });

  it('should return `[false]` for expression and `contains` rule', () => {
    const expression: Expression = {
      rules: [
        {
          variableId: 'variable-id-a',
          operator: 'contains',
          value: 'other',
        },
      ],
    };

    expect(expressionToRPN(expression, variableValueSomething)).toEqual([false]);
  });

  it('should return `[false]` for expression and `not_contains` rule', () => {
    const expression: Expression = {
      rules: [
        {
          variableId: 'variable-id-a',
          operator: 'not_contains',
          value: 'some',
        },
      ],
    };

    expect(expressionToRPN(expression, variableValueSomething)).toEqual([false]);
  });

  it('should return `[true]` for expression and `not_contains` rule', () => {
    const expression: Expression = {
      rules: [
        {
          variableId: 'variable-id-a',
          operator: 'not_contains',
          value: 'other',
        },
      ],
    };

    expect(expressionToRPN(expression, variableValueSomething)).toEqual([true]);
  });

  it('should return `[true]` for complex expression', () => {
    const complexExpression: Expression = {
      joiner: 'AND',
      rules: [
        baseExpression,
        {
          joiner: 'OR',
          rules: [
            notBinaryExpression,
            {
              rules: [
                {
                  variableId: 'variable-id-a',
                  operator: 'eq',
                  value: 'wrong-value',
                },
              ],
            },
          ],
        },
      ],
    };

    expect(expressionToRPN(complexExpression, variablesValueMap)).toEqual([true]);
  });

  it('should return `[false]` for complex expression', () => {
    const complexExpression: Expression = {
      joiner: 'AND',
      rules: [
        baseExpression,
        {
          joiner: 'AND',
          rules: [
            notBinaryExpression,
            {
              rules: [
                {
                  variableId: 'variable-id-a',
                  operator: 'eq',
                  value: 'wrong-value',
                },
              ],
            },
          ],
        },
      ],
    };

    expect(expressionToRPN(complexExpression, variablesValueMap)).toEqual([false]);
  });
});
