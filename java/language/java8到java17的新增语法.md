# Java8到Java17的新增语法

为什么从Java8开始，因为我从Java8以后就没怎么使用Java了，而Java语言本身也从Java8以后变更了更新模式（刷版本号）。

## 接口中的私有函数(java9)

Java8增加了default语法从而允许对接口进行更新且不影响旧代码，接口中的`private`函数可以帮助拆分代码，也不会存在兼容性问题，合情合理。

```java
public interface Hello {
    String hello();
    default void sayHello(){
        if(isLegal()){
            System.out.println(hello());
        }
    }
	// 检查敏感词
    private boolean isLegal(){
        return !hello().contains("fuck");
    }
}
```

## try with resource加强(java9)

Java7增加了try with resource语法，但在面临多个资源时代码会让人困惑：

```java
try (BufferedReader br1 = new BufferedReader(...);
    BufferedReader br2 = new BufferedReader(...)) {
    System.out.println(br1.readLine() + br2.readLine());
}
```

Java9允许将资源的定义放在外面，代码结构上更加清晰。

```java
BufferedReader br1 = new BufferedReader(new FileReader("d:/1.txt"));
BufferedReader br2 = new BufferedReader(new FileReader("d:/2.txt"));
try (br1; br2) {
    System.out.println(br1.readLine() + br2.readLine());
}
```

当然，这样的设计也不是没有缺点：

```java
BufferedReader br = new BufferedReader(...);
try (br) {
    System.out.println(br.readLine());
}
br.readLine(); // Boom!
```

## 局部变量类型推断(java10)

局部变量可以省略类型说明（只要编译器可以推断）：

```java
var greetingMessage = "Hello!";
```

## 现代switch：switch表达式(java14)

Java传统的switch语法源自于C，相比于C仅支持数字，java支持更多的值类型。

而Java14引入了现代的switch语法，称为`switch表达式`：

```java
enum Day {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
}

public class Main {

    public static void main(String[] args) throws Exception {
        var day = Day.SUNDAY;
        int numLetters = switch (day) {
            case MONDAY, FRIDAY, SUNDAY -> 6;
            case TUESDAY -> 7;
            default -> {
                String s = day.toString();
                int result = s.length();
                yield result;
            }
        };
        System.out.println(numLetters);
    }
}
```

与传统switch相比，switch表达式的特点是：

- 不会`fall through`，为了避免重复，允许同时匹配多个值
- switch是`详尽`的，也就是必须列出所有情况

## 文本块(java15)

文本块就是多行字符串：

```java
        String html = """
          <html>
            <body>
              <p>Hello,\
 world</p>
            </body>
          </html>
          """;
        System.out.println(html);

//> Task :Main.main()
//          <html>
//            <body>
//              <p>Hello,world</p>
//            </body>
//          </html>
```

多行字符串的特点是：

- 多行
- 允许"（只要不连续超过3个）

相比于其它语言的多行字符串，Java版本增加了一些feature（了解）：

1) 可以使用`\`注释掉换行

2) 末尾`"""`可以用来控制缩进：

```java
String noIndentation = """
  First line
  Second line
  """;//无缩进

String indentedByToSpaces = """
  First line
  Second line
""";//缩进2空格

String noIndentation2 = """
  First line
  Second line
    """;//无缩进
```

3) 尾部空白被优化

```java
String noTrailingSpace = """
  First line
  Second line
  """;//尾部空白被优化

String withTrailingSpace = """
  First line
  Second line\n
  """;//增加尾部换行
```

### 换行符问题

Java的多行字符串的换行符没有采取与平台有关，而是使用`\n`。

//more

## 记录(java16)(TODO)

## 模式匹配(java16)

### instanceof 模式匹配

```java
//旧代码
if (obj instanceof String) {
    String s = (String) obj;
    // use s
}

//使用模式匹配的新代码
if (obj instanceof String s) {
    // use s
}
```

模式匹配等价于两个操作：

- 测试(test)
- 创建匹配值

## 密封(Sealed)类(TODO)


## 参考资料

[blog: Java8到Java21的新增语法](https://advancedweb.hu/new-language-features-since-java-8-to-21)