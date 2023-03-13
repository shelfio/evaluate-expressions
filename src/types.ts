export type Rule = {
  variableId: string;
  operator: 'eq' | 'neq' | 'contains' | 'not_contains';
  value: string;
};
export type Expression = {
  joiner?: 'or' | 'and';
  rules: (Expression | Rule)[];
};
export type VariableWithValue = {id: string; value: string};
export type JoinerParameters = {left: StackElement; right: StackElement};
export type StackElement = boolean | Expression['joiner'];
export type RuleParameters = {passedValue?: string; comparedValue: string};
