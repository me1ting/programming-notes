# 饱受争议的Gradle

`Gradle`是JVM上的构建系统，现已成为Android,Kotlin的默认构建系统。

但是Gradle一直饱受争议，一方面是它确实存在一些设计缺陷，但主要是因为它为满足复杂构建任务所设计，但是很多用户根本不存在复杂的构建任务。

## 关于构建

`构建`是指将源代码转换成产出的过程，产出可能是可执行文件、库等。

构建这个概念可简单，也可复杂，它可以是本地电脑上的`go build`，也可能是用大规模集群进行的分布式的构建。

简单的构建只需要编码人员就能完成，复杂的构建需要专职的人员或团队完成，甚至需要购买商业服务（比如Gradle Enterprise）或者定制构建系统（比如Google Bazel）。

## 现有的一些构建系统

### Make

[Make](https://en.wikipedia.org/wiki/Make_(software))是Unix时代就出现的构建系统，主要用于Unix Like环境下 以C/C++为主的原生项目的构建。

### Ant,Maven,Gradle

[Ant](https://en.wikipedia.org/wiki/Apache_Ant)是 Java社区模仿Make的一款用于Java项目的构建系统，其默认配置文件为`build.xml`。

[Maven](https://en.wikipedia.org/wiki/Apache_Maven)是Ant的继承者，相比Ant其Make风格少了许多，而且提供了仓库、外部依赖等高级概念。

Ant和Maven诞生的年代是”XML泡沫“的时代，这两个工具都选择了XML作为配置文档，这也是它们今天最令人诟病的点之一。

Gradle是Maven之后诞生的构建系统，致力于在Ant和Maven之间寻找平衡。Gradle使用Groovy DSL，后续又支持Kotlin DSL。

### go,cargo,rollup

这类构建工具的特点是用于中小型单语言项目，上手简单、使用容易。

## Gradle的设计缺陷

### 版本变更频繁，不同版本不兼容

Gradle的版本号变更很快（1~2年更新一个主要版本），高版本不兼容低版本，当项目使用的版本不存在于当前电脑上时，需要下载100M多对应版本的Gradle，这一点对于局域网用户来说很麻烦。

不兼容性还体现在配置文件上，如果你更新项目的Gradle的大版本，同时需要升级配置文件。

## Gradle的复杂点

### 基于编程语言的DSL

使用编程语言作为DSL的优点是能满足更多的功能需求。

但是缺点也很明显，如果用户不学习目标编程语言，那么用户很难有信心使用Gradle，使用起来充满挫败感。太过灵活性也不利于多人开发和维护。

## 总结

Gradle受困于JVM，使得它只能在Java这片领域发展，难以成为一个通用的构建工具。

因为Gradle的设计缺陷和复杂度，使得大多数初学者对其望而却步，很难有兴趣深入使用。

Java领域似乎还缺少一个足够现代、简单的、面向Java/JVM的依赖管理和构建工具。
