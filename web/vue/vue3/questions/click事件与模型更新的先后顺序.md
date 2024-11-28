# click事件与模型更新的先后顺序

## 背景

在实现一个应用功能时，数据从storage加载，并且要求在数据更新时写入storage。

```vue
<script>
const data1 = ref(false)

onMounted(async () => {
	data1.value = localStorage.getItem("data1");
})
</script>
<template>
	<input v-model="data1" type="checkbox"/>
</template>
```

## 尝试使用侦听器（出错）

查阅Vue的文档，发现[侦听器](https://cn.vuejs.org/guide/essentials/watchers.html)应该可以用来完成任务。

```vue
<script>
const data1 = ref(false)

watch(data1, async (newValue) => {
  localStorage.setItem("data1", newValue)
})

onMounted(async () => {
  data1.value = localStorage.getItem("data1");
})
</script>
<template>
	<input v-model="data1" type="checkbox"/>
</template>
```

实际使用后发现，侦听器的问题是`onMounted`时对data1的赋值也会触发。虽然从结果上来讲没什么问题，但是额外的一次写入不够优雅。

尝试使用状态变量来避免第一次的写入：

```vue
<script>
const data1 = ref(false)
let data1Loaded = false

watch(data1, async (newValue) => {
  if (!data1Loaded){
    data1Loaded = true
    return
  }
  localStorage.setItem("data1", newValue)
})

onMounted(async () => {
  data1.value = localStorage.getItem("data1");
})
</script>
<template>
	<input v-model="data1" type="checkbox"/>
</template>
```

实际测试发现，这导致侦听器的工作时好时坏，有时触发，有时不触发。

## 混合使用数据绑定和点击事件

这意味着需要了解数据绑定和点击事件的发生顺序，虽然测试得出点击事件发生在前，但个人认为没有官方文档的说明，这种顺序是不可靠的。

因此在事件处理程序中不能通过数据对象获取新值，而是使用DOM获取新值：

```vue
<script>
const data1 = ref(false)
let data1Loaded = false

function handleClick(event:MouseEvent){
	const input = event.target as HTMLInputElement
	localStorage.setItem("data1", input.checked)
}

onMounted(async () => {
  data1.value = localStorage.getItem("data1");
})
</script>
<template>
	<input v-model="data1" @click="handleClick" type="checkbox"/>
</template>
```