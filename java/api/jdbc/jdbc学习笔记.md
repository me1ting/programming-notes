# JDBC学习笔记

JDBC是Java的通用关系型数据库访问API，由数据厂商提供底层驱动，从而实现对关系型数据库的访问。

虽然现代Java开发并不需要直接使用JDBC，但是当我们使用JPA,Mybatis等ORM框架，遇到问题时，解决问题除了需要数据库知识，还需要具备ORM框架到底层的JDBC的知识，从代码角度找寻解决问题的办法。

## JDBC的设计

简单来说，JDBC定义了一套面向数据库使用者的接口，数据库使用者基于Java API和SQL来实现对数据库的操作。

在底层，JDBC提供一套面向数据库开发商的接口，数据库开发商提供驱动满足这些接口，从而支持服务。

## JDBC配置

### 数据库URL

JDBC使用URL来描述数据源，具体的地址格式可以在数据库官方文档或搜索引擎找到。

```
jdbc:mysql://192.168.162.163:3306/learning
```

### 数据库驱动自动注册

JDBC使用Java SPI这套机制实现数据库驱动的自动注册。我们**只需要将数据库驱动放置在应用的CLASSPATH下**，就能自动使用它。

### Connection接口

[Connection](https://docs.oracle.com/javase/8/docs/api/java/sql/Connection.html)是JDBC对于数据库连接的抽象，其提供了数据库访问的所有功能，相关接口我们后续了解。

通过如下方式创建连接：

```java
public static Connection conn() throws Exception {
    var url = "jdbc:mysql://192.168.162.163:3306/learning";
    var user = "root";
    var passwd = "root123";

    return DriverManager.getConnection(url, user, passwd);
}
```

## 执行SQL

### Statement接口

`Statement`是JDBC对于SQL语句的抽象，通过Connection实例创建：

```java
public interface Connection{
	Statement createStatement() throws SQLException;
	Statement createStatement(int resultSetType, int resultSetConcurrency)
		throws SQLException;
	Statement createStatement(int resultSetType, int resultSetConcurrency,  
	                          int resultSetHoldability) throws SQLException;
	//...
}
```

使用Statement：

```java
var stat = conn.createStatement();
String command = "update ...";
stat.executeUpdate(command);//返回受影响的行数
```

`executeUpdate()`是一个通用的SQL更新方法，不仅是UPDATE，还能执行INSERT,DELETE等数据操纵语句，以及CREATE TABLE,DROP TABLE等数据库定义语句。

`executeQuery()`是查询方法，执行SELECT语句，其返回值类型为`ResultSet`，表示查询的结果集。

### closeable 连接、语句、结果集

在JDBC中，连接、语句、结果集都是可关闭的，使用完后需要关闭以释放资源。一个语句对应一个活跃的结果集，一些实现中（如MS SQL SERVER），一个连接对应一个活跃的语句。

### 异常处理

执行数据库操作时可能会抛出异常，应当捕获并关闭相关连接。当开启事务时，捕获到异常，应该根据业务需求执行提交或回滚。

## 查询的细节

### PreparedStatement

`预处理语句`是通过预编译来优化批量执行相似SQL语句的性能，而且可以防止SQL注入。

JDBC提供`PreparedStatement`接口来支持预编译语句。

使用预编译语句的示例：

```java
var queryUserByNameAndAge = "SELECT * FROM user WHERE name=? and id=?";
var stat = conn.preparedStatement(queryUserByNameAndAge);
stat.setString(1, "zhangsan");//根据索引设定参数
stat.setString(2, 20);
ResultSet rs = stat.executeQuery();
```

## 事务

在JDBC中，默认情况下是自动提交模式，需要手动开启事务。

```java
conn.setAutoCommit(false);
```

开启事务后，需要手动提交事务，或者手动回滚：

```java
conn.commit();
conn.rollback(); //撤销上次提交后的所有操作
```

### 事务保存点

`保存点`提供了一个更细粒度的事务控制，JDBC使用`SavePoint`接口抽象保存点。

```java
var stat = conn.createStatement();
stat.executeUpdate(command1);
SavePoint svpt = conn.setSavePoint();
stat.executeUpdate(command2);
if (...) conn.rollback(svpt);

//不需要时释放保存点
conn.releaseSavepoint(svpt);
```

## 批量更新

当批量调用同一个准备好的语句，大多数 JDBC 驱动程序都会提供改进的性能。JDBC对此提供了封装。

```java
var stat = conn.prepareStatement("insert into user(id, name, age) values(? ,?, ?)");
stat.setIndex(2, "zhangsan");
stat.setIndex(3, "1");
for (var i = 0; i < 10000; i++) {
    stat.setInt(1, i);
    stat.addBatch();
}
stat.executeBatch();
```

### 批量更新与预处理语句

从API来讲，JDBC提供的接口支持在批量更新里面使用任意更新语句，但是这样做和不使用批量接口没什么区别。

```java
```java
var stat = conn.prepareStatement("insert into user(id, name, age) values(? ,?, ?)");
//对比上面示例代码，多了这一行，但这条语句是单独执行的
stat.addBatch("delete from user where id >= 0");
stat.setIndex(2, "zhangsan");
stat.setIndex(3, "1");
for (var i = 0; i < 10000; i++) {
    stat.setInt(1, i);
    stat.addBatch();
}
stat.executeBatch();
```

**只有批量更新里面的预处理更新语句才能得到性能优化**。
### 批量更新与事务

批量更新并不是与事务绑定的，只有当业务逻辑需要事务时，才使用事务来执行批量更新。
### 数据库支持

并非所有的数据库都支持批量更新，可以通过以下方式测试：

```java
System.out.println(conn().getMetaData().supportsBatchUpdates());
```

特别的，MySQL需要添加 [rewriteBatchedStatements](https://dev.mysql.com/doc/connectors/en/connector-j-connp-props-performance-extensions.html) 连接参数。

```
jdbc:mysql://192.168.162.163:3306/learning?rewriteBatchedStatements=true
```

### 批量更新的原理

目前我只了解过MySQL的批量更新实现原理，尚未考察其它数据库的实现原理。

#### MySql的批量更新原理

根据[文档说明](https://dev.mysql.com/doc/connectors/en/connector-j-connp-props-performance-extensions.html)，MySQL的批量更新原理：

- 开启 multi-queries（TODO）
- 将多行预处理的更新语句重写为单行（带多个子语句的）批量更新语句

## 参考资料

《Java核心技术 卷2》v9 4. 数据库编程