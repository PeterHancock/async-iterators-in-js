name: agenda
class: middle, center

# Async Iteration in JavaScript

---

whoami

---

class: middle, center

# Part I

# Synchronous Iteration

---

```
for (i of Iterable) {
}
```

```
[...Iterable]
```

TODO when was spread etc introduced
Examples of native Iterables

---

What is an Iterable?

An object with the property `[Symbol.iterator]` is an _Iterator_ return ing function

---

OK, what is an Iterator

'Interface'

```
{
  next(nextValue) {
    return { value, done: boolean }
  }
  \\ Optional
  throw(err) {

  }
  \\ Optional
  return() {

  }
}
```

---

Many Iterators are also Iterable!

Call iterator manually, e.g.
`"abc"[Symbol.iterator]()`

Proxy an iterator and put it through a loop (could use `Proxy` but KISS)

```
function decorate(iterator) {
  return
}
```

* Demo early termination ('return')
* Demo `try-catch-finally`

---

Custom iterables/iterators

Fibonacci?

```
  function Fib(f0 = 1, f1 = 1) {
    const iterator = () => {
      let x = f0
      let y = f1
      function next = () => {
        const value = x
        y = x + y
        x = x - y
        return {
          value,
          done: false
        }
      }
    }
    return {
      [Symbol.iterator]: iterator
    }
  }
```

```
  let n = 0
  for (const i of Fib()) {
    console.log(`fib_${n} = ${i}`)
    if (n++ > 10)
      break
  }
```

---

Slightly cumbersome - generators give us a more declatitive way
Generators

Passing data to the interator `next(value)`

```
  function* fib(f0 = 1, f1 = 1) {
    let x = f0
    let y = f1
    while(true) {
      yield x
      y = x + y
      x = x - y
    }
  }
```

Composing generators - [].map.filter...

```
const map = (f) => function*(it) {
  for (i of it) {
    yield f(i)
  }
}
```

```
map(x => x * 2)(
  map(x => x + 1) (
    [1, 2, 3]
    )
  )
```

or

```
const transform = R.compose(map(x => x * 2), map(x => x + 1))

const transformedIterator = transform([1, 2, 3])
```

---

Idea to represent iteration

```
[1, 2, 3] -> ... -> []
[2, 3] 1 -> 2 -> 4 [4]
[3] 2 -> 3 -> 6 [4, 6]
[]  3 -> 4 -> 8 -> [4, 6, 8]
```

Transducers for obviating the nested iterators?

## Async

callbck hell

Promise chaining

(pre async/await)

```
function run(promises) {
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


run(function * fetchData() {
  const data = yield fetch(url)
  console.log(data)
  return data
})
```

```
async function fetchData() {
  const data = await fetch(url)
  console.log(data)
  return data
}

fetchData()
```

Note async functions are

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
[es6 spec](http://exploringjs.com/es6/ch_iteration.html#sec_iterability)

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
