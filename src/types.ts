export type Rule = {
  variableId: string;
  operator: 'eq' | 'neq' | 'contains' | 'not_contains';
  value: string;
};
export type Expression = {
  joiner?: 'OR' | 'AND';
  rules: (Expression | Rule)[];
};
export type VariableWithValue = {id: string; value: string};
export type JoinerParameters = {left: StackElement; right: StackElement};
export type StackElement = boolean | 'OR' | 'AND';
export type RuleParameters = {passedValue?: string; comparedValue: string};
