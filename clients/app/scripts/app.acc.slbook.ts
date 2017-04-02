import { FormGroup, FormBuilder } from '@angular/forms';
import {Component, OnInit} from '@angular/core';
import { AppDataService } from '../service/app.data.services';
import {AppCommonService} from '../service/app.common.service';



@Component({
    selector:'APP-SLBOOK' ,
    templateUrl:'app/views/app.acc.slbook.html'
})  


export class AppAccSlBook implements OnInit{

 public table:string =  'slbook' ;   
 public allData= [] ;
 public error = []  ;
 public slData=[] ;
 public allGlData=[] ; 
 public formDatas:FormGroup ; 
 public orgId:number ;
 public editFlag:boolean=false;
 public editId:number;
 public emptyData = {"id":-1,"code":null,"name":null,"glid":null, orgid:null, crdr:null , type:'SL'} ;

 constructor( private _data:AppDataService , private _common:AppCommonService , private _bldr:FormBuilder) { };

 ngOnInit(){
 
        this.orgId = this._common.getOrg() ;
        console.log('org id  ' + this.orgId) ; 
        this._data.getData(this.table )
            .subscribe(resp => {
            this.allData = resp ;
            this._common.log(resp) ; 
            if (this.allData.length > 0){
               this.slData = this.allData.filter(data => { return  data.orgid==this.orgId && data.type =='SL'  });
            }  
        }, error => {this.error = error  }) ;

        this._data.getData('gl' )
            .subscribe(resp => {
            console.log(' glt ' + resp.length) ;     
            this.allGlData = resp.filter( _data => _data.orgid==this.orgId  ) ;
            console.log(' glt2 ' + this.allGlData.length) ; 
        }, error => {this.error = error  }) ;
 }


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
    this.slData.unshift(this.emptyData) ;
}

onCancel(id, index){
    console.log('cancel data') ; 
    this.editFlag = false ;
    this.editId   = undefined;
    if (id==-1){ 
       this.slData.splice(index, 1);
    }
}


deleteData(id:number, index:number) {
       if (confirm( "Delete this Ledger Definition? ")) {
          this._data.deleteData(this.table, id).subscribe(resp => {
               this._common.log( resp ) ;
               if (resp.affectedRows >= 1) { 
                   let indx = this._common.findIndex(this.allGlData , 'id== '+this.slData[index].glid);
                   if (indx >= 0) {
                        this.updateGl(this.allGlData[indx] , null, null ) ;
                   }
  
                  this.slData.splice(index, 1);
                }                      
           }, error => this.error = error  )
       }   
}


editData(id:number, index:number) {
    console.log(' Data') ; 
    this.initData(false, this.slData[index]) ; 
    //this.emptyData.orgid = this.orgId ;
    //this.glData.unshift(this.emptyData) ;

}


updateGl(doc:any , bookldgr:string ,  code:string) {
    console.log('update gl ' + bookldgr +'  / ' + code) ;
    doc.bookledger = bookldgr ; 
    doc.ledger     = code ;
    
    this._data.updateData('gl', doc).subscribe(respData => {
     }, respError => { this.error = respError });

}


saveData(id, index){
       let data =  this.formDatas.value ; 
       data.code = data.code.toUpperCase();
       console.log(' Save  ' + id + "/" + index);
       let indx:number = this._common.findIndex(this.slData , 'code== "'+data.code+'"');
        //console.log(' dup id ' + dupid) ;
       if (indx >= 0) {
            if (this.slData[indx].id != id) {
                alert("The code already exists, pls enter diferent code");
                return;
            }
       }

       indx = this._common.findIndex(this.slData , 'name=="'+data.name+'"');
        //console.log(' dup id ' + dupid) ;
       if (indx >= 0) {
            if (this.slData[indx].id != id) {
                alert("The Name already exists, pls enter diferent Name");
                return;
            }
       }
      
       if (id == -1) {
           console.log('insert data') ;
           console.log( data  ) 
           indx = this._common.findIndex(this.allGlData , 'id== '+data.glid);
           //console.log(' dup id ' + dupid) ;
           if (indx >= 0) {
              data.crdr =  this.allGlData[indx].crdr ;
           }

           if (this.allGlData[indx].bookledger ){
               alert ('General Ledger linked to another book'  ) ; 
               return ;
           }
           
           //this.glData[index].orgid = this.orgId ;
           // insert
            this._data.insertData(this.table, data).subscribe(respData => {
                this.slData[index]     = data ;
                this.slData[index].id  = respData.id;
                this.updateGl(this.allGlData[indx] , 'SL', data.code ) ; 
            }, respError => { this.error = respError });
                   
        } else {
               console.log('update data') ;
               let updGl:boolean = false ;
               this._data.updateData(this.table, data).subscribe(respData => {
               if (this.slData[index].glid != data.glid) {
                   updGl = true ;
                   indx = this._common.findIndex(this.allGlData , 'id== '+this.slData[index].glid);
                   if (indx >= 0) {
                        this.updateGl(this.allGlData[indx] , null, null ) ;
                   }
                  
               }    
               this.slData[index]     = data ;
               if (updGl){
                   indx = this._common.findIndex(this.allGlData , 'id== '+data.glid);
                   if (indx >= 0) {
                        this.updateGl(this.allGlData[indx] , 'SL', data.code ) ;
                   }
                   
               } 
            }, respError => { this.error = respError });
        }
        this.onCancel(-2,-2) ;
   
   };



  goHome(){
  this._common.goHome() ;
  }

    
}
