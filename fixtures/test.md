# Test

<!-- import source/test.json -->

```json
{
  "a": 1,
  "b": 2,
  "c": 3,
  "d": 4,
  "e": 5
}
```

<!-- importend -->

<!-- import source/test.json --slice 2:4 -->

```json
  "b": 2,
  "c": 3,
```

<!-- importend -->

<!-- index source/test1.md -->

- [source/test1.md](source/test1.md)

<!-- indexend  -->

<!-- import source/*.js -->

```js
console.log('test1.js..()');
```


```js
console.log('test2.js..()');
```

<!-- importend -->

<!-- index source/*.md -->

- [source/test1.md](source/test1.md)
- [source/test2.md](source/test2.md)

<!-- indexend  -->

<!-- import source/*.js --title-tag h3 -->

### source/test1.js


```js
console.log('test1.js..()');
```


### source/test2.js


```js
console.log('test2.js..()');
```

<!-- importend -->

<!-- index source/*.{md,js} -->

- [source/test1.js](source/test1.js)
- [source/test1.md](source/test1.md)
- [source/test2.js](source/test2.js)
- [source/test2.md](source/test2.md)

<!-- indexend  -->