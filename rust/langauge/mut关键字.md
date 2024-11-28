# mut关键字

mut关键字看似简单，但实际使用细节仍需要深入了解。

## mut修饰变量

```rust
fn main() {
    let a = vec![0];
    let mut b = a;
    b.push(1);
    println!("{:?}", b);//[0, 1]
}
```

`mut`修饰变量，表示变量可以被修改。

## mut修饰引用

```rust
fn main() {
    let mut a = vec![0];

    let mut c = &a;// 虽然编译器不报错，但是这里的mut是无效的
    let d:&mut Vec<i32> = &mut a;// mut引用值的来源为mut变量或者mut引用值
    d.push(1);
    println!("{:?}", a);//[0, 1]
}
```

mut可以用来修饰引用，表示可以通过该引用修改可变变量。
