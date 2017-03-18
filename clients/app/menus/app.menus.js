"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var app_data_services_1 = require("../service/app.data.services");
var app_common_service_1 = require("../service/app.common.service");
var router_1 = require("@angular/router");
var AppMenus = (function () {
    function AppMenus(_data, _common, _router) {
        this._data = _data;
        this._common = _common;
        this._router = _router;
    }
    AppMenus.prototype.ngOnInit = function () {
        console.log('Menu entry');
        this.orgId = this._common.getOrg();
        if (!this.orgId || this.orgId === null) {
            // redirect to select org
            console.log('redirecting to Org Selector');
            //this._router.navigateByUrl('orgSelect') ;
        }
        this.orgName = this._common.getOrgName();
    };
    return AppMenus;
}());
AppMenus = __decorate([
    core_1.Component({
        selector: 'APP-MENU',
        templateUrl: '../app/menus/app.menus.html'
    }),
    __metadata("design:paramtypes", [app_data_services_1.AppDataService, app_common_service_1.AppCommonService, router_1.Router])
], AppMenus);
exports.AppMenus = AppMenus;
;
//# sourceMappingURL=app.menus.js.map