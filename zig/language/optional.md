# optional

不同于Java/Rust，Zig没有提供一个`Option`类型。而是采用更复杂的解决办法（语法化）：

- 提供`null`，这是一个特殊的值，表示空
- 设计了独特的语法来表示`optional`

## orelse value

```go
test "orelse" {
    const a: ?f32 = null;
    const fallback_value: f32 = 0;
    const b = a orelse fallback_value;
    try expect(b == 0);
    try expect(@TypeOf(b) == f32);
}
```

`?f32`是一个Option类型，`a orelse fallback_value` 等价于Rust中的 [unwrap_or](https://doc.rust-lang.org/std/option/enum.Option.html#method.unwrap_or)。

## orelse unreachable 与 .?

```go
test "orelse unreachable" {
    const a: ?f32 = 5;
    const b = a orelse unreachable;
    const c = a.?;
    try expect(b == c);
    try expect(@TypeOf(c) == f32);
}
```

`.?`是`orelse unreachable`的简写，这里有个问题，按照reddit的[讨论](https://www.reddit.com/r/Zig/comments/10kuqvv/meaning_of_unreachable_keyword/)以及[官方文档](https://ziglang.org/documentation/master/#unreachable)，`unreachable`行为受到发布模式的影响，因此它并不能完全等价于Rust的[`unwrap`](https://doc.rust-lang.org/std/option/enum.Option.html#method.unwrap "method std::option::Option::unwrap")。

## if与while的支持

```go
test "if optional payload capture" {
    const a: ?i32 = 5;
    if (a != null) {
        const value = a.?;
        _ = value;
    }

    var b: ?i32 = 5;
    if (b) |*value| {
        value.* += 1;
    }
    try expect(b.? == 6);
}

var numbers_left: u32 = 4;
fn eventuallyNullSequence() ?u32 {
    if (numbers_left == 0) return null;
    numbers_left -= 1;
    return numbers_left;
}

test "while null capture" {
    var sum: u32 = 0;
    while (eventuallyNullSequence()) |value| {
        sum += value;
    }
    try expect(sum == 6); // 3 + 2 + 1
}
```

## 小结

个人认为，相比于Rust，Zig的可选类型设计是很丑陋的，语法化意味着它缺乏Option类型的表现力且存在记忆成本，if 与 while 对其的支持让我仿佛看到了`if (null)`，把 null 强制转换成布尔类型的丑陋。

尚且不知Zig是否是因为与C集成的考量，才进行如此设计。
