
name: inverse
layout: true
class: middle, center, inverse
---

# Async Iteration in JavaScript

---

whoami

---
template: inverse

## Part I - Synchronous iteration

### Consuming iterators
#### `for...of`
#### `[...]`

### Producing iterators
####  The protocol
#### Generators

## Part II - Asynchronous
#### Callbacks and Promises
#### Combining Generators and Promises for pseudo synchronous style
#### Async/await

---

## PART III - Asynchronous iteration

---
template: inverse

# Part I

# Synchronous Iteration

---
layout: false

## Consuming Iterables

#### `for...of`

```
for (item of Iterable) {
  // do something with item
}
```

#### The spread operator

```
[...Iterable]
```

Both introduced in ES6/ECMAScript 2015 and supported natively in modern browsers

.jsbin.corner.demo[repefax/3]

---

## What is an _Iterable_?

Any object with the property `[Symbol.iterator]` that is a function returning an _Iterator_

---

## OK, what is an _Iterator_?

An object with the property
```
next: () => { done: boolean, value: any }
```

.jsbin.corner.demo[tuhicur/4]

---

```
...[1, 2]
```

.sequence[simple-array-iteration]

---

## Custom Iterables

### The Natural Numbers

```
const naturalNumbers = {
  [Symbol.iterator]: () => {
    let n = 0
    return {
      next: () => ({
        value: ++n,
        done: false
      })
    }
  }
}
```

.jsbin.corner.demo[wisotiw/3]

---

* Iterables can represent infinite sequences
* Iterables can lazily construct the next value

---

## The Fibonacci sequence as an Iterable

From the recursive definition `fn = fn-1 + fn-2` to an iterative process

```
function fibonacci(f0 = 1, f1 = 1) {
  return {
    [Symbol.iterator]: () => {
      let x = f0
      let y = f1
      return {
        next: () => {
          const value = x
          y = x + y
          x = y - x
          return {
            value,
            done: false
          }
        }
      }
    }
  }
}
```

.jsbin.corner.demo[dewuvin/3]

---

## Generators

> An ES2015 language feature to simplify the creation of iterables

```
function* fibonacci(f0 = 1, f1 = 1) {
  let x = f0
  let y = f1

  while(true) {
    yield x
    y = x + y
    x = y - x
  }
}

```
* `function *`
* `yield`


.jsbin.corner.demo[kagitiy/2]

---
```
function* naturalNumbers() {
  let i = 0
  while (true) {
    yield ++i
  }
}
```

```
for (const n of naturalNumbers()) {
  // do something
  if (n > 1) break
}
```

---

.sequence[simple-generator-loop-break]

---

## Transforming Iterators

As with Arrays, transforms like `map`, `filter` can be used to build up interesting iterables.

Whilst the `Array` prototype includes such things, iterables/iterators do not

```
const map = (f) => function*(it) {
  for (i of it) {
    yield f(i)
  }
}
```

```
const filter = (f) => function*(it) {
  for (i of it) {
    if (f(i)) {
      yield i
    }
  }
}
```

.jsbin.corner.demo[lafigaj/8]

---

.sequence[transform]

---

## Talking back to Generators

### Passing in data with `next(data)`

.jsbin.demo[nafajac/5]

### Returning early with `return()`

.jsbin.demo[nucicom/1]

---
template: inverse

# Part II

# Asynchronous Operations

---
layout: none

The traditional function signature for an async operations is

```
function asyncOp(..., callback) {

}
```

e.g.

```
function request(url, callback) {
  // get response and
  callback(null, response) // traditionally the first argument is for errors
}
```
---
## Callback hell
Things get messy when callbacks invoke other async operations

```
function getStuff (callback) {
  request(url, (err, response) => {
    getJson(response, (jsonErr, json) => {
      callback(null, json)
    }))
})
```

This style tightly interleaves the the calling of async functions with the handling of resolved data

---

## Promises

> Represent future data

`Promise.then` is used to register handlers, and called once the data is available
`Promise.catch` for handling errors

Using Promise returning functions for async ops

```
function request(url): Promise<Result>
```

e.g.
```
request(url)
  .then((response) => {
    return getJson(response)
  })
  .then((json) => /* do something with json */)

```
---

## Generators and Promises

If a blocking version `request` and `getJson` existed the code would look like

```
const response = request(url)
const json = getJson(response)
// do something with json

```

This clearly expresses the sequence of operations (but with the single thread blocked!)

---

```
function * () {
  const response = yield request(url)
  const json = yield getJson(response)
  return json
}
```

The iterating logic could call next on the iterator and once the yielded promise is resolved call next with the resolved value.

---

Libraries like [co](https://github.com/tj/co) do this iterating for us

```
co(function * () {
  const response = yield request(url)
  const json = yield getJson(response)
  return json
})
  .then((json) => /* ... */)
```
---

## Async/await

Standardise this Generator/Promise use case

```
async function fetchData() {
  const response = await request(url)
  const json = await getJson(response)
  return json
}

fetchData().then( json => /* ... */)
```

> Introduced in ES6/ECMAScript 2017 and supported natively in modern browsers

.jsbin.corner.demo[yawuroq/2]

---

## Part I & II recap

* `for...of` and `[...]` syntactic forms consuming Iterables

* Iterables are defined by the Iterator creating function keyed to `Symbol.iterator`

* Iterables can represent infinite sequences and the items can be created lazily on demand

* Generators provide a syntax to declaratively creating Iterables

* Async operations can be tamed with Promises

* A blocking like control flow can be emulated with Generators and Promises

* Async/Await brings this pattern to the spec with new syntactic forms

---
template: inverse

# Part III

# Asynchronous Iteration

---
layout: none


Async iteration looks like
```
  for await (item of asyncIterable) {

  }
```

An Async Iterable imlements the protocol
```
{
  [Symbol.asyncIterator]: () => ({
    next: Promise<{ done: boolean, value: any }>
  })
}
```
---
Blocking queue

---

## References

[Proposal Async Iterators](https://github.com/tc39/proposal-async-iteration)
[ES2015/ES6](http://exploringjs.com/es6/ch_iteration.html#sec_iterability)
[ES2018](http://2ality.com/2017/02/ecmascript-2018.html)
---

[Slides powered by remark](https://remarkjs.com)

---

Code

<a class="jsbin-embed" href="http://jsbin.com/vewedugato/embed?js,console"></a>

---

Sequence SVG

.sequence[transform]

---
Idea to represent iteration

```
[1, 2, 3] -> ... -> []
[2, 3] 1 -> 2 -> 4 [4]
[3] 2 -> 3 -> 6 [4, 6]
[]  3 -> 4 -> 8 -> [4, 6, 8]
```

Transducers for obviating the nested iterators?
