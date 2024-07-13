# 状态栏

[一个不错的handbook](https://wpf-tutorial.com/common-interface-controls/statusbar-control/)<br/>
[官方文档](https://docs.microsoft.com/en-us/dotnet/api/system.windows.controls.primitives.statusbar?view=windowsdesktop-6.0)<br/>

使用经验：

- 使用`DockPanel`来快速布局`statusbar`到面板底部
- 使用`StatusBar.ItemsPanel`来实现statusbar的切分需求
- 使用`Separator`来表示分隔符
- 使用`StatusBarItem`来包裹状态栏元素，注意的是其只能包裹一个元素；如果存在多个元素，需要使用容器来进一步包裹为一个元素
