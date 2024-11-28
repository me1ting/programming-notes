# 布局与导航栏

我们可以使用vuetify[预定义的组件](https://vuetifyjs.com/en/features/application-layout/)来帮我们布局，但并不强制：

- `v-app`表示应用容器
- `v-navigation-drawer`表示导航栏
- ...

以一个左导航右内容的页面为例，其架构如下：

```html
<v-app>
  <v-navigation-drawer permanent disable-resize-watcher floating width="120">
    <!--导航栏内容-->
  </v-navigation-drawer>
  <v-main style="">
    <!--页面主要内容-->
  </v-main>
</v-app>
```

## 导航栏

vuetify真实的还原了`material design`默认导航难用的特点（如果你使用过flutter就会明白），比如标题无法居中。

幸运的是vuetify的自由度比较高，我们完全可以无视掉`v-navigation-drawer`组件预留给我们的UI接口，而是自定义导航元素，如：

```html
<v-navigation-drawer permanent disable-resize-watcher floating width="120">
  <v-list density="compact" color="primary" nav>
    <v-list-item
      v-for="item in navigationList"
      :active="currentPath === item.href"
      :value="item.href"
      :href="item.href"
      :key="item.href"
      ><!--这是一个导航-->
      <p
        class="text-center"
        :class="{ 'text-text-secondary': currentPath !== item.href }"
      >
        {{ t(item.title) }}<!--自定义导航内容，而非使用预留接口-->
      </p> </v-list-item
    ><!--甚至这个v-list都不需要，如果你想自定义一个List实现的话-->
  </v-list>
</v-navigation-drawer>
```

# input

Vuetify提供的输入控件最大的特点是：

- 渲染采取 `单向绑定`
- 修改采取 `回调函数`

```html
<v-select
  :items="languages"
  :model-value="lang"
  @update:model-value="updateLanguage"
></v-select>
```
