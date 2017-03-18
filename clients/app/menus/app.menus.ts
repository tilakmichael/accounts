import {Component, OnInit} from '@angular/core' ;
import {MenuRoutes} from './app.router' ; 
import {AppAccHome} from '../scripts/app.acc.home' ; 
import {AppAccOrgs} from '../scripts/app.acc.orgs' ; 
import {AppAccTypes} from '../scripts/app.acc.types' ; 
import {AppAccOrgSelector } from '../scripts/app.acc.org.select' ; 

import { AppDataService } from '../service/app.data.services';
import {AppCommonService} from '../service/app.common.service';
import {Router} from '@angular/router';


@Component({
    selector:'APP-MENU'  ,
    templateUrl : '../app/menus/app.menus.html'
})

export class AppMenus  implements OnInit{
    public orgName:string ;
    public orgId:number ;
    public periodId:number ; 
    public startDt:Date ; 
    public endDt:Date  ; 
    
    constructor( private _data:AppDataService, private _common:AppCommonService, private _router:Router){   
    }
    ngOnInit(){
        console.log('Menu entry') ;
        this.orgId = this._common.getOrg() ; 
        if (!this.orgId || this.orgId === null)  {
           // redirect to select org
           console.log('redirecting to Org Selector') ;
           //this._router.navigateByUrl('orgSelect') ;
        }
        this.orgName = this._common.getOrgName() ;
    }
      
};
