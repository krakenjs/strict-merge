/* @flow */

export function makeError(code : string, message : string, originalError? : Error) : Error {
    if (originalError && originalError.stack) {
        message = `${ message }\n\n${ originalError.stack }`;
    }
    let err = new Error(message);
    // $FlowFixMe
    err.code = code;
    return err;
}
