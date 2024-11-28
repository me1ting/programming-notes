# python examples

## 文件

### 路径

使用`pathlib.Path`包。

```python
from pathlib import Path

def must_parent(path:str):
    '''确保文件所在路径存在'''
    Path(path).parent.mkdir(parents=True, exist_ok=True)

# 父目录的绝对路径
print(path.parent.absolute())
```

### 执行外部命令

使用`subprocess`包。

```python
import subprocess

retcode = subprocess.call(["ls", "-l"])
```

`subprocess.call()`提供了一个简单的API，而`subprocess.run()`满足更复杂的功能需求。

## 字符串

### snake to camel

```python
def snake_to_camel(name:str):
    result = ''
    capitalize_next = False
    for char in name:
        if char == '_':
            capitalize_next = True
        else:
            if capitalize_next:
                result += char.upper()
                capitalize_next = False
            else:
                result += char
    return result
```
