import { FormGroup, FormBuilder } from '@angular/forms';
import {Component, OnInit} from '@angular/core';


import { AppDataService } from '../service/app.data.services';
import {AppCommonService} from '../service/app.common.service';


@Component({
    selector:'APP-GL',
    templateUrl:'app/views/app.acc.gl.html'
})

export class AppAccGl implements OnInit{
 public table:string =  'gl' ;   
 public allData= [] ;
 public error = []  ;
 public glData=[] ;
 public allGlData=[] ; 
 public formDatas:FormGroup ; 
 public gltypData=[] ;
 public orgId:number ;
 public periodId:number ;
 public editFlag:boolean=false;
 public editId:number;
 public emptyData = {"id":-1,"orgid":null,"gltypeid":null,"name":null,"crdr":null,"bookledger":null,"book":null,"ledger":null} ;
 public pager:any = {};

 constructor( private _data:AppDataService , private _common:AppCommonService , private _bldr:FormBuilder) { };


ngOnInit(){
        this.orgId = this._common.getOrg() ;
        console.log('org id  ' + this.orgId) ; 
        this._data.getData(this.table )
            .subscribe(resp => {
            this.allData = resp ;
            this._common.log(resp) ; 
            if (this.allData.length > 0){
               this.allGlData = this.allData.filter(data =>   data.orgid==this.orgId );
               this.setPage(1) ;

            }  
        }, error => {this.error = error  }) ;

        this._data.getData('gltypes' )
            .subscribe(resp => {
            console.log(' glt ' + resp.length) ;     
            this.gltypData = resp.map( function(_data){  return _data ; }  ) ;
            console.log(' glt2 ' + this.gltypData.length) ; 
        }, error => {this.error = error  }) ;
};

initData(newData:boolean, doc:any){
    console.log('init data') ; 
    this.editFlag  = true ;
    this.editId    = -1;
    this.emptyData.orgid = this.orgId ;
    this.formDatas = this._bldr.group(this.emptyData )
    if (!newData && doc ){
        console.log('edit data'); 
       this.editId   = doc.id ;
       this.formDatas = this._bldr.group(doc )
       
    }
}





addData() {
    console.log('Add Data') ; 
    this.initData(true, null) ; 
    this.emptyData.orgid = this.orgId ;
    this.glData.unshift(this.emptyData) ;
}

deleteData(id:number, index:number) {
       if (confirm( "Delete this period? ")) {
          this._data.deleteData(this.table, id).subscribe(resp => {
               this._common.log( resp ) ;
               if (resp.affectedRows >= 1) { 
                  this.glData.splice(index, 1);
                  let alidx = this._common.findIndex( this.allGlData, 'id == '+id ) ; 
                  if (alidx > 0) {
                     this.allGlData.splice(alidx, 1) ;
                     this.setPage(this.pager.curentPage)
 
                  }
               }                      
           }, error => this.error = error  )
       }   
}

editData(id:number, index:number) {
    console.log(' Data') ; 
    this.initData(false, this.glData[index]) ; 
    //this.emptyData.orgid = this.orgId ;
    //this.glData.unshift(this.emptyData) ;

     
}




private findDupName(name:string , id:number , doc:any){
     let dupId = undefined;
     console.log(' find name : '+name +id);
     let index =  doc.findIndex(data => (data.name == name  && data.id != id) );
     //console.log( 'dup index ' + index) ; 
      if (index >= 0) {
           dupId = doc[index].id;
        }
        console.log('dup idx ' + dupId) ;  
        return dupId;

};


private findCrDr(id:number){
     let crdr = undefined;
     console.log(' find crdr : ' +id);
     let index =  this.gltypData.findIndex(data => (data.id == id) );
     //console.log( 'dup index ' + index) ; 
      if (index >= 0) {
           crdr = this.gltypData[index].crdr ;
        }
        console.log('crdr ' + crdr) ;
        return crdr;

};

setPage(page:number){
    if ( page < 1 || page > this.pager.totalPages){
        return ;
    }
    this.pager = this._common.getPager(this.allGlData.length, page);
    this.glData= this.allGlData.slice(this.pager.startIndex, this.pager.endIndex+1)
}

onCancel(id, index){
    console.log('cancel data') ; 
    this.editFlag = false ;
    this.editId   = undefined;
    if (id==-1){ 
       this.glData.splice(index, 1);
    }
}

saveData(id, index){
       let data =  this.formDatas.value ; 
       console.log(' Save  ' + id + "/" + index);
       let dupid:number = this.findDupName(data.name , id , this.allGlData);
        //console.log(' dup id ' + dupid) ;
       if (dupid >= 0) {
            if (dupid != id) {
                alert("The name already exists, pls enter diferent name");
                return;
            }
       }
      
       data.crdr = this.findCrDr( data.gltypeid );
       if (id == -1) {
           console.log('insert data') ;
           console.log( data  ) ;
           
           //this.glData[index].orgid = this.orgId ;
               // insert
            this._data.insertData(this.table, data).subscribe(respData => {
                this.glData[index]     = data ;
                this.glData[index].id  = respData.id;
                
                this.allGlData.push(this.glData[index]) ; 
            }, respError => { this.error = respError });
                   
        } else {
               console.log('update data') ;
               this._data.updateData(this.table, data).subscribe(respData => {
               this.glData[index]     = data ; 
               let alidx = this._common.findIndex( this.allGlData, 'id == '+id ) ; 
               if (alidx >= 0) {
                   this.allGlData[index] = data ;
               }   
               //this.updateGlData(data) ;
            }, respError => { this.error = respError });
        }
        this.onCancel(-2,-2) ;
        if (this.glData.length > 10 ) {
            this.setPage(this.pager.curentPage)
        }
  };

}