import type {Expression} from './types';
import type {JoinerParameters} from './types';
import type {Rule, StackElement} from './types';
import type {RuleParameters} from './types';
import {validateJoinerInvoke, validateRuleInvoke} from './validations';

export const evaluate = ({
  expression,
  variableIdToVariablesMap,
  options = {caseSensitive: false},
}: {
  expression: Expression;
  variableIdToVariablesMap: Map<string, string>;
  options?: {caseSensitive: boolean};
}): StackElement => {
  const {caseSensitive} = options;
  const ruleHandlers = caseSensitive ? caseSensitiveRuleHandlers : caseInsensitiveRuleHandlers;

  const evaluator = (
    expression: Expression | Rule,
    variableIdToValuesMap: Map<string, string>
  ): StackElement[] => {
    if ('rules' in expression) {
      const rpn = transformToBinaryOperators(expression).rules.flatMap(rule =>
        evaluator(rule, variableIdToValuesMap)
      );

      const {joiner} = expression;
      const [left, right] = rpn.splice(-2, 2);

      validateJoinerInvoke({joiner, left, right});

      rpn.push(joinerHandlers[joiner ?? 'single']({left, right}));

      return rpn;
    }

    const {variableId, operator, value: comparedValue} = expression;

    validateRuleInvoke({operator, comparedValue});
    const passedValue = variableIdToValuesMap.get(variableId);

    if (passedValue === undefined) {
      return [false];
    }

    return [
      ruleHandlers[operator]({
        passedValue: variableIdToValuesMap.get(variableId),
        comparedValue,
      }),
    ];
  };
  const [result] = evaluator(expression, variableIdToVariablesMap);

  return result;
};

type RuleHandlers = Record<
  'eq' | 'neq' | 'contains' | 'not_contains',
  (params: RuleParameters) => boolean
>;

const caseSensitiveRuleHandlers: RuleHandlers = {
  eq: ({passedValue, comparedValue}: RuleParameters) => passedValue === comparedValue,
  neq: ({passedValue, comparedValue}: RuleParameters) => passedValue !== comparedValue,
  contains: ({passedValue, comparedValue}: RuleParameters) =>
    passedValue?.includes(comparedValue) ?? false,
  not_contains: ({passedValue, comparedValue}: RuleParameters) =>
    passedValue?.includes(comparedValue) === false,
};
const applyRuleWithUpperCase = (
  {passedValue, comparedValue}: RuleParameters,
  rule: (params: RuleParameters) => boolean
): boolean =>
  rule({passedValue: passedValue?.toUpperCase(), comparedValue: comparedValue?.toUpperCase()});

const caseInsensitiveRuleHandlers: RuleHandlers = {
  eq: ({passedValue, comparedValue}: RuleParameters) =>
    applyRuleWithUpperCase({passedValue, comparedValue}, caseSensitiveRuleHandlers.eq),
  neq: ({passedValue, comparedValue}: RuleParameters) =>
    applyRuleWithUpperCase({passedValue, comparedValue}, caseSensitiveRuleHandlers.neq),
  contains: ({passedValue, comparedValue}: RuleParameters) =>
    applyRuleWithUpperCase({passedValue, comparedValue}, caseSensitiveRuleHandlers.contains),
  not_contains: ({passedValue, comparedValue}: RuleParameters) =>
    applyRuleWithUpperCase({passedValue, comparedValue}, caseSensitiveRuleHandlers.not_contains),
};

const joinerHandlers: Record<'or' | 'and' | 'single', (params: JoinerParameters) => boolean> = {
  or: ({left, right}: JoinerParameters) => Boolean(left || right),
  and: ({left, right}: JoinerParameters) => Boolean(left && right),
  single: ({left}: JoinerParameters) => Boolean(left),
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
