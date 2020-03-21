### 利用当前项目：
```
 npm install即可--->对于github中的代码上提不能超过100M，此时我们会选择不上传node_modules，即将它设置为gitignore，但是我们会上传package.json,下载后的项目直接执行npm install就会安装依赖
 
```



### 从无到有实现项目：

```
1. npm init 
2. npm install express -S
3. npm install mongoose —S
4. npm install nodemon —D 用于重启node服务
5. 本地电脑安装mongodb osx可用brew install mongdb安装 （brew是homebrew的简称，在苹果环境中带有）
6.  brew services start mongodb 借助brew启动服务
7.  mongodb的默认端口号为27017 可借助Robo 3T连接
8. 创建 server.js文件编写连接mongodb代码
9. 当使用静态资源时创建static文件夹进行静态资源托管
10. 当调试接口时安装插件 REST Client

```



#### doc存放mongdb操作文档