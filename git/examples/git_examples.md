# git examples

## 强制覆盖本地代码

使用硬重置实现：

```bash
# 获取所有上游仓库代码
git fetch -all
# 根据实际情况修改远程仓库主分支
git reset --hard origin/master
```

## change remote url

```bash
git remote set-url <remote_name> <remote_url>
```

如：

```bash
git remote set-url origin https://www.github.com/me1ting/programming-notes.git
```

## git pull 阻塞了怎么办？

使用`trace`模式执行：

```bash
GIT_TRACE=true git pull
```

## 如何删除tag?

本地删除：

```
git tag --delete tagname
```

远程删除：

```
git push origin :tagname
```

如果远程是github，可以在网页上进行删除。

## 强制撤销已提交的commit

*仅限于个人项目*

首先在本地撤销最后一次提交（注意备份内容）

```
git reset --soft HEAD~
```

然后将本地的当前内容强制同步到远程：

```
git push origin master --force
```