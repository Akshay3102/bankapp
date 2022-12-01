import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user:String="";

  //to hold accono to be delete
  acno:any

  depositForm=this.fb.group({
    acno:['',[Validators.required,Validators.pattern('[0-9]*')]],
    pswd:['',[Validators.required,Validators.pattern('[a-zA-Z0-9]*')]],
    amount:['',[Validators.required,Validators.pattern('[0-9]*')]]
  })

  withdrawForm=this.fb.group({
    acno:['',[Validators.required,Validators.pattern('[0-9]*')]],
    pswd:['',[Validators.required,Validators.pattern('[a-zA-Z0-9]*')]],
    amount:['',[Validators.required,Validators.pattern('[0-9]*')]]
  })

  constructor(private fb:FormBuilder,private router:Router,private api:ApiService) { }

  ngOnInit(): void {
    if(localStorage.getItem("username")){
      this.user=localStorage.getItem("username")||''
    }
    if(!localStorage.getItem("token")){
      alert("Please login")
      this.router.navigateByUrl("")
    }
    
  }
  
deposit(){
  var acno =this.depositForm.value.acno
    var pswd =this.depositForm.value.pswd
    var amount =this.depositForm.value.amount
    if(this.depositForm.valid){
    //asynchronus
    this.api.deposit(acno,pswd,amount)
    .subscribe((result:any)=>{
      alert(result.message)
      
    },
    // if client error-4xx
    (result:any)=>{
      alert(result.error.message)
    }
    )
      

    }
    else{
      alert(' Invalid Form')
    }
}

//withdrawal
withdraw(){
  var acno =this.withdrawForm.value.acno
    var pswd =this.withdrawForm.value.pswd
    var amount =this.withdrawForm.value.amount
    if(this.withdrawForm.valid){
    //asynchronus
    this.api.withdraw(acno,pswd,amount)
    .subscribe((result:any)=>{
      alert(result.message)
      
    },
    // if client error-4xx
    (result:any)=>{
      alert(result.error.message)
    }
    )
      

    }
    else{
      alert(' Invalid Form')
    }
}
//logout
logout(){
  localStorage.removeItem("username")
  localStorage.removeItem("token")
  localStorage.removeItem("currentAcno")
  //redirect to login page
  this.router.navigateByUrl('')

}
//delete
delete(){
   this.acno=localStorage.getItem("currentAcno")
}
 cancel(){
  this.acno=''
 }
 onDelete(event:any){
    this.api.deleteAcc(event)
    .subscribe((result:any)=>{
      alert(result.message)
      this.logout()
    },
    result=>{
      alert(result.error.message)
    }
    )
 }

}
