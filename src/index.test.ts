import type {Expression} from './index';
import {evaluateExpression} from './index';

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
];

describe('evaluateExpression', () => {
  it('should return `true`', () => {
    expect(evaluateExpression(baseExpression, variablesWithValue)).toEqual(true);
  });

  it('should return `true` for expression w/ non-binary operator', () => {
    expect(evaluateExpression(notBinaryExpression, variablesWithValue)).toEqual(true);
  });

  it('should return `true` for single rule when passed correct variable value', () => {
    expect(evaluateExpression(singleRuleExpression, variablesWithValue)).toEqual(true);
  });

  it('should return `false` for single rule when passed wrong variable value', () => {
    const variablesWithValue = [
      {
        id: 'variable-id-a',
        value: 'wrong-value',
      },
    ];

    const expression: Expression = {
      rules: [
        {
          variableId: 'variable-id-a',
          operator: 'eq',
          value: 'a',
        },
      ],
    };

    expect(evaluateExpression(expression, variablesWithValue)).toEqual(false);
  });

  it('should return `true` for complex expression', () => {
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

    expect(evaluateExpression(complexExpression, variablesWithValue)).toEqual(true);
  });

  it('should return `false` for complex expression', () => {
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

    expect(evaluateExpression(complexExpression, variablesWithValue)).toEqual(false);
  });

  it('should throw error if passed incorrect expression w/ joiner `AND`', () => {
    expect.assertions(1);

    const variablesWithValue = [
      {
        id: 'variable-id-a',
        value: 'a',
      },
    ];

    const expression: Expression = {
      joiner: 'AND',
      rules: [
        {
          variableId: 'variable-id-a',
          operator: 'eq',
          value: 'a',
        },
      ],
    };

    try {
      evaluateExpression(expression, variablesWithValue);
    } catch ({message}) {
      expect(message).toEqual('Invalid expression with joiner AND, right side is missing');
    }
  });

  it('should throw error if passed incorrect expression w/ joiner `OR`', () => {
    expect.assertions(1);

    const variablesWithValue = [
      {
        id: 'variable-id-a',
        value: 'a',
      },
    ];

    const expression: Expression = {
      joiner: 'OR',
      rules: [
        {
          variableId: 'variable-id-a',
          operator: 'eq',
          value: 'a',
        },
      ],
    };

    try {
      evaluateExpression(expression, variablesWithValue);
    } catch ({message}) {
      expect(message).toEqual('Invalid expression with joiner OR, right side is missing');
    }
  });
});
