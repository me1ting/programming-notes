# 基本概念

## 虚函数

由基类定义的，但不包含实现，希望子类自己实现的函数。

```cpp
class Sharp{
public:
    virtual std::string type();
};
```

### 动态分派

子类继承基类时可以指定`public`，这样可以将子类对象作为基类使用：

```cpp
class Sharp {
public:
    virtual std::string name() { return "sharp"; };
};

class Round : public Sharp {
public:
    std::string name() override {
        return "round";
    }
};

int main() {
    Round r = Round{};
    Sharp *s1 = new Round{};
    Sharp *s2 = &r;
    Sharp &s3 = r;
    Sharp s4 = r;//注意这是拷贝初始化
    std::cout << s1->name() << std::endl;//round
    std::cout << s2->name() << std::endl;//round
    std::cout << s3.name() << std::endl; //round
    std::cout << s4.name() << std::endl; //sharp
    delete s1;
}
```

### 虚析构函数

只有虚函数才能动态分派，既然使用了虚函数，那么子类就可能被当做基类使用：此时，析构函数默认是非虚函数，调用的是基类的析构函数，导致资源没有正常释放。因此只要用到了虚函数，基类必然要设置虚析构函数：

````
```cpp
class Sharp {
public:
    virtual std::string name() { return "sharp"; };
    virtual ~Sharp = default;
};
````

## 继承

子类继承基类的语法称为`类派生列表`：

```
class Round:Sharp{//:后面那一坨
public:
    std::string name() override {
        return "round";
    }
};
```
