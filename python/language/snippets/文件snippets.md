# 文件snippets

## 将文件读取为多行字符串

```python
with open("demo.text", "rt", "utf-8") as f:
	lines = f.readlines()
```

注意，这种方式读取的多行字符串，每个字符串末尾都带有一个换行符`\n`。

通过`line = line[:len(line)-1]`，得到不包括末尾换行符的行字符串。