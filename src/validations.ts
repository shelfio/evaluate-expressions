import type {Expression, JoinerParameters, Rule} from './types';

export const validateJoinerInvoke = ({
  joiner,
  left,
  right,
}: {joiner: Expression['joiner']} & JoinerParameters) => {
  if (joiner && (right === undefined || left === undefined)) {
    throw new Error(`Invalid Joiner expression "${left} ${joiner} ${right}"`, {
      cause: 'invalid-expression',
    });
  }
};

export const validateRuleInvoke = ({
  operator,
  comparedValue,
}: {
  comparedValue: string;
  operator?: Rule['operator'];
}) => {
  if (comparedValue === undefined) {
    throw new Error(`Invalid Rule compared value not exist`, {
      cause: 'invalid-expression',
    });
  }

  if (operator === undefined) {
    throw new Error(`Invalid Rule operator not exist`, {
      cause: 'invalid-expression',
    });
  }
};
