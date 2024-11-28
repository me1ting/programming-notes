# json examples

## 基本使用

### 格式化

使用`\t`作为缩进，格式化生成的json数据：

```go
json.MarshalIndent(target, "", "\t")
```

## 高级使用

//more

## faq

### 处理嵌套结构体

嵌套结构体本质是**组合**，被嵌套的结构体是所属结构体的字段：

```go
type SchemaMetadata struct {
	Version   int `json:"version"`
	CreatedAt int `json:"createdAt"`
}

type SchemaFile struct {
	SchemaMetadata `json:"SchemaMetadata"`
	//Version   int           `json:"version"`
	//CreatedAt int           `json:"createdAt"`
}

func TestUnmarshal(t *testing.T) {
	data := os.ReadFile(`{version:1, createdAt:21323421`)
	var schemaFile poedat.SchemaFile

	json.Unmarshal(data, &schemaFile)
	if schemaFile.Version != 1 {
		t.Error("schemaFile.Version unmarshaled failed")
	}
}
//stderr: schemaFile.Version unmarshaled failed
```
