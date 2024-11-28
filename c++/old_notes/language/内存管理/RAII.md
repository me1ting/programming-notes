# RAII

RAII（Resource Acquisition Is Initialization）即**资源获取即初始化**，指在C++这样**手动管理资源**的编程语言中，使用局部对象（即栈上分配）来管理资源。局部对象的类应当在构造器中初始化资源，在析构函数中释放资源，因为是局部对象，函数退出即自动调用析构函数释放对象。

简单来说，RAII就是一种编程经验，如何简单有效的使用资源，其核心有两点：

- 使用栈对象封装资源
- 栈对象的类在构造器中申请资源，在析构函数中释放资源

# reference

[对象生存期和资源管理 (RAII)](https://docs.microsoft.com/zh-cn/cpp/cpp/object-lifetime-and-resource-management-modern-cpp?view=msvc-160)
