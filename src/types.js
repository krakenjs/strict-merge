/* @flow */

export type JSONPrimitive = string | boolean | number;
// eslint-disable-next-line flowtype/no-mutable-array
export type JSONObject = { [string] : JSONPrimitive | JSONObject } | Array<JSONPrimitive | JSONObject>;
export type JSONObjectType = { [string] : JSONPrimitive | JSONObject };
// eslint-disable-next-line flowtype/no-mutable-array
export type JSONArrayType = Array<JSONPrimitive | JSONObject>;
export type JSONType = JSONObject | JSONPrimitive;
