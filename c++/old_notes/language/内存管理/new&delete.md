# new&delete
```cpp
int *pi = new int{1024};
delete pi;
```

## 默认分配与初始化
默认分配的对象是默认初始化的，建议显式初始化：
```cpp
int 
```

## 内存分配失败
由于OOM可能导致内存分配失败，默认会抛出异常。可以阻止异常，而要求返回nullptr：
```cpp
int *p2 = new (nothrow) int;
```

### 安全性
直接管理内存是很不方便的，也是C++最常见的内存问题。

`空悬指针`定义已经被释放内存了的无效指针。