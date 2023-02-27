import type {Expression, Rule, StackElement} from './types';
import type {JoinerParameters, RuleParameters} from './types';
import {validateJoinerInvoke, validateRuleInvoke} from './validations';

export const joinerHandlers = {
  OR: ({left, right}: JoinerParameters) => Boolean(left || right),
  AND: ({left, right}: JoinerParameters) => Boolean(left && right),
  SINGLE: ({left}: JoinerParameters) => Boolean(left),
};

export const ruleHandlers = {
  eq: ({passedValue, comparedValue}: RuleParameters) => passedValue === comparedValue,
  neq: ({passedValue, comparedValue}: RuleParameters) => passedValue !== comparedValue,
  contains: ({passedValue, comparedValue}: RuleParameters) =>
    passedValue?.includes(comparedValue) ?? false,
  not_contains: ({passedValue, comparedValue}: RuleParameters) =>
    passedValue?.includes(comparedValue) === false,
};

export const expressionToRPN = (
  expression: Expression | Rule,
  variableIdToValuesMap: Map<string, string>
): StackElement[] => {
  if ('rules' in expression) {
    const rpn = transformToBinaryOperators(expression).rules.flatMap(rule =>
      expressionToRPN(rule, variableIdToValuesMap)
    );

    const {joiner} = expression;
    const [left, right] = rpn.splice(-2, 2);

    validateJoinerInvoke({joiner, left, right});

    rpn.push(joinerHandlers[joiner ?? 'SINGLE']({left, right}));

    return rpn;
  }

  const {variableId, operator, value: comparedValue} = expression;

  validateRuleInvoke({operator, comparedValue});

  return [
    ruleHandlers[operator]({
      passedValue: variableIdToValuesMap.get(variableId),
      comparedValue,
    }),
  ];
};

const transformToBinaryOperators = (expression: Expression): Expression => {
  if (expression.rules.length <= 2) {
    return expression;
  }

  const [firstRule, ...restOfRules] = expression.rules;
  const equivalentExpression = transformToBinaryOperators({
    joiner: expression.joiner,
    rules: restOfRules,
  });

  return {
    joiner: expression.joiner,
    rules: [firstRule, equivalentExpression],
  };
};
