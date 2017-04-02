import { Router ,ActivatedRoute} from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import {Component, OnInit} from '@angular/core';
import { AppDataService } from '../service/app.data.services';
import {AppCommonService} from '../service/app.common.service';


@Component({
    selector:'APP-RECDOC',
    templateUrl:'app/views/app.acc.recDoc.html'
})

export class AppAccRecDoc implements OnInit{
 public table:string =  'doc' ;   
 public allData= [] ;
 public error = []  ;
 public bookData=[]  ;
 public slBookData = [] ;
 public orgId:number ;
 public prdId:number ;
 public editFlag:boolean=false;
 public editId:number;
 public slcode:string ;
 public lgrName:string ;
 public glid:number ;
 public pager:any = {};
 public emptyData = {};
 public payRecJv:string;
 public type:string; 
 public typeName:string;
 constructor( private _actrout:ActivatedRoute, private _data:AppDataService , private _common:AppCommonService , private _bldr:FormBuilder, private _route:Router) {
       this.payRecJv =   this._actrout.snapshot.params['payRecJv'] ;
       this.slcode =   this._actrout.snapshot.params['code'] ;
       //alert(this.payRecJv +' / '+ this.slcode) ;
 };


ngOnInit(){
        this.orgId = this._common.getOrg() ;
        this.prdId = this._common.getPeriodId() ;
        this.type       = 'C' ;
        this.typeName   = 'Payment' ; 
        // receipt 
        if (this.payRecJv == 'R' ) {
           this.type   = 'D' ;       
           this.typeName   = 'Receipt' ;     
        }
        console.log('org id  ' + this.orgId) ; 
        this._data.getData(this.table )
            .subscribe(resp => {
            this.allData = resp.filter(_data => _data.orgid==this.orgId && _data.code == this.slcode && _data.type == this.payRecJv) ;
            this.setPage(1) ;
        }, error => {this.error = error  }) ;

        this._data.getData('slbook' )
            .subscribe(resp => {
            console.log('slbook ' + resp.length) ;     
            this.slBookData = resp.filter( _data => _data.orgid==this.orgId && _data.type=='LG'  &&  _data.code == this.slcode) ;
            console.log(' slbook2 ' + this.slBookData.length) ;
            if ( this.slBookData.length >= 0) {
                this.lgrName = this.slBookData[0].name ;

                this._common.setSlCode(this.slcode) ;
                this._common.setGlId( this.slBookData[0].glid) ;
                this._common.setGlName( this.lgrName ) ;
                 
                console.log(' setting this.lgrName ' + this.lgrName + ' / '+ this.slBookData[0].glid) ;
            }
        }, error => {this.error = error  }) ;


};

editData(id:number, index:number) {
    console.log(' edit Data') ;
    this._common.setDoc( this.bookData[index] ) ;  
    this._route.navigateByUrl('recdet/'+ id+'/'+this.slcode+'/'+this.payRecJv  );     
}

addData(id:number, index:number) {
    console.log(' add Data') ; 
    this._route.navigateByUrl('recdet/'+ -1+'/'+this.slcode+'/'+this.payRecJv );     
}


setPage(page:number){
    if ( page < 1 || page > this.pager.totalPages){
        return ;
    }
    this.pager = this._common.getPager(this.allData.length, page);
    this.bookData= this.allData.slice(this.pager.startIndex, this.pager.endIndex+1)
}

goHome(){
  this._common.goHome() ;
}
  
}


}