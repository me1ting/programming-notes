# 如何将不可比较类型作为map的key

map只允许将可比较类型（基本数据类型,`function`,`slice`,`map`）作为key，那么当我们确实需要将不可比较类型作为key时，比如[这道leetcode题](https://leetcode.cn/problems/equal-row-and-column-pairs/submissions/)，应该怎么做？

## 将其转换为可比较类型

我们可以将不可比较类型转换为可比较类型：整数或者字符串，比如[官方题解](https://leetcode.cn/problems/equal-row-and-column-pairs/solution/xiang-deng-xing-lie-dui-by-leetcode-solu-gvcg/)就是使用`fmt.Sprint()`将`slice`转换为`string`。

但是这种转换方式很难同时做到两点：

- 必须保证一一对应
- 良好的性能

以`[]int`为例，如果转换为`int`，可以使用[Horner](https://en.wikipedia.org/wiki/Horner%27s_method)方法，但是无法保证一一对应。保证一一对应的一种简单想法是记录`hashCode`与`[]int`之间的映射，如果产生碰撞，hashCode+1，这本质是**线性探测法**。

如果转换为string，字符串的拼接明显会导致性能问题。

## 使用“半”自定义hashmap实现

这是我在解决这个leetcode问题时采用的，但是在整理笔记时发现问题很大，仅作探讨使用。

所谓“半”自定义，是指将`map`作为我们自定义hashmap的一部分，采用如下方法：

- 为每个key计算hashCode
- 使用`map`存储`hashCode`到`container`的映射，container可以是数组/链表，或者查找树
- 查找操作：key-->hashCode-->map-->container-->entry-->val
- 插入操作：key-->hashCode-->map-->container-->entry

我们只需要实现`hashCode`,`equals`,`container`，因此很简单。

这个办法可以用来答题，但是存在一个严重的问题：map的resize是基于container的个数，而非基于元素的个数，这导致这个hashmap实际上“超载了”，导致性能下降。

## 自定义hashmap实现

根据上述可以得知，目前无法复用Go提供的map来满足我们的需求，我们只能自定义实现一个通用的hashmap来满足相关需求。
