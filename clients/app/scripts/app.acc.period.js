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
var AppAccPeriod = (function () {
    function AppAccPeriod(_data, _common) {
        this._data = _data;
        this._common = _common;
        this.table = 'period';
        this.allData = [];
        this.periodData = [];
        this.docData = [];
        this.error = [];
        this.editFlag = false;
        this.editId = undefined;
        this.emptyData = { id: -1, startdt: Date, enddt: Date, orgid: null, status: 'O' };
    }
    AppAccPeriod.prototype.ngOnInit = function () {
        var _this = this;
        this.orgid = this._common.getOrg();
        if (!this.orgid || this.orgid == null || this.orgid == undefined) {
            this.editFlag = true;
        }
        this._data.getData(this.table)
            .subscribe(function (resp) {
            _this.allData = resp;
            if (_this.allData.length > 0) {
                _this.periodData = _this.allData.filter(function (data) { return data.orgid == _this.orgid; });
            }
            _this._common.log(resp);
        }, function (error) { _this.error = error; });
        this._data.getData('doc')
            .subscribe(function (resp) {
            _this.docData = resp.filter(function (data) { return data.orgid == _this.orgid; });
            _this._common.log(resp);
        }, function (error) { _this.error = error; });
    };
    AppAccPeriod.prototype.checkDups = function (id, startdt, enddt) {
        var _this = this;
        var index = this.periodData.findIndex(function (doc) { return doc.id != id && (doc.startdt <= enddt && doc.enddt >= startdt) && doc.orgid == _this.orgid; });
        return index;
    };
    AppAccPeriod.prototype.cancellData = function (id, index) {
        this.editFlag = false;
        this.editId = undefined;
        if (id === -1) {
            this.periodData.splice(index, 1);
        }
    };
    AppAccPeriod.prototype.initdata = function (initFlag, doc) {
        console.log(initFlag);
        this.startdt = undefined;
        this.enddt = undefined;
        this.status = 'O';
        if (initFlag == 'Y') {
            console.log(doc);
            this.startdt = this._common.sqlDt2Jdt(doc.startdt);
            this.enddt = this._common.sqlDt2Jdt(doc.enddt);
            this.status = doc.status;
            console.log(this.startdt, this.enddt);
        }
    };
    AppAccPeriod.prototype.saveData = function (id, index) {
        var _this = this;
        if (!this.startdt || this.startdt == undefined || this.startdt == null) {
            alert('Not enough data to save the document');
            return;
        }
        if (!this.enddt || this.enddt == undefined || this.enddt == null) {
            alert('Not enough data to save the document');
            return;
        }
        if (this.enddt <= this.startdt) {
            alert('End date must be greater than start date!');
            return;
        }
        var indx = this.checkDups(id, this.startdt, this.enddt);
        if (indx > 0) {
            alert('The date already exist ');
            return;
        }
        var data = this.periodData[index];
        data.startdt = this.startdt;
        data.enddt = this.enddt;
        data.status = this.status;
        console.log(data);
        if (id == -1) {
            this._common.log('Insert ');
            // insert
            this._data.insertData(this.table, data).subscribe(function (resp) {
                _this._common.log(resp);
                if (resp.id) {
                    data.id = resp.id;
                    _this.periodData[index] = data;
                    _this.editFlag = false;
                    _this.editId = undefined;
                }
            }, function (error) { return _this.error = error; });
        }
        else {
            // update  
            this._common.log('Update ');
            this._data.updateData(this.table, data).subscribe(function (resp) {
                _this._common.log(resp);
                _this.periodData[index] = data;
                _this.editFlag = false;
                _this.editId = undefined;
            }, function (error) { return _this.error = error; });
        }
    };
    ;
    AppAccPeriod.prototype.addData = function () {
        console.log('Add Data');
        this.initdata('N', null);
        this.editFlag = true;
        this.editId = -1;
        this.emptyData.orgid = this.orgid;
        this.periodData.unshift(this.emptyData);
    };
    AppAccPeriod.prototype.editData = function (id, index) {
        this.initdata('Y', this.periodData[index]);
        this._common.log(id + ' / ' + index);
        this.editFlag = true;
        this.editId = id;
        console.log(this.startdt);
        console.log('end dt ');
        console.log(this.enddt);
    };
    AppAccPeriod.prototype.checkDoc = function (id) {
        var retval = false;
        var idx = this._common.findIndex(this.docData, 'prdid==' + id);
        if (idx >= 0) {
            retval = true;
        }
        return retval;
    };
    AppAccPeriod.prototype.deleteData = function (id, index) {
        var _this = this;
        if (this.checkDoc(id)) {
            alert('Document exists fpr this period');
            return;
        }
        if (confirm("Delete this period? ")) {
            this._data.deleteData(this.table, id).subscribe(function (resp) {
                _this._common.log(resp);
                if (resp.affectedRows >= 1) {
                    _this.periodData.splice(index, 1);
                }
            }, function (error) { return _this.error = error; });
        }
    };
    AppAccPeriod.prototype.periodChange = function (date) {
        if (this.enddt == undefined && date) {
            //this.enddt = (date.to) ;
            //alert(date) ; 
        }
    };
    return AppAccPeriod;
}());
AppAccPeriod = __decorate([
    core_1.Component({
        selector: 'ACC-PERD',
        templateUrl: 'app/views/app.acc.period.html'
    }),
    __metadata("design:paramtypes", [app_data_services_1.AppDataService, app_common_service_1.AppCommonService])
], AppAccPeriod);
exports.AppAccPeriod = AppAccPeriod;
//# sourceMappingURL=app.acc.period.js.map