import { FormGroup, FormBuilder } from '@angular/forms';
import {Component, OnInit} from '@angular/core';
import { AppDataService } from '../service/app.data.services';
import {AppCommonService} from '../service/app.common.service';



@Component({
    selector:'APP-SLBOOK' ,
    templateUrl:'app/views/app.acc.sl.html'
})  


export class AppAccSl implements OnInit{

 public table:string =  'sl' ;   
 public allData= [] ;
 public error = []  ;
 public slData=[] ;
 public allSlData=[] ;
 public slbook=[] ; 
 public formDatas:FormGroup ; 
 public orgId:number ;
 public editFlag:boolean=false;
 public editId:number;
 public slcode:string ;
 public glid:number ;
 public lgrName:string ; 
 public emptyData = {id:-1, name:null,glid:null,slcode:null,address1:null,address2:null,city:null,state:null,country:null,pin:null,phone:null,contact:null,email:null,orgid:null} ;
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
               console.log('sl ccode  ' + this.slcode) ;  
              // this.slData = this.allData.filter(data =>  data.orgid==this.orgId && data.slcode==this.slcode );
               console.log('sl data ' + this.slData.length ) ; 
            }  
        }, error => {this.error = error  }) ;

        this._data.getData('slbook' )
            .subscribe(resp => {
            console.log('slbook ' + resp.length) ;     
            this.slbook = resp.filter( _data => _data.orgid==this.orgId && _data.type=='SL' ) ;
            console.log(' slbook2 ' + this.slbook.length) ; 
        }, error => {this.error = error  }) ;
 }


 initData(newData:boolean, doc:any){
    console.log('init data') ; 
    this.editFlag  = true ;
    this.editId    = -1;
    this.emptyData.orgid  = this.orgId ;
    this.emptyData.slcode = this.slcode ; 
    this.emptyData.glid   = this.glid   ;
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
    //this.emptyData.orgid = this.orgId ;
    this.slData.unshift(this.emptyData) ;
}

onCancel(id, index){
    console.log('cancel data ' , index , id) ; 
    this.editFlag = false ;
    this.editId   = undefined;
    console.log( 'edit flag ' + this.editFlag) ; 
    if (id==-1){ 
       this.slData.splice(index, 1);
    }
}


deleteData(id:number, index:number) {
     if (confirm( "Delete this Ledger Definition? ")) {
         console.log('delete id  ' + id ) ; 
          this._data.deleteData(this.table, id).subscribe(resp => {
               this._common.log( resp ) ;
               if (resp.affectedRows >= 1) { 
                  this.slData.splice(index, 1);

                  let alidx = this._common.findIndex( this.allSlData, 'id == '+id ) ; 
                  if (alidx > 0) {
                     this.allSlData.splice(alidx, 1) ;
                     this.setPage(this.pager.curentPage)
                   }

                }                      
           }, error => this.error = error  )
          if (this.slData.length > 10 ) {
            this.setPage(this.pager.curentPage)
          }
 
     }   
}


editData(id:number, index:number) {
    console.log(' Data') ; 
    this.initData(false, this.slData[index]) ; 
    //this.emptyData.orgid = this.orgId ;
    //this.glData.unshift(this.emptyData) ;

}




saveData(id, index){
       let data =  this.formDatas.value ; 
       let indx = this._common.findIndex(this.slData , 'name=="'+data.name+'"');
      console.log(' dup idx ' + indx) ;
       if (indx >= 0) {
            if (this.slData[indx].id != id) {
                alert("The Name already exists, pls enter diferent Name");
                return;
            }
       }
      
       if (id == -1) {
           console.log('insert data') ;
           console.log( data  ) 
           //console.log(' dup id ' + dupid) ;
           
           //this.glData[index].orgid = this.orgId ;
           // insert
            this._data.insertData(this.table, data).subscribe(respData => {
                this.slData[index]     = data ;
                this.slData[index].id  = respData.id;
                this.allSlData.push(this.slData[index]) ; 
            }, respError => { this.error = respError });
                   
        } else {
               console.log('update data '+ id) ;
               
               this._data.updateData(this.table, data).subscribe(respData => {
                  console.log('update sucessfull '+ data.state) ; 
                  this.slData[index] = data ;    
                  let alidx = this._common.findIndex( this.allSlData, 'id == '+id ) ; 
                  if (alidx >= 0) {
                      this.allSlData[index] = data ;
                  }   
                           
               }, respError => { this.error = respError });
        }
        this.onCancel(-2,-2) ;
        if (this.slData.length > 10 ) {
            this.setPage(this.pager.curentPage)
        }
 

   };




 public onChange(event) {
      console.log('sl code ' + this.slcode ) ; 
      if (this.slcode) {
         this.allSlData = this.allData.filter(data =>  data.orgid==this.orgId && data.slcode==this.slcode );
         this.setPage(1) ;
         console.log(' sl all data ' + this.allSlData.length) ;
         console.log(' sl data ' + this.slData.length) ;  
         let indx = this._common.findIndex(this.slbook , "code== '"+this.slcode+"'")  ;   
         console.log(' Gl index ' + indx) ; 
         this.glid      = this.slbook[indx].glid ;
         this.lgrName   = this.slbook[indx].name ;
         console.log(' Gl id ' + this.glid ) ;  
      }
  }

  setPage(page:number){
    if ( page < 1 || page > this.pager.totalPages){
        return ;
    }
    this.pager = this._common.getPager(this.allSlData.length, page);
    this.slData= this.allSlData.slice(this.pager.startIndex, this.pager.endIndex+1)
  }

  goHome(){
      this._common.goHome() ;
  }


    
}
