# change remote url
```bash
git remote set-url <remote_name> <remote_url>
```
如：
```bash
git remote set-url origin https://www.github.com/me1ting/programming-notes.git
```

# git pull 阻塞了怎么办？

使用`trace`模式执行：
```bash
GIT_TRACE=true git pull
```

# 如何删除tag?
本地删除：
```
git tag --delete tagname
```
远程删除：
```
git push origin :tagname
```