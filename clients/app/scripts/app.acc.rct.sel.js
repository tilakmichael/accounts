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
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
var core_1 = require("@angular/core");
var app_data_services_1 = require("../service/app.data.services");
var app_common_service_1 = require("../service/app.common.service");
var AppAccRecSel = (function () {
    function AppAccRecSel(_actrout, _data, _common, _bldr, _route) {
        this._actrout = _actrout;
        this._data = _data;
        this._common = _common;
        this._bldr = _bldr;
        this._route = _route;
        this.error = [];
        this.allSlBookData = [];
        this.slBookData = [];
        this.payRecJv = this._actrout.snapshot.params['payRecJv'];
    }
    ;
    AppAccRecSel.prototype.ngOnInit = function () {
        var _this = this;
        this.orgId = this._common.getOrg();
        this.prdId = this._common.getPeriodId();
        this._data.getData('slbook')
            .subscribe(function (resp) {
            console.log('slbook ' + resp.length);
            _this.slBookData = resp.filter(function (_data) { return _data.orgid == _this.orgId && _data.type == 'LG'; });
            console.log(' slbook2 ' + _this.slBookData.length);
        }, function (error) { _this.error = error; });
    };
    ;
    AppAccRecSel.prototype.onChange = function (event) {
        console.log('sl code ' + this.slcode);
        if (this.slcode) {
            console.log(' moving to ' + this.payRecJv);
            this._route.navigateByUrl('recdoc/' + this.payRecJv + '/' + this.slcode);
        }
    };
    return AppAccRecSel;
}());
AppAccRecSel = __decorate([
    core_1.Component({
        selector: 'APP-REC-SEL',
        template: "<div>  \n     <div class=\"table-responsive\">\n       <div class=\"panel panel-default\">\n           <div class=\"panel-body\">\n                 <form class=\"form-horizontal\" #userform='ngForm'>\n                    <div class=\"form-group\">\n                         <label  class='control-label col-sm-2'>Accounts Book</label>\n                         <div class=\"col-sm-3\">\n                             <select [(ngModel)]=\"slcode\" (ngModelChange)='onChange($event)' name='slcode' required>\n                                <option *ngFor=\"let _data of slBookData\" [value]='_data.code'> {{_data.name}} </option>\n                             </select>\n                         </div>\n                    </div> \n\n                 </form>\n            </div>\n        </div>\n      </div>\n \n  </div>"
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute, app_data_services_1.AppDataService, app_common_service_1.AppCommonService, forms_1.FormBuilder, router_1.Router])
], AppAccRecSel);
exports.AppAccRecSel = AppAccRecSel;
//# sourceMappingURL=app.acc.rct.sel.js.map