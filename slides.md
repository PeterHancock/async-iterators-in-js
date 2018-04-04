
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
#### `for of`
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

#### `for of`

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

.jsbin[repefax/3]

---

## What is an _Iterable_?

Any object with the property `[Symbol.iterator]` that is a function returning an _Iterator_

---

## OK, what is an _Iterator_?

An object with the property
```
next: () => { done: boolean, value: any }
```

.jsbin[tuhicur/4]

---

Sequence diagram of simple for loop/ spread

---

## Custom Iterables

### The Natural Numbers

```
const = {
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

.jsbin[wisotiw/3]

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

.jsbin[dewuvin/3]

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


.jsbin[kagitiy/2]

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

.jsbin[lafigaj/5]

---

sequence diagram

echo repeats each item from the delegate iterator

take - takes the first n items

---

## Talking back to Generators
Passing data to the iterator `next(value)`


```
iterator.next(value)
```

---

```
function decorate(iterator) {
  return
}
```

* Demo early termination ('return')
* Demo `try-catch-finally`

---
template: inverse

# Part II

# Asyncronous Operations

---
layout: none

## Callback hell

```
fetch(url, (err, data) => {
    fetch(anotherUrl, (err, data) => {
       ...  
    })
})

```


## Promise chaining

```
fetch(url)
  .then((data) => {
    return fetch()
  })

```
---

## Generators and Promises


Create a generator that yields promises
Iterate over the resultant iterator calling next when the with the result resolved from the previously yielded promises

```
const result = yield Promise.resolve(value)
```

```
const promise = iterator.next()
promise.then((result) => {
  iterator.next(result)
})
```

```
function runAsync(promises) {
  return new Promise(resolve => {
    const _next = (input) => {
      const { value, done } = promises.next(input)
      if (done) {
        Promise.resolve(value).then(resolve)
      } else {
        return Promise.resolve(value).then(_next)
      }
    }
    _next()
  })
}

runAsync(function * fetchData() {
  const response = yield fetch(url)
  console.log(response.status)
  const json = yield response.json()
  return json
})
```
---

## Async await

```
async function fetchData() {
  const data = await fetch(url)
  console.log(data)
  const moreData = await fetch(anotherUrl)
  return data
}

fetchData()
```

Note async functions are

---

## Async iteration

```
  for await (i of asyncIterator) { }
  promise.all([...asyncIterator])
```

```
  next: Promise<{ done, value }>
```

Blocking queue

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

Image

<p class="scrollbar">
  <image src="static/transform.svg"/>
</p>

---

Idea to represent iteration

```
[1, 2, 3] -> ... -> []
[2, 3] 1 -> 2 -> 4 [4]
[3] 2 -> 3 -> 6 [4, 6]
[]  3 -> 4 -> 8 -> [4, 6, 8]
```

Transducers for obviating the nested iterators?
