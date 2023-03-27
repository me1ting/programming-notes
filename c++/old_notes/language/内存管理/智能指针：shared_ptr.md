# 智能指针
智能指针提供了一定程度上的内存自动释放机制，是通过`模板`技术实现的。
>虽然不了解模板，可以简单理解为：封装+语法支持。

智能指针并不参与动态内存的分配，只是解放了人们手动释放内存的繁琐，目标对象依然需要使用`new`来进行动态分配。

## 智能指针与异常
使用智能指针可以在异常打破执行流时，因为退出块而自动释放相应内存，避免内存泄露。

# shared_ptr
```cpp
#include <memory>

int main() {
    using std::shared_ptr;
    using std::make_shared;
    shared_ptr<int> p = make_shared<int>(10);
}
```

shared_ptr使用`引用计数`策略，指针可以被拷贝、复制、释放，当引用计数为0时释放其指向的对象。

## 与new配合使用
注意的是，只能使用直接初始化shared_ptr的方式：
```cpp
int *pi = new int{1024};
//shared_ptr<int> p = pi;//错误，不支持普通指针到智能指针的转换
shared_ptr<int> p{pi};
```

## 指向非动态内存
默认是不允许的，因为会调用`delete`来释放内存，但是可以覆盖调用delete，从而允许指向其它内存。

## 自定义deleter
//more
