import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';
//import { DialogService } from "ng2-bootstrap-modal";

import { AppDataService } from '../service/app.data.services';
import {AppCommonService} from '../service/app.common.service';
//import {AppAccTypeCrud} from '../scripts/app.acc.type.crud' ; 


@Component({
    selector: "APP-TYPES",
    templateUrl: 'app/views/app.acc.types.html'
})

export class AppAccTypes{

    public table:string =  'types' ;
    public orgId:number ;
    public allData = [] ;
    public fData   = [] ;
    public sData   = [] ;
    public tData   = [] ;
    public glData   = [] ;

    public error   = [] ;
    
    public fEditFlag:boolean=false ; 
    public sEditFlag:boolean=false ; 
    public tEditFlag:boolean=false ;
    public editflag:boolean=false ; 
    
    public fId:number=undefined ; 
    public sId:number=undefined ; 
    public tId:number=undefined ; 

    public fPid:number=undefined ; 
    public sPid:number=undefined ;
    public fPcrdr:string=undefined ; 
    public sPcrdr:string=undefined ;

    public fname:string=undefined ;
    public sname:string=undefined ;

    public name:string=undefined ; 
    public seq:number =undefined ; 
    public crdr:string=undefined ;
    public level:string=undefined ;   
    public emptyData = {id:-1,name:'',seq:null, crdr:null,level:null, refid:null, orgid:this.orgId };

    constructor( private _data:AppDataService , private _common:AppCommonService, /* private _dialog:DialogService */) { };

    ngOnInit() {
        this.orgId = this._common.getOrg() ;
        this._data.getData(this.table )
            .subscribe(resp => {
            this.allData = resp ;
            this._common.log(resp) ; 
            if (this.allData.length > 0){
               this.fData = this.allData.filter(data => { return data.level == 1 && data.orgid==this.orgId });
               this.fId   = this.allData[0].id ; 
               this.fPid  = this.fId ;
               this.fPcrdr= this.allData[0].crdr ;
               this.fname = this.fData[0].name ;
               this.onclick(1, this.fId , 0)
            }  
        }, error => {this.error = error  }) ;


           this._data.getData('gl' )
            .subscribe(resp => {
            this.glData = resp.filter(_doc => _doc.orgid==this.orgId ) ;
            }, error => {this.error = error  }) ;
    }

    public onclick(level, id, index) {
      //console.log( 'onclick  ' + level + ' / ' + index) ;   
      //console.log(id) ; 

      if (level ===1) {
         this.fname = this.fData[index].name ; 
         this.fPcrdr = this.fData[index].crdr ; 
         if (id > 0) {
             this.fPid = id ;
             this.popChild(id  , 2 ) ;
               if (this.sData.length > 0 ) {
                   this.sPid  = this.sData[0].id ;
                   this.sPcrdr= this.sData[0].crdr ;
                   this.sname = this.sData[0].name ;
                   this.popChild(this.sPid  , 3  ) ;
               } else {
                      this.sPid  = undefined ;
                      this.sname = undefined ;
                      this.sPcrdr= undefined ;
                      this.popChild(this.sPid, 3  ) ;
                   
               }
          }       
      }

      if (level ===2) {
         this.sname = this.sData[index].name ; 
         if (id > 0) {
             this.sPid = id ;
             this.sPcrdr = this.fPcrdr ;
             this.popChild(this.sPid  , 3  ) ;
          }       
      }
 } ;

private popChild(parentId,  level ){
   let data =  this.allData.filter(data => { return data.level == level && data.refid == parentId && data.orgid==this.orgId });
    //console.log( ' pop ' + parentId +' / ' + this.orgId +' / '+ level +' / ' + data.length) ;
   //if (data.length > 0 ) {
       if (level ===2 ) {
          this.sData = data ;

       } else{ if (level === 3){
          this.tData = data ;
       } }
   //} 

} ;



    public initData(){
        this.name      = undefined;
        this.seq       = undefined  ; 
        this.crdr      = undefined ;
        this.level     = undefined ;
        this.error     = [] ;
        this.fEditFlag = false ;
        this.sEditFlag = false ;
        this.tEditFlag = false ;
        this.fId       = undefined ;
        this.sId       = undefined ;
        this.tId       = undefined ;
        this.editflag  = false ; 
        
        this.emptyData = {id:-1,name:'',seq:null, crdr:null,level:null, refid:null, orgid:this.orgId };
    } ;

    private updateAllData(doc:any) {
        let idex= this.allData.findIndex(data => data.id == doc.id ) ;
        if (idex != -1) {
           this.allData[idex] = doc ;  
        }
               
 
    };


  private checkGl(id):boolean {
      let retval:boolean = false ; 
      let indx = this._common.findIndex(this.glData, 'gltypeid=='+id) ; 
      if (indx >= 0 ) {
          retval = true ;
      }
      return retval ; 
  }  

