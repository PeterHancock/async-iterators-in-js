
name: inverse
layout: true
class: middle, center, inverse
---

# Async Iteration in JavaScript

---

whoami

---
template: inverse

## Part I - Synchronous Iteration

### Consuming Iterables - _for...of_  and  _[...]_

### Producing Iterables - Protocol and Generators

## Part II - Asynchronous Operations
### Callbacks and Promises
### Combining Generators and Promises to emulate blocking
### Async/await

## PART III - Asynchronous Iteration

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

.jsbin.corner.demo[repefax/6]
.techio.corner.demo[YE3o2qH]

---

## What is an _Iterable_?

Any object with the property `[Symbol.iterator]` that is a function returning an _Iterator_

```
{
  [Symbol.iterator]: () => Iterator
}
```

---

## OK, what is an _Iterator_?

An object with the property `next`
```
{
  next: () => { done: boolean, value: any }
}
```

.jsbin.corner.demo[tuhicur/4]

.techio.corner.demo[ziOwLbq]

---

```
...[1, 2]
```

.sequence[simple-array-iteration]

---

## Custom Iterables

#### The Natural Numbers

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

.techio.corner.demo[5FbSTaT]

---

### Iterables can model infinite sequences

### Iterables can lazily construct the next values

---

## The Fibonacci Sequence as an Iterable

From the recursive definition to an iterative process

* f<sub>1</sub>, f<sub>2</sub> = 1
* f<sub>n</sub> = f<sub>n-1</sub> + f<sub>n-2</sub>


```
function fibonacci() {
  return {
    [Symbol.iterator]: () => {
      let x = 1
      let y = 1
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

.jsbin.corner.demo[dewuvin/5]

.techio.corner.demo[UBTJTXi]

---

## Generators

> An ES2015 language feature to simplify the creation of Iterables

```
function* fibonacci() {
  let x = 1
  let y = 1

  while(true) {
    yield x
    y = x + y
    x = y - x
  }
}

```

* `function*`
* `yield`


.jsbin.corner.demo[kagitiy/4]

.techio.corner.demo[vVgsfVs]

---

.sequence[fibonacci-generator]

---

## Talking back to Generators

### Passing in data with `next(value)`

.jsbin.demo[nafajac/6]
.techio.demo[ilnHTiX]

### Returning early with `return()`

### Throwing with `throw(error)`

---

## Transforming Iterators

As with Arrays, transforms like `map`, `filter` can be used to build up interesting iterables.

Whilst the `Array` prototype includes such things, iterables/iterators do not

```
const map = (f) => function* (it) {
  for (i of it) {
    yield f(i)
  }
}
```

```
const filter = (f) => function* (it) {
  for (i of it) {
    if (f(i)) {
      yield i
    }
  }
}
```

.jsbin.corner.demo[lafigaj/12]
.techio.corner.demo[WDpqAn1]

<!-- ---
.sequence[transform]
-->

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
## Callback Hell
Things get messy when callbacks invoke other async operations

```
function getJson(callback) {
  request(url, (error, response) => {
    getBody(response, (error2, body) => {
      callback(null, JSON.parse(body))
    }))
})
```

This style mixes up the calling of async functions with the handling of resolved data

---

## Promises

>  Represents the eventual completion (or failure) of an asynchronous operation, and its resulting value.

`Promise.then` is called to register success and failure handlers which and called after the operation has completed.

These days many APIs use *Promise* returning functions for async operations

```
function asyncOp(...args): Promise<Result>
```

e.g. `fetch`
```
fetch(url)
  .then((response) => {
    // The response header is resolved before the body is streamed
    return response.getJson()
  })
  .then((data) => /* do something with json data */)
```
---

## Generators and Promises

If a blocking version of `fetch` and `getJson` existed the code could look like

```
const response = fetch(url)
const json = response.getJson()
```

This clearly expresses the sequence of operations (albeit by blocking the single thread!)

How about

```
function * () {
  const response = yield fetch(url)
  const json = yield response.getJson()
  return json
}
```

What if iterating logic looked like?:

* Received the yielded promise by calling  `next()` on the iterator
* Called `next(value)` with the resolved value
* Repeat

---

Libraries like [co](https://github.com/tj/co) do this looping, and with proper error handling, etc

```
co(function * () {
  const response = yield fetch(url)
  const json = yield response.getJson()
  return json
})
  .then((json) => /* ... */)
```
---

## Async/Await

Standardized syntax to simplify this Generator/Promise pattern

```
async function fetchData() {
  const response = await fetch(url)
  const json = await response.getJson()
  return json
}

fetchData().then( json => /* ... */)
```

> Introduced in ES2017 and supported natively in modern browsers

.jsbin.corner.demo[sipozuf/1]

---

## Part I & II Recap

* `for...of` and `[...]` - syntactic forms consuming Iterables

* Iterables are objects with Iterator creating function keyed to `Symbol.iterator`

* Iterables can represent infinite sequences and the items can be created lazily on demand

* Generators provide syntax for creating Iterables concisely

* Async operations can be tamed with Promises

* A blocking style control flow can be emulated with Generators and Promises

* Async/Await brings this pattern to the language with new syntactic forms

---
template: inverse

# Part III

# Asynchronous Iteration

---
layout: none

`for-await-of`
```
  for await (const item of asyncIterable) {
     // use item
  }
```

The Async Iterable Protocol
```
{
  [Symbol.asyncIterator]: () => ({
    next: () => Promise<{ done: boolean, value: any }>
  })
}
```
Async Generators
```
async function * asyncGenerator () {
  await
  yield  
}
```
* Standardized in ES2018
* Supported in the latest stables of modern browsers
* Available in Node v8.10 with `--es_staging` flag

---

## A Sequence of Random Numbers

The Australian National University provides a Quantum Random Numbers REST service
```
const getQuantumRandomNumber = async () => {
  const response = await fetch('https://qrng.anu.edu.au/API/jsonI.php?length=1&type=uint8')
  const json = await response.json()
  return json.data[0]
}
```

Lets create an async sequence from this
```
async function* quantumRandomNumbers() {
  while (true) {
    yield await getQuantumRandomNumber()
  }
}
```

And consume it

```
for await (const randomNumber of quantumRandomNumbers()) {
  console.log(randomNumber)
}
```

.jsbin.corner.demo[licefuj/5]

<!-- ---
.sequence[async-random]
-->
---

## Iterating Over Network Streams

> [ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) part of the Streams API

* Streaming data over the network avoids buffering the whole response body

* fetch -  `response.body` is a `ReadableStream`

```
async function* toAsyncIterator(url) {
  const response = await fetch(url)
  const reader = response.body.getReader() // ReadableStream
  let next = await reader.read()
  // noprotect
  while (!next.done) {
    yield next.value
    next = await reader.read()
  }
}
```

.jsbin.demo[fiqojuc/7]

---

## Transforming Async Iterators

```
const map = (f) => async function* (it) {
  for await (const i of it) {
    yield f(i)
  }
}
```

```
const filter = (f) => async function* (it) {
  for await (const i of it) {
    if (await f(i)) {
      yield i
    }
  }
}
```

---

## Transforming Async Iterators

.sequence[async-random-transform]

<!-- ---
## A Queue with Blocking Takes

.jsbin.demo[takohaz/7]

Queues are the concurrency primitive at the core of the Actor model (Erlang, Scala) and CSP (Communicating Sequential Processes) (Clojure's core.async)
-->

---
template: inverse

# Thank you

Slides powered by [remark](https://remarkjs.com)

<!-- ---

## References

* [Async Iterators Proposal](https://github.com/tc39/proposal-async-iteration)
* [ES2015 Iteration](http://exploringjs.com/es6/ch_iteration.html#sec_iterability)
* [ES2018](http://2ality.com/2017/02/ecmascript-2018.html)
* [Readable Streams](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
-->
