import { Component, OnInit,EventEmitter  } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';
//import { DialogService } from "ng2-bootstrap-modal";

import { AppDataService } from '../service/app.data.services';
import {AppCommonService} from '../service/app.common.service';
import {Location} from '@angular/common' ; 


@Component({
    selector: 'APP-ORG-SELECT' , 
    templateUrl:'app/views/app.acc.org.select.html' , 
    outputs : ['orgEId', 'orgEName', 'periodEId' , 'startEdt', 'endEdt'] 
})


export class AppAccOrgSelector implements OnInit {
 public allData= [] ;
 public error = []  ;
 public orgData=[] ;
 public periodData=[] ;
 public prdData   =[] ;
 public orgId:number ;
 public periodId:number ; 

 public table:string =  'orgs' ;
 public emdata  = {id:-1,name:'',address1:'', address2:'',city:'',state:'',country:'', postal:'',phone:'',email:'',web:'' };
 orgEId   = new EventEmitter<number>();
 orgEName = new EventEmitter<string>();
 periodEId = new EventEmitter<number>() ;
 startEdt  = new EventEmitter<Date>() ;
 endEdt  = new EventEmitter<Date>() ;

 constructor( private _data:AppDataService, private _common:AppCommonService, private _loc:Location, private _router:Router){}   
    

 ngOnInit(){
        this._data.getData(this.table )
             .subscribe(resp => {
                this.allData = resp ;
                this.orgData =  resp ;
                console.log( this.allData) ; 
                console.log( this.allData.length) ;
                this.orgData = this.allData.map( function(_data){  return _data ; } ) ;  

                
                if (this.allData.length =  0) {
                       this.emdata.name    = 'Test Organization' ; 
                       this.emdata.phone   = '999999999' ; 
                       this.emdata.country = 'xxxx' ;
                       this._data.insertData(this.table, this.emdata).subscribe(resp => {
                            this._common.log(resp) ;
                            if (resp.id) {
                                this.emdata.id = resp.id ; 
                                this.allData.unshift(this.emdata) ;
                            }
                        }, error => {this.error = error  }) ;  
             }

        } );

        this._data.getData('period')
             .subscribe(resp => {
                 this.prdData = resp ;
             }, error => {this.error = error  }) ;  
        } ;


  public orgSelect() {
      console.log('org id ' + this.orgId ) ; 
      if (this.orgId) {

         if (this.periodData.length > 0 && (this.periodId==undefined || this.periodId==null) ){
             alert('Please Select Period') ; 
             return ;
         }

        this._common.setOrg(this.orgId) ; 
        let index = this.orgData.findIndex(doc => { console.log(doc.id);
                                                    return doc.id ==this.orgId } ) ;
         console.log('index '+index);

        if (index != -1) {
            this._common.setOrgName(this.orgData[index].name) ; 
        } 
         
        this.orgEId.emit(this.orgId) ;
        this.orgEName.emit( this.orgData[index].name) ;
        console.log('period id  ' + this.periodId) ;
        console.log('period []  ' + this.periodData.length );
        if (this.periodId) {
           this._common.setPeriodId(this.periodId) ; 
           index = this.periodData.findIndex(doc =>{     console.log(doc.id) ; return  doc.id ==this.periodId } ) ;
           
           console.log('period indx' + index) ; 
           if (index >= 0 ) {
               this._common.setStatDt( this.periodData[index].startdt ) ; 
               this._common.setEndDt( this.periodData[index].enddt ) ;
               this.startEdt.emit(  this.periodData[index].startdt ) ;
               this.endEdt.emit(this.periodData[index].enddt ) ;   
           }
           this.periodEId.emit(this.periodId);

           
        }

        //this._loc.back( ) ;
        //this._router.navigateByUrl('menu') ;
       this._common.goHome(); 
      }
  }


  public onChange(id) {
      console.log(id) ; 
      if (event) {
          console.log(this.prdData.length    ) ;
          this.periodData = this.prdData.filter(doc => doc.orgid == id ) ;
          console.log(this.periodData.length    ) ;  
      }
      this.periodId = undefined ;
  }

}