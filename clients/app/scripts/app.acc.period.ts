import {Component , OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms' ;
import { AppDataService } from '../service/app.data.services';
import {AppCommonService} from '../service/app.common.service';

@Component({
    selector:'ACC-PERD',
    templateUrl:'app/views/app.acc.period.html'
})

export class AppAccPeriod implements OnInit{
    public table:string =  'period' ;
    public allData =[] ; 
    public periodData = [] ;
    public docData = [] ;
    public error = [] ;
    public data:FormGroup ; 
    public editFlag:boolean = false ; 
    public editId:number = undefined ;d
    public emptyData = {id:-1,startdt:Date, enddt:Date,orgid:null,status:'O'};
    public orgid:number     ;
    public startdt   ; 
    public enddt      ; 
    public status:string    ;

    constructor( private _data:AppDataService, private _common:AppCommonService){} 
    ngOnInit(){
          this.orgid = this._common.getOrg();
          if (!this.orgid || this.orgid==null || this.orgid==undefined){
            this.editFlag = true ;
          }  

          this._data.getData(this.table )
              .subscribe(resp => {
                this.allData = resp ;
                 if (this.allData.length > 0){
                     this.periodData = this.allData.filter(data => data.orgid == this.orgid)

                 }
                this._common.log(resp) ;   
          }, error => {this.error = error  }) ;

          this._data.getData('doc' )
              .subscribe(resp => {
                this.docData = resp.filter(data => data.orgid == this.orgid)
                this._common.log(resp) ;   
          }, error => {this.error = error  }) ;

    }

     checkDups(id:number, startdt:Date, enddt:Date){
         let index = this.periodData.findIndex(doc => doc.id != id && (doc.startdt <= enddt && doc.enddt >= startdt  ) && doc.orgid == this.orgid )
         return index ;
     }
     cancellData(id:number, index:number){
         this.editFlag = false ; 
         this.editId   = undefined ;
         if (id===-1){
            this.periodData.splice(index, 1);      
         }
    }


   initdata(initFlag:string , doc){
      console.log(initFlag) ;
      this.startdt       = undefined     ; 
      this.enddt         = undefined     ; 
      this.status        = 'O'     ; 
      
      if (initFlag == 'Y' ) {
         console.log(doc) ; 
         this.startdt  = this._common.sqlDt2Jdt(doc.startdt)  ; 
         this.enddt    =  this._common.sqlDt2Jdt(doc.enddt)      ; 
         this.status   = doc.status   ; 
         console.log(this.startdt , this.enddt ) ; 
      }
   }


   saveData(id:number, index:number) {
        if (!this.startdt || this.startdt == undefined || this.startdt == null ){
           alert('Not enough data to save the document') ;
           return ;             
        }
        if (!this.enddt || this.enddt == undefined || this.enddt == null ){
           alert('Not enough data to save the document') ;
           return ;             
        }
        if (this.enddt <= this.startdt){
           alert('End date must be greater than start date!') ;
           return ;             
        }

        let indx = this.checkDups(id,this.startdt, this.enddt ) ; 
        if (indx > 0 ) { 
            alert('The date already exist ') ; 
            return ; 
        }
        let data = this.periodData[index] ;
        data.startdt  = this.startdt ; 
        data.enddt    = this.enddt   ; 
        data.status   = this.status  ; 
        console.log(data) ; 
        if (id == -1) {
           this._common.log('Insert ' ) ;
           // insert
           this._data.insertData(this.table, data).subscribe(resp => {
               this._common.log(resp) ;
               
               if (resp.id) {
                   data.id = resp.id ; 
                   this.periodData[index] = data ;
                   this.editFlag = false ; 
                   this.editId   = undefined ;
                }
          }, error => this.error = error) ; 

        }else{
          // update  
          this._common.log( 'Update ' ) ;
          this._data.updateData(this.table, data).subscribe(resp => {
               this._common.log(resp) ;
               this.periodData[index] = data ;
               this.editFlag = false ; 
               this.editId   = undefined ;
           }, error => this.error = error) ; 
        } 
  };



  addData() {
         console.log('Add Data') ;
         this.initdata('N', null) ;
         this.editFlag = true ; 
         this.editId   = -1
         this.emptyData.orgid = this.orgid ;  
         this.periodData.unshift(this.emptyData);
          
    }

    editData(id:number, index:number) {
         this.initdata('Y' , this.periodData[index]);
         this._common.log(id + ' / ' + index) ; 
         this.editFlag = true ; 
         this.editId   = id ;

         console.log(this.startdt) ; 
         
         console.log('end dt ') ;  
         console.log( this.enddt ) ; 
    }

    private checkDoc(id:number):boolean{
        let retval:boolean = false ; 
        let idx = this._common.findIndex(this.docData, 'prdid=='+id) ; 
        if (idx >= 0){
           retval = true;
        }
        return retval ; 
    }

    deleteData(id:number, index:number) {
       if (this.checkDoc(id)){
          alert( 'Document exists fpr this period') ;
          return 
       }
       if (confirm( "Delete this period? ")) {
          this._data.deleteData(this.table, id).subscribe(resp => {
               this._common.log( resp ) ;
               if (resp.affectedRows >= 1) { 
                  this.periodData.splice(index, 1);
               }                      
           }, error => this.error = error  )
       }   
    }
 
   periodChange(date:Date) {
       if (this.enddt == undefined && date) {
          //this.enddt = (date.to) ;
          //alert(date) ; 
       }
   }

   goHome(){
      this._common.goHome() ;
    }


}

