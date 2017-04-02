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
var forms_1 = require("@angular/forms");
var core_1 = require("@angular/core");
var app_data_services_1 = require("../service/app.data.services");
var app_common_service_1 = require("../service/app.common.service");
var AppAccGl = (function () {
    function AppAccGl(_data, _common, _bldr) {
        this._data = _data;
        this._common = _common;
        this._bldr = _bldr;
        this.table = 'gl';
        this.allData = [];
        this.error = [];
        this.glData = [];
        this.allGlData = [];
        this.gltypData = [];
        this.editFlag = false;
        this.emptyData = { "id": -1, "orgid": null, "gltypeid": null, "name": null, "crdr": null, "bookledger": null, "book": null, "ledger": null };
        this.pager = {};
    }
    ;
    AppAccGl.prototype.ngOnInit = function () {
        var _this = this;
        this.orgId = this._common.getOrg();
        console.log('org id  ' + this.orgId);
        this._data.getData(this.table)
            .subscribe(function (resp) {
            _this.allData = resp;
            _this._common.log(resp);
            if (_this.allData.length > 0) {
                _this.allGlData = _this.allData.filter(function (data) { return data.orgid == _this.orgId; });
                _this.setPage(1);
            }
        }, function (error) { _this.error = error; });
        this._data.getData('gltypes')
            .subscribe(function (resp) {
            console.log(' glt ' + resp.length);
            _this.gltypData = resp.map(function (_data) { return _data; });
            console.log(' glt2 ' + _this.gltypData.length);
        }, function (error) { _this.error = error; });
    };
    ;
    AppAccGl.prototype.initData = function (newData, doc) {
        console.log('init data');
        this.editFlag = true;
        this.editId = -1;
        this.emptyData.orgid = this.orgId;
        this.formDatas = this._bldr.group(this.emptyData);
        if (!newData && doc) {
            console.log('edit data');
            this.editId = doc.id;
            this.formDatas = this._bldr.group(doc);
        }
    };
    AppAccGl.prototype.addData = function () {
        console.log('Add Data');
        this.initData(true, null);
        this.emptyData.orgid = this.orgId;
        this.glData.unshift(this.emptyData);
    };
    AppAccGl.prototype.deleteData = function (id, index) {
        var _this = this;
        if (confirm("Delete this period? ")) {
            this._data.deleteData(this.table, id).subscribe(function (resp) {
                _this._common.log(resp);
                if (resp.affectedRows >= 1) {
                    _this.glData.splice(index, 1);
                    var alidx = _this._common.findIndex(_this.allGlData, 'id == ' + id);
                    if (alidx > 0) {
                        _this.allGlData.splice(alidx, 1);
                        _this.setPage(_this.pager.curentPage);
                    }
                }
            }, function (error) { return _this.error = error; });
        }
    };
    AppAccGl.prototype.editData = function (id, index) {
        console.log(' Data');
        this.initData(false, this.glData[index]);
        //this.emptyData.orgid = this.orgId ;
        //this.glData.unshift(this.emptyData) ;
    };
    AppAccGl.prototype.findDupName = function (name, id, doc) {
        var dupId = undefined;
        console.log(' find name : ' + name + id);
        var index = doc.findIndex(function (data) { return (data.name == name && data.id != id); });
        //console.log( 'dup index ' + index) ; 
        if (index >= 0) {
            dupId = doc[index].id;
        }
        console.log('dup idx ' + dupId);
        return dupId;
    };
    ;
    AppAccGl.prototype.findCrDr = function (id) {
        var crdr = undefined;
        console.log(' find crdr : ' + id);
        var index = this.gltypData.findIndex(function (data) { return (data.id == id); });
        //console.log( 'dup index ' + index) ; 
        if (index >= 0) {
            crdr = this.gltypData[index].crdr;
        }
        console.log('crdr ' + crdr);
        return crdr;
    };
    ;
    AppAccGl.prototype.setPage = function (page) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.pager = this._common.getPager(this.allGlData.length, page);
        this.glData = this.allGlData.slice(this.pager.startIndex, this.pager.endIndex + 1);
    };
    AppAccGl.prototype.onCancel = function (id, index) {
        console.log('cancel data');
        this.editFlag = false;
        this.editId = undefined;
        if (id == -1) {
            this.glData.splice(index, 1);
        }
    };
    AppAccGl.prototype.saveData = function (id, index) {
        var _this = this;
        var data = this.formDatas.value;
        console.log(' Save  ' + id + "/" + index);
        var dupid = this.findDupName(data.name, id, this.allGlData);
        //console.log(' dup id ' + dupid) ;
        if (dupid >= 0) {
            if (dupid != id) {
                alert("The name already exists, pls enter diferent name");
                return;
            }
        }
        data.crdr = this.findCrDr(data.gltypeid);
        if (id == -1) {
            console.log('insert data');
            console.log(data);
            //this.glData[index].orgid = this.orgId ;
            // insert
            this._data.insertData(this.table, data).subscribe(function (respData) {
                _this.glData[index] = data;
                _this.glData[index].id = respData.id;
                _this.allGlData.push(_this.glData[index]);
            }, function (respError) { _this.error = respError; });
        }
        else {
            console.log('update data');
            this._data.updateData(this.table, data).subscribe(function (respData) {
                _this.glData[index] = data;
                var alidx = _this._common.findIndex(_this.allGlData, 'id == ' + id);
                if (alidx >= 0) {
                    _this.allGlData[index] = data;
                }
                //this.updateGlData(data) ;
            }, function (respError) { _this.error = respError; });
        }
        this.onCancel(-2, -2);
        if (this.glData.length > 10) {
            this.setPage(this.pager.curentPage);
        }
    };
    ;
    AppAccGl.prototype.goHome = function () {
        this._common.goHome();
    };
    return AppAccGl;
}());
AppAccGl = __decorate([
    core_1.Component({
        selector: 'APP-GL',
        templateUrl: 'app/views/app.acc.gl.html'
    }),
    __metadata("design:paramtypes", [app_data_services_1.AppDataService, app_common_service_1.AppCommonService, forms_1.FormBuilder])
], AppAccGl);
exports.AppAccGl = AppAccGl;
//# sourceMappingURL=app.acc.gl.js.map