jest.mock('./evaluation');

import {expressionToRPN} from './evaluation';
import {evaluateExpression} from './index';

it('should return true', () => {
  jest.mocked(expressionToRPN).mockReturnValue([true]);

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
  jest.mocked(expressionToRPN).mockReturnValue([undefined as any]);

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
