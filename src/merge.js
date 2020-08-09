/* @flow */

import { assertRawObjectOrPrimitiveType, assertPrimitiveType, assertRawObjectType, getTypeof, isDefined, isObjectOrArrayType } from './typecheck';
import { TYPE, ERROR } from './constants';
import { makeError } from './util';
import type { JSONArrayType, JSONObjectType, JSONPrimitive } from './types';

type MergerType<T : JSONPrimitive> = (first : T, second : T, type : string, key : string) => T;

const defaultMerger = ((a, b) => b);

// eslint-disable-next-line complexity
export function strictMerge<T : JSONArrayType | JSONObjectType > (
    first : T,
    second : T,
    // $FlowFixMe
    merger? : MergerType<*> = defaultMerger,
    fullKey? : string = ''
) : T {
    
    assertRawObjectType(first);
    assertRawObjectType(second);

    const typeOfFirst = getTypeof(first);
    const typeOfSecond = getTypeof(second);

    if (typeOfFirst === TYPE.ARRAY && typeOfSecond === TYPE.ARRAY) {

        const result : JSONArrayType = [];

        const firstLength = first.length;
        const secondLength = second.length;
        // $FlowFixMe
        const maxLength = Math.max(firstLength, secondLength);

        for (let i = 0; i < maxLength; i++) {
            const qualifiedKey = fullKey ? `${ fullKey }.${ i }` : `${ i }`;

            // $FlowFixMe
            const firstVal = first[i];
            // $FlowFixMe
            const secondVal = second[i];

            if (firstVal === secondVal) {
                assertRawObjectOrPrimitiveType(firstVal);
                result[i] = firstVal;
                continue;
            // $FlowFixMe
            } else if (i >= firstLength) {
                assertRawObjectOrPrimitiveType(secondVal);
                result[i] = secondVal;
                continue;
            // $FlowFixMe
            } else if (i >= secondLength) {
                assertRawObjectOrPrimitiveType(firstVal);
                result[i] = firstVal;
                continue;
            } else if (!isDefined(firstVal)) {
                assertRawObjectOrPrimitiveType(secondVal);
                result[i] = secondVal;
                continue;
            } else if (!isDefined(secondVal)) {
                assertRawObjectOrPrimitiveType(firstVal);
                result[i] = firstVal;
                continue;
            } else {
                assertRawObjectOrPrimitiveType(firstVal);
                assertRawObjectOrPrimitiveType(secondVal);
            }

            const firstValType = getTypeof(firstVal);
            const secondValType = getTypeof(secondVal);

            if (firstValType !== secondValType) {
                throw new TypeError(`None-matching types for index ${ qualifiedKey }: ${ firstValType } vs ${ secondValType }`);
            }

            if (isObjectOrArrayType(firstVal) && isObjectOrArrayType(secondVal)) {
                // $FlowFixMe
                result[i] = strictMerge(firstVal, secondVal, merger, qualifiedKey);
                continue;
            }

            assertPrimitiveType(firstVal);
            assertPrimitiveType(secondVal);

            // $FlowFixMe
            result[i] = merger(firstVal, secondVal, firstValType, qualifiedKey);
        }

        // $FlowFixMe
        return result;

    } else if (typeOfFirst === TYPE.OBJECT && typeOfSecond === TYPE.OBJECT) {

        const result : JSONObjectType = {};

        // $FlowFixMe
        const keys = new Set([ ...Object.keys(first), ...Object.keys(second) ]);

        for (const key of keys) {
            const qualifiedKey = fullKey ? `${ fullKey }.${ key }` : `${ key }`;

            // $FlowFixMe
            const firstVal = first[key];
            // $FlowFixMe
            const secondVal = second[key];

            if (firstVal === secondVal) {
                assertRawObjectOrPrimitiveType(firstVal);
                result[key] = firstVal;
                continue;
            } else if (!first.hasOwnProperty(key)) {
                assertRawObjectOrPrimitiveType(secondVal);
                result[key] = secondVal;
                continue;
            } else if (!second.hasOwnProperty(key)) {
                assertRawObjectOrPrimitiveType(firstVal);
                result[key] = firstVal;
                continue;
            } else if (!isDefined(firstVal)) {
                assertRawObjectOrPrimitiveType(secondVal);
                result[key] = secondVal;
                continue;
            } else if (!isDefined(secondVal)) {
                assertRawObjectOrPrimitiveType(firstVal);
                result[key] = firstVal;
                continue;
            } else {
                assertRawObjectOrPrimitiveType(firstVal);
                assertRawObjectOrPrimitiveType(secondVal);
            }

            const firstValType = getTypeof(firstVal);
            const secondValType = getTypeof(secondVal);

            if (firstValType !== secondValType) {
                throw new TypeError(`None-matching types for key ${ qualifiedKey }: ${ firstValType } vs ${ secondValType }`);
            }

            if (isObjectOrArrayType(firstVal) && isObjectOrArrayType(secondVal)) {
                // $FlowFixMe
                result[key] = strictMerge(firstVal, secondVal, merger, qualifiedKey);
                continue;
            }

            assertPrimitiveType(firstVal);
            assertPrimitiveType(secondVal);

            // $FlowFixMe
            result[key] = merger(firstVal, secondVal, firstValType, qualifiedKey);
        }

        // $FlowFixMe
        return result;
    }

    throw makeError(ERROR.INVALID_TYPE, `Expected matching array or object types${ fullKey ? `for key ${ fullKey }` : '' }, got ${ typeOfFirst } and ${ typeOfSecond }`);
}
