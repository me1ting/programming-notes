# InnoDB的锁与事务模型

## 锁

### 共享锁和独占锁（抽象概念？）

InnoDB实现了标准的行锁，类似并发领域的读写锁：

- 共享锁(shared lock，本文使用缩写S表示)，允许持有该锁的事务读取行
- 排他锁(exclusive lock，本文使用缩写X表示)，允许持有该锁的事务更新或删除行

共享锁和排他锁是互斥的，共享锁允许多个事务同时持有，而排他锁同时只能有一个事务持有。

### 意向锁

[意向锁](https://dev.mysql.com/doc/refman/8.0/en/glossary.html#glos_intention_lock)是表级别的锁，其中：

- 意向共享锁(IS) 表示事务将在表的所有行上使用共享锁，第一个获取IS锁的事务阻止其它事务获取X锁
- 意向排他锁(IX)指在表的所有行上使用排斥锁，第一个获取IX锁的事务阻止其它事务获取S,X锁

使用如下SQL语句获取意向锁：

```sql
 SELECT id FROM user FOR SHARE // 意向共享锁
 SELECT id FROM FOR UPDATE // 意向排斥锁
```

### 记录锁

记录锁是索引记录上的锁，我们可以从示例上理解：

```sql
SELECT c1 FROM t WHERE c1 = 10 FOR UPDATE
```

这个查询语句阻止其它事务增删改`c1 = 10`的行。

记录锁阻止其它事务插入、修改、删除`WHERE子句`匹配的行。记录锁是独占的，但是不阻止其它事务读取索引记录。

> “记录锁始终锁定索引记录，即使表定义为没有索引。对于这种情况， `InnoDB`创建一个隐藏的聚集索引并使用该索引进行记录锁定。请参见 [第 15.6.2.1 节“聚集索引和二级索引”](https://dev.mysql.com/doc/refman/8.0/en/innodb-index-types.html "15.6.2.1 聚集索引和二级索引")。”
>
> 索引记录(lock record)并不直接等同于行，它是索引所关联的行

### 间隙锁

间隙锁是对索引记录之间间隙的锁定，同样需要示例来理解：

```sql
SELECT c1 FROM t WHERE c1 BETWEEN 10 and 20 FOR UPDATE
```

这个查询语句阻止其它事务插入`10<=c1<=20`的行。

上述示例还阻止其它事务对已存在索引记录的删改，也就是存在记录锁。我们将在next-key锁中解释这种情况。

### Next-Key 锁

Next-Key锁指索引记录的记录锁与其之前间隙的间隙锁的组合。

## 事务模型

### 一致性非锁定读取

`一致性读取`指InnoDB使用多版本的快照机制，来实现事务的隔离性需求，是事务中`SELECT`（不包括`FOR UPDATE`,`FOR SHARE`子句）语句的执行模型。

当事务隔离级别为已提交读(RC)时，在每次一致性读取都建立自己的快照。

当事务隔离级别为可重复读(RR)时，在第一次读取时返回建立快照，后续一致性读取返回相同的结果。

### 锁定读

事务使用的常见模式：先查询数据，再增删改数据。

默认情况下，这种模式无法保证并发安全。需要提供额外的语法，也就是`FOR SHARE`,`FOR UPDATE`。

### READ COMMITTED

对于非锁定读，参考一致性读章节。

对于锁定读取只锁定索引记录，而无法锁定间隙。

### REPEATABLE READ

`REPEATABLE READ`是InnoDB的**默认隔离级别**。

对于非锁定读，参考一致性读章节。

对于锁定读取（SELECT FOR UPDATE,SELECT FOR SHARE,UDATE,DELETE）会进行锁定：

- 如果搜索条件是对unique index的a unique search condition，那么只锁定找到的行
- 否则，使用间隙锁或者next-key锁对范围进行锁定

> 第一种情况简单来说就是形如`SELECT id from tablename WHERE id=1 for UPDATE`的语句

## 参考资料

[doc: InnoDB 锁和事务模型](https://dev.mysql.com/doc/refman/8.0/en/innodb-locking-transaction-model.html)
