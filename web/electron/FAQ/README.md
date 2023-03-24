# 功能
## 如何使用浏览器打开链接？
参考该stackoverflow[问题](https://stackoverflow.com/questions/32402327/how-can-i-force-external-links-from-browser-window-to-open-in-a-default-browser)，需要进行两个设定：

- [阻止默认的的打开方式](https://stackoverflow.com/a/67409223)
- 在`<a>`上设置`target="_blank"`

## 如何使用使用资源管理器打开文件夹？
参考[该网站](https://ourcodeworld.com/articles/read/208/how-to-show-and-focus-a-file-or-folder-in-the-file-explorer-of-the-os-with-electron-framework)，但是只能显示文件夹，不能打开文件夹。

# 构建
## 自定义icon
icon的设置属于构建过程，参考你所使用的electron构建工具。

### Electron Forge
参考[文档](https://www.electronforge.io/guides/create-and-add-icons)说明。

如果使用了`WiX MSI`，需要进行额外配置，在其配置中进行设置：
```json
  makers: [
    new MakerZIP({}, ["win32"]),
    {
      name: "@electron-forge/maker-wix",
      config: {
        language: 1033,
        manufacturer: "me1ting",
        icon: "icons/icon.ico",
      },
    },
  ]
```