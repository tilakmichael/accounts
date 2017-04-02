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
var router_1 = require("@angular/router");
//import { DialogService } from "ng2-bootstrap-modal";
var app_data_services_1 = require("../service/app.data.services");
var app_common_service_1 = require("../service/app.common.service");
var common_1 = require("@angular/common");
var AppAccOrgSelector = (function () {
    function AppAccOrgSelector(_data, _common, _loc, _router) {
        this._data = _data;
        this._common = _common;
        this._loc = _loc;
        this._router = _router;
        this.allData = [];
        this.error = [];
        this.orgData = [];
        this.periodData = [];
        this.prdData = [];
        this.table = 'orgs';
        this.emdata = { id: -1, name: '', address1: '', address2: '', city: '', state: '', country: '', postal: '', phone: '', email: '', web: '' };
        this.orgEId = new core_1.EventEmitter();
        this.orgEName = new core_1.EventEmitter();
        this.periodEId = new core_1.EventEmitter();
        this.startEdt = new core_1.EventEmitter();
        this.endEdt = new core_1.EventEmitter();
    }
    AppAccOrgSelector.prototype.ngOnInit = function () {
        var _this = this;
        this._data.getData(this.table)
            .subscribe(function (resp) {
            _this.allData = resp;
            _this.orgData = resp;
            console.log(_this.allData);
            console.log(_this.allData.length);
            _this.orgData = _this.allData.map(function (_data) { return _data; });
            if (_this.allData.length = 0) {
                _this.emdata.name = 'Test Organization';
                _this.emdata.phone = '999999999';
                _this.emdata.country = 'xxxx';
                _this._data.insertData(_this.table, _this.emdata).subscribe(function (resp) {
                    _this._common.log(resp);
                    if (resp.id) {
                        _this.emdata.id = resp.id;
                        _this.allData.unshift(_this.emdata);
                    }
                }, function (error) { _this.error = error; });
            }
        });
        this._data.getData('period')
            .subscribe(function (resp) {
            _this.prdData = resp;
        }, function (error) { _this.error = error; });
    };
    ;
    AppAccOrgSelector.prototype.orgSelect = function () {
        var _this = this;
        console.log('org id ' + this.orgId);
        if (this.orgId) {
            if (this.periodData.length > 0 && (this.periodId == undefined || this.periodId == null)) {
                alert('Please Select Period');
                return;
            }
            this._common.setOrg(this.orgId);
            var index = this.orgData.findIndex(function (doc) {
                console.log(doc.id);
                return doc.id == _this.orgId;
            });
            console.log('index ' + index);
            if (index != -1) {
                this._common.setOrgName(this.orgData[index].name);
            }
            this.orgEId.emit(this.orgId);
            this.orgEName.emit(this.orgData[index].name);
            console.log('period id  ' + this.periodId);
            console.log('period []  ' + this.periodData.length);
            if (this.periodId) {
                this._common.setPeriodId(this.periodId);
                index = this.periodData.findIndex(function (doc) { console.log(doc.id); return doc.id == _this.periodId; });
                console.log('period indx' + index);
                if (index >= 0) {
                    this._common.setStatDt(this.periodData[index].startdt);
                    this._common.setEndDt(this.periodData[index].enddt);
                    this.startEdt.emit(this.periodData[index].startdt);
                    this.endEdt.emit(this.periodData[index].enddt);
                }
                this.periodEId.emit(this.periodId);
            }
            //this._loc.back( ) ;
            //this._router.navigateByUrl('menu') ;
            this._common.goHome();
        }
    };
    AppAccOrgSelector.prototype.onChange = function (id) {
        console.log(id);
        if (event) {
            console.log(this.prdData.length);
            this.periodData = this.prdData.filter(function (doc) { return doc.orgid == id; });
            console.log(this.periodData.length);
        }
        this.periodId = undefined;
    };
    return AppAccOrgSelector;
}());
AppAccOrgSelector = __decorate([
    core_1.Component({
        selector: 'APP-ORG-SELECT',
        templateUrl: 'app/views/app.acc.org.select.html',
        outputs: ['orgEId', 'orgEName', 'periodEId', 'startEdt', 'endEdt']
    }),
    __metadata("design:paramtypes", [app_data_services_1.AppDataService, app_common_service_1.AppCommonService, common_1.Location, router_1.Router])
], AppAccOrgSelector);
exports.AppAccOrgSelector = AppAccOrgSelector;
//# sourceMappingURL=app.acc.org.select.js.map