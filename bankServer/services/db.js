//MONGODB connection

//1. import mongoose

const mongoose =require('mongoose')

//2. define connection string
mongoose.connect('mongodb://localhost:27017/bank',()=>{
    console.log('mongo db connected successfully');
})

//3.create a model to store data of bank

const User=mongoose.model('User',{
    acno:Number,
    username:String,
    password:String,
    balance:Number,
    transaction:[]
})

//4 to use User in other  files -we have to export it
module.exports={
    User
}