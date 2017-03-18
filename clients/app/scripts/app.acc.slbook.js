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
var AppAccSlBook = (function () {
    function AppAccSlBook(_data, _common, _bldr) {
        this._data = _data;
        this._common = _common;
        this._bldr = _bldr;
        this.table = 'slbook';
        this.allData = [];
        this.error = [];
        this.slData = [];
        this.allGlData = [];
        this.editFlag = false;
        this.emptyData = { "id": -1, "code": null, "name": null, "glid": null, orgid: null, crdr: null, type: 'SL' };
    }
    ;
    AppAccSlBook.prototype.ngOnInit = function () {
        var _this = this;
        this.orgId = this._common.getOrg();
        console.log('org id  ' + this.orgId);
        this._data.getData(this.table)
            .subscribe(function (resp) {
            _this.allData = resp;
            _this._common.log(resp);
            if (_this.allData.length > 0) {
                _this.slData = _this.allData.filter(function (data) { return data.orgid == _this.orgId && data.type == 'SL'; });
            }
        }, function (error) { _this.error = error; });
        this._data.getData('gl')
            .subscribe(function (resp) {
            console.log(' glt ' + resp.length);
            _this.allGlData = resp.filter(function (_data) { return _data.orgid == _this.orgId; });
            console.log(' glt2 ' + _this.allGlData.length);
        }, function (error) { _this.error = error; });
    };
    AppAccSlBook.prototype.initData = function (newData, doc) {
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
    AppAccSlBook.prototype.addData = function () {
        console.log('Add Data');
        this.initData(true, null);
        this.emptyData.orgid = this.orgId;
        this.slData.unshift(this.emptyData);
    };
    AppAccSlBook.prototype.onCancel = function (id, index) {
        console.log('cancel data');
        this.editFlag = false;
        this.editId = undefined;
        if (id == -1) {
            this.slData.splice(index, 1);
        }
    };
    AppAccSlBook.prototype.deleteData = function (id, index) {
        var _this = this;
        if (confirm("Delete this Ledger Definition? ")) {
            this._data.deleteData(this.table, id).subscribe(function (resp) {
                _this._common.log(resp);
                if (resp.affectedRows >= 1) {
                    var indx = _this._common.findIndex(_this.allGlData, 'id== ' + _this.slData[index].glid);
                    if (indx >= 0) {
                        _this.updateGl(_this.allGlData[indx], null, null);
                    }
                    _this.slData.splice(index, 1);
                }
            }, function (error) { return _this.error = error; });
        }
    };
    AppAccSlBook.prototype.editData = function (id, index) {
        console.log(' Data');
        this.initData(false, this.slData[index]);
        //this.emptyData.orgid = this.orgId ;
        //this.glData.unshift(this.emptyData) ;
    };
    AppAccSlBook.prototype.updateGl = function (doc, bookldgr, code) {
        var _this = this;
        console.log('update gl ' + bookldgr + '  / ' + code);
        doc.bookledger = bookldgr;
        doc.ledger = code;
        this._data.updateData('gl', doc).subscribe(function (respData) {
        }, function (respError) { _this.error = respError; });
    };
    AppAccSlBook.prototype.saveData = function (id, index) {
        var _this = this;
        var data = this.formDatas.value;
        data.code = data.code.toUpperCase();
        console.log(' Save  ' + id + "/" + index);
        var indx = this._common.findIndex(this.slData, 'code== "' + data.code + '"');
        //console.log(' dup id ' + dupid) ;
        if (indx >= 0) {
            if (this.slData[indx].id != id) {
                alert("The code already exists, pls enter diferent code");
                return;
            }
        }
        indx = this._common.findIndex(this.slData, 'name=="' + data.name + '"');
        //console.log(' dup id ' + dupid) ;
        if (indx >= 0) {
            if (this.slData[indx].id != id) {
                alert("The Name already exists, pls enter diferent Name");
                return;
            }
        }
        if (id == -1) {
            console.log('insert data');
            console.log(data);
            indx = this._common.findIndex(this.allGlData, 'id== ' + data.glid);
            //console.log(' dup id ' + dupid) ;
            if (indx >= 0) {
                data.crdr = this.allGlData[indx].crdr;
            }
            if (this.allGlData[indx].bookledger) {
                alert('General Ledger linked to another book');
                return;
            }
            //this.glData[index].orgid = this.orgId ;
            // insert
            this._data.insertData(this.table, data).subscribe(function (respData) {
                _this.slData[index] = data;
                _this.slData[index].id = respData.id;
                _this.updateGl(_this.allGlData[indx], 'SL', data.code);
            }, function (respError) { _this.error = respError; });
        }
        else {
            console.log('update data');
            var updGl_1 = false;
            this._data.updateData(this.table, data).subscribe(function (respData) {
                if (_this.slData[index].glid != data.glid) {
                    updGl_1 = true;
                    indx = _this._common.findIndex(_this.allGlData, 'id== ' + _this.slData[index].glid);
                    if (indx >= 0) {
                        _this.updateGl(_this.allGlData[indx], null, null);
                    }
                }
                _this.slData[index] = data;
                if (updGl_1) {
                    indx = _this._common.findIndex(_this.allGlData, 'id== ' + data.glid);
                    if (indx >= 0) {
                        _this.updateGl(_this.allGlData[indx], 'SL', data.code);
                    }
                }
            }, function (respError) { _this.error = respError; });
        }
        this.onCancel(-2, -2);
    };
    ;
    return AppAccSlBook;
}());
AppAccSlBook = __decorate([
    core_1.Component({
        selector: 'APP-SLBOOK',
        templateUrl: 'app/views/app.acc.slbook.html'
    }),
    __metadata("design:paramtypes", [app_data_services_1.AppDataService, app_common_service_1.AppCommonService, forms_1.FormBuilder])
], AppAccSlBook);
exports.AppAccSlBook = AppAccSlBook;
//# sourceMappingURL=app.acc.slbook.js.map