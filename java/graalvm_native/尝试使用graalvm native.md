# 尝试使用graalvm native

`graalvm native`是Java在云原生时代所做出的重大方向调整，目的是更适应容器执行环境：

- 快速启动
- 减小文件大小和降低内存占用

本文记录了个人在Windows上的尝试记录。
## 前期准备

### 下载oracle graalvm

[下载](https://www.oracle.com/java/technologies/downloads/#graalvmjava21-windows)我们需要的graalvm，解压到合适位置，并将其添加到系统的`PATH`路径下，以及设置`JAVA_HOME`。

```
PS C:\Users\me> java -version
java version "21.0.1" 2023-10-17
Java(TM) SE Runtime Environment Oracle GraalVM 21.0.1+12.1 (build 21.0.1+12-jvmci-23.1-b19)
Java HotSpot(TM) 64-Bit Server VM Oracle GraalVM 21.0.1+12.1 (build 21.0.1+12-jvmci-23.1-b19, mixed mode, sharing)
```

### 安装vs c++编译环境

我的电脑上已经安装了visual stdio 2022 C++环境。

### 准备示例程序

Hello.java

```java
public class Hello{
    public static void main(String[] args){
        System.out.println("hello");
    }
}
```

MANIFEST.MF

```
Manifest-Version: 1.0
Main-Class: Main
```

创建一个空白文件夹，创建以上文件，然后编译和创建JAR包：

```
javac Hello.java
jar cvfm Hello.jar .\MANIFEST.MF Hello.class
```

这样我们就得到了一个可执行的Hello.jar。

## 编译JAR包到native程序

```
native-image -jar ./Hello.jar --no-fallback -H:Class=Hello -H:Name=hello -H:-CheckToolchain
```

这条命令的细节包括：

- `native-image` 创建native的工具
- `-jar ./Main.jar` 源文件为jar包
- `-H:Class=Hello` 入口Main方法所属的类
- `-H:Name=hello` 自定义结果可执行文件的名称
- `-H:-CheckToolchain` 不检查工具链（不带这个参数会报错无法识别C++编译器）

经过一段时间编译后，会生成可执行文件hello.exe：

![](_images/Pasted%20image%2020240101140313.png)

## spring graalvm native（失败）

尝试构建一个简单的spring graalvm native程序，结果构建过程出错，缺失具体的错误原因。

```
* What went wrong:
Execution failed for task ':nativeCompile'.
> Process 'command 'D:\AppsInDisk\graalvm-jdk-21.0.1+12.1\bin\native-image.cmd'' finished with non-zero exit value 1
```

## 总结

Java目前依然是企业级开发的TOP0选择，graalvm是一个充满商业前景的项目。

但目前来看，距离graalvm技术成熟还有较长一段时间。

## 参考资料

[v2ex: graalvm 拯救了 Java 的启动速度，但没法拯救 Java 的内存占用](https://www.v2ex.com/t/1005841)