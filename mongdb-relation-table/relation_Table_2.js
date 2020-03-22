/*
 * @Author: wp 
 * @Date: 2020-03-22 11:37:28 
 * @Last Modified by: wp
 * @Last Modified time: 2020-03-22 16:37:57
 * 用于描述mongdb中表之间的关联，以一个博客系统为例子，一个帖子对应多个或者一个分类。
 * 下面案例讲述了：
 * 1.建立帖子
 * 2.帖子和分类的关联
 * 3.从帖子查询到对应分类
 * 4.从分类查询到含有帖子 (存放于relation_Table_2.js中)
 */

//mongdb的连接
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mongo-relation', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
//category的结构schema提取出来为了添加参数和操作
const CategorySchema = new mongoose.Schema({
    name: {
        type: String
    }
},{
    //当toJSON时的参数配置，显示虚拟的建值
    toJSON:{
        virtuals:true
    }
})
//给category结构添加一个虚拟字段posts
CategorySchema.virtual('posts',{
    localField:'_id',   //要用本身的哪个字段，这里是指的要用Category模型中的id字段（mongodb中自动生成的）（可以理解为关联外键）
    ref:'Post',//将要和谁做关联
    foreignField:'category', //和POST模型做关联，用的是Post中的category字段 （关联外键）
    justOne:false //是否是只有一条数据
})
//建立模型 category分类模型
const Category = mongoose.model('Category',CategorySchema )
//建立 帖子模型
const Post = mongoose.model('Post', new mongoose.Schema({
    title: {
        type: String
    },
    body: {
        type: String
    },
    //帖子模型中关联了分类模型，ref为指定的模型，type是指你将用指定模型中哪个字段作为关联。
    category: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Category'
    },
    //假如一个帖子对应多个分类的话，我们就将其换成数组
    categories: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Category'
    }]
}))

async function main() {
    //默认清空下category的虚拟字段是不显示的，如要显示可使用下面几种方式
    // const category = await Category.find().populate('posts') ,这种你虽然看不到，但是通过category[0].posts是能获取到的。

    //获取的第一种方式：使用lean方法强制显示，
    // const category = await Category.find().populate('posts').lean();
    // console.log(category);

    //获取的第二种方式：将category转化成json字符串，同时在Schema下添加配置项{ virtuals:true}
    const category = await Category.find().populate('posts');
    console.log(JSON.stringify(category));
    

}
main();