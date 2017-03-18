import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';
import { AppDataService } from '../service/app.data.services';
import {AppCommonService} from '../service/app.common.service';


@Component({
    selector: "APP-LOOKUP",
    templateUrl: `app/views/app.acc.lookups.html`
})

export class AppAccLookups implements OnInit {
    public table:string =  'lookups' ;
    public allData = [];
    public lookData = [];
    public typeData = [];
    public error = [];
    public data: FormGroup;
    
    public name: string;
    public seq:number  ; 
    public refid:number ; 
    public seeded:string ;
    public type:string ; 

    public typeId:number;
    public typeName: string;
    public typeEditFlag: boolean = false;
    public typeEditIndex: number = undefined ;

    public lookEditFlag: boolean = false;
    public lookEditIndex: number =  undefined;
    public lookName: string;
    public lookId: number;

    public emptyData = {id:-1,name:'',seq:null, refid:null,seeded:'N',type:'' };

    constructor( private _data:AppDataService , private _common:AppCommonService ) { };

    ngOnInit() {
        this._data.getData(this.table )
            .subscribe(resp => {
            this.allData = resp ;
            this._common.log(resp) ; 
            if (this.allData.length > 0){
               this.typeData = this.allData.filter(data => { return data.type == "TYPE" });
               this.typeName = this.typeData[0].name;
               this.typeId     = this.typeData[0].id;
               this.lookData = this.allData.filter(data => { return data.type == "LOOK" && data.refid == this.typeId });
            }  
        }, error => {this.error = error  }) ;
    }


    public initData(){
       this.name  = undefined;
       this.seq   = undefined  ; 
       this.refid = undefined ;
       this.seeded= undefined ;
       this.type  = undefined ;
       this.error = [] ;
       this.emptyData = {id:-1,name:'',seq:null, refid:null,seeded:'N',type:'' };

    }

    public setData(doc:any){
       this.name  = doc.name  ;
       this.seq   = doc.seq  ; 
       this.refid = doc.refid  ;
       this.seeded= doc.seeded  ;
       this.type  = doc.type ;
    
    }

    
    public onTypeRowClick(id, index: number) {
        if (id) {
            if (!this.typeEditFlag) {
              this.typeId   = this.typeData[index].id;
              this.typeName = this.typeData[index].name;
              this.lookData = this.allData.filter(data => { return data.type=="LOOK" && data.refid==this.typeId });
            }
        }

    }

    public onLocRowClick(id , index: number) {
        if (id) {
            if ( !this.lookEditFlag) {
               this.lookId   = this.lookData[index].id;
               this.lookName = this.lookData[index].name;
            }
        }

    }


    public onTypeAdd() {
        this._common.log(' New Type') ;
        this.initData();
        let emptyTdata = this.emptyData ;
        emptyTdata.type = 'TYPE' ;
        emptyTdata.refid = undefined ;
        this.typeData.unshift(emptyTdata);
        
        this.typeEditFlag = true;
        this.typeEditIndex = -1;
        this.typeId = -1 ;
    }

    public onLookAdd() {
        this._common.log(' New Lookups') ;
        this.initData();
        let emptyLdata   = this.emptyData ;
        emptyLdata.type  = 'LOOK' ;
        emptyLdata.refid = this.typeId ;
        this.refid       = this.typeId ;
        this.typeId      = undefined ; 

        this.lookData.unshift(emptyLdata);
        this.typeEditFlag = true;
        this.lookEditFlag = true ;
        this.lookEditIndex = -1;
        this.lookId = -1 ;

        //console.log( ' look length ' + this.lookData.length) ; 
        //console.log( ' type length  ' + this.typeData.length) ; 
        
    }

   public onTypeCancel(id , index: number) {
        //console.log(' Cancell  ');
        this.typeEditFlag = false;
        this.typeEditIndex = -1;
        this.typeId = undefined ;
        this.name = undefined;
        this.initData();
        if (id == -1) {
            this.typeData.splice(index, 1);
        }
        
    }

    public onLookCancel(id , index: number) {
        console.log(' Cancell  ');
        this.lookEditFlag = false;
        this.typeEditFlag = false;
        this.lookEditIndex = -1;
        this.lookId   = undefined ;
        this.lookName = undefined;
        this.typeId   = this.lookData[index].refid ;
        this.initData();
        if (id == -1) {
            this.lookData.splice(index, 1);
        }
        
    }

    public onTypeEdit(id, index) {
        //console.log( ' Edit ' + index +' / '+ id) ;
        this.typeEditFlag = true;
        this.typeEditIndex = index;
        this.typeId = id ;
        this.typeName = this.typeData[index].name;
        this.setData(this.typeData[index]);
        console.log( ' Edit e ' + this.typeEditIndex + ' ' + this.typeEditFlag) ;

    }

    public onLookEdit(index) {
        //console.log( ' Edit ' + index) ;
        this.typeEditFlag = true;
        this.lookEditIndex = index;
        this.lookName = this.lookData[index].name;
        this.lookId   = this.lookData[index].id;
        this.setData(this.lookData[index]);
        this.typeId   = undefined ;
        //console.log( ' Edit ' + this.countEditIndex) ;

    }




    public onTypeDelete(id , index) {
        //console.log(' Delete  ' + id + "/" + index);
        this.typeEditFlag = false;
        this.typeEditIndex = -1;

        //if (id > 0) {
            this.onTypeRowClick(id, index);
            if (this.lookData.length > 0) {
                alert("You can not delete Type:" + this.name + " when you have Lookup Values. Please delete all Lookup Values!");
                this.name = undefined;
                return;
            }
            if (!confirm('Are sure you want to delete: ' + this.typeData[index].name + '?')) {
                return;
            }
            
            this._data.deleteData(this.table,  id).subscribe(respData => {
                //console.log("delete Response");
                //console.log(respData);
                this.typeData.splice(index, 1);
                this.typeId = undefined;
                this.initData() ;


            }, respError => { this.error = respError });

        //} else {
        //    this.counData.splice(index, 1);
        //}

    }


    public onLookDelete(id , index) {
        //console.log(' Delete  ' + id + "/" + index);
        this.typeEditFlag = false;
        this.lookEditIndex = -1;

        //if (id  != -1) {
            if (!confirm('Are sure you want to delete: ' + this.lookData[index].name + '?')) {
                return;
            }
                this.name = undefined;
                this._data.deleteData(this.table, id).subscribe(respData => {
                //console.log("delete Response");
                //console.log(respData);
                this.lookData.splice(index, 1);
                this.lookId = undefined;


            }, respError => { this.error = respError });

        //} else {
        //    console.log("Delete only memory!") ; 
        //    this.locData.splice(index, 1);
       // }

    }



    public onTypeSave(id , index: number) {
        //console.log(' Save  ');
        //console.log(" Name " + this.name);
        this.typeData[index].name = this.name;
        this.typeData[index].seeded='N';
        this.typeData[index].seq= null;
  
        let data = this.typeData[index];

        let dupid:number = this.findTypeName(this.name);
        //console.log(' dup id ' + dupid) ;
        if (dupid >= 0) {
            if (dupid != id) {
                alert("The name already exists, pls enter diferent name");
                return;
            }
        }
        this.typeEditFlag = false;
        this.typeEditIndex = -1;

        data.name = this.name;
        this.name = undefined;

        //console.log(data);

        if (id == -1) {
               // insert
               this._data.insertData(this.table, data).subscribe(respData => {
                //console.log("Insert Response");
                //console.log(respData.id);
                this.typeData[index].id = respData.id;
                data.id = respData.id 
                this.allData.push(data) ; 

            }, respError => { this.error = respError });
        } else {
            // update 
               this._data.updateData(this.table, data).subscribe(respData => {
                //console.log("Insert Response");
                //console.log(respData);
                // updata alldata
                this.updateAllData(data) ; 
            }, respError => { this.error = respError });
        }
    }


  public onLookSave(id , index: number) {
        //console.log(' Save  ');
        //console.log(" Name " + this.name);
        this.lookData[index].name   = this.name;
        this.lookData[index].seq    = this.seq;
        this.lookData[index].seeded ='N';
        let data                    = this.lookData[index];
        let dupid                   = this.findLookName(this.name , data.refid);
       
        //console.log(data);
        if (dupid >= 0) {
            if (dupid != id) {
                alert("The name already exists, pls enter diferent name");
                return;
            }
        }

        if (id == -1) {
            // insert
            this._data.insertData(this.table,  data).subscribe(respData => {
            //console.log("Insert Response");
            //console.log(respData.id);
            this.lookData[index].id = respData.id;
            data.id = respData.id;
            this.allData.push(data) ;
            //console.log(data);
            this.typeEditFlag = false ;
            this.lookEditFlag = false ;
            this.lookEditIndex= -1;
            this.typeId       = this.refid 

            this.initData();
                 
     
            }, respError => { this.error = respError });
        } else {

            // update 
            this._data.updateData(this.table, data).subscribe(respData => {
            //console.log("Insert Response");
            //console.log(respData);
            this.updateAllData(data) ;
            this.initData();
            this.typeEditFlag = false ;
            this.lookEditFlag = false ;
            this.lookEditIndex= -1;
            this.typeId       = this.refid 


            this.initData();
              
            }, respError => { this.error = respError });
        }
    
    }

    private findTypeName(name: string) {
        let id = -1;
        //console.log(' find name : '+name);
        let index = this.allData.findIndex(data => (data.name == name && data.type == 'TYPE') );
        if (index >= 0) {
            id = this.allData[index].id;
        }
        //console.log(id);
        return id;
    }

    private findLookName(name: string, refId ) {
        let id = -1;
        console.log(' find name : '+name +refId);
        let index = this.allData.findIndex(data => data.name == name && data.refid== refId);
        if (index >= 0) {
            id = this.allData[index].id;
        }
        return id;
    }

    private updateAllData(doc:any) {
        let idex= this.allData.findIndex(data => data.id == doc.id) ;
        if (idex != -1) {
           this.allData[idex] = doc ;  
        }
    }


}
