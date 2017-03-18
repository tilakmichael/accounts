import { Location } from '@angular/common';
import { Router,ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AppDataService } from '../service/app.data.services';
import {AppCommonService} from '../service/app.common.service';


@Component({
    selector:'APP-DOC-REC-DET`',
    templateUrl:'app/views/app.acc.dockdet.html'
})

export class AppAccRecDocDets implements OnInit{
    public table:string = 'docdet' ;
    public error=[] ;
    public doc:string ; 
    public formDatas:FormGroup ;
    public detData:FormGroup ; 
    public detRows=[] ;
    public allDetRows=[] ;
    public allDocRows=[] ; 
    //public emptyDoc={} ;
    public pager:any={};
    public editFlag = false ;
    public detRowFlag = false ; 
    public editId:number   = undefined ;
    public orgId:number    = undefined ;
    public prdId:number    = undefined;
    public glId    = undefined ;
    public lgrname = undefined ;
    public crdr    = 'D' ; 
    public hcrdr  = 'C' ;
    public type:string ;
    public typeName:string ;
    public docnotready:boolean = true ;
    public docId:number ;
    public slcode:string ;
    public emptyHDoc= {id:-1,code:null,docno:null,docdate:null,orgid:null,prdid:null,refno:null,refdate:null,describ:null,amount:null,status:null, type:null} ;
    public emptyData = {id:-1,docid:1,glid:null,slid:null,describ:null,amount:null,crdr:null, orgid:null} ;

    public allgl = [] ; 
    public glrows = [] ; 
    public allsl  = [] ; 
    public slrows = [] ; 
    public slglrows   = [] ;
    constructor( private _data:AppDataService , private _common:AppCommonService , private _bldr:FormBuilder, private _route:Router, private _actrout:ActivatedRoute, private _loc:Location) { 
       this.docId  =   this._actrout.snapshot.params['id'] ;
       this.slcode =   this._actrout.snapshot.params['code'] ;
       this.type   =   this._actrout.snapshot.params['type']
       console.log(this.docId + ' / '+ this.slcode + ' / ' + this.type);
    };

    ngOnInit(){
       this.initSetup() ; 
       if (this.docId >= 0) {
            this.docnotready = false ; 
            this._data.getData('docdet/'+this.docId )
            .subscribe(resp => {
                 this.allDocRows = resp.map( (_obj) => _obj) ;
                 this.allDetRows = this.allDocRows.filter(_data => _data.glid != this.glId) ;
                 this._common.log(resp) ; 
                 this.setPage(1) ;
                 this.sumDetData() ;
                 this.detRowFlag = (this.allDetRows.length>0) ; 
                 console.log('det row length'+this.detRows.length);
            }, error => {this.error = error  }) ;
       } ; 
       // get allgl anf glrows
       console.log('get gl' + this.orgId);
       this._data.getData('gl'  )
            .subscribe(resp => {
               this.allgl = resp ;
               console.log('get gl count ' + this.allgl.length);
               this.glrows = this.allgl.filter(_data =>  _data.orgid == this.orgId && _data.id !== this.glId ) ;
               console.log('get gl count ' + this.glrows.length);
       }, error => {this.error = error  }) ;

       // get allgl anf glrows
       console.log('get sl') ; 
       this._data.getData('sl' )
            .subscribe(resp => {
               this.allsl = resp ;
                console.log('get sl count ' + this.allsl.length);
               this.slrows = this.allsl.filter(_data => _data.orgid == this.orgId ) ;
               console.log('get sl count ' + this.slrows.length);
       }, error => {this.error = error  }) ;
    }


 onCancel(){
    console.log('cancel data') ; 
    this.editFlag = false ;
    this.editId   = undefined;
    if (this.docId > 0) {
      this.adddHeadr(false , this.docId);
    }
    this._loc.back() ;    
 }

 initSetup() {
       console.log(' initsetup  ' + this.docId);
       this.orgId    = this._common.getOrg() ;
       this.prdId    = this._common.getPeriodId() ;
       this.typeName = 'Payment';
       if (this.type == 'R'){
          this.hcrdr    = 'D' ;
          this.crdr     = 'C' ;
          this.typeName = 'Receipt' ;
       }

       
       if (this.docId < 0) {
          let eDoc    = this.emptyHDoc ; 
          eDoc.type   = this.type  ;
          eDoc.code   = this.slcode;
          eDoc.orgid  = this.orgId ;
          eDoc.prdid  = this.prdId ;
          eDoc.docdate= this._common.sqlDt2Jdt(new Date()) ;
          this.formDatas =  this._bldr.group(eDoc);
       }else {
           let eDoc = this._common.getDoc() ; 
           this.formDatas       =  this._bldr.group(eDoc);
           this.formDatas.controls['docdate'].setValue( this._common.sqlDt2Jdt(eDoc['docdate']) ) ;   
           this.formDatas.controls['refdate'].setValue( this._common.sqlDt2Jdt(eDoc['refdate']) ) ;
           console.log(eDoc) ;
           this._common.setDoc({}) ;
      }
       
       //console.log(' sl code' + eDoc['code'] + ' / '+ this.slcode) ;

       if (this.slcode !== null && this.slcode !== undefined) {
        
            if (this.slcode == this._common.getSlCode()) {
               this.lgrname = this._common.getGlName() ; 
               this.glId   =  this._common.getGlId()
            }
            if (!this.glId) {
                alert ('An Issue Found, please contact Admin!')
                this._common.setSlCode(null) ;
                this._common.setGlId(null) ; 
                this._common.setGlName(null) ; 
      
            }
   
      }
 }

 glChange( _event) {
   console.log('gl chnge ' , _event) ; 
   this.initGlSl(_event);
 }

 initGlSl(glId:number) {
   console.log('initglsl');   
   let idx = this._common.findIndex(this.glrows, 'id=='+glId) ;
   if (idx >= 0) {
      let bookledger = this.glrows[idx].bookledger ;
      console.log('SL Code '+ bookledger) ;  
      if (bookledger == 'SL') {
          console.log ('sl rwos' + this.slrows.length ) ;
          this.slglrows = this.slrows.filter(_data =>  _data.glid==glId );
          console.log ('sl ros' + this.slglrows.length ) ;
      }else {
          this.slglrows=[] ; 
      }
   } 
  }


 initData(newData:boolean, doc:any){
    console.log('init data') ;
    console.log('alldocrec ' +  this.allDocRows.length ) ; 
    console.log(this.allDocRows);
     
    this.editFlag         = true ;
    this.editId           = -1;
    this.emptyData.id     = -1 ;
    this.emptyData.orgid  = this.formDatas.controls['orgid'].value ;
    this.emptyData.docid  = this.formDatas.controls['id'].value ;
    this.emptyData.crdr   = this.crdr ;
    this.emptyData.glid   = null  ;  
    this.emptyData.amount =  0 ; 
    this.emptyData.describ= null ;
    //if (this.formDatas.controls['crdr'].value  == 'C' ) {
    //   this.emptyData.crdr = 'D' ;
    //}

    this.detData = this._bldr.group(this.emptyData )
    if (!newData && doc ){
        console.log('edit data'); 
       this.editId   = doc.id ;
       this.detData = this._bldr.group(doc );
       this.initGlSl(doc.glid) ; 
       
    }
 }   


 adddHeadr(insertFlag:boolean , id:number) {
    console.log('addheader') ;
    let sum = 0  ; 
    if (!insertFlag) {
       console.log('alldocrec ' +  this.allDocRows.length ) ; 
       console.log(this.allDocRows);
       let idx = this._common.findIndex(this.allDocRows , 'glid==='+this.glId) ;
       if (idx >= 0 ) {
           for (let x in this.allDetRows ) {
                console.log(x) ; 
                console.log(this.allDetRows[x].amount); 
                 sum += this.allDetRows[x].amount;
           } 
           console.log('updating  header '+sum) ;
           if (this.allDocRows[idx].amount != sum ) {

              this.allDocRows[idx].amount = sum ; 
              this._data.updateData('docdet', this.allDocRows[idx]).subscribe(respData => {
               }, respError => { this.error = respError } );
 
               this._data.updateData('doc', this.formDatas.value ).subscribe(respData => {
               }, respError => { this.error = respError } );
       }
          
    }
  
    return ;

    }
    console.log('insert header  ' + sum) ;
    let data   = this.emptyData  ; 
    data.glid  = this.glId  ; 
    data.crdr  = this.hcrdr ; 
    data.docid =  id 
    data.orgid = this.orgId ;
    data.amount= sum ; 
    data.describ= 'Paid Amount in Doc:' +this.formDatas.controls['code'].value +'-'+this.formDatas.controls['docno'].value;
    this._data.insertData('docdet', data ).subscribe(respData => {
             data.id = respData.id ; 
             this.allDocRows.push(  JSON.parse(JSON.stringify(data) )) ;

             console.log('alldocrec ' +  this.allDocRows.length ) ; 
             console.log(this.allDocRows);

  
    }, respError => { this.error = respError });
  
      console.log('alldocrec ' +  this.allDocRows.length ) ; 
      console.log(this.allDocRows);

    console.log('end of  header');        
 }

sumDetData(){
    console.log('sum data ' + this.allDetRows.length) ;
    if (this.allDetRows.length > 0 ) { 
       if (this.allDetRows.length > 1 ) {  
          let sum = 0 ;
           for (let x in this.allDetRows ) {
                console.log(x) ; 
                console.log(this.allDetRows[x].amount); 
                 sum += this.allDetRows[x].amount;
           } 
           this.formDatas.controls['amount'].setValue(sum) ;   
       }else {
          console.log('sum data 2 ' + this.allDetRows[0].amount ) ;
          this.formDatas.controls['amount'].setValue(this.allDetRows[0].amount)  ; 
       } 
       console.log('sum data 2 ' + this.formDatas.controls['amount'].value ) ;
       if (this.allDetRows.length > 10 ) {
          this.setPage(this.pager.curentPage)
       }
 
    }  
}
 
addDetData() {
    console.log('Add Data') ; 
    this.initData(true, null) ; 
    this.detRows.unshift(this.emptyData) ;
}

deleteDetData(id:number, index:number) {
       if (confirm( "Delete this detail? ")) {
          this._data.deleteData(this.table, id).subscribe(resp => {
               this._common.log( resp ) ;
               if (resp.affectedRows >= 1) { 
                  this.detRows.splice(index, 1);
                  let indx = this._common.findIndex(this.allDetRows, 'id=='+id ) ; 
                  if (indx >= 0 ) {
                      this.allDetRows.splice(indx, 1) ;
                  }

                  indx = this._common.findIndex(this.allDocRows, 'id=='+id ) ; 
                  if (indx >= 0 ) {
                      this.allDocRows.splice(indx, 1) ;
                  }

                  console.log('alldocrec ' +  this.allDocRows.length ) ; 
                  console.log(this.allDocRows);

                  this.sumDetData() ;
               }     
               this.detRowFlag = (this.allDetRows.length>0) ;     
                                
           }, error => this.error = error  )
       }   
}


deleteData(id:number) {
       id = id|this.docId ;
       if (this.allDetRows.length > 0) {
           alert('Please Delete the details information') ; 
           return ; 
       }
       if (confirm( "Delete this Document? ")) {
          let idx = this._common.findIndex(this.allDocRows, 'glid=='+this.glId) ; 
          if (idx >= 0 ) {
               this._data.deleteData(this.table, this.allDocRows[idx].id).subscribe(resp => {
          }, error => this.error = error  )
         }

         this._data.deleteData('doc', id).subscribe(resp => {
          }, error => this.error = error  )

         this._loc.back() ;     
      
      }


}

editDetData(id:number, index:number) {
    console.log(' Data') ; 
    this.initData(false, this.detRows[index]) ;

           console.log('alldocrec ' +  this.allDocRows.length ) ; 
       console.log(this.allDocRows);
 

}

onDetCancel(id, index){
    console.log('cancel data') ; 
    this.editFlag = false ;
    this.editId   = undefined;
    if (id==-1){ 
       this.detRows.splice(index, 1);
    }
}


saveData(){
       console.log(' insert data  ' ) ; 
       let data    =  this.formDatas.value ;
       let docid   = data.id ; 
       console.log(' insert data  ' + docid) ;
       if (docid < 0  ) {
           console.log('insert doc') ; 
           this._data.insertData('doc', data).subscribe(respData => {
                data.id = respData.id ; 
                this.formDatas.controls['id'].setValue(data.id) ;
                this.adddHeadr(true , data.id) 
                this.docId = data.id ;
                this.docnotready = false ;
                 
            }, respError => { this.error = respError });
      }else {
          console.log('update data') ;
          this._data.updateData('doc', data).subscribe(respData => {
              this.adddHeadr(false , data.id)
              
          }, respError => { this.error = respError });
      }


  };



saveDetData(id, index){
      console.log('insert det doc') ;  
       let data    =  this.formDatas.value ;
       let detData =  this.detData.value ; 
       let docid   = data.id ; 

       if (docid < 0  ) {
           alert('please save the document first') ;
           return ; 
    //        console.log('insert doc'  ) ;
    //        if (!this.formDatas.valid) {
    //          alert('Please make sure docment required data are entered ') ; 
    //          return ; 
    //        } 
    //        this._data.insertData('doc', data).subscribe(respData => {
    //             data.id = respData.id ; 
    //             this.formDatas.controls['id'].setValue(data.id) ;
    //             this.adddHeadr(true , data.id) 
    //         }, respError => { this.error = respError });
            
        }
       
       console.log(' Save  ' + id + "/" +data.id +' / ' + index);
        //console.log(' dup id ' + dupid) ;
      
       if (id == -1) {
           console.log('insert data') ;
           console.log( detData  ) ;
           
           //this.glData[index].orgid = this.orgId ;
               // insert
            this._data.insertData(this.table, detData).subscribe(respData => {
            this.detRows[index]     = detData ;
            this.detRows[index].id  = respData.id;
            
            this.allDetRows.push(this.detRows[index]) ;
            this.allDocRows.push(this.detRows[index]) ;
            this.detRowFlag = (this.allDetRows.length>0) ;
            this.sumDetData() ;
      
            }, respError => { this.error = respError });
                   
        } else {
               console.log('update data') ;
               this._data.updateData(this.table, detData).subscribe(respData => {
               this.detRows[index]   = detData ; 
               let alidx = this._common.findIndex( this.allDetRows, 'id == '+id ) ;
               console.log('update all data ' + alidx) ; 
               if (alidx >= 0) {
                    this.allDetRows[alidx] = detData ;
                    console.log( this.allDetRows[alidx] ) ;
                    this.sumDetData() ;
              }   
              //this.updateGlData(data) ;
            }, respError => { this.error = respError });
        }
        this.onDetCancel(-2,-2) ;

       console.log('alldocrec ' +  this.allDocRows.length ) ; 
       console.log(this.allDocRows);

  };



setPage(page:number){
    if ( page < 1 || page > this.pager.totalPages){
        return ;
    }
      this.pager = this._common.getPager(this.allDetRows.length, page,5);
      this.detRows= this.allDetRows.slice(this.pager.startIndex, this.pager.endIndex+1)

      console.log(this.detRows[0]) ;
}


}    

