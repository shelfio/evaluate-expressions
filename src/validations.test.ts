import {validateJoinerInvoke, validateRuleInvoke} from './validations';

describe('validateJoinerInvoke', () => {
  it('should throw error if joiner is not SINGLE and left is undefined', () => {
    expect(() =>
      validateJoinerInvoke({
        joiner: 'and',
        left: true,
        right: undefined as any,
      })
    ).toThrow('Invalid Joiner expression "true and undefined"');
  });

  it('should throw error if joiner is not SINGLE and right is undefined', () => {
    expect(() =>
      validateJoinerInvoke({
        joiner: 'and',
        left: undefined as any,
        right: true,
      })
    ).toThrow('Invalid Joiner expression "undefined and true"');
  });
});

describe('validateRuleInvoke', () => {
  it('should throw error if comparedValue is undefined', () => {
    expect(() =>
      validateRuleInvoke({
        comparedValue: undefined as any,
        operator: 'eq',
      })
    ).toThrow('Invalid Rule compared value not exist');
  });

  it('should throw error if operator is undefined', () => {
    expect(() =>
      validateRuleInvoke({
        comparedValue: 'a',
        operator: undefined as any,
      })
    ).toThrow('Invalid Rule operator not exist');
  });
});
