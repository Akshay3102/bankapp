//import express 
const express=require('express')
//import dataservices
const dataService=require('./services/data.service')


//import cors

const cors=require('cors')

//import jsonwebtoken

const jwt=require('jsonwebtoken')
                                                    

//create server app
const app=express()

//to define origin using cors
app.use(cors({
    origin:'http://localhost:4200'
}  
))
//set up port for server app
app.listen(3000,()=>{
    console.log('Server started at 3000');
})

//Application specific Middleware
const appMiddleware=(req,res,next)=>{
    console.log('Application specific Middleware');
    next()
}
//to use in entire  application
app.use(appMiddleware)

//to resolve client request

// app.get('/',(req,res)=>{
//     res.send("GET REQUEST")
// })
// app.post('/',(req,res)=>{
//     res.send("Post REQUEST")
// })

// app.patch('/',(req,res)=>{
//     res.send("Patch REQUEST")
// })

// app.put('/',(req,res)=>{
//     res.send("Put REQUEST")
// })

// app.delete('/',(req,res)=>{
//     res.send("delete REQUEST")
// })



//to parse json
app.use(express.json())

//bank sever api-request resolving
 
//jwt token verification middleware
const jwtMiddleware=(req,res,next)=>{

    console.log('Router specific Middleware');
    //1.get token from request header in access-token
    const token=req.headers['access-token']
    //2.verify token using verify method in jsonwebtoken
    try{
        const data =jwt.verify(token,"secretkey12345")
        //assigning login user acno to currentAcno in req
        req.currentAcno=data.currentAcno
        next()
    }
    catch{
        res.status(422).json({
            status:false,
            message:'Please log in'
        })
    }
}

//login api-resolve
app.post('/login',(req,res)=>{
    console.log(req.body);
    //asynchronus
    dataService.login(req.body.acno,req.body.pswd)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
    // res.send('login rqst')
})
    //register
    app.post('/register',(req,res)=>{
        console.log(req.body);
        //asynchronus
        dataService.register(req.body.acno,req.body.pswd,req.body.uname)
        .then((result)=>{
            res.status(result.statusCode).json(result)
        })
})


//deposit
app.post('/deposit',jwtMiddleware,(req,res)=>{
    console.log(req.body);
    //asynchronus
    dataService.deposit(req,req.body.acno,req.body.pswd,req.body.amount)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

//withdraw
app.post('/withdraw',jwtMiddleware,(req,res)=>{
    console.log(req.body);
    //asynchronus
    dataService.withdraw(req,req.body.acno,req.body.pswd,req.body.amount)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
})
    //transaction
app.get('/transaction/:acno',jwtMiddleware,(req,res)=>{
    
    //asynchronus
    dataService.transaction(req.params.acno)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
})
//delete acno
app.delete('/deleteAcno/:acno',jwtMiddleware,(req,res)=>{
    dataService.deleteAcno(req.params.acno)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
})

