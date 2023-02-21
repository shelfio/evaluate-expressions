import {validateJoinerInvoke, validateRuleInvoke} from './validations';

describe('validateJoinerInvoke', () => {
  it('should throw error if joiner is not SINGLE and left is undefined', () => {
    expect(() =>
      validateJoinerInvoke({
        joiner: 'AND',
        left: true,
        right: undefined as any,
      })
    ).toThrow('Invalid Joiner expression "true AND undefined"');
  });

  it('should throw error if joiner is not SINGLE and right is undefined', () => {
    expect(() =>
      validateJoinerInvoke({
        joiner: 'AND',
        left: undefined as any,
        right: true,
      })
    ).toThrow('Invalid Joiner expression "undefined AND true"');
  });
});

describe('validateRuleInvoke', () => {
  it('should throw error if comparedValue is undefined', () => {
    expect(() =>
      validateRuleInvoke({
        comparedValue: undefined as any,
        operator: 'eq',
        passedValue: 'a',
        variableId: 'variable-id-a',
      })
    ).toThrow('Invalid Rule compared value not exist');
  });

  it('should throw error if operator is undefined', () => {
    expect(() =>
      validateRuleInvoke({
        comparedValue: 'a',
        operator: undefined as any,
        passedValue: 'a',
        variableId: 'variable-id-a',
      })
    ).toThrow('Invalid Rule operator not exist');
  });

  it('should throw error if passedValue is undefined', () => {
    expect(() =>
      validateRuleInvoke({
        comparedValue: 'a',
        operator: 'eq',
        passedValue: undefined as any,
        variableId: 'variable-id-a',
      })
    ).toThrow('Invalid passed variable value with id: variable-id-a');
  });
});
