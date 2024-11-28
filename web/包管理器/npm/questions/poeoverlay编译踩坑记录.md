# poeoverlay编译踩坑记录

`poeoverlay`是一个electron应用，使用了`node-gyp`来编译非js或ts的包，这是导致它编译麻烦的主要原因。

[开发者文档](https://github.com/PoE-Overlay-Community/PoE-Overlay-Community-Fork/blob/master/DEVELOPERS.md)

一开始，我直接用本机环境，已安装node@16.x.x LTS和msvc2019，执行`npm install`，结果遇到各种问题。

这里记录一下遇到的问题，及解决思路。

## 使用文档指定的node版本

文档指定的node版本为`12.18.0`，和当前的LTS版本跨度太大，应当使用文档指定的node版本（尝试使用node@1.6.x.x执行后续步骤，确实存在很大的兼容性问题）。

## npm install

### robotjs安装失败问题

```
npm ERR! > robotjs@0.6.0 install
npm ERR! > prebuild-install || node-gyp rebuild
...//省略了中间的日志
npm ERR! gyp info using node-gyp@3.8.0
npm ERR! gyp info using node@16.17.1 | win32 | x64
npm ERR! gyp ERR! configure error
npm ERR! gyp ERR! stack Error: Command failed: C:\Users\me\AppData\Local\Programs\Python\Python310\python.EXE -c import
sys; print "%s.%s.%s" % sys.version_info[:3];
npm ERR! gyp ERR! stack   File "<string>", line 1
npm ERR! gyp ERR! stack     import sys; print "%s.%s.%s" % sys.version_info[:3];
```

安装robotjs@0.6.0版本失败，使用的是node-gyp@3.8.0版本，错误原因是编译代码使用Python2编写，而本机安装的是Python3。

这里有几个解决思路：

- 卸载Python3，安装Python2
- 安装Python2但不卸载Python3，通过配置环境变量或配置文件的方式，使用Python2
- 使用新的node.gpy版本

#### 思路2：指定python版本

在Python官网上找到Python2的安装文件，直接安装，默认不添加`path`。
在MSVC官网上找到 MSVC2017的安装文件，安装桌面VC++开发依赖。

找到`node-gyp@3.8.0`的github主页，根据[安装说明](https://github.com/nodejs/node-gyp/tree/v3.8.0#option-2)，设置使用Python2：

```
npm config set python "C:\Python27\python"
```

#### openssl_fips问题

```
npm ERR! gyp: name 'openssl_fips' is not defined while evaluating condition 'openssl_fips != ""' in binding.gyp while trying to load binding.gyp
```

Google得到解决办法：

```
npm install --openssl_fips=''
```

#### 思路3：更新node-gyp版本

**1) 避免使用node自带的node-gyp**

nodejs自带`node-gyp`，如果你使用`npm install`安装一个本地或全局的`node-gyp`，`在npm install`项目时，默认使用的是自带的`node-gyp`。

需要使用[特别的方法](https://github.com/nodejs/node-gyp/issues/2272)来覆盖掉node自带的`node-gyp`。

这种方法在node16已经失效，需要使用环境变量实现：

```powershell
npm prefix -g | % {$Env:npm_config_node_gyp = "$_\node_modules\node-gyp\bin\node-gyp.js"}
```

**2) 选择一个合适的node-gyp版本**

`node-gyp`包依赖`python,msvc,nodejs`，不同的`node-gyp`版本所支持的`python`,`msvc`,`nodejs`版本不同，所支持的配置选项也不同。

由于开发者文档并没有说明，最开始我尝试使用`node.gyp`最新版本，安装时会警告与`node.js`版本不兼容，然后我选择降级到`8.4.1`版本。

在`node-gyp`的较老版本中，没法指定`python`,`msvc`的版本，也就是说，如果你电脑上安装了`python3`,`msvc2019`，你需要卸载掉它们并安装`python2`和`msvc2017`，这是我选择较新版本的`node-gyp`的原因，最终`8.4.1`版本在整个编译过程中工作正常。

找到`8.4.1`版本所对应的[项目主页](https://github.com/nodejs/node-gyp/tree/v8.4.1)，要求`python3`的特定版本（实际测试电脑上已有的更新本也能用，但是如果后续出现编译问题，那么需要尝试降级python3），以及要求`msvc2017`。

## `npm run electron:windows`

### heap out of memory问题

使用更大的堆：

```powershell
$env:NODE_OPTIONS="--max-old-space-size=8192"
```

## 总结

由于poeoverlay依赖旧版`robotjs`，编译该依赖用到了旧版的`node-gyp`，导致整个项目依赖于`node.js 14`,`python2`,`msvc 2017`，给编译带来了很多麻烦。
