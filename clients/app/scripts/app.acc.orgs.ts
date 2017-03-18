import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms' ;
import {AppCommonService} from '../service/app.common.service';
import {AppDataService} from '../service/app.data.services' ;  

@Component({
    selector:'APP-ORGS' , 
    templateUrl : 'app/views/app.acc.orgs.html'
})

export class AppAccOrgs implements OnInit{
    public table:string =  'orgs' ;
    public allData =[] ; 
    public error = [] ;
    public prdData=[] ;
    public data:FormGroup ; 
    public addDataFlag:boolean = true ;
    public editFlag:boolean = false ; 
    public editId:number = undefined ;
    public emptyData = {id:-1,name:'',address1:'', address2:'',city:'',state:'',country:'', postal:'',phone:'',email:'',web:'' };
    public name:string  ;
    public address1:string ; 
    public address2:string ; 
    public city:string ; 
    public state:string ; 
    public country:string ; 
    public postal:string ;
    public phone:string ;
    public email:string;
    public web:string;

    constructor(private _data:AppDataService , private _common:AppCommonService ){} ; 
    ngOnInit(){
         this._data.getData(this.table )
              .subscribe(resp => {
                this.allData = resp ;
                if (this.allData.length >= 3) {
                   this.addDataFlag = false ;
                }
                this._common.log(resp) ;   
              }, error => {this.error = error  }) ;

         this._data.getData('period' )
              .subscribe(resp => {
                this.prdData = resp ;
              }, error => {this.error = error  }) ;
 

    }

    cancellData(id:number, index:number){
         this.editFlag = false ; 
         this.editId   = undefined ;
         if (id===-1){
            this.allData.splice(index, 1);      
         }
    }

    setdata(initFlag:string , data){
      initFlag = initFlag || 'N' ; 
      
      this.name     = undefined     ; 
      this.address1 = undefined     ; 
      this.address2 = undefined     ; 
      this.city     = undefined     ; 
      this.state    = undefined     ;
      this.country  = undefined     ; 
      this.phone    = undefined     ; 
      this.email    = undefined     ; 
      this.web      = undefined     ;
      this.postal   = undefined     ;   

      if (initFlag == 'Y' ) {
        this.name     = data.name     ; 
        this.address1 = data.address1 ; 
        this.address2 = data.address2 ; 
        this.city     = data.city     ; 
        this.state    = data.state    ;
        this.country  = data.country  ; 
        this.phone    = data.phone    ; 
        this.email    = data.email    ; 
        this.web      = data.web      ;   
        this.postal   = data.postal   ;
      }

    }



    saveData(id:number, index:number) {
        if (!this.name || this.name == undefined || this.name == null ){
           alert('Not enough data to save the document') ;
           return ;             
        }

        let data = this.allData[index] ;
        data.name = this.name ; 
        data.address1 = this.address1 ; 
        data.address2 = this.address2 ; 
        data.city     = this.city ; 
        data.state    = this.state ;
        data.country  = this.country ; 
        data.phone    = this.phone ; 
        data.email    = this.email ; 
        data.web      = this.web ;   
        data.postal   = this.postal ;
        
        if (id == -1) {
          this._common.log('Insert ' ) ;
          // insert
          this._data.insertData(this.table, data).subscribe(resp => {
               this._common.log(resp) ;
               
               if (resp.id) {
                  data.id = resp.id ; 
                  this.allData[index] = data ;
                  this.editFlag = false ; 
                  this.editId   = undefined ;
                  this.addDataFlag = !(this.allData.length >= 3) ;
                }
  
               
          }, error => this.error = error) ; 

        }else{
          // update  
          this._common.log( 'Update ' ) ;
          this._data.updateData(this.table, data).subscribe(resp => {
               this._common.log(resp) ;
               this.addData[index] = data ;
               this.editFlag = false ; 
               this.editId   = undefined ;

           }, error => this.error = error) ; 

        } 
      
        
    }
    addData() {
         this.editFlag = true ; 
         this.editId   = -1
         this.allData.unshift(this.emptyData);
         this.setdata('N' , {});
    }

    editData(id:number, index:number) {
         this._common.log(id + ' / ' + index) ; 
         this.editFlag = true ; 
         this.editId   = id ;
         this.setdata('Y' , this.allData[index]);    
    }

    private checkChild(id:number) {
      this._common.log( 'check child ' + id ) ; 
      let retval:boolean = false ;
      let index = this._common.findIndex(this.prdData, 'orgid=='+id) ;
      this._common.log( index ) ;

      if ( index  >= 0 ) {
         retval = true ; 
      }

      return retval ; 
    }

    deleteData(id:number, index:number) {
       if (this.checkChild(id) ) {
          alert('Period Exist for this Organization. Deletion is not allowed')
          return ;
       } 
       
       this._data.deleteData(this.table, id).subscribe(resp => {
            this._common.log( resp ) ;
            if (resp.affectedRows >= 1) { 
               this.allData.splice(index, 1);
               this.addDataFlag = !(this.allData.length >= 3) ;
            }                      
       }, error => this.error = error  )
         
    }
 



}