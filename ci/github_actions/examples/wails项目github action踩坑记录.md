# wails项目github action踩坑记录

## 目录结构

最开始我的wails项目是放在仓库的`desktop`目录下的，大多数github action的插件都是以仓库的`./`作为默认路径，因此使用monorepo时，编写CI脚本很麻烦。

我最终选择将wails项目的所有文件迁出到`./`目录下。

## go version

一开始我看[setup-go](https://github.com/actions/setup-go)支持[go-version-file](https://github.com/actions/setup-go?tab=readme-ov-file#getting-go-version-from-the-gomod-file)选项，而wails当前的go.mod中的版本是`1.18`，但在安装wails工具链时会报错：

```
note: module requires Go 1.19
Error: Process completed with exit code 1.
```

wails工具链需要至少 1.19以上版本，修改安装版本为`^1.20.0`解决了该问题。

## pnpm&npm

由于前端文件内容是单独存放在`frontend`中的，需要额外的配置选项进行说明：

```yaml
      # pnpm
      - name: Setup pnpm
        uses: pnpm/action-setup@v2.4.0
        with:
          version: 8
          package_json_file: frontend/package.json
      # npm
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'pnpm'
          cache-dependency-path: frontend/pnpm-lock.yaml
```

### 在编译前构建前端内容

在本机上测试时，clone下来的项目可直接`wails build`进行构建，但是actions中，会报如下的错误：

```
main.go:13: pattern all:frontend/dist: no matching files found
```

解决办法是在`wails build`前先把前端内容构建好：

```yaml
      # build frontend
      - name: build frontend
        working-directory: frontend
        run: |
          pnpm install
          pnpm build
      # wails build
      # ...
```
