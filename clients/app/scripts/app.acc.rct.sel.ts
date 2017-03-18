import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {Component, OnInit} from '@angular/core';
import { AppDataService } from '../service/app.data.services';
import {AppCommonService} from '../service/app.common.service';


@Component({
    selector:'APP-REC-SEL' , 
    template:`<div>  
     <div class="table-responsive">
       <div class="panel panel-default">
           <div class="panel-body">
                 <form class="form-horizontal" #userform='ngForm'>
                    <div class="form-group">
                         <label  class='control-label col-sm-2'>Sub Ledger Definition</label>
                         <div class="col-sm-3">
                             <select [(ngModel)]="slcode" (ngModelChange)='onChange($event)' name='slcode' required>
                                <option *ngFor="let _data of slBookData" [value]='_data.code'> {{_data.name}} </option>
                             </select>
                         </div>
                    </div> 

                 </form>
            </div>
        </div>
      </div>
 
  </div>`
})


export class AppAccRecSel implements OnInit {
 public error = []  ;
 public allSlBookData=[]  ;
 public slBookData = [] ;
 public orgId:number ;
 public prdId:number ;
 public slcode:string ;
 public glid:number ;
 public payRecJv:string ;


 constructor(private _actrout:ActivatedRoute, private _data:AppDataService , private _common:AppCommonService , private _bldr:FormBuilder, private _route:Router) { 
     this.payRecJv =   this._actrout.snapshot.params['payRecJv'] ;
 } ;


 ngOnInit(){
        this.orgId = this._common.getOrg() ;
        this.prdId = this._common.getPeriodId() ;

        this._data.getData('slbook' )
            .subscribe(resp => {
            console.log('slbook ' + resp.length) ;     
            this.slBookData = resp.filter( _data => _data.orgid==this.orgId && _data.type=='LG' ) ;
            console.log(' slbook2 ' + this.slBookData.length) ; 
        }, error => {this.error = error  }) ;
};

public onChange(event) {
      console.log('sl code ' + this.slcode ) ; 
      if (this.slcode) {
        console.log(' moving to ' + this.payRecJv  );         
         this._route.navigateByUrl('recdoc/'+ this.payRecJv+'/'+this.slcode ); 
      }
  }




}