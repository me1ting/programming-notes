# heap
[container/heap](https://golang.org/pkg/container/heap/)标准库提供对`heap`这一数据结构的支持。

# 使用方式
`heap`的使用方式类似`sort`包，`heap`定义了一个堆的抽象接口：
```go
type Interface interface {
    sort.Interface
    //这两个方法不等价于后面的两个函数，只是简单的队尾插入数据，队头弹出数据
    //使用者应当调用库函数而非这两个方法
    Push(x interface{}) // add x as element Len()
    Pop() interface{}   // remove and return element Len() - 1.
}
```

然后定义了一些操作堆的函数：
```go
func Fix(h Interface, i int)//修复堆中的特定位置。
func Init(h Interface)//初始化构建堆序。
func Pop(h Interface) interface{}
func Push(h Interface, x interface{})
func Remove(h Interface, i int) interface{}
```

**目标类型需要实现该接口，并使用heap提供的函数来操作堆**：
```go
h := &IntHeap{2, 1, 5}//创建堆
heap.Init(h)//初始化有初始化元素的堆
heap.Push(h, 3)//使用堆
```

根据堆的定义，这是一个`小堆`。