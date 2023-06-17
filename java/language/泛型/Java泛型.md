# Java 泛型

## 了解泛型

泛型（generics）是现代编程语言的基本feature，中文意“泛化的类型”，主要用于容器类的代码重用，典型如集合类。

当没有泛型时，集合类要想具备可重用性，需要面向`Object`编程，用户使用时需要强制类型转换，缺乏错误类型检查。

```java
public class ArrayList {
	private Object[] elementData;
	public Object get(int i){...}
	public void add(Object o){...}
}
```

而使用泛型时，编译器能够检查类型不匹配的错误，保证了代码可读性和安全性。

```java
files.add(new File("..."));// error, can only add String objects to an ArrayList<String>
```

## 泛型语法

### 类型变量和类型参数

**(1). 简单泛型类**

简单泛型类引入了`类型变量`，而在其内部可以将该类型变量作为类型而使用（存在限制，后续详解）。

```java
public class Pair<T>{//类型变量
	private T first;
	private T second;

	public Pair(){first = null; second = null;}
	public Pair(T first,T second){//类型参数
		this.first = first;
		this.second = second;
	}
}
```

一般使用E(表示集合元素),K,V(表示键值对),T,U,S表示任意类型。

**(3). 泛型方法**

泛型方法同样引入了类型变量和类型参数（与泛型类中的方法区分）。

```java
public static <T> T getMiddle(T... a){
	return a[a.length/2];
}
```

### 限定类型变量

有时我们引入的类型变量并不面向所有类型，如希望其是可比较的，可以限制其必须实现Comparable接口：

```java
public static <T extends Comparable> T min(T[] a){...}
```

编译器会对这种限定进行检查，避免不符合条件的使用。

可以使用多个类型来限定，由于Java的单继承，这些限定类型中只允许有一个类（第一次看到该语法，以前很少注意）。

```java
public static <T extends Comparable & Serializable> T min(T[] a){...}
```

## 泛型的底层实现

为了兼容性Java5及其之前的版本，Java在实现泛型时采取两个策略：

- 使用类型参数擦除，替换为限定类型（默认Object） 
- 必要时插入强制类型转换

泛型的引入，与多态特性产生冲突，Java避免了这种冲突。但就实际使用而言，并没有对代码的逻辑产生任何不利影响。其基于：

- JVM中通过方法签名和返回参数来确定一个方法，允许方法签名相同。而Java语法是不允许多个相同方法签名（但返回参数不同）的方法。  

可以使用注解来表明不需要使用类型参数检查，这在于遗留代码交互时很有用。

```java
@SuppressWarnings("unchecked")
```

  

## 泛型的缺陷

因为Java泛型采取擦除机制，导致泛型存在以下局限性：

- 不能使用基本类型实例化类型参数。原因在于类型擦除建立在Object继承体系上，不支持基本类型。
- 运行时类型查询只适用于原始类型，即类型检查、强制转换、getClass得到的是泛型类原始类型，不包含泛型参数。
- 不能创建包含参数化类型的泛型类的数组，可以使用ArrayList替代。原因是数组存储检查只会检查原始类型，导致存在数组检查允许但实际执行出现类型错误的情况。 
- 不能实例化类型变量
- 泛型类的类型参数是运行时的属性，不能在静态代码中使用。
- ...

以上缺陷不需要强行记忆，需要的是当IDE/编译器提示时，能够知道为什么发生了错误：因为Java的擦除机制，Java语法对泛型存在许多限制。

## 泛型与继承

类型参数虽然可以看作是类型的组成部分，但在Java中，类型参数只能算额外信息，并不能影响类型的本质，比如运行时类型检查，以及后述的继承体系。

泛型不参与继承体系，不影响多态。

![](Pasted%20image%2020230618002648.png)

## 通配符类型

用于编写针对泛型类的代码，但保留了灵活性，对目标泛型类的类型变量部分进行限定（需要与前面的类型变量的限定进行区分，一个是定义类型变量，一个是针对泛型类）。

```java
public static void printBuddies(Pair<? extends Employee> p)
```

通配符类型引入一种特殊的继承体系(注意`Pair<Manager>`与`Pair<Employee>`是sibling关系)：

![](Pasted%20image%2020230618002811.png)

这种继承体系支持多态。

### 子类型限定与超类型限定

**(1). 子类型限定**

上述语法称为`子类型限定`，子类型限定的泛型类型适合获取元素，如：

```java
Employee first = p.getFirst();
```

但不能用于设置元素，因为其只限定了元素的父类，并不能确定其允许接收的具体类型。

**(2). 超类型限定**

超类型限定如下：

```java
pubic static void minmaxBonus(Manager[] a,Pair<? super Manager> result)
```

其引入的特殊继承体系：

![](Pasted%20image%2020230618003057.png)

超类型限定的泛型类型类型适合设置元素：

```java
result.setFirst(a[0]);
```

因为多态允许父类变量引用子类实例，但不允许获取元素，因为其只限定了元素的子类型，并不能确定元素的具体/父类型。

总结就是带有超类型限定的通配符可以向泛型对象写入，带有子类型限定的通配符可以从泛型对象中读取。

超类型限定的通配符有如下的经典使用模板：

```java
public static <T extends Comparable<? super T>> T min(T[] a)...
```

### 无限定通配符

使用无限定通配符的方法，等价于使用类型变量的泛型方法：

```java
public static boolean hasNulls(Pair<?> p)...

public static <T> boolean hasNulls(Pair<?> p)...
```

## 反射与泛型

主要是两点：

1. 反射API中的Class类等是泛型的，如`String.class`是`Class<String>`类的唯一对象。
2. 反射API支持获取泛型类的泛型信息，但需要与对象的泛型信息区别（对象的泛型信息已被抹去，无法获取）。

## 参考资料

<<Java核心技术 卷1>>v9 第12章 泛型程序设计