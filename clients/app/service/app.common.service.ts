import { Router } from '@angular/router';
import { Injectable } from '@angular/core' ;
import { Observable } from 'rxjs/Observable' ;
import {DatePipe} from '@angular/common' ;

@Injectable()
export class AppCommonService {
   //public url:string = "http://localhost:3000/api/acc/v1/";
   public url:string = "/api/acc/v1/";
   private orgId:number ;
   private orgName:string ;

   private periodiId:number= undefined ;
   private startDt:Date    = undefined ;
   private endDt:Date      = undefined  ;
   private doc={}
   private glid:number ;
   private glName:string ;
   private slCode:string ;

   constructor(private _date:DatePipe , private _router:Router) {}

   range(start, count){
       return Array.apply(0, Array(count))
          .map( function (element, index){
              return (index+start) ;
          });
   }

  public getOrg() {
      return this.orgId ;
  }

  public setOrg(id:number) {
      this.orgId = id ;
  }

  public getOrgName() {
      return this.orgName ;
  }

  public setOrgName(name:string) {
      this.orgName = name ;
  }

  public getPeriodId() {
      return this.periodiId ;
  }

  public setPeriodId(id:number){
    this.periodiId = id ;
  }
  public getstartDt(){
      return this.startDt ;
  }
  public setStatDt(date:Date){
      this.startDt = date ;
  }
  public getEndDt() {
      return this.endDt ;
  }
  public setEndDt(date:Date){
      this.endDt=date ;
  }

  public goHome() {
      this._router.navigateByUrl('') ;
  }

  public sqlDt2Jdt(date:Date) {

      if (date == null || date==undefined || !date) {
          return ;
      }
      var jsDate  = this._date.transform(date, 'yyyy-MM-dd');
      console.log(jsDate) ;
      return jsDate ;

  }


   public getPager(totalItems:number, currentPage:number=1, pageSize:number=10 ){
        let totalPages = Math.ceil(totalItems/ pageSize) ;
        let startPage:number, endPage:number ;
        if (totalPages <= 10){
           startPage = 1 ;
           endPage   = totalPages ;
        }else {
           if (currentPage <= 6){
               startPage = 1 ;
               endPage = 6 ;
           }else if (currentPage+4 >= totalPages){
               startPage = totalPages-9 ;
               endPage = 10 ;

           }else {
               startPage = currentPage-5 ;
               endPage = currentPage+4 ;
           }
        }
        let startIndex = (currentPage-1)* pageSize ;
        let endIndex   = Math.min(startIndex+pageSize-1, totalItems-1) ;
        let pages = this.range(startPage,endPage) ;

        return {
            totalItems:totalItems ,
            currentPage:currentPage,
            totalPages:totalPages ,
            startPage:startPage ,
            endPage:endPage ,
            startIndex: startIndex,
            endIndex: endIndex ,
            pages:pages
        }
   }


 public findIndex(doc, filter:string ){
   console.log('filter : ' +  filter) ;
   filter = '_doc.'+filter.trim() ;
   console.log(filter) ;

   let index = doc.findIndex(_doc =>   eval(filter) ) ;
   console.log( 'fndindex' + index) ;
   return index ;
 }



   public getUrl() {
       return this.url ;
   } ;


   public setDoc(doc){
       this.doc = doc ;
   }

   public getDoc(){
       return this.doc ;
   }

   public log(msg) {
     console.log(msg) ;
    } ;

    public getSlCode() {
        return this.slCode ;
    }

    public getGlId() {
        return this.glid ;
    }

    public getGlName() {
        return this.glName ;
    }

     public setSlCode(slCode:string) {
        return this.slCode = slCode;
    }

    public setGlId(glId:number) {
        this.glid = glId;
    }

    public setGlName(glName:string) {
        this.glName = glName ;
    }


}
