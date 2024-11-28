# java中的抽象数据类型

## 列表

使用`List`接口，主要有两个实现类：

- `ArrayList` 基于数组的列表
- `LinkedList` 链表

## 栈

使用`Deque`接口，表示双端队列，可以用作栈。主要有两个实现类：

- `ArrayDeque`
- `LinkedList`

## 队列

使用`Queue`接口，Queue没有直接的实现类，`Deque`是`Queue`的子接口。

## 查找表

### 二叉查找树

`TreeSet`和`TreeMap`是基于红黑树实现的查找集合。

## 哈希表

`HashSet`和`HashMap`是基于哈希表的查找集合。

## 优先队列

`PriorityQueue`是基于堆的优先队列实现。

## 参考资料

《Java核心技术 卷1》v10 9. 集合
