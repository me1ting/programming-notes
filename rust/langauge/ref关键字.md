# ref关键字

我是逛论坛了解到这个关键字的，《trpl》中并没有讲解这个关键字，因为它的使用场景很少。

## 模式匹配

这个关键字设计出来的唯一目的是在模式匹配时，表示传递引用，而非所有权。

```rust
let maybe_name = Some(String::from("Alice"));
// Using `ref`, the value is borrowed, not moved ...
match maybe_name {
    Some(ref n) => println!("Hello, {n}"),
    _ => println!("Hello, world"),
}
// ... so it's available here!
println!("Hello again, {}", maybe_name.unwrap_or("world".into()));
```
## 其它场景（避免使用）

语法上虽然允许在其它地方使用`ref`，但是最好不要这样做，**除了引起混乱并没有任何好处**。

ref可以用来定义引用：

```rust
let mut x = 5;
let ref z = x;//&i32
let ref mut z = x; //&mut i32
```

ref可以用在函数参数上，但会导致所有权的转移（引起混乱）：

```rust
fn main() {
    let s = String::from("hello");
    change(s);
    //println!("{}", s); 无法编译，s已经move
}

fn change(ref mut s: String) {
	// 虽然s是一个引用，但函数要求传入s后再获取引用，发生了move
    s.push_str(", world");
    println!("{}", s);
}
```

## 参考资料

[doc: ref 关键字](https://doc.rust-lang.org/stable/std/keyword.ref.html#)