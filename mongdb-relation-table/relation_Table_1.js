/*
 * @Author: wp 
 * @Date: 2020-03-22 11:37:28 
 * @Last Modified by: wp
 * @Last Modified time: 2020-03-22 14:35:30
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
//建立模型 category分类模型
const Category = mongoose.model('Category', new mongoose.Schema({
    name: {
        type: String
    }
}))
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
    categories:[
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Category'
        }
    ]
}))

async function main() {
    // await Post.insertMany([
    //     {title:'第1篇帖子',body:'内容1'},
    //     {title:'第2篇帖子',body:'内容2'},
    // ])
    // await Category.insertMany([
    //     {
    //         name:'nodejs'
    //     },
    //     {
    //         name:'vuejs'
    //     }
    // ])
    // let category = await Category.find();
    // console.log(category);
    //下面就是给每一个帖子设定他们的帖子，（这就是一对多的关系）
    const post1 =await Post.findOne({title:'第1篇帖子'});
    const post2 =await Post.findOne({title:'第2篇帖子'});
    const cat1 = await Category.findOne({name:'nodejs'});
    const cat2 = await Category.findOne({name:'vuejs'});

    // 有一个分类时
    post1.category =cat1; //当然也可以直接写成 category =cat1._id （nodejs会自动帮我们去找他滴的_id）
    post2.category =cat2;
    //有多个分类时
    post1.categories =[cat1,cat2]; //当然也可以直接写成 category =cat1._id （nodejs会自动帮我们去找他滴的_id）
    post2.categories =cat2;


    await post1.save();
    await post2.save();//此时category会变成category：category的id

    const posts = await Post.find().populate('categories');
    console.log('posts:',posts);

    
    //如果我们想在每个posts1中看到详细的category信息可以使用populate填充方法
    // console.log('categoriy:',await Post.find().populate('categoriy'))//此意思就是要填充哪个字段
    // console.log('categories:',await Post.find().populate('categories'))//此意思就是要填充哪个字段

    console.log('posts[0]:'+posts[0]);
    console.log('posts[1]:'+posts[1]);
}
main();