//
// Javascript has the following set of built in types:
//
// * Undefined
// * Null
// * Boolean
// * Number
// * String
// * Symbol
// * Object
//
// These tests show examples of working with these types.
// Objects are a bigger topic and will be described elsewhere.
//

test("undefined", () => {

    // The variable v is undefined. It is not assigned to a value.
    var v;
    expect(v).toBeUndefined()

    // The property `y` on object `x` is not defined.
    var x = {};
    expect(x.y).toBeUndefined();

    // Using typeof on an undefined variable will always return "undefined"
    expect(typeof z).toEqual("undefined");

    // The function does not have a return statement, therefore
    // the return value is `undefined`
    var f = (arg) => {};
    expect(f("test")).toBeUndefined();

    // Variables can be "undefined"
    x = undefined;
    expect(x === undefined).toBeTruthy();

});

test("null", () => {

    // Simply declaring a variable does not make it `null`.
    // Until it is assigned a value (including `null`), it is `undefined`.
    var x;
    expect(x).toBeUndefined();
    expect(x).toBeFalsy();

    x = null;
    expect(x).toBeNull();
    expect(x).toBeFalsy();

    // careful - typeof null will return "object". This is a long standing JS bug that will never be fixed.
    expect(typeof x).toEqual("object");

});
//
// Javascript has a single `number` type - a 64 bit float (double in java)
//
test('number parsing', () => {

    const n = Number("20"); // string -> number
    expect(n).toBe(20);
    expect(n).toEqual(20.00);

    expect(n.toString()).toBe("20"); // number -> string

    const n2 = Number("20.0");
    expect(n2).toEqual(n);
    expect(n2.toString()).toBe("20");
});

//
// Strings
//
// * Strings in ES6 are unicode.
// * ES6 adds convenience functions for working with strings (contains, startsWith, endsWith).
// * String template literals provide string interpolation and allow for embedded expressions.
//
test("strings", () => {
    //
    // Unicode
    //
    const text = "𠮷";
    expect(text.length).toBe(2); // There are two code units.
    expect(/^.$/u.test(text)).toBeTruthy(); // But it is only treated as one character.

    //
    // When comparing strings w/ the potential for Unicode code points,
    // always normalize the strings. This ensures that two character strings
    // which are equivalent in meaning but not the same code points
    // are treated as equal.
    //
    const s1 = "damon";
    const s2 = "damon";
    expect(s1.normalize()).toEqual(s2.normalize());

    //
    // ES6 string template literals : backticks.
    //
    // * Multi-line strings using \. Tabs count on newlines, so watch indentations.
    // * Expressions can be embedded into templates using ${}.
    //
    const name = "damon";
    const s10 = `
I said:
    "hello, ${name}. We can embed expressions. The time is: ${new Date().toString()}!"`
    // console.log(s10);
    expect(s10.indexOf(name) > 0).toBeTruthy();

    //
    // Tagged templates.
    // Allows you to apply transformations on a template.
    // literals is an array of literal strings as intrepreted by JS.
    // Each subsequent argument is the interpreted value of each substitution.
    //
    // This allows you to create domain specific languages for translating strings.
    //
    function echoTag(literals, ...substitutions) {
        let result = "";
        for (let i = 0; i < substitutions.length; i++) {
            result += literals[i];
            result += substitutions[i];
        }
        // add the last literal.
        result += literals[literals.length - 1];
        return result
    }

    let count = 10,
        price = 0.25,
        message = echoTag`${count} items cost $${(count * price).toFixed(2)}.`;

    expect(message).toEqual("10 items cost $2.50.");

});

test('string iterating', () => {
    const name = "damon";
    var found = "";
    for (let i = 0; i < name.length; i++) {
        // creates a new immutable string with every iteration.
        // would be more efficient as an array.
        found += name[i];
    }
    expect(found).toEqual(name);
});

test('arrays', () => {
    // JS is not typed.
    const a1 = ["tree", 20, [1, 2, 3]];
    expect(a1[0]).toEqual("tree");


    // Copy the array via iteration.
    var a2 = []
    for(let i = 0; i < a1.length; i++) {
        a2.push(a1[i]);
    }
    expect(a1).toEqual(a2);

    // `slice()` will copy an array.
    expect(a1.slice()).toEqual(a1);
});

//
// Sets and Maps
//
// ES6 introduces Set, Map, WeakSet, and WeakMap.
//
// Weak[Set|Map] is good for storing objects to which you do not
// own the lifetime - like storing DOM elements.
//
// Note that the *key* values are weak. When the key is GC'd,
// it will be removed from the collection. The value is not stored weak.
//
test("sets", () => {

    let set = new Set();
    set.add(1);
    set.add("1");

    expect(set.size).toBe(2);

    let found = new Set();

    // Set iteration using `forEach`
    // `key` and `value` are identical for sets.
    set.forEach((value, key, ownerSet) => {
        found.add(value);
    });

    expect(set).toEqual(found);

    set.delete("1");
    set.delete("test"); // ok to remove a value not in the set.

    expect(set.size).toBe(1);
    expect(set.has(1)).toBeTruthy();
    set.clear();
    expect(set.size).toBe(0);
});

test("maps", () => {
    let map = new Map();

    map.set("name", "damon");
    map.set("age", 41);

    expect(map.has("name")).toBeTruthy();
    expect(map.get("name")).toBe("damon");

    map.delete("age");
    map.clear();


    let wMap = new WeakMap();
    let name = {}; // keys must be objects.
    wMap.set(name, "damon");
    expect(wMap.has(name)).toBeTruthy();

    name = null;
    expect(wMap.has(name)).toBeFalsy();

});