import { Component } from '@angular/core';
import { AppCommonService} from './service/app.common.service' ; ; 
import {AppDataService} from './service/app.data.services' ;   

@Component({
  selector: 'my-app',
  template: `<div class='container'> 
                 <div>
                    <APP-MENU> </APP-MENU>
                 </div>   
             </div>
             ` , 
  providers: [AppCommonService, AppDataService]
})
export class AppComponent { };