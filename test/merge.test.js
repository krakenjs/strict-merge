/* @flow */

import deepEqual from 'deep-equal';

import { strictMerge, TYPE } from '../src';

// $FlowFixMe
test(`Should successfully merge two simple objects`, () => {

    const one = {
        foo: 'bar'
    };

    const two = {
        baz: 'boz'
    };

    const expected = {
        foo: 'bar',
        baz: 'boz'
    };

    const result = strictMerge(one, two);

    if (!deepEqual(result, expected)) {
        throw new Error(`Expected\n\n${ JSON.stringify(result, null, 2) }\n\nto equal\n\n${ JSON.stringify(expected, null, 2) }`);
    }
});

test(`Should successfully merge two deep objects`, () => {

    const one = {
        foo: {
            bar: {
                baz: 1,
                boz: 2
            }
        }
    };

    const two = {
        foo: {
            bar: {
                baz: 3
            }
        }
    };

    const expected = {
        foo: {
            bar: {
                baz: 3,
                boz: 2
            }
        }
    };

    const result = strictMerge(one, two);

    if (!deepEqual(result, expected)) {
        throw new Error(`Expected\n\n${ JSON.stringify(result, null, 2) }\n\nto equal\n\n${ JSON.stringify(expected, null, 2) }`);
    }
});

test(`Should successfully two objects with an array`, () => {

    const one = {
        foo: [ 1, 2, 3 ]
    };

    const two = {
        foo: [ 1, 2, 8, 9 ]
    };

    const expected = {
        foo: [ 1, 2, 8, 9 ]
    };

    const result = strictMerge(one, two);

    if (!deepEqual(result, expected)) {
        throw new Error(`Expected\n\n${ JSON.stringify(result, null, 2) }\n\nto equal\n\n${ JSON.stringify(expected, null, 2) }`);
    }
});

test(`Should successfully merge two deep objects with arrays`, () => {

    const one = {
        foo: {
            bar: {
                baz: 1,
                boz: [
                    {
                        hello: 'world',
                        fizz:  'buzz'
                    },
                    {
                        '1': 2,
                        '3': 4
                    }
                ]
            }
        }
    };

    const two = {
        foo: {
            bar: {
                baz: 1,
                boz: [
                    {
                        hello: 'woooorld',
                        lol:   'zomg'
                    },
                    {
                        '1': 7
                    }
                ]
            }
        }
    };

    const expected = {
        foo: {
            bar: {
                baz: 1,
                boz: [
                    {
                        hello: 'woooorld',
                        fizz:  'buzz',
                        lol:   'zomg'
                    },
                    {
                        '1': 7,
                        '3': 4
                    }
                ]
            }
        }
    };

    const result = strictMerge(one, two);

    if (!deepEqual(result, expected)) {
        throw new Error(`Expected\n\n${ JSON.stringify(result, null, 2) }\n\nto equal\n\n${ JSON.stringify(expected, null, 2) }`);
    }
});


test(`Should successfully merge two deep objects with merging criteria`, () => {

    const one = {
        foo: {
            bar: {
                baz: 1,
                boz: [
                    {
                        foo: 123,
                        bar: 456
                    },
                    {
                        '1': 2,
                        '3': 4
                    },
                    'aaa'
                ],
                bif: 'bof'
            }
        }
    };

    const two = {
        foo: {
            bar: {
                baz: 5,
                boz: [
                    {
                        foo: 55,
                        bar: 999
                    },
                    {
                        '1': 1,
                        '3': 2
                    },
                    'ggg'
                ],
                bif: 'baf'
            }
        }
    };

    const expected = {
        foo: {
            bar: {
                baz: 5,
                boz: [
                    {
                        foo: 123,
                        bar: 999
                    },
                    {
                        '1': 2,
                        '3': 4
                    },
                    'ggg'
                ],
                bif: 'baf'
            }
        }
    };

    const result = strictMerge(one, two, (a, b, type) => {
        if (type === TYPE.NUMBER) {
            return Math.max(a, b);
        }
        return b;
    });

    if (!deepEqual(result, expected)) {
        throw new Error(`Expected\n\n${ JSON.stringify(result, null, 2) }\n\nto equal\n\n${ JSON.stringify(expected, null, 2) }`);
    }
});

test(`Should error out if disparate types passed`, () => {

    const one = {
        foo: 'bar'
    };

    const two = {
        foo: 55
    };

    let error;

    try {
        strictMerge(one, two);
    } catch (err) {
        error = err;
    }

    if (!error) {
        throw new Error(`Expected error to be thrown`);
    }
});

test(`Should error out if disparate types passed in deep object`, () => {

    const one = {
        foo: {
            bar: {
                baz: 1,
                boz: [
                    {
                        foo: 123,
                        bar: 456
                    },
                    {
                        '1': 2,
                        '3': 4
                    },
                    'aaa'
                ],
                bif: 'bof'
            }
        }
    };

    const two = {
        foo: {
            bar: {
                baz: 5,
                boz: [
                    {
                        foo: 55,
                        bar: true
                    },
                    {
                        '1': 1,
                        '3': 2
                    },
                    'ggg'
                ],
                bif: 'baf'
            }
        }
    };

    let error;

    try {
        strictMerge(one, two);
    } catch (err) {
        error = err;
    }

    if (!error) {
        throw new Error(`Expected error to be thrown`);
    }
});

