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
var AppAccLookups = (function () {
    function AppAccLookups(_data, _common) {
        this._data = _data;
        this._common = _common;
        this.table = 'lookups';
        this.allData = [];
        this.lookData = [];
        this.typeData = [];
        this.error = [];
        this.typeEditFlag = false;
        this.typeEditIndex = undefined;
        this.lookEditFlag = false;
        this.lookEditIndex = undefined;
        this.emptyData = { id: -1, name: '', seq: null, refid: null, seeded: 'N', type: '' };
    }
    ;
    AppAccLookups.prototype.ngOnInit = function () {
        var _this = this;
        this._data.getData(this.table)
            .subscribe(function (resp) {
            _this.allData = resp;
            _this._common.log(resp);
            if (_this.allData.length > 0) {
                _this.typeData = _this.allData.filter(function (data) { return data.type == "TYPE"; });
                _this.typeName = _this.typeData[0].name;
                _this.typeId = _this.typeData[0].id;
                _this.lookData = _this.allData.filter(function (data) { return data.type == "LOOK" && data.refid == _this.typeId; });
            }
        }, function (error) { _this.error = error; });
    };
    AppAccLookups.prototype.initData = function () {
        this.name = undefined;
        this.seq = undefined;
        this.refid = undefined;
        this.seeded = undefined;
        this.type = undefined;
        this.error = [];
        this.emptyData = { id: -1, name: '', seq: null, refid: null, seeded: 'N', type: '' };
    };
    AppAccLookups.prototype.setData = function (doc) {
        this.name = doc.name;
        this.seq = doc.seq;
        this.refid = doc.refid;
        this.seeded = doc.seeded;
        this.type = doc.type;
    };
    AppAccLookups.prototype.onTypeRowClick = function (id, index) {
        var _this = this;
        if (id) {
            if (!this.typeEditFlag) {
                this.typeId = this.typeData[index].id;
                this.typeName = this.typeData[index].name;
                this.lookData = this.allData.filter(function (data) { return data.type == "LOOK" && data.refid == _this.typeId; });
            }
        }
    };
    AppAccLookups.prototype.onLocRowClick = function (id, index) {
        if (id) {
            if (!this.lookEditFlag) {
                this.lookId = this.lookData[index].id;
                this.lookName = this.lookData[index].name;
            }
        }
    };
    AppAccLookups.prototype.onTypeAdd = function () {
        this._common.log(' New Type');
        this.initData();
        var emptyTdata = this.emptyData;
        emptyTdata.type = 'TYPE';
        emptyTdata.refid = undefined;
        this.typeData.unshift(emptyTdata);
        this.typeEditFlag = true;
        this.typeEditIndex = -1;
        this.typeId = -1;
    };
    AppAccLookups.prototype.onLookAdd = function () {
        this._common.log(' New Lookups');
        this.initData();
        var emptyLdata = this.emptyData;
        emptyLdata.type = 'LOOK';
        emptyLdata.refid = this.typeId;
        this.refid = this.typeId;
        this.typeId = undefined;
        this.lookData.unshift(emptyLdata);
        this.typeEditFlag = true;
        this.lookEditFlag = true;
        this.lookEditIndex = -1;
        this.lookId = -1;
        //console.log( ' look length ' + this.lookData.length) ; 
        //console.log( ' type length  ' + this.typeData.length) ; 
    };
    AppAccLookups.prototype.onTypeCancel = function (id, index) {
        //console.log(' Cancell  ');
        this.typeEditFlag = false;
        this.typeEditIndex = -1;
        this.typeId = undefined;
        this.name = undefined;
        this.initData();
        if (id == -1) {
            this.typeData.splice(index, 1);
        }
    };
    AppAccLookups.prototype.onLookCancel = function (id, index) {
        console.log(' Cancell  ');
        this.lookEditFlag = false;
        this.typeEditFlag = false;
        this.lookEditIndex = -1;
        this.lookId = undefined;
        this.lookName = undefined;
        this.typeId = this.lookData[index].refid;
        this.initData();
        if (id == -1) {
            this.lookData.splice(index, 1);
        }
    };
    AppAccLookups.prototype.onTypeEdit = function (id, index) {
        //console.log( ' Edit ' + index +' / '+ id) ;
        this.typeEditFlag = true;
        this.typeEditIndex = index;
        this.typeId = id;
        this.typeName = this.typeData[index].name;
        this.setData(this.typeData[index]);
        console.log(' Edit e ' + this.typeEditIndex + ' ' + this.typeEditFlag);
    };
    AppAccLookups.prototype.onLookEdit = function (index) {
        //console.log( ' Edit ' + index) ;
        this.typeEditFlag = true;
        this.lookEditIndex = index;
        this.lookName = this.lookData[index].name;
        this.lookId = this.lookData[index].id;
        this.setData(this.lookData[index]);
        this.typeId = undefined;
        //console.log( ' Edit ' + this.countEditIndex) ;
    };
    AppAccLookups.prototype.onTypeDelete = function (id, index) {
        var _this = this;
        //console.log(' Delete  ' + id + "/" + index);
        this.typeEditFlag = false;
        this.typeEditIndex = -1;
        //if (id > 0) {
        this.onTypeRowClick(id, index);
        if (this.lookData.length > 0) {
            alert("You can not delete Type:" + this.name + " when you have Lookup Values. Please delete all Lookup Values!");
            this.name = undefined;
            return;
        }
        if (!confirm('Are sure you want to delete: ' + this.typeData[index].name + '?')) {
            return;
        }
        this._data.deleteData(this.table, id).subscribe(function (respData) {
            //console.log("delete Response");
            //console.log(respData);
            _this.typeData.splice(index, 1);
            _this.typeId = undefined;
            _this.initData();
        }, function (respError) { _this.error = respError; });
        //} else {
        //    this.counData.splice(index, 1);
        //}
    };
    AppAccLookups.prototype.onLookDelete = function (id, index) {
        var _this = this;
        //console.log(' Delete  ' + id + "/" + index);
        this.typeEditFlag = false;
        this.lookEditIndex = -1;
        //if (id  != -1) {
        if (!confirm('Are sure you want to delete: ' + this.lookData[index].name + '?')) {
            return;
        }
        this.name = undefined;
        this._data.deleteData(this.table, id).subscribe(function (respData) {
            //console.log("delete Response");
            //console.log(respData);
            _this.lookData.splice(index, 1);
            _this.lookId = undefined;
        }, function (respError) { _this.error = respError; });
        //} else {
        //    console.log("Delete only memory!") ; 
        //    this.locData.splice(index, 1);
        // }
    };
    AppAccLookups.prototype.onTypeSave = function (id, index) {
        var _this = this;
        //console.log(' Save  ');
        //console.log(" Name " + this.name);
        this.typeData[index].name = this.name;
        this.typeData[index].seeded = 'N';
        this.typeData[index].seq = null;
        var data = this.typeData[index];
        var dupid = this.findTypeName(this.name);
        //console.log(' dup id ' + dupid) ;
        if (dupid >= 0) {
            if (dupid != id) {
                alert("The name already exists, pls enter diferent name");
                return;
            }
        }
        this.typeEditFlag = false;
        this.typeEditIndex = -1;
        data.name = this.name;
        this.name = undefined;
        //console.log(data);
        if (id == -1) {
            // insert
            this._data.insertData(this.table, data).subscribe(function (respData) {
                //console.log("Insert Response");
                //console.log(respData.id);
                _this.typeData[index].id = respData.id;
                data.id = respData.id;
                _this.allData.push(data);
            }, function (respError) { _this.error = respError; });
        }
        else {
            // update 
            this._data.updateData(this.table, data).subscribe(function (respData) {
                //console.log("Insert Response");
                //console.log(respData);
                // updata alldata
                _this.updateAllData(data);
            }, function (respError) { _this.error = respError; });
        }
    };
    AppAccLookups.prototype.onLookSave = function (id, index) {
        var _this = this;
        //console.log(' Save  ');
        //console.log(" Name " + this.name);
        this.lookData[index].name = this.name;
        this.lookData[index].seq = this.seq;
        this.lookData[index].seeded = 'N';
        var data = this.lookData[index];
        var dupid = this.findLookName(this.name, data.refid);
        //console.log(data);
        if (dupid >= 0) {
            if (dupid != id) {
                alert("The name already exists, pls enter diferent name");
                return;
            }
        }
        if (id == -1) {
            // insert
            this._data.insertData(this.table, data).subscribe(function (respData) {
                //console.log("Insert Response");
                //console.log(respData.id);
                _this.lookData[index].id = respData.id;
                data.id = respData.id;
                _this.allData.push(data);
                //console.log(data);
                _this.typeEditFlag = false;
                _this.lookEditFlag = false;
                _this.lookEditIndex = -1;
                _this.typeId = _this.refid;
                _this.initData();
            }, function (respError) { _this.error = respError; });
        }
        else {
            // update 
            this._data.updateData(this.table, data).subscribe(function (respData) {
                //console.log("Insert Response");
                //console.log(respData);
                _this.updateAllData(data);
                _this.initData();
                _this.typeEditFlag = false;
                _this.lookEditFlag = false;
                _this.lookEditIndex = -1;
                _this.typeId = _this.refid;
                _this.initData();
            }, function (respError) { _this.error = respError; });
        }
    };
    AppAccLookups.prototype.findTypeName = function (name) {
        var id = -1;
        //console.log(' find name : '+name);
        var index = this.allData.findIndex(function (data) { return (data.name == name && data.type == 'TYPE'); });
        if (index >= 0) {
            id = this.allData[index].id;
        }
        //console.log(id);
        return id;
    };
    AppAccLookups.prototype.findLookName = function (name, refId) {
        var id = -1;
        console.log(' find name : ' + name + refId);
        var index = this.allData.findIndex(function (data) { return data.name == name && data.refid == refId; });
        if (index >= 0) {
            id = this.allData[index].id;
        }
        return id;
    };
    AppAccLookups.prototype.updateAllData = function (doc) {
        var idex = this.allData.findIndex(function (data) { return data.id == doc.id; });
        if (idex != -1) {
            this.allData[idex] = doc;
        }
    };
    return AppAccLookups;
}());
AppAccLookups = __decorate([
    core_1.Component({
        selector: "APP-LOOKUP",
        templateUrl: "app/views/app.acc.lookups.html"
    }),
    __metadata("design:paramtypes", [app_data_services_1.AppDataService, app_common_service_1.AppCommonService])
], AppAccLookups);
exports.AppAccLookups = AppAccLookups;
//# sourceMappingURL=app.acc.lookups.js.map