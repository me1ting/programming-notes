# 示例
## 元素

### 创建元素并插入

```javascript
const newButton = document.createElement('button');
newButton.textContent = 'Click me!';
document.body.appendChild(newButton);
```

### 作为第一个子元素插入

```javascript
var eElement; // some E DOM instance
var newFirstElement; //element which should be first in E

eElement.insertBefore(newFirstElement, eElement.firstChild);
```