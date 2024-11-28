# examples

## array

### 去除重复

可以使用如下方式，给数据去重且保留顺序，但这种方式仅限于少量数据，因为性能较差。

```js
const arr = [1, 2, "a", "b", 2, "a", 3, 4];
const uniqueArr = arr.filter((element, index) => {
  return arr.indexOf(element) === index;
});
```

如果大量数据，需要使用array记录顺序，使用Set去除重复。
