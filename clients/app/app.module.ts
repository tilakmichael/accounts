import {NgModule} from  '@angular/core';
import {BrowserModule} from '@angular/platform-browser' ;
import { FormsModule, ReactiveFormsModule } from '@angular/forms' ;
import {HttpModule} from '@angular/http';
import {DatePipe, CurrencyPipe} from '@angular/common' ; 
//import {ModalModule} from 'ng2-bootstrap' ; 
//import { BootstrapModalModule } from 'ng2-bootstrap-modal';

//import {AppCommonService } from './service/app.common.service' ;
//import { AppDataService } from './service/app.data.services' ;  
import { MenuComponents, MenuRoutes} from './menus/app.router';

import {AppComponent} from './app.component' ;
import {AppMenus} from './menus/app.menus' ; 
import {AppAccOrgs} from './scripts/app.acc.orgs' ; 
import {AppAccHome } from './scripts/app.acc.home' ; 
import {AppAccOrgSelector } from './scripts/app.acc.org.select' ;
//import {AppAccLookups } from './scripts/app.acc.lookups' ; 
 
//import {AppAccPeriod} from './scripts/app.acc.period' ;
//import { AppAccSlBook} from './scripts/app.acc.slbook' ; 
//import { AppAccBook} from './scripts/app.acc.book' ; 
//import { AppAccSl} from './scripts/app.acc.sl' ; 

//import {AppAccTypeCrud} from './scripts/app.acc.type.crud' ;

@NgModule({
    imports: [BrowserModule, /*ModalModule.forRoot(), BootstrapModalModule,*/ FormsModule, ReactiveFormsModule, HttpModule ,  MenuRoutes] , 
    declarations:[AppComponent, AppMenus,AppAccHome ,AppAccOrgs, AppAccOrgSelector,MenuComponents /*,AppAccLookups,AppAccPeriod ,AppAccSlBook ,AppAccBook ,AppAccSl */  ] , 
    providers: [DatePipe,CurrencyPipe] ,
    //entryComponents: [ AppAccTypeCrud ],
    bootstrap: [AppComponent]
})

export class AppModule {} ;
