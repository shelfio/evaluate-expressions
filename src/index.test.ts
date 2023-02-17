import type {Expression} from './index';
import {evaluateExpression} from './index';

describe('evaluateExpression', () => {
  it('should return `true`', () => {
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
      {
        id: 'variable-id-d',
        value: 'd',
      },
    ];

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
              variableId: 'variable-id-c',
              operator: 'eq',
              value: 'c',
            },
            {
              variableId: 'variable-id-d',
              operator: 'eq',
              value: 'd',
            },
          ],
        },
        {
          variableId: 'variable-id-a',
          operator: 'eq',
          value: 'a',
        },
        {
          variableId: 'variable-id-b',
          operator: 'eq',
          value: 'b',
        },
      ],
    };

    expect(evaluateExpression(expression, variablesWithValue)).toEqual(true);
  });
});