   private deleteAllData(id) {
        let idex= this.allData.findIndex(data => data.id == id ) ;
        if (idex != -1) {
           this.allData.splice(idex,1) ;
        }
               
 
    };

    private findDupName(name:string , id:number , doc:any){
         let dupId = undefined;
        //console.log(' find name : '+name +id);
        let index =  doc.findIndex(data => (data.name == name  && data.orgid==this.orgId   && data.id !== id) );
        //console.log( 'dup index ' + index) ; 
        if (index >= 0) {
           dupId = doc[index].id;
        }
        return dupId;

    };

    public addFdata() {
        //console.log( ' Add F Data') ; 
        this.initData() ;
            
        let data       = this.emptyData ; 
        data.id        = -1 ; 
        data.level     =  1 ;
        this.fEditFlag = true ; 
        this.fId       = -1 ; 
        this.fData.unshift(data) ;
        this.editflag  = true ;
        this.crdr      = 'D'  ;
        data.orgid     = this.orgId ;
    } 

    public addSdata() {
        //console.log( ' Add S Data') ;
        if ( !this.fPid || this.fPid == null) {
            alert('Plezse select level I for adding level II Data!')
        } 
        //console.log( ' I i '+ this.fPid) ;
        this.initData() ;
            
        let data       = this.emptyData ; 
        data.id        = -1 ; 
        data.level     =  2 ;
        data.refid     =  this.fPid ;
        data.crdr      =  this.fPcrdr ;
        this.sEditFlag = true ; 
        this.sId       = -1 ; 
        this.sData.unshift(data) ;
        this.editflag  = true ;
        this.crdr       = data.crdr ;
        data.orgid     = this.orgId ;
        console.log( this.crdr  + ' / '+ this.fPcrdr) ; 
    } 

    public addTdata() {
        //console.log( ' Add T Data') ;
        if ( !this.sPid || this.sPid == null) {
            alert('Plezse select level II for adding level II Data!')
        } 
        //console.log( ' II id '+ this.sPid) ;
        this.initData() ;
            
        let data       = this.emptyData ; 
        data.id        = -1 ; 
        data.level     =  3 ;
        data.refid     =  this.sPid ;
        data.crdr      =  this.sPcrdr ;
        this.tEditFlag = true ; 
        this.tId       = -1 ; 
        this.tData.unshift(data) ;
        this.editflag  = true ;
        data.orgid     = this.orgId ;
        this.crdr       = data.crdr ;
        //console.log( this.tData.length) ; 
    } 


    public cancelFdata(id, index) {
        //console.log( 'cancell F Data') ; 
        this.initData() ;
        if (id === -1) {
            this.fData.splice(index,1) ;
        }
    } ; 

    

   public cancelSdata(id, index) {
        //console.log( 'cancell S Data') ; 
        this.initData() ;
        if (id === -1) {
            this.sData.splice(index,1) ;
        }
    } ; 

  public cancelTdata(id, index) {
        //console.log( 'cancell T Data') ; 
        this.initData() ;
        if (id === -1) {
            this.tData.splice(index,1) ;
        }
    } ; 


    public saveFdata(id:number , index:number) {
        //console.log(' Save  ' + id + "/" + index);
        let dupid:number = this.findDupName(this.name , id , this.fData);
        //console.log(' dup id ' + dupid) ;
        if (dupid >= 0) {
            if (dupid != id) {
                alert("The name already exists, pls enter diferent name");
                return;
            }
        }

        this.fData[index].name  = this.name;
        this.fData[index].seq   = this.seq ;
        this.fData[index].crdr  = this.crdr ;
        this.fData[index].level = 1 ;
        this.onclick(1, id, index) ; 
        ////console.log(data);
        let data = this.fData[index] ; 
        //console.log(data) ; 
        if (id == -1) {
               // insert
           this._data.insertData(this.table, data).subscribe(respData => {
                this.fData[index].id = respData.id;
               this.allData.push(data) ; 
               this.initData() ; 
                   
            }, respError => { this.error = respError });
        } else {
               this._data.updateData(this.table, data).subscribe(respData => {
               this.updateAllData(data) ;
               this.initData() ; 
            }, respError => { this.error = respError });
        }
    } ;


   public saveSdata(id:number , index:number) {
        //console.log(' Save  ' + id + "/" + index);
        let dupid:number = this.findDupName(this.name , id , this.sData);
        //console.log(' dup id ' + dupid) ;
        if (dupid >= 0) {
            if (dupid != id) {
                alert("The name already exists, pls enter diferent name");
                return;
            }
        }

        this.sData[index].name  = this.name;
        this.sData[index].seq   = this.seq ;
        this.sData[index].crdr  = this.crdr ;
        this.sData[index].level = 2 ;
        this.onclick(2, id, index) ; 
        ////console.log(data);
        let data = this.sData[index] ; 
        //console.log(data) ; 
        if (id == -1) {
               // insert
           this._data.insertData(this.table, data).subscribe(respData => {
                this.sData[index].id = respData.id;
               this.allData.push(data) ; 
               this.initData() ; 
                    
            }, respError => { this.error = respError });
        } else {
               this._data.updateData(this.table, data).subscribe(respData => {
               this.updateAllData(data) ;
               this.initData() ; 
            }, respError => { this.error = respError });
        }
    } ;

  public saveTdata(id:number , index:number) {
        //console.log(' Save  ' + id + "/" + index);
        let dupid:number = this.findDupName(this.name , id , this.sData);
        //console.log(' dup id ' + dupid) ;
        if (dupid >= 0) {
            if (dupid != id) {
                alert("The name already exists, pls enter diferent name");
                return;
            }
        }

        this.tData[index].name  = this.name;
        this.tData[index].seq   = this.seq ;
        this.tData[index].crdr  = this.crdr ;
        this.tData[index].level = 3 ;
        ////console.log(data);
        let data = this.tData[index] ; 
        //console.log(data) ; 
        if (id == -1) {
               // insert
           this._data.insertData(this.table, data).subscribe(respData => {
                this.tData[index].id = respData.id;
               this.allData.push(data) ; 
               this.initData() ; 
                    
            }, respError => { this.error = respError });
        } else {
               this._data.updateData(this.table, data).subscribe(respData => {
               this.updateAllData(data) ;
               this.initData() ; 
            }, respError => { this.error = respError });
        }
    } ;


    public editFData( id:number, index:number){
        //console.log( ' Edit F Data') ;
        this.initData() ;
        this.onclick(1, id, index) ;
        
        let data       = this.fData[index] ; 
        this.fEditFlag = true ; 
        this.editflag  = true ;
        this.name      = this.fData[index].name ;
        this.seq       = this.fData[index].seq  ; 
        this.crdr      = this.fData[index].crdr ;
        this.level     = this.fData[index].level;
        this.fId       = id ;  
    }

    public editSData( id:number, index:number){
        //console.log( ' Edit S Data') ;
        this.initData() ;
        this.onclick(2, id, index) ;
        
        let data       = this.sData[index] ; 
        this.sEditFlag = true ; 
        this.editflag  = true ;
        this.name      = this.sData[index].name ;
        this.seq       = this.sData[index].seq  ; 
        this.crdr      = this.sData[index].crdr ;
        this.level     = this.sData[index].level;
        this.sId       = id ;  
    }

   public editTData( id:number, index:number){
        //console.log( ' Edit T Data') ;
        this.initData() ;
        
        let data       = this.tData[index] ; 
        this.tEditFlag = true ; 
        this.editflag  = true ;
        this.name      = this.tData[index].name ;
        this.seq       = this.tData[index].seq  ; 
        this.crdr      = this.tData[index].crdr ;
        this.level     = this.tData[index].level;
        this.tId       = id ;  
    }


    public deleteFData( id:number, index:number){
       this.onclick(1, id, index) ;
       if (this.sData.length > 0 ) {
          alert( 'Child Level Exist for this record: '+ this.fData[index].name) ; 
          return ;
       }

       if (this.checkGl(id)) {
          alert( 'Ledger Defined for this record: '+ this.fData[index].name) ; 
          return ;
       }
       if ( confirm(' Do you want to delete '+ this.fData[index].name+'?') ){
          this.fData.splice(index,1) ; 
          this.deleteAllData(id);
          this._data.deleteData(this.table, id)
               .subscribe( respData => {

               }, respError => { this.error = respError }
               ) ;
        }   
    } ; 

   public deleteSData( id:number, index:number){
       this.onclick(2, id, index) ;
       if (this.tData.length > 0 ) {
          alert( 'Child Level Exists for this record: '+ this.sData[index].name) ; 
          return ;
       }
       if (this.checkGl(id)) {
          alert( 'Ledger Defined for this record: '+ this.sData[index].name) ; 
          return ;
  
       }
       
       if ( confirm(' Do you want to delete '+ this.sData[index].name+'?')) {
          this.sData.splice(index,1) ; 
          this.deleteAllData(id);
          this._data.deleteData(this.table, id)
               .subscribe( respData => {

               }, respError => { this.error = respError }
               ) ;
        }   
    } ; 

  public deleteTData( id:number, index:number){
      if (this.checkGl(id)) {
          alert( 'Ledger Defined for this record: '+ this.tData[index].name) ; 
          return ;
      }
 
       if ( confirm(' Do you want to delete '+ this.tData[index].name+'?')) {
          this.tData.splice(index,1) ; 
          this.deleteAllData(id);
          this._data.deleteData(this.table, id)
               .subscribe( respData => {

               }, respError => { this.error = respError }
               ) ;
        }   
    } ; 

   public crdrChange(value){
       console.log(value) ;
       this.crdr = value ;
   } 


}