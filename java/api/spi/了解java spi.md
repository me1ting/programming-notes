# 了解Java SPI

SPI是`Service Provider Interface`（服务提供者接口）的缩写，是Java提供的用于框架的可扩展、可替换实现的API。

在一个典型的应用场景中，包括三部分：服务发现者、SPI协议(API)、服务提供者。

![](_images/Pasted%20image%2020230617233049.png)

服务发现者定义了`服务`，并通过SPI自动找到位于classpath下的服务实现类，通过反射获得实例。

## 服务发现者

服务发现者可调用 `java.util.ServiceLoader` 提供的API加载并遍历所有服务实现类的无参实例。

```java
public static void main(String[] args) {
    ServiceLoader<HelloService> serviceLoader = ServiceLoader.load(HelloService.class);
    Iterator services = serviceLoader.iterator();

    while(services.hasNext()) {
        System.out.println(((HelloService)services.next()).helloWorld());
    }
}
```

## SPI协议

由`java.util.ServiceLoader` 类完成。基本思路是：

- 拼接`\META-INF\services\`与服务接口全类型名得到资源文件名
- 使用`ClassLoader`读取资源文件
- 解析资源文件得到`Provider`全类型名称
- 根据全类型名称加载类并创建无参实例
- 调用迭代器，循环以上过程

## 服务提供者

服务提供者是服务的实现方，通常为独立的jar包，实现了Service接口，并进行了声明：创建了`\META-INF\services\{服务接口全类型名}`的文件，并在其中声明了实现类的全类型名称。

```
spi.ChineseHelloService
spi.EnglishHelloService
```

## 应用场景

SPI API在Java 和第三方框架中广泛使用：

- JDBC自动加载驱动
- Servlet3 支持使用Java类进行配置
- 日志门面框架（log4j,logback...）自动加载日志实现

## 总结

Java SPI是Java为满足框架的可扩展、实现可替换的需求而提供的一套API，在Java中广泛引用。
