const express = require('express');
const app = express();
const mongoose = require('mongoose');
//解决跨域问题  (一个主机名加一个端口号被称为一个域) CORS

// 浏览器中跨域错误：
// Access to fetch at 'http://localhost:4000/products' from origin 'null' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.

// 可安装vscode插件 live Share重启服务来实现俩个服务器直接的跨域模拟

// 解决方案：安装npm包 cors并使用即可

app.use(require('cors')());

//允许express来处理提交过来的json数据，如果没有这个express自带中间件的话post请求的req.body中是拿不到数据的
app.use(express.json());

//连接mongdb，使用的是mongoose中间件
mongoose.connect('mongodb://localhost:27017/express-mongodb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// 如果遇到下面问题（第一问题是需要用新的url解析器，第二个为用新的服务器发现和监视引擎），需要在第二个参数中添加对象配置，如上所示
// DeprecationWarning: current URL string parser is deprecated, and will be removed in a future version. To use the new parser, pass option { useNewUrlParser: true } to MongoClient.connect.
// (node:19425)
//  DeprecationWarning: current Server Discovery and Monitoring engine is deprecated, and will be removed in a future version. To use the new Server Discover and Monitoring engine, pass option { useUnifiedTopology: true } to the MongoClient constructor.

//创建一个模型
const Product = mongoose.model('Product', new mongoose.Schema({
    text: String
}))

// Product.insertMany([{  //插入多条数据
//         text: '产品1'
//     },
//     {
//         text: '产品2'
//     }, {
//         text: '产品3'
//     },
// ])

//光监听在服务器上是没有任何反应的，你需要手动添加路由
app.listen(4000, () => {
    console.log('start server!');
})
//主页
// app.get('/', (req, res) => {
//     res.send({
//         page: 'home'
//     });
// });
//关于我们
app.get('/about', (req, res) => {
    res.send({
        page: 'about us'
    });
});
//产品列表，列表页接口
app.get('/products', async (req, res) => {
    // let data = await Product.find().skip(1).limit(2);  //skip跳过1条,limit限制显示俩条，俩者结合是来实现分页的

    // let data = await Product.find().where({  //查询text字段为产品2的数据

    //     text:'产品2'
    // })
    let data = await Product.find().sort({ //排序
        _id: 1 //1:正序 ，从小到大  //2:倒序，从大到小
    })
    res.send(data); //查找所有记录
});

//动态获取url参数，来表示每个产品，:表示匹配任意字符 
//详情页接口
app.get('/products/:id', async (req, res) => {
    // let data = await Product.find().skip(1).limit(2);  //skip跳过1条,limit限制显示俩条，俩者结合是来实现分页的
    console.log(req.params);
    console.log(req.params.id) //就能取到id
    let data = await Product.findById(req.params.id)
    res.send(data); //查找所有记录
});

//添加数据接口，此时以restful接口为例get请求和post的url一样了，我们就不能用浏览器来查看了，此时可以安装vscode插件REST Client来实现，安装完毕后在根目录下创建一个后缀.http的文件（如同postman一样测试）
app.post('/products', async (req, res) => {
    const data = req.body; //从post请求中得到数据
    //创建一条数据
    let product = await Product.create(data);
    //创建成功后就返回product
    res.send(product);
})

//修改
app.put('/products/:id', async (req, res) => {
    let product = await Product.findById(req.params.id);
    product.text = req.body.text;
    await product.save();
    res.send(product);
})

//删除

app.delete('/products/:id', async (req, res) => {
    let product = await Product.findById(req.params.id);
    await product.remove();
    res.send({
        success: true
    });
})

//托管静态文件
//第一参数表示在浏览器中想去访问静态文件的路径
//第二个参数表示使用express的static方法来规定静态文件托管路径
app.use('/', express.static('static'));