import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
acno:Number=0

transactions:any=[]
  constructor(private apiService:ApiService) { }

  ngOnInit(): void {
    if(localStorage.getItem("currentAcno")){
      this.acno=Number(localStorage.getItem("currentAcno"))
    }
     this.apiService.transction(this.acno)
     .subscribe((result:any)=>{
      this.transactions=result.transaction
     })
    
  }

}
