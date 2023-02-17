export type Rule = {
  variableId: string;
  operator: 'eq' | 'neq';
  value: string;
};
export type Expression = {
  joiner: 'OR' | 'AND';
  rules: (Expression | Rule)[];
};
export type VariableWithValue = {id: string; value: string};

type StackElement = boolean | 'OR' | 'AND';
type JoinerParameters = {left: StackElement; right: StackElement};

const invokeJoinerMap = {
  OR: ({left, right}: JoinerParameters) => left || right,
  AND: ({left, right}: JoinerParameters) => left && right,
};

type RuleParameters = {passedValue: string | undefined; comparedValue: string};
const invokeRuleMap = {
  eq: ({passedValue, comparedValue}: RuleParameters) => passedValue === comparedValue,
  neq: ({passedValue, comparedValue}: RuleParameters) => passedValue !== comparedValue,
};

export const evaluateExpression = (
  expression: Expression,
  variableValues: VariableWithValue[]
): boolean => {
  const variableIdToVariablesMap = new Map(variableValues.map(({id, value}) => [id, value]));

  const [result] = expressionToRPN(expression, variableIdToVariablesMap);

  if (typeof result !== 'boolean') {
    throw new Error('Invalid expression');
  }

  return result;
};
const expressionToRPN = (
  expression: Expression | Rule,
  variableIdToVariablesMap: Map<string, string>
): StackElement[] => {
  if ('rules' in expression) {
    const rpn: StackElement[] = [];
    transformToBinaryOperators(expression).rules.forEach(rule => {
      rpn.push(...expressionToRPN(rule, variableIdToVariablesMap));
    });

    const [left, right] = rpn.splice(-2, 2);
    rpn.push(invokeJoinerMap[expression.joiner]({left, right}));

    return rpn;
  }

  return [
    invokeRuleMap[expression.operator]({
      passedValue: variableIdToVariablesMap.get(expression.variableId),
      comparedValue: expression.value,
    }),
  ];
};

function transformToBinaryOperators(expression: Expression): Expression {
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
}
