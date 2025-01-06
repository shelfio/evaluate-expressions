import type {Expression} from './types.js';
import {evaluate} from './evaluation.js';

const baseExpression: Expression = {
  joiner: 'and',
  rules: [
    {
      joiner: 'or',
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
  joiner: 'and',
  rules: [
    {
      joiner: 'or',
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

const variablesValueMap = new Map<string, string>(
  [
    {
      id: 'variable-id-a',
      value: 'A',
    },
    {
      id: 'variable-id-b',
      value: 'B',
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

describe('evaluate', () => {
  it('should return `true`', () => {
    expect(
      evaluate({expression: baseExpression, variableIdToVariablesMap: variablesValueMap})
    ).toEqual(true);
  });

  it('should return `true` for expression w/ non-binary operator', () => {
    expect(
      evaluate({expression: notBinaryExpression, variableIdToVariablesMap: variablesValueMap})
    ).toEqual(true);
  });

  it('should return `true` for single rule when passed correct variable value', () => {
    expect(
      evaluate({expression: singleRuleExpression, variableIdToVariablesMap: variablesValueMap})
    ).toEqual(true);
  });

  it('should return `false` for single rule when passed wrong variable value', () => {
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

    expect(evaluate({expression, variableIdToVariablesMap: variablesValueMap})).toEqual(false);
  });

  it('should return `false` for `neq` operator when variable value not passed', () => {
    const variablesValueMap = new Map([]) as any;

    const expression: Expression = {
      rules: [
        {
          variableId: 'variable-id-a',
          operator: 'neq',
          value: 'a',
        },
      ],
    };

    expect(evaluate({expression, variableIdToVariablesMap: variablesValueMap})).toEqual(false);
  });

  it('should return `false` for `not_contains` operator when variable value not passed', () => {
    const variablesValueMap = new Map([]) as any;

    const expression: Expression = {
      rules: [
        {
          variableId: 'variable-id-a',
          operator: 'not_contains',
          value: 'a',
        },
      ],
    };

    expect(evaluate({expression, variableIdToVariablesMap: variablesValueMap})).toEqual(false);
  });

  it('should return `false` for `contains` operator when variable value not passed', () => {
    const variablesValueMap = new Map([]) as any;

    const expression: Expression = {
      rules: [
        {
          variableId: 'variable-id-a',
          operator: 'contains',
          value: 'a',
        },
      ],
    };

    expect(evaluate({expression, variableIdToVariablesMap: variablesValueMap})).toEqual(false);
  });

  it('should return `false` for `eq` operator when variable value not passed', () => {
    const variablesValueMap = new Map([]) as any;

    const expression: Expression = {
      rules: [
        {
          variableId: 'variable-id-a',
          operator: 'eq',
          value: 'a',
        },
      ],
    };

    expect(evaluate({expression, variableIdToVariablesMap: variablesValueMap})).toEqual(false);
  });

  it('should return `false` when variables value not passed', () => {
    const variablesValueMap = new Map();

    const expression: Expression = {
      rules: [
        {
          variableId: 'variable-id-a',
          operator: 'eq',
          value: 'a',
        },
      ],
    };

    expect(evaluate({expression, variableIdToVariablesMap: variablesValueMap})).toEqual(false);
  });

  const variableValueSomething = new Map([['variable-id-a', 'something']]);

  it('should return `true` for expression and `contains` rule', () => {
    const expression: Expression = {
      rules: [
        {
          variableId: 'variable-id-a',
          operator: 'contains',
          value: 'some',
        },
      ],
    };

    expect(evaluate({expression, variableIdToVariablesMap: variableValueSomething})).toEqual(true);
  });

  it('should return `false` for expression and `contains` rule', () => {
    const expression: Expression = {
      rules: [
        {
          variableId: 'variable-id-a',
          operator: 'contains',
          value: 'other',
        },
      ],
    };

    expect(evaluate({expression, variableIdToVariablesMap: variableValueSomething})).toEqual(false);
  });

  it('should return `false` for expression and `not_contains` rule', () => {
    const expression: Expression = {
      rules: [
        {
          variableId: 'variable-id-a',
          operator: 'not_contains',
          value: 'some',
        },
      ],
    };

    expect(evaluate({expression, variableIdToVariablesMap: variableValueSomething})).toEqual(false);
  });

  it('should return `true` for expression and `not_contains` rule', () => {
    const expression: Expression = {
      rules: [
        {
          variableId: 'variable-id-a',
          operator: 'not_contains',
          value: 'other',
        },
      ],
    };

    expect(evaluate({expression, variableIdToVariablesMap: variableValueSomething})).toEqual(true);
  });

  it('should return `true` for complex expression', () => {
    const complexExpression: Expression = {
      joiner: 'and',
      rules: [
        baseExpression,
        singleRuleExpression,
        {
          joiner: 'or',
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

    expect(
      evaluate({expression: complexExpression, variableIdToVariablesMap: variablesValueMap})
    ).toEqual(true);
  });

  it('should return `false` for complex expression', () => {
    const complexExpression: Expression = {
      joiner: 'and',
      rules: [
        baseExpression,
        singleRuleExpression,
        {
          joiner: 'and',
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

    expect(
      evaluate({expression: complexExpression, variableIdToVariablesMap: variablesValueMap})
    ).toEqual(false);
  });

  it('should return `false` for case sensitive option', () => {
    expect(
      evaluate({
        expression: baseExpression,
        variableIdToVariablesMap: variablesValueMap,
        options: {caseSensitive: true},
      })
    ).toEqual(false);
  });

  it('should return `true` for case sensitive option', () => {
    const variablesLowerCaseValueMap = new Map<string, string>(
      [
        {
          id: 'variable-id-a',
          value: 'a',
        },
        {
          id: 'variable-id-b',
          value: 'b',
        },
      ].map(({id, value}) => [id, value])
    );

    expect(
      evaluate({
        expression: baseExpression,
        variableIdToVariablesMap: variablesLowerCaseValueMap,
        options: {caseSensitive: true},
      })
    ).toEqual(true);
  });
});
