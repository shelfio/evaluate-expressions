export type Rule = {
  variableId: string;
  operator: 'eq' | 'neq';
  value: string;
};
export type Expression = {
  joiner?: 'OR' | 'AND';
  rules: (Expression | Rule)[];
};
export type VariableWithValue = {id: string; value: string};

type StackElement = boolean | 'OR' | 'AND';
type JoinerParameters = {left: StackElement; right: StackElement};

const invokeJoinerMap = {
  OR: ({left, right}: JoinerParameters) => !!(left || right),
  AND: ({left, right}: JoinerParameters) => !!(left && right),
  default: ({left}: JoinerParameters) => !!left,
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
  variableIdToValuesMap: Map<string, string>
): StackElement[] => {
  if ('rules' in expression) {
    const rpn = transformToBinaryOperators(expression).rules.flatMap(rule =>
      expressionToRPN(rule, variableIdToValuesMap)
    );

    const [left, right] = rpn.splice(-2, 2);

    if (expression.joiner && right === undefined) {
      throw new Error(`Invalid expression with joiner ${expression.joiner}, right side is missing`);
    }

    rpn.push(invokeJoinerMap[expression.joiner ?? 'default']({left, right}));

    return rpn;
  }

  const passedValue = variableIdToValuesMap.get(expression.variableId);
  const comparedValue = expression.value;

  return [
    invokeRuleMap[expression.operator]({
      passedValue,
      comparedValue,
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
