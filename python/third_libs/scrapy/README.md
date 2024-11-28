# 简介

[scrapy](https://scrapy.org/)是一款优秀的python平台下的爬虫框架，针对爬虫这一需求提供了**完整的框架服务**。

这里简单记录一下自己的步骤，以便以后使用时快速入门，而不需要重复阅读文档。

# 安装

[install](https://docs.scrapy.org/en/latest/intro/install.html)

推荐使用[虚拟环境](https://docs.python.org/zh-cn/3/library/venv.html)

```
python -m venv example-spider
```

在虚拟环境中使用pip安装（可以根据需要设置代理环境变量），注意scrapy对于python版本存在要求。

```
cd example-spider
# 启动虚拟环境（不同操作系统脚本所在文件夹不同）
source Scripts/activate
pip install scrapy
```

## tutorial

[tutorial](https://docs.scrapy.org/en/latest/intro/tutorial.html)

```
scrapy startproject tutorial
cd tutorial
scrapy genspider example example.com
```

会找到一个`example.py`文件，这就是一个爬虫脚本。

```py
import scrapy

# 一个爬虫
class QuotesSpider(scrapy.Spider):
    # 名称，应该保证项目唯一
    name = "quotes"

    # 请求入口，或者使用start_urls属性来说明
    def start_requests(self):
        urls = [
            'http://quotes.toscrape.com/page/1/',
            'http://quotes.toscrape.com/page/2/',
        ]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    # 每一个请求完成后的处理逻辑，比如存储
    def parse(self, response):
        page = response.url.split("/")[-2]
        filename = f'quotes-{page}.html'
        with open(filename, 'wb') as f:
            f.write(response.body)
        self.log(f'Saved file {filename}')
```

# 使用

## 选择器

[selector](https://docs.scrapy.org/en/latest/topics/selectors.html#using-selectors)

`parse`过程用于解析文档并提取有效信息。scrapy自带选择器，基于`lxml`，总体上功能比较羸弱。因此完全可以使用第三方工具，比如BeautifulSoup。

# FAQ

## 文件下载

[media-pipeline](https://docs.scrapy.org/en/latest/topics/media-pipeline.html)

图片下载依赖于项目[Pillow](https://pillow.readthedocs.io/en/latest/installation.html)

## 伪装

设置header，关闭`robots.txt`检测。

## 代理

## 数据库访问

[mongodb pipeline](https://docs.scrapy.org/en/latest/topics/item-pipeline.html#write-items-to-mongodb)

# 问题

## 压缩问题

通过header头请求服务器对返回的响应压缩，这是chrome的默认情况：

```
'Accept-Encoding': 'gzip, deflate, br'
```

但是目前除了gzip，没有合理的方法解决后两种压缩解决方案。
