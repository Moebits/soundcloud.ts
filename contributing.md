# Style Guide

If you wish to contribute to my repository, you must follow my style guide.

**1. No Semicolons** \
Do not use semicolons, unless when needed to avoid a syntax error. They are ugly.

```ts
// x Bad
let a = 5;
// ✓ Good
let a = 5
```

**2. Double quote strings** \
Use double quotes for string literals, not single quotes. 

```ts
// x Bad
let a = 'hello'
// ✓ Good
let a = "hello"
```

**3. No spaces on imports** \
No spaces when importing classes.

```ts
// x Bad
import { Test } from "test"
// ✓ Good
import {Test} from "test"
```

**4. Use arrow functions** \
Use arrow functions, not regular functions.

```ts
// x Bad
async function func(str: string) {}
// ✓ Good
const func = async (str: string) => {}
```

**5. No var** \
Do not use var when declaring variables.

```ts
// x Bad
var a = 1
// ✓ Good
let a = 1
const b = 2
```

**6. No double equals** \
Do not use the double equals/not equals.

```ts
// x Bad
if (a == 1)
if (a != 1)
// ✓ Good
if (a === 1)
if (a !== 1)
```

**7. Do not fill with comments** \
Do not fill the code with excessive comments. A documentation comment for the function is fine. If you have 
to comment every other line, you are making bad code.

```ts
// x Bad
// set a to 1
let a = 1
// ✓ Good
/**
* Gets a user from the api
*/
public getUser = async () => {}
```

**8. Use implicit return types** \
Let typescript infer the return type whenever possible. This helps when refactoring, since changes to the function will always update to the correct return type.

```ts
// x Bad
public func = async (str: string): Promise<string> => {}
// ✓ Good
public func = async (str: string) => {}
```

**9. Interface vs type** \
Interface should be used for large object-like types. Type is used for simpler union types or when generics are needed.

```ts
// Interface
interface User {
  name: string
  birthday: string
}
// Type
type Theme = "light" | "dark"
```

**10. Minimize any usage** \
Typed code minimizes bugs. Therefore you should reduce the usage of any type as much as possible, although sometimes it is 
unavoidable.

```ts
// x Bad
let x = [] as any
// ✓ Good
let x = [] as string[]
```

**11. Use async/await** \
Use async/await. Avoid nested callbacks hell. You can convert a callback to async/await like this:

```ts
await new Promise<void>((resolve) => {
  callback((result) => {
    resolve()
  })
}
```

**12. Use array methods for simple logic** \
Prefer array methods like map and filter for simple logic over a for loop. For complex logic, you may 
use a for loop instead.

```ts
// x Bad
for (let i = 0; i < a.length; i++) {
  a[i] += 5
}
// ✓ Good
a = a.map(x => x + 5)
```

