# 对象的DIFF和CMP

在一些场景下，我们需要对对象进行diff或是cmp（指相等比较）。

## 对象的DIFF

这是源于一个我实际遇到的一个场景，我有一个TS库生成JSON数据，后来我使用Rust进行了重写，而TS库依然维护。由于生成的JSON数据比较复杂，我需要将TS库的生成结果用作对比测试，对生成的两个JSON进行diff。

首先，需要对diff进行定义：

- 必须包含相同的字段，不能存在额外字段
- 数组基于Set的比较，即不比较顺序

我的需求细节是：

- 能够描述diff的具体点，这样能方便我针对性的去检查代码。

通过Google，我找到了[deep-object-diff](https://www.npmjs.com/package/deep-object-diff)，它完美的满足我所有需求。

```js
//ts_result和rs_result是需要比较的JSON，通过JSON.parse()转化得到
expect(diff(ts_result, rs_result)).toEqual({});
```

diff得到的就是两者的差异，测试工具在不匹配时会打印显示diff。

## 对象的CMP(deep equal)

这是我在对象的DIFF的需求场景时，最开始考察的办法，发现它没法获取`diff`内容，所以放弃了该方法。

### Runtime的实现

常用的JS运行时都提供了原生实现：

- Bun提供了[deepEquals()](https://bun.sh/guides/util/deep-equals)函数
- Node.js提供了`asset.deepEquals()`函数

### JSON.stringify（错误方法）

```js
JSON.stringify(person1) === JSON.stringify(person2);
```

一些资料提到该方法，这是行不通的，因为如果字段、数组元素顺序不一致，也会导致结果不同。
