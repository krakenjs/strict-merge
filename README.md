Strict Merge
------------

Deep merge two objects with strict type checking.

```javascript
import { strictMerge } from 'strict-merge';

let first = {
    foo: {
        bar: {
            baz: 1,
            biz: 2
        }
    }
}

let second = {
    foo: {
        bar: {
            bas: 3
        }
    }
}

let result = strictMerge(first, second);

/*
{
    foo: {
        bar: {
            baz: 3,
            biz: 2
        }
    }
}
*/
```

Or provide a merger function to resolve conflicts:

```javascript
import { strictMerge, TYPE } from 'strict-merge';

let first = {
    foo: {
        bar: {
            baz: 1,
            biz: 2
        }
    }
}

let second = {
    foo: {
        bar: {
            bas: 3
        }
    }
}

let result = strictMerge(first, second, (a, b, type) => {
    if (type === TYPE.NUMBER) {
        return Math.min(a, b);
    }
    return b;
});

/*
{
    foo: {
        bar: {
            baz: 1,
            biz: 2
        }
    }
}
*/
```

### Notes:

- Leaf nodes from second argument will take precedence
- Any conflicts between types for leaf nodes will result in an error (e.g. if you try to merge a string with an int)