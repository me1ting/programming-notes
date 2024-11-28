# 从Java9到Java17

从Java9开始，Java采用固定时间间隔的火车发布模式(release train)，每6个月发布一个主要版本，且只提供6个月的支持，每隔几个主要版本，确定一个长期版本，提供3~8年的支持（取决于具体的JDK厂商）。

从Java8起，后续的LTS版本包括Java11,Java17,Java21。

## Java9~Java11

### 官方的模块实现（jigsaw）

包是对源文件的组织方式的抽象。[模块](https://en.wikipedia.org/wiki/Modular_programming)是一种程序设计方法，强调功能的独立性、可替代性。

在 Java9 之前，Java 语言只有包的概念，并没有模块的概念（Go语言早期也是这样）。存在社区的模块实现（如 Maven ），但由于缺乏官方的支持，第三方的模块只能提供模块的部分功能，如版本化，一些核心功能缺失，如封装性。

Java9 的模块实现，提供了封装性，模块必须声明它所公开的内容，它所引用的外部内容。

jigsaw 使用模块顶层目录下的`module-info.class`声明其导出内容和引用内容，使用细节见[官方文档](https://openjdk.org/projects/jigsaw/quick-start)。

但是 jigsaw 的普及还存在漫长的道路，目前大多数项目都还没有采用。

>对比Go，Java的模块功能由于出现时间较晚，且其提供的功能对开发者而言不是很急迫，因此其普及速度很慢。而Go的模块提供了版本化这个必不可少的功能，因此迅速普及。

### 接口中的私有函数

Java8 增加了 default 语法从而允许对接口进行更新且不影响旧代码，新增的接口中的 `private` 函数可以帮助拆分代码，也不会存在兼容性问题。

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

### try with resource加强

Java7 增加了 try with resource 语法，但在面临多个资源时代码会让人困惑：

```java
try (BufferedReader br1 = new BufferedReader(...);
    BufferedReader br2 = new BufferedReader(...)) {
    System.out.println(br1.readLine() + br2.readLine());
}
```

Java9 允许将资源的定义放在外面，代码结构上更加清晰。

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
br.readLine(); // 资源已经被关闭，这里会抛出错误
```

### 局部变量类型推导

局部变量可以省略类型说明（只要编译器可以推断）：

```java
var greetingMessage = "Hello!";
```

### 垃圾回收器改进

从 Java9 开始，G1 成为默认的垃圾回收器。Java11 引入 ZGC ，这是一款低延时垃圾收集器。

## Java12~Java17

### 现代switch：switch表达式

Java 传统的 switch 语法源自于 C ，相比于 C 仅支持数字，java支持更多的值类型。

Java14 引入了现代的switch语法，称为`switch表达式`：

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
- switch 是`详尽`的，也就是必须列出所有情况

### 文本块

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

//> 输出内容：
//<html>
//  <body>
//    <p>Hello,world</p>
//  </body>
//</html>
```

多行字符串的特点是：

- 多行
- 允许内容包括`"`而不需要转义（只要不连续超过3个）

相比于其它语言的多行字符串，Java 版本增加了一些 feature （了解）：

1) 可以使用 `\` 注释掉换行，内容将不包括换行符

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

Java的多行字符串的换行符使用与平台无关的`\n`。

### 模式匹配

### instanceof 模式匹配

这可以减少样板代码。

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

- 测试
- 创建匹配值

### 记录类

引入记录(Record)是为了减少 POJO 的样板代码。**记录是不可变的数据类，只需要字段的类型和名称**，编译器会自动生成 constructor, equals, hashCode, toString方法。

```java
public record Person (String name, String address) {}
```

从形式上来讲，这类似一个函数，但其实这是定义一个类型。
### 密封类

密封类(Sealed Classes)对于类型的继承提供更精细化的控制。

密封类限定了可以扩展父类型的子类型：

```java
public abstract sealed class Person
    permits Employee, Manager {
 
    //...
}
```

子类型必须是`final`（无法被扩展）,`non-sealed`（非密封类）,`sealed`（密封类）修饰。

```java
public final class Employee extends Person {
}

public non-sealed class Manager extends Person {
}
```

密封类目前已知的唯一使用场景是安全的 `详尽` 所有子类型：

```java
if (person instanceof Employee) {
    return ((Employee) person).getEmployeeId();
} else if (person instanceof Manager) {
    return ((Manager) person).getSupervisorId();
}//如果是密封类，而且没有指出所有子类型，编译器会发出警告
```

## 参考资料

[了解 Java 平台模块系统](https://www.alibabacloud.com/blog/understanding-the-java-platform-module-system-project-jigsaw_601621)对Java模块系统更细致的了解（八股、套话） <br/>
[baeldung: Java9 的新增内容](https://www.baeldung.com/new-java-9)目录还包括Java9~Java21的新增内容，这里并未全部列出 <br/>
[baeldung: Record 的细节](https://www.baeldung.com/java-record-keyword)<br/>
[blog: Java8到Java21的新增语法](https://advancedweb.hu/new-language-features-since-java-8-to-21)<br/>