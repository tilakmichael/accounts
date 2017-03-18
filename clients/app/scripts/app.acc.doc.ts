import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import {Component, OnInit} from '@angular/core';
import { AppDataService } from '../service/app.data.services';
import {AppCommonService} from '../service/app.common.service';


@Component({
    selector:'APP-DOC',
    templateUrl:'app/views/app.acc.doc.html'
})

export class AppAccDocs implements OnInit{
 public table:string =  'doc' ;   
 public allData= [] ;
 public error = []  ;
 public bookData=[] ;
 //public allBookData=[] ;
 public allSlBookData=[]  ;
 public slBookData = [] ;
 public orgId:number ;
 public prdId:number ;
 public editFlag:boolean=false;
 public editId:number;
 public slcode:string ;
 public lgrName:string ;
 public glid:number ;
 public emptyData= {id:-1,code:null,docno:null,docdate:null,orgid:null,prdid:null,refno:null,refdate:null,describ:null,amount:null,status:null, type:'P'} ;
 public pager:any = {};

 constructor( private _data:AppDataService , private _common:AppCommonService , private _bldr:FormBuilder, private _route:Router) { };


ngOnInit(){
        this.orgId = this._common.getOrg() ;
        this.prdId = this._common.getPeriodId() ;

        console.log('org id  ' + this.orgId) ; 
        this._data.getData(this.table )
            .subscribe(resp => {
            this.allData = resp ;
            this._common.log(resp) ; 
        }, error => {this.error = error  }) ;

        this._data.getData('slbook' )
            .subscribe(resp => {
            console.log('slbook ' + resp.length) ;     
            this.slBookData = resp.filter( _data => _data.orgid==this.orgId && _data.type=='LG' ) ;
            console.log(' slbook2 ' + this.slBookData.length) ; 
        }, error => {this.error = error  }) ;
 

};


addData() {
    console.log('Add Data') 
    this.emptyData.orgid = this.orgId ; 
    this.emptyData.prdid = this.prdId ; 
    this.emptyData.code  = this.slcode ; 
    
    this._route.navigateByUrl('docdet/'+ JSON.stringify(this.emptyData) ); 
}


editData(id:number, index:number) {
    console.log(' Data') ; 
    this._route.navigateByUrl('docdet/'+ JSON.stringify(this.bookData[index]) );     
}


setPage(page:number){
    if ( page < 1 || page > this.pager.totalPages){
        return ;
    }
    this.pager = this._common.getPager(this.allData.length, page);
    this.bookData= this.allData.slice(this.pager.startIndex, this.pager.endIndex+1)
}


public onChange(event) {
      console.log('sl code ' + this.slcode ) ; 
      if (this.slcode) {
         this.bookData = this.allData.filter(data =>  data.orgid==this.orgId && data.slcode==this.slcode && data.type == 'P') ;
         console.log(' book data' + this.bookData.length ) ; 
         this.setPage(1) ;
         let indx = this._common.findIndex(this.slBookData , "code== '"+this.slcode+"'")  ;   
         console.log(' Gl index ' + indx) ; 
         this.glid      = this.slBookData[indx].glid ;
         this.lgrName   = this.slBookData[indx].name ;
         console.log(' lgrname ' + this.lgrName) ;
      }
  }
}