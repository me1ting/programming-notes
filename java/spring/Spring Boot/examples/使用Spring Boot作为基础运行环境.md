# 使用Spring Boot作为基础运行环境

有时，我们只想使用Spring Boot作为应用的基础运行环境，来编写或测试一些代码。

可以使用`CommandLineRunner`或者`ApplicationRunner`接口。

```java
@Component
public class Runner implements CommandLineRunner {
    @Override
    public void run(String... args) throws Exception {
        // 你想执行的代码
        System.exit(0);//如果不能自动退出，使用强制退出
    }
}
```
