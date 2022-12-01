//import db
const db=require('./db')
//import jsonwebtoken

const jwt=require('jsonwebtoken')

//login definition

const login=(acno,password)=>{
   //1.search acno,password in mongodb -findeOne()
   return db.User.findOne({
    acno,
    password
   }).then((result)=>{
    console.log(result);
    if(result){
        //gnerate token

        const token=jwt.sign({
            currentAcno:acno
        },"secretkey12345")

        return {
            message:'Login Successfull',
            status:true,
            statusCode:200,
            username:result.username,
            token,
            currentAcno:acno
        }
    }
    else{
        return {
            message:'Invalid Account number/ password!!',
            status:false,
            statusCode:404
        }
    }
   })


}

//register
const register=(acno,pswd,uname)=>{
    //1.search acno in db if yes
    return db.User.findOne({
        acno
    }).then((result)=>{
        //2.if yes response :already exist
        if(result){
            return{
                message:'Already existing user!!',
                status:false,
                statusCode:404
            }
        }
        //3.new user :store all data into db
        else{
            let newUser=new db.User({
                acno,
                username:uname,
                password:pswd,
                balance:0,
                transaction:[]
            })
            newUser.save()
            return{
                message:'Register Successfully',
                status:true,
                statusCode:200
            }
        }
    })
}

//deposit definition

const deposit=(req,acno,password,amount)=>{
    var amt=Number(amount)
    //1.search acno,password in mongodb -findeOne()
    return db.User.findOne({
     acno,
     password,
    
    }).then((result)=>{
        if(acno!=req.currentAcno){
            return {
                message:`Permision denied`,
                status:false,
                statusCode:404
            }
        }
     console.log(result);
     if(result){
        result.balance +=amt
        result.transaction.push({
            amount,
            type:'  CREDIT'
        })
        result.save()
         return {
             message:`${amt} deposited successfully and new balance is ${result.balance}`,
             status:true,
             statusCode:200
         }
     }
     else{
         return {
             message:'Invalid Account Number/Password',
             status:false,
             statusCode:404
         }
     }
    })
 
 
 }
 //withdraw definition

const withdraw=(req,acno,password,amount)=>{
    var amt=Number(amount)
    //1.search acno,password in mongodb -findeOne()
    return db.User.findOne({
     acno,
     password,
    
    }).then((result)=>{
        if(acno!=req.currentAcno){
            return {
                message:`Permision denied`,
                status:false,
                statusCode:404
            }
        }
     console.log(result);
     if(result){
        //check sufficient balane
        if(result.balance>amt){
            result.balance -=amt
        result.transaction.push({
            amount,
            type:'  DEBIT'
        })
        result.save()
         return {
             message:`${amt} Withdraw successfully and new balance is ${result.balance}`,
             status:true,
             statusCode:200
         }
        }
        
     }
     else{
         return {
             message:'Insufficient Balance',
             status:false,
             statusCode:404
         }
     }
    })
 
 
 }

 //transaction 
 const transaction=(acno)=>{
    return db.User.findOne({
        acno
       
    }).then(result=>{
        if(result){
            return{
                status:true,
                statusCode:200,
                transaction:result.transaction
            }
        }else{
            return {
                message:'Invalid Account Number/Password',
                status:false,
                statusCode:404
            }
        }
    })
 }
 //to delete acno from db
 const deleteAcno=(acno)=>{
    return db.User.deleteOne({
        acno
    }).then(result=>{
        if(result){
            return{
                status:true,
                statusCode:200,
                message:`${acno} deleted SuccessFully`
            }
        }
        else{
            return {
                message:'Invalid Account Number/Password',
                status:false,
                statusCode:404
            }
        }
    })
 }

module.exports={
    login,
    register,
    deposit,
    withdraw,
    transaction,
    deleteAcno
}