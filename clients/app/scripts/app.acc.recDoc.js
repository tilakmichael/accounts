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
var AppAccRecDoc = (function () {
    function AppAccRecDoc(_actrout, _data, _common, _bldr, _route) {
        this._actrout = _actrout;
        this._data = _data;
        this._common = _common;
        this._bldr = _bldr;
        this._route = _route;
        this.table = 'doc';
        this.allData = [];
        this.error = [];
        this.bookData = [];
        this.slBookData = [];
        this.editFlag = false;
        this.pager = {};
        this.emptyData = {};
        this.payRecJv = this._actrout.snapshot.params['payRecJv'];
        this.slcode = this._actrout.snapshot.params['code'];
        //alert(this.payRecJv +' / '+ this.slcode) ;
    }
    ;
    AppAccRecDoc.prototype.ngOnInit = function () {
        var _this = this;
        this.orgId = this._common.getOrg();
        this.prdId = this._common.getPeriodId();
        this.type = 'C';
        this.typeName = 'Payment';
        // receipt 
        if (this.payRecJv == 'R') {
            this.type = 'D';
            this.typeName = 'Receipt';
        }
        console.log('org id  ' + this.orgId);
        this._data.getData(this.table)
            .subscribe(function (resp) {
            _this.allData = resp.filter(function (_data) { return _data.orgid == _this.orgId && _data.code == _this.slcode && _data.type == _this.payRecJv; });
            _this.setPage(1);
        }, function (error) { _this.error = error; });
        this._data.getData('slbook')
            .subscribe(function (resp) {
            console.log('slbook ' + resp.length);
            _this.slBookData = resp.filter(function (_data) { return _data.orgid == _this.orgId && _data.type == 'LG' && _data.code == _this.slcode; });
            console.log(' slbook2 ' + _this.slBookData.length);
            if (_this.slBookData.length >= 0) {
                _this.lgrName = _this.slBookData[0].name;
                _this._common.setSlCode(_this.slcode);
                _this._common.setGlId(_this.slBookData[0].glid);
                _this._common.setGlName(_this.lgrName);
                console.log(' setting this.lgrName ' + _this.lgrName + ' / ' + _this.slBookData[0].glid);
            }
        }, function (error) { _this.error = error; });
    };
    ;
    AppAccRecDoc.prototype.editData = function (id, index) {
        console.log(' edit Data');
        this._common.setDoc(this.bookData[index]);
        this._route.navigateByUrl('recdet/' + id + '/' + this.slcode + '/' + this.payRecJv);
    };
    AppAccRecDoc.prototype.addData = function (id, index) {
        console.log(' add Data');
        this._route.navigateByUrl('recdet/' + -1 + '/' + this.slcode + '/' + this.payRecJv);
    };
    AppAccRecDoc.prototype.setPage = function (page) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.pager = this._common.getPager(this.allData.length, page);
        this.bookData = this.allData.slice(this.pager.startIndex, this.pager.endIndex + 1);
    };
    return AppAccRecDoc;
}());
AppAccRecDoc = __decorate([
    core_1.Component({
        selector: 'APP-RECDOC',
        templateUrl: 'app/views/app.acc.recDoc.html'
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute, app_data_services_1.AppDataService, app_common_service_1.AppCommonService, forms_1.FormBuilder, router_1.Router])
], AppAccRecDoc);
exports.AppAccRecDoc = AppAccRecDoc;
//# sourceMappingURL=app.acc.recDoc.js.map