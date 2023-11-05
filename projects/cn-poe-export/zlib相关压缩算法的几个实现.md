# 前言

本项目分别在`lua`,`go`,`js`中使用到了zlib相关算法的库，因为对概念不够了解踩了坑，这里以作记录。
# deflate算法与zlib,gzip实现

`deflate`是一个压缩算法（结合了LZ77和Halfman的复合算法），在RFC 1951中标准化。

`zlib`,`gzip`是压缩格式实现，两者采用了`deflate`算法作为压缩算法，并封装了额外数据，比如头信息、校验和等。

# 踩坑细节
pob使用的库是lua-zlib，其实际使用的是`zlib`来压缩数据，但使用的函数名是`deflate`，导致我以为它使用的是原始的deflate算法。

go的compress库，是将`deflate`算法,`zlib`实现拆分为并列的包，因此我使用`deflate`包来处理POB的数据时，会出现错误。

js的pako/node.js实现，并没有提供独立的`defalte`算法实现，而是通过`zlib.deflateRaw`来提供的。