name: inverse
layout: true
class: middle, center, inverse
---
# Async Iteration in JavaScript

---

whoami

---

class: middle, center

# Part I

# Synchronous Iteration

---
layout: false

```
for (i of Iterable) {
}
```

```
[...Iterable]
```

Both introduced in ES6/ECMAScript 2015 and supported natively in modern browsers

<a target="_blank" href="http://jsbin.com/fowojaloto/1/edit?js,console">demo</a>

<!-- a class="jsbin-embed" href="http://jsbin.com/fowojaloto/1/embed?js,console">JS Bin on jsbin.com</a-->

---

So what is an Iterable?

An object with the property `[Symbol.iterator]` that is an _Iterator_ returning function

---

## OK, what is an Iterator?

The minimal protocol is
```
{
  next(nextValue) {
    return { value, done: boolean }
  }
}
```

```
[1, 2, 3][Symbol.iterator]().next() // { done: false, value: 1 }
```

<a target="_blank" href="http://jsbin.com/rajeniyoho/2/edit?js,console">run</a>

---

Many Iterators are also Iterables!

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
template: inverse

# Part II

# Asyncronous Operations

---
layout: none

## callback hell

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

## Generators to the rescue

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
  const moreData = await fetch(anotherUrl)
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
