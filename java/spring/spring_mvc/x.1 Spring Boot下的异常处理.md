# Spring Boot下的异常处理

同样，本文也只关注RestController下的异常处理。

在上篇中，我们提到Spring MVC提供了`ResponseEntityExceptionHandler`来处理RestController的全局异常处理。

Spring Boot默认创建了一个`ResponseEntityExceptionHandler`实例（见`WebMvcAutoConfiguration`），当用户没有创建该类型的实例时。

```java
@Configuration(proxyBeanMethods = false)
@ConditionalOnProperty(prefix = "spring.mvc.problemdetails", name = "enabled", havingValue = "true")
static class ProblemDetailsErrorHandlingConfiguration {

    @Bean
    @ConditionalOnMissingBean(ResponseEntityExceptionHandler.class)
    @Order(0)
    ProblemDetailsExceptionHandler problemDetailsExceptionHandler() {
        return new ProblemDetailsExceptionHandler();
    }
}
```

默认的异常处理输出是不符合实际需求的，因此用户需要自己创建一个类型并覆盖相关方法。

// TODO
