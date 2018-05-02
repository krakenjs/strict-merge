/* @flow */

import deepEqual from 'deep-equal';

import { strictMerge, TYPE } from '../src';

test(`Should successfully merge two simple objects`, () => {

    let one = {
        foo: 'bar'
    };

    let two = {
        baz: 'boz'
    };

    let expected = {
        foo: 'bar',
        baz: 'boz'
    };

    let result = strictMerge(one, two);

    if (!deepEqual(result, expected)) {
        throw new Error(`Expected\n\n${ JSON.stringify(result, null, 2) }\n\nto equal\n\n${ JSON.stringify(expected, null, 2) }`);
    }
});

test(`Should successfully merge two deep objects`, () => {

    let one = {
        foo: {
            bar: {
                baz: 1,
                boz: 2
            }
        }
    };

    let two = {
        foo: {
            bar: {
                baz: 3
            }
        }
    };

    let expected = {
        foo: {
            bar: {
                baz: 3,
                boz: 2
            }
        }
    };

    let result = strictMerge(one, two);

    if (!deepEqual(result, expected)) {
        throw new Error(`Expected\n\n${ JSON.stringify(result, null, 2) }\n\nto equal\n\n${ JSON.stringify(expected, null, 2) }`);
    }
});

test(`Should successfully two objects with an array`, () => {

    let one = {
        foo: [ 1, 2, 3 ]
    };

    let two = {
        foo: [ 1, 2, 8, 9 ]
    };

    let expected = {
        foo: [ 1, 2, 8, 9 ]
    };

    let result = strictMerge(one, two);

    if (!deepEqual(result, expected)) {
        throw new Error(`Expected\n\n${ JSON.stringify(result, null, 2) }\n\nto equal\n\n${ JSON.stringify(expected, null, 2) }`);
    }
});

test(`Should successfully merge two deep objects with arrays`, () => {

    let one = {
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

    let two = {
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

    let expected = {
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

    let result = strictMerge(one, two);

    if (!deepEqual(result, expected)) {
        throw new Error(`Expected\n\n${ JSON.stringify(result, null, 2) }\n\nto equal\n\n${ JSON.stringify(expected, null, 2) }`);
    }
});


test(`Should successfully merge two deep objects with merging criteria`, () => {

    let one = {
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

    let two = {
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

    let expected = {
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

    let result = strictMerge(one, two, (a, b, type) => {
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

    let one = {
        foo: 'bar'
    };

    let two = {
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

    let one = {
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

    let two = {
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

