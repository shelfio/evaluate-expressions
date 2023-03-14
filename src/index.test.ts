jest.mock('./evaluation');

import {evaluate} from './evaluation';
import {evaluateExpression} from './index';

it('should return true', () => {
  jest.mocked(evaluate).mockReturnValue(true);

  const expression = {
    rules: [
      {
        variableId: 'variable-id-a',
        operator: 'contains' as const,
        value: 'some',
      },
    ],
  };

  expect(evaluateExpression(expression, [{id: 'variable-id-a', value: 'something'}])).toBe(true);
});

it('should throw `Invalid expression result` if expressionToRPN return undefined', () => {
  jest.mocked(evaluate).mockReturnValue(undefined);

  const expression = {
    rules: [
      {
        variableId: 'variable-id-a',
        operator: 'contains' as const,
        value: 'some',
      },
    ],
  };

  expect(() => evaluateExpression(expression, [{id: 'variable-id-a', value: 'something'}])).toThrow(
    'Invalid expression result'
  );
});
