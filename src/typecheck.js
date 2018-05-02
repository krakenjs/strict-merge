/* @flow */

import { TYPE, TOSTRING_TYPE, ERROR } from './constants';
import { makeError } from './util';

export function getTypeof(item : mixed) : string {
    if (item === null) {
        return TYPE.NULL;
    }
    let type = typeof item;
    if (type === TYPE.OBJECT && Array.isArray(item)) {
        return TYPE.ARRAY;
    }
    return type;
}

export function isPrimitiveType(item : mixed) : boolean {
    let type = getTypeof(item);
    return (type === TYPE.STRING || type === TYPE.NUMBER || type === TYPE.BOOLEAN);
}

export function isObjectOrArrayType(item : mixed) : boolean {
    let type = getTypeof(item);
    return (type === TYPE.OBJECT || type === TYPE.ARRAY);
}

export function isRawObject(item : mixed) : boolean {
    return Object.prototype.toString.call(item) === TOSTRING_TYPE.OBJECT;
}

export function isRawArray(item : mixed) : boolean {
    return Object.prototype.toString.call(item) === TOSTRING_TYPE.ARRAY;
}

export function isDefined(item : mixed) : boolean {
    let type = getTypeof(item);
    return type !== TYPE.NULL && type !== TYPE.UNDEFINED;
}

export function assertRawObjectType(item : mixed) {
    if (!isRawObject(item) && !isRawArray(item)) {
        throw makeError(ERROR.INVALID_TYPE, `Expected raw object or array, got ${ Object.prototype.toString.call(item) }`);
    }
}

export function assertPrimitiveType(item : mixed) {
    if (!isPrimitiveType(item)) {
        throw makeError(ERROR.INVALID_TYPE, `Expected primitive type, got ${ typeof item }`);
    }
}

export function assertRawObjectOrPrimitiveType(item : mixed) {
    if (!isRawObject(item) && !isRawArray(item) && !isPrimitiveType(item)) {
        throw makeError(ERROR.INVALID_TYPE, `Expected raw object or array, got ${ typeof item }: ${ Object.prototype.toString.call(item) }`);
    }
}
