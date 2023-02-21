import type {Expression, VariableWithValue} from './types';
import {expressionToRPN} from './evaluation';

export const evaluateExpression = (
  expression: Expression,
  variableValues: VariableWithValue[]
): boolean => {
  const variableIdToVariablesMap = new Map(variableValues.map(({id, value}) => [id, value]));

  const [result] = expressionToRPN(expression, variableIdToVariablesMap);

  if (typeof result !== 'boolean') {
    throw new Error('Invalid expression result', {
      cause: 'invalid-expression',
    });
  }

  return result;
};
