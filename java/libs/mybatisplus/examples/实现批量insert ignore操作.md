# 实现批量insert ignore操作

在我的项目中，需要批量执行MySQL的`INSERT IGNORE`语句。

## 思路分析

查阅官方文档的[批量操作](https://baomidou.com/pages/33c2c2/)时，发现可以使用[自定义批量操作的方法](https://baomidou.com/pages/33c2c2/#execute)。

然后查阅官方文档的[SQL注入器](https://baomidou.com/pages/42ea4a/)，可以自定义Mapper接口。

## 实现代码

### 给Mapper添加`insertIgnore()`方法

定义自己的`BaseMapper`接口，以供项目的Mapper继承：

```java
// com/example/integration/mybatisplus/MyBaseMapper.java
public interface MyBaseMapper <T> extends BaseMapper<T> {  
    int insertIgnore(T entity);  
}
```

方法的实现：

```java
// com/example/integration/mybatisplus/MyBaseMapper.java
/**
 * 插入一条数据（选择字段插入），如果冲突，选择忽略，只支持MySQL
 * 修改自官方的Inert类型。
 * @See com.baomidou.mybatisplus.core.injector.methods.Insert
 */
public class InsertIgnore extends AbstractMethod {
    // 修改自 com.baomidou.mybatisplus.core.enums.SqlMethod.INSERT_ONE
    private static final String METHOD_NAME = "insertIgnore";
    private static final String METHOD_DESC = "插入一条数据（选择字段插入），如果冲突，选择忽略，只支持MySQL";
    private static final String METHOD_SQL = "<script>\nINSERT IGNORE INTO %s %s VALUES %s\n</script>";

    /**
     * 自增主键字段是否忽略
     *
     * @since 3.5.4
     */
    private boolean ignoreAutoIncrementColumn;

    public InsertIgnore() {
        this(METHOD_NAME);
    }

    /**
     * @param ignoreAutoIncrementColumn 是否忽略自增长主键字段
     * @since 3.5.4
     */
    public InsertIgnore(boolean ignoreAutoIncrementColumn) {
        this(METHOD_NAME);
        this.ignoreAutoIncrementColumn = ignoreAutoIncrementColumn;
    }


    /**
     * @param name 方法名
     * @since 3.5.0
     */
    public InsertIgnore(String name) {
        super(name);
    }

    /**
     * @param name                      方法名
     * @param ignoreAutoIncrementColumn 是否忽略自增长主键字段
     * @since 3.5.4
     */
    public InsertIgnore(String name, boolean ignoreAutoIncrementColumn) {
        super(name);
        this.ignoreAutoIncrementColumn = ignoreAutoIncrementColumn;
    }

    @Override
    public MappedStatement injectMappedStatement(Class<?> mapperClass, Class<?> modelClass, TableInfo tableInfo) {
        KeyGenerator keyGenerator = NoKeyGenerator.INSTANCE;
        String columnScript = SqlScriptUtils.convertTrim(tableInfo.getAllInsertSqlColumnMaybeIf(null, ignoreAutoIncrementColumn),
            LEFT_BRACKET, RIGHT_BRACKET, null, COMMA);
        String valuesScript = LEFT_BRACKET + NEWLINE + SqlScriptUtils.convertTrim(tableInfo.getAllInsertSqlPropertyMaybeIf(null, ignoreAutoIncrementColumn),
            null, null, null, COMMA) + NEWLINE + RIGHT_BRACKET;
        String keyProperty = null;
        String keyColumn = null;
        // 表包含主键处理逻辑,如果不包含主键当普通字段处理
        if (StringUtils.isNotBlank(tableInfo.getKeyProperty())) {
            if (tableInfo.getIdType() == IdType.AUTO) {
                /* 自增主键 */
                keyGenerator = Jdbc3KeyGenerator.INSTANCE;
                keyProperty = tableInfo.getKeyProperty();
                // 去除转义符
                keyColumn = SqlInjectionUtils.removeEscapeCharacter(tableInfo.getKeyColumn());
            } else if (null != tableInfo.getKeySequence()) {
                keyGenerator = TableInfoHelper.genKeyGenerator(methodName, tableInfo, builderAssistant);
                keyProperty = tableInfo.getKeyProperty();
                keyColumn = tableInfo.getKeyColumn();
            }
        }
        String sql = String.format(METHOD_SQL, tableInfo.getTableName(), columnScript, valuesScript);
        SqlSource sqlSource = super.createSqlSource(configuration, sql, modelClass);
        return this.addInsertMappedStatement(mapperClass, modelClass, methodName, sqlSource, keyGenerator, keyProperty, keyColumn);
    }
}
```

定义自己的注入器，添加我们创建的方法：

```java
// come/example/integration/mybatisplus/MySqlInjector.java
public class MySqlInjector extends DefaultSqlInjector {

    /**
     * 如果只需增加方法，保留MP自带方法
     * 可以super.getMethodList() 再add
     * @return
     */
    @Override
    public List<AbstractMethod> getMethodList(Class<?> mapperClass, TableInfo tableInfo) {
        List<AbstractMethod> methodList = super.getMethodList(mapperClass, tableInfo);
        methodList.add(new InsertIgnore());
        return methodList;
    }
}
```

将注入器配置为bean，MP从而使用自定义的注入器：

```java
// come/example/config/MybatisPlusConfig.java
@Configuration  
@MapperScan("com.example.mapper") 
public class MybatisPlusConfig {  
    /**  
     * 自定义 SqlInjector  
     * 里面包含自定义的全局方法  
     */  
    @Bean  
    public MySqlInjector mySqlInjector() {  
        return new MySqlInjector();  
    }  
}
```

现在，我们的Mapper只要继承了MyBaseMapper接口，就能使用`insertIgnore()`方法了：

```java
@Autowired
private UserMapper mapper;

public boolean saveIgnore(User user){
	//...
	return mapper.insertIgnore(user) > 0;
}
```

### 实现批量操作

根据官方文档说明，采用如下方式：

```java
@Autowired
private UserMapper mapper;

@Transactional(rollbackFor = Exception.class)
public void saveIgnoreBatch(List<User> users){
	//...
	MybatisBatch<User> mybatisBatch = new MybatisBatch<>(this.getSqlSessionFactory(), users);  
	MybatisBatch.Method<User> method = new MybatisBatch.Method<>(UserMapper.class);  
	mybatisBatch.execute(method.get("insertIgnore"));
}
```

### 实现自定义IService和ServiceImpl

我们还可以自定义`IService`和`ServiceImpl`，从而注入操作到项目的Service中，不需要手动调用`MybatisBatch`进行批量处理。

IService：

```java
// com/example/integration/mybatisplus/MyIService.java
public interface MyIservice<T> extends IService<T> {
    /**
     * 插入一条记录（选择字段，策略插入），如果冲突忽略错误
     *
     * @param entity 实体对象
     */
    default boolean saveIgnore(T entity) {
        return SqlHelper.retBool(((MyBaseMapper<T>)getBaseMapper()).insertIgnore(entity));
    }

    /**
     * 插入（批量），如果冲突忽略错误
     *
     * @param entityList 实体对象集合
     */
    @Transactional(rollbackFor = Exception.class)
    default boolean saveIgnoreBatch(Collection<T> entityList) {
        return saveIgnoreBatch(entityList, DEFAULT_BATCH_SIZE);
    }

    /**
     * 插入（批量），如果冲突忽略错误
     *
     * @param entityList 实体对象集合
     * @param batchSize  插入批次数量
     */
    boolean saveIgnoreBatch(Collection<T> entityList, int batchSize);
}
```

ServiceImpl：

```java
// com/example/integration/mybatisplus/MyServiceImpl.java
public class MyServiceImpl<M extends MyBaseMapper<T>, T> extends ServiceImpl<M, T> implements MyIservice<T>{

    /**
     * 批量插入，如果冲突则忽略错误
     *
     * @param entityList ignore
     * @param batchSize  ignore
     * @return ignore
     */
    @Transactional(rollbackFor = Exception.class)
    @Override
    public boolean saveIgnoreBatch(Collection<T> entityList, int batchSize) {
        String sqlStatement = mapperClass + StringPool.DOT + InsertIgnore.METHOD_NAME;
        return executeBatch(entityList, batchSize, (sqlSession, entity) -> sqlSession.insert(sqlStatement, entity));
    }
}
```
## 总结

本文记录了如何给MybatisPlus添加批量insert ignore操作。
