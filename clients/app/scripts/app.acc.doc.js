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
var AppAccDocs = (function () {
    function AppAccDocs(_data, _common, _bldr, _route) {
        this._data = _data;
        this._common = _common;
        this._bldr = _bldr;
        this._route = _route;
        this.table = 'doc';
        this.allData = [];
        this.error = [];
        this.bookData = [];
        //public allBookData=[] ;
        this.allSlBookData = [];
        this.slBookData = [];
        this.editFlag = false;
        this.emptyData = { id: -1, code: null, docno: null, docdate: null, orgid: null, prdid: null, refno: null, refdate: null, describ: null, amount: null, status: null, type: 'P' };
        this.pager = {};
    }
    ;
    AppAccDocs.prototype.ngOnInit = function () {
        var _this = this;
        this.orgId = this._common.getOrg();
        this.prdId = this._common.getPeriodId();
        console.log('org id  ' + this.orgId);
        this._data.getData(this.table)
            .subscribe(function (resp) {
            _this.allData = resp;
            _this._common.log(resp);
        }, function (error) { _this.error = error; });
        this._data.getData('slbook')
            .subscribe(function (resp) {
            console.log('slbook ' + resp.length);
            _this.slBookData = resp.filter(function (_data) { return _data.orgid == _this.orgId && _data.type == 'LG'; });
            console.log(' slbook2 ' + _this.slBookData.length);
        }, function (error) { _this.error = error; });
    };
    ;
    AppAccDocs.prototype.addData = function () {
        console.log('Add Data');
        this.emptyData.orgid = this.orgId;
        this.emptyData.prdid = this.prdId;
        this.emptyData.code = this.slcode;
        this._route.navigateByUrl('docdet/' + JSON.stringify(this.emptyData));
    };
    AppAccDocs.prototype.editData = function (id, index) {
        console.log(' Data');
        this._route.navigateByUrl('docdet/' + JSON.stringify(this.bookData[index]));
    };
    AppAccDocs.prototype.setPage = function (page) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.pager = this._common.getPager(this.allData.length, page);
        this.bookData = this.allData.slice(this.pager.startIndex, this.pager.endIndex + 1);
    };
    AppAccDocs.prototype.onChange = function (event) {
        var _this = this;
        console.log('sl code ' + this.slcode);
        if (this.slcode) {
            this.bookData = this.allData.filter(function (data) { return data.orgid == _this.orgId && data.slcode == _this.slcode && data.type == 'P'; });
            console.log(' book data' + this.bookData.length);
            this.setPage(1);
            var indx = this._common.findIndex(this.slBookData, "code== '" + this.slcode + "'");
            console.log(' Gl index ' + indx);
            this.glid = this.slBookData[indx].glid;
            this.lgrName = this.slBookData[indx].name;
            console.log(' lgrname ' + this.lgrName);
        }
    };
    AppAccDocs.prototype.goHome = function () {
        this._common.goHome();
    };
    return AppAccDocs;
}());
AppAccDocs = __decorate([
    core_1.Component({
        selector: 'APP-DOC',
        templateUrl: 'app/views/app.acc.doc.html'
    }),
    __metadata("design:paramtypes", [app_data_services_1.AppDataService, app_common_service_1.AppCommonService, forms_1.FormBuilder, router_1.Router])
], AppAccDocs);
exports.AppAccDocs = AppAccDocs;
//# sourceMappingURL=app.acc.doc.js.map