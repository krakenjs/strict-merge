/* @flow */

export type JSONPrimitive = string | boolean | number;
export type JSONObject = { [string] : JSONPrimitive | JSONObject } | Array<JSONPrimitive | JSONObject>;
export type JSONObjectType = { [string] : JSONPrimitive | JSONObject };
export type JSONArrayType = Array<JSONPrimitive | JSONObject>;
export type JSONType = JSONObject | JSONPrimitive;
