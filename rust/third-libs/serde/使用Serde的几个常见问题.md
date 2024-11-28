# 使用Serde的几个常见问题

## 反序列化
### 自包含类型

使用`Box`：

```rust
struct Person{
	friends: Vec<Box<Person>>
}
```

### 未声明的字段

有时我们只需要对JSON数据的部分内容进行读写，不需要完整的建模整个JSON数据，也不能破坏JSON数据的结构，我们需要捕获未声明字段。

```rust
type Data{
	field1:...,
	field2:...,
	...
	#[serde(flatten)]
	other: HashMap<String, Value>,//存放未声明的字段
}
```

### 带路径的错误信息

Serde的错误信息不包含错误位置，让人摸不着头脑，无从下手解决问题。使用[serde_path_to_error](https://crates.io/crates/serde_path_to_error)库可以解决这个问题。

将serde_path_to_error作为开发阶段依赖：

```
[dev-dependencies]
serde_path_to_error = "0.1"
```

获取错误信息：

```rust
let contents = fs::read_to_string("user.json").unwrap();

let de = &mut serde_json::Deserializer::from_str(&contents);
let result: Result<User, _> = serde_path_to_error::deserialize(de);
result.unwrap();
```

现在，在测试时会出现错误路径：

```
Error { path: Path { segments: [Map { key: "friends" }] }, original: Error("expected value", line: 7, column: 24) }
```

### Union Type

#### 使用enum

这里所指的Union Type对应TypeScript的联合类型：

```ts
// 这里定义了一个Person类型表示人，TA有一个名字或者多个名字
type Persion = {
	name: string|string[],
}
```

上述中的`name`就是一个Union Type。这对应Rust中的枚举类型。

>Rust也有C中的[Union类型](https://doc.rust-lang.org/reference/items/unions.html)，与这里讨论的Union Type不同。

```rust
#[derive(Serialize, Deserialize, Debug)]
struct Persion {
	name: NameData,
}
#[derive(Serialize, Deserialize, Debug)]
#[serde(untagged)]// 这个标记很重要
enum NameData{
	name(string),
	names(Vec<string>)
}
```

关于枚举更细节的使用方式，参考[文档](https://serde.rs/enum-representations.html)。这个方法在一些场景下无效，比如：

```json
[
  {
    "a":{
      "1":1,
      "2",2,
    }
  },
  {
  "a": []
  }
]
```

这是我在实际项目中遇到的问题，一个字段可能是数组也可能是对象，无法将字段A映射为：

```rust
#[derive(Serialize, Deserialize, Debug)]
#[serde(untagged)]
pub enum TypeA {
    Map(HashMap<i32, i32>),
    Empty(Vec<i32>),
}
```

#### 自定义反序列化

一个更复杂，但更灵活的办法是自定义反序列化函数。参考我在 poe-trans 中的实现。

参考：

[doc: 反序列化到Map](https://serde.rs/deserialize-map.html)<br/>
[doc: 自定义序列化](https://serde.rs/custom-serialization.html)

### Object键的顺序

当使用HashMap映射JSON中的Object时，反序列化后再序列化，会发现键的顺序是乱序的，而一些应用可能依赖这个顺序。

解决办法是使用[indexmap](https://docs.rs/indexmap/latest/indexmap/)

