# mut关键字

mut关键字看似简单，但实际使用细节仍需要深入了解。

## mut修饰变量而非值

```rust
fn main() {
    let a = vec![0];
    let mut b = a;
    b.push(1);
    println!("{:?}", b);//[0, 1]
}
```

`mut`不具有`const`那样的功能，它只表示无法使用当前变量来修改值。

## mut修饰引用值而非引用变量

```rust
fn main() {
    let mut a = vec![0];
    
    let mut c = &a;// 虽然编译器不报错，但是这里的mut是无效的
    let d:&mut Vec<i32> = &mut a;// mut引用值的来源为mut变量或者mut引用值
    d.push(1);
    println!("{:?}", a);//[0, 1]
}
```

## mut修饰指针

// TODO