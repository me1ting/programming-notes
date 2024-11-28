# 一门糟糕的编程语言

目前，我只接触过两个伴生语言：Groovy,TypeScript。如果说TypeScript是大师操刀，直击JavaScript的痛点，恰到好处的弥补了JavaScript的不足，而又不让使用者混淆两者的语法。那么Groovy就是毫无编程语言设计经验的人，设计出来让人没法用的编程语言。

简单举例，Groovy中有3种字符串：

```groovy
'a single-quoted string'
'''a triple-single-quoted string'''
"a double-quoted string"
```

发明这么多字符串语法给谁用呢？

又比如说，Groovy有自己独特的切片理解：

```groovy
def letters = ['a', 'b', 'c', 'd']      
assert letters[2..4] == ['C', 'd', 'e']  
```

切片语法包含`end`元素，嗯，真是天才的设想。

## 我&Groovy

个人的职业生涯是从Java开始的，由于反感Java的啰嗦，个人一时因为轻信了知乎上的正面评价，而对Groovy产生了兴趣，有过一段时间的尝试。

JVM作为一个平台，可以作为其它语言运行时环境，这给在Java语言上存在大量资产的实体带来了看似的无限可能，但这些语言都只是Java的伴生语言，仅在某领域使用，而**无法成为一门通用的编程语言**。

事实上JVM上的非Java语言都只是在占据Java原本的市场份额，由于JVM的限制并没有开拓新的市场份额，大致可以分为：其它JVM语言、Groovy、Scala、Kotlin，越左越小众越伴生，越右越大众越独立，但即使是其中的佼佼者Kotlin，目前也仅仅用于Android的开发，大致类比Swift之于IOS与MacOS。
