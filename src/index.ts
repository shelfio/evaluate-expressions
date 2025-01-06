import type {Expression, VariableWithValue} from './types.js';
import {evaluate} from './evaluation.js';

export const evaluateExpression = (
  expression: Expression,
  variableValues: VariableWithValue[],
  options: {caseSensitive: boolean} = {caseSensitive: false}
): boolean => {
  const variableIdToVariablesMap = new Map(variableValues.map(({id, value}) => [id, value]));

  const result = evaluate({expression, variableIdToVariablesMap, options});

  if (typeof result !== 'boolean') {
    throw new Error('Invalid expression result', {
      cause: 'invalid-expression',
    });
  }

  return result;
};

export type {Expression, Rule} from './types.js';
