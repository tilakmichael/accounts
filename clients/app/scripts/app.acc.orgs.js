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
var app_common_service_1 = require("../service/app.common.service");
var app_data_services_1 = require("../service/app.data.services");
var AppAccOrgs = (function () {
    function AppAccOrgs(_data, _common) {
        this._data = _data;
        this._common = _common;
        this.table = 'orgs';
        this.allData = [];
        this.error = [];
        this.prdData = [];
        this.typData = [];
        this.addDataFlag = true;
        this.editFlag = false;
        this.editId = undefined;
        this.emptyData = { id: -1, name: '', address1: '', address2: '', city: '', state: '', country: '', postal: '', phone: '', email: '', web: '' };
    }
    ;
    AppAccOrgs.prototype.ngOnInit = function () {
        var _this = this;
        this._data.getData(this.table)
            .subscribe(function (resp) {
            _this.allData = resp;
            if (_this.allData.length >= 3) {
                _this.addDataFlag = false;
            }
            _this._common.log(resp);
        }, function (error) { _this.error = error; });
        this._data.getData('period')
            .subscribe(function (resp) {
            _this.prdData = resp;
        }, function (error) { _this.error = error; });
        this._data.getData('types')
            .subscribe(function (resp) {
            _this.typData = resp;
        }, function (error) { _this.error = error; });
    };
    AppAccOrgs.prototype.cancellData = function (id, index) {
        this.editFlag = false;
        this.editId = undefined;
        if (id === -1) {
            this.allData.splice(index, 1);
        }
    };
    AppAccOrgs.prototype.setdata = function (initFlag, data) {
        initFlag = initFlag || 'N';
        this.name = undefined;
        this.address1 = undefined;
        this.address2 = undefined;
        this.city = undefined;
        this.state = undefined;
        this.country = undefined;
        this.phone = undefined;
        this.email = undefined;
        this.web = undefined;
        this.postal = undefined;
        if (initFlag == 'Y') {
            this.name = data.name;
            this.address1 = data.address1;
            this.address2 = data.address2;
            this.city = data.city;
            this.state = data.state;
            this.country = data.country;
            this.phone = data.phone;
            this.email = data.email;
            this.web = data.web;
            this.postal = data.postal;
        }
    };
    AppAccOrgs.prototype.saveData = function (id, index) {
        var _this = this;
        if (!this.name || this.name == undefined || this.name == null) {
            alert('Not enough data to save the document');
            return;
        }
        var data = this.allData[index];
        data.name = this.name;
        data.address1 = this.address1;
        data.address2 = this.address2;
        data.city = this.city;
        data.state = this.state;
        data.country = this.country;
        data.phone = this.phone;
        data.email = this.email;
        data.web = this.web;
        data.postal = this.postal;
        if (id == -1) {
            this._common.log('Insert ');
            // insert
            this._data.insertData(this.table, data).subscribe(function (resp) {
                _this._common.log(resp);
                if (resp.id) {
                    data.id = resp.id;
                    _this.allData[index] = data;
                    _this.editFlag = false;
                    _this.editId = undefined;
                    _this.addDataFlag = !(_this.allData.length >= 3);
                }
            }, function (error) { return _this.error = error; });
        }
        else {
            // update  
            this._common.log('Update ');
            this._data.updateData(this.table, data).subscribe(function (resp) {
                _this._common.log(resp);
                _this.addData[index] = data;
                _this.editFlag = false;
                _this.editId = undefined;
            }, function (error) { return _this.error = error; });
        }
    };
    AppAccOrgs.prototype.addData = function () {
        this.editFlag = true;
        this.editId = -1;
        this.allData.unshift(this.emptyData);
        this.setdata('N', {});
    };
    AppAccOrgs.prototype.editData = function (id, index) {
        this._common.log(id + ' / ' + index);
        this.editFlag = true;
        this.editId = id;
        this.setdata('Y', this.allData[index]);
    };
    AppAccOrgs.prototype.checkChild = function (id) {
        this._common.log('check child ' + id);
        var retval = false;
        var index = this._common.findIndex(this.prdData, 'orgid==' + id);
        this._common.log(index);
        if (index >= 0) {
            retval = true;
        }
        else {
            index = this._common.findIndex(this.typData, 'orgid==' + id);
            if (index >= 0) {
                retval = true;
            }
        }
        return retval;
    };
    AppAccOrgs.prototype.deleteData = function (id, index) {
        var _this = this;
        if (this.checkChild(id)) {
            alert('Period or Leger Type Exist for this Organization. Deletion is not allowed');
            return;
        }
        this._data.deleteData(this.table, id).subscribe(function (resp) {
            _this._common.log(resp);
            if (resp.affectedRows >= 1) {
                _this.allData.splice(index, 1);
                _this.addDataFlag = !(_this.allData.length >= 3);
            }
        }, function (error) { return _this.error = error; });
    };
    AppAccOrgs.prototype.goHome = function () {
        this._common.goHome();
    };
    return AppAccOrgs;
}());
AppAccOrgs = __decorate([
    core_1.Component({
        selector: 'APP-ORGS',
        templateUrl: 'app/views/app.acc.orgs.html'
    }),
    __metadata("design:paramtypes", [app_data_services_1.AppDataService, app_common_service_1.AppCommonService])
], AppAccOrgs);
exports.AppAccOrgs = AppAccOrgs;
//# sourceMappingURL=app.acc.orgs.js.map