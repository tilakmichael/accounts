import { Http, Headers, Response} from '@angular/http' ;
import { Injectable } from '@angular/core' ; 
import { Observable } from 'rxjs/Observable' ; 
import { AppCommonService   } from './app.common.service';

import 'rxjs/add/operator/map' ;
import 'rxjs/add/operator/catch' ;
import 'rxjs/add/Observable/throw' ;

@Injectable()
export class AppDataService {
   constructor(private _http:Http , private _common:AppCommonService ){};
   //public url:String = "http://localhost:3000/api/"; 
   public url:String = "/";
   getData(table:String){
       let url = this.getUrl(table) ; 
        return this._http.get(url )
           .map( (resp:Response) => resp.json() ) 
           .catch( (error:Response )=> {
               console.error(error) ;
               return Observable.throw(error);
           })  ;  
   } ;

insertData(table:String, data:any){
       let url = this.getUrl(table) ; 
       var header = new Headers() ; 
       header.append('content-type', 'application/json') ; 
       return this._http.post(url, JSON.stringify(data), {headers:header} )
           .map( (resp:Response) => resp.json() ) 
           .catch( (error:Response )=> {
               console.error(error) ;
               return Observable.throw(error);
           })  ;  
   } ;

updateData(table:String, data:any){
       let url = this.getUrl(table) ; 
       var header = new Headers() ; 
       header.append('content-type', 'application/json') ; 
       return this._http.put(url, JSON.stringify(data), {headers:header} )
           .map( (resp:Response) => resp.json() ) 
           .catch( (error:Response )=> {
               console.error(error) ;
               return Observable.throw(error);
           })  ;  
   } ;

deleteData(table:String, id:any){
       let url = this.getUrl(table) ;
       url = url+'/'+id ; 
       var header = new Headers() ; 
       header.append('content-type', 'application/json') ; 
       return this._http.delete(url )
           .map( (resp:Response) => resp.json() ) 
           .catch( (error:Response )=> {
               console.error(error) ;
               return Observable.throw(error);
           })  ;  
   } ;



getUrl(table) {
      let url = this._common.getUrl() ;
      this._common.log(url) ;
      console.log(url+table) ; 
      return url+table ;    
   } ;

}
