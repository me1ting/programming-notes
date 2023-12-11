# lombok examples

lombok是Java的一个工具类型，负责编译时生成一些模板代码。lombok主要基于注解，需要lombok依赖库和IDE插件。

由于很多人都使用lombok，因此存在学习的必要。

## @Getter和@Setter

@Getter和@Setter生成getter和setter方法，默认访问权限为`public`，但可以指定访问权限。

```java
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

public class GetterSetterExample {
  @Getter @Setter private int age = 10;
  @Setter(AccessLevel.PROTECTED) private String name;
}
```
## @with

@with生成withFieldName()方法，当字段值相等时，with方法返回原对象，否则返回原对象的拷贝并设置新的字段值。

生成对象的拷贝是通过构造函数实现的，因此@with依赖一个全字段参数构造器，可以通过`AllArgsConstructor`实现。

```java
@Data
public class User {

    private final @With Long id;
    private Long credit;

    public User(Long credit) {

        this.id = null;
        this.credit = credit;
    }
}

void demo(){
	User user = new User(1000L);  
	var anotherUser = user.withId(1L);  
	var nextUser = anotherUser.withId(1L);  
	var nnUser = anotherUser.withId(2L);  
	  
	System.out.printf("anotherUser == user: %b\n",anotherUser == user);  //false
	System.out.printf("nextUser == anotherUser: %b\n",nextUser == anotherUser);  //true
	System.out.printf("nnUser == anotherUser: %b\n",nnUser == anotherUser);  //false
	System.out.println(nnUser.getCredit());//1000
}
```

## @NoArgsConstructor, @RequiredArgsConstructor and @AllArgsConstructor

这些注解用于自动生成构造器：

- `@AllArgsConstructor`，生成全字段参数的构造器

构造器同样可以使用`access`设置访问权限，并使用`onConstructor = @__(@PersistenceCreator)`设置生成的构造器的注解，这适用于某些框架需求，如Spring。

```java
@AllArgsConstructor(access = AccessLevel.PRIVATE, onConstructor = @__(@PersistenceCreator))
public class User{
// 省略
}
```

## @Data

`@Data`是一个聚合接口，默认为所有字段生成getter和setter，生成`hashCode()`,`equals()`,`toString()`。
## 参考资料

[doc: lombok features](https://projectlombok.org/features/)