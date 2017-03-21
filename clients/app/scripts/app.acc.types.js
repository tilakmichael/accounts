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
//import { DialogService } from "ng2-bootstrap-modal";
var app_data_services_1 = require("../service/app.data.services");
var app_common_service_1 = require("../service/app.common.service");
//import {AppAccTypeCrud} from '../scripts/app.acc.type.crud' ; 
var AppAccTypes = (function () {
    function AppAccTypes(_data, _common) {
        this._data = _data;
        this._common = _common;
        this.table = 'types';
        this.allData = [];
        this.fData = [];
        this.sData = [];
        this.tData = [];
        this.glData = [];
        this.error = [];
        this.fEditFlag = false;
        this.sEditFlag = false;
        this.tEditFlag = false;
        this.editflag = false;
        this.fId = undefined;
        this.sId = undefined;
        this.tId = undefined;
        this.fPid = undefined;
        this.sPid = undefined;
        this.fPcrdr = undefined;
        this.sPcrdr = undefined;
        this.fname = undefined;
        this.sname = undefined;
        this.name = undefined;
        this.seq = undefined;
        this.crdr = undefined;
        this.level = undefined;
        this.emptyData = { id: -1, name: '', seq: null, crdr: null, level: null, refid: null, orgid: this.orgId };
    }
    ;
    AppAccTypes.prototype.ngOnInit = function () {
        var _this = this;
        this.orgId = this._common.getOrg();
        this._data.getData(this.table)
            .subscribe(function (resp) {
            _this.allData = resp;
            _this._common.log(resp);
            if (_this.allData.length > 0) {
                _this.fData = _this.allData.filter(function (data) { return data.level == 1 && data.orgid == _this.orgId; });
                _this.fId = _this.allData[0].id;
                _this.fPid = _this.fId;
                _this.fPcrdr = _this.allData[0].crdr;
                _this.fname = _this.fData[0].name;
                _this.onclick(1, _this.fId, 0);
            }
        }, function (error) { _this.error = error; });
        this._data.getData('gl')
            .subscribe(function (resp) {
            _this.glData = resp.filter(function (_doc) { return _doc.orgid == _this.orgId; });
        }, function (error) { _this.error = error; });
    };
    AppAccTypes.prototype.onclick = function (level, id, index) {
        //console.log( 'onclick  ' + level + ' / ' + index) ;   
        //console.log(id) ; 
        if (level === 1) {
            this.fname = this.fData[index].name;
            this.fPcrdr = this.fData[index].crdr;
            if (id > 0) {
                this.fPid = id;
                this.popChild(id, 2);
                if (this.sData.length > 0) {
                    this.sPid = this.sData[0].id;
                    this.sPcrdr = this.sData[0].crdr;
                    this.sname = this.sData[0].name;
                    this.popChild(this.sPid, 3);
                }
                else {
                    this.sPid = undefined;
                    this.sname = undefined;
                    this.sPcrdr = undefined;
                    this.popChild(this.sPid, 3);
                }
            }
        }
        if (level === 2) {
            this.sname = this.sData[index].name;
            if (id > 0) {
                this.sPid = id;
                this.sPcrdr = this.fPcrdr;
                this.popChild(this.sPid, 3);
            }
        }
    };
    ;
    AppAccTypes.prototype.popChild = function (parentId, level) {
        var _this = this;
        var data = this.allData.filter(function (data) { return data.level == level && data.refid == parentId && data.orgid == _this.orgId; });
        //console.log( ' pop ' + parentId +' / ' + this.orgId +' / '+ level +' / ' + data.length) ;
        //if (data.length > 0 ) {
        if (level === 2) {
            this.sData = data;
        }
        else {
            if (level === 3) {
                this.tData = data;
            }
        }
        //} 
    };
    ;
    AppAccTypes.prototype.initData = function () {
        this.name = undefined;
        this.seq = undefined;
        this.crdr = undefined;
        this.level = undefined;
        this.error = [];
        this.fEditFlag = false;
        this.sEditFlag = false;
        this.tEditFlag = false;
        this.fId = undefined;
        this.sId = undefined;
        this.tId = undefined;
        this.editflag = false;
        this.emptyData = { id: -1, name: '', seq: null, crdr: null, level: null, refid: null, orgid: this.orgId };
    };
    ;
    AppAccTypes.prototype.updateAllData = function (doc) {
        var idex = this.allData.findIndex(function (data) { return data.id == doc.id; });
        if (idex != -1) {
            this.allData[idex] = doc;
        }
    };
    ;
    AppAccTypes.prototype.checkGl = function (id) {
        var retval = false;
        var indx = this._common.findIndex(this.glData, 'gltypeid==' + id);
        if (indx >= 0) {
            retval = true;
        }
        return retval;
    };
    AppAccTypes.prototype.deleteAllData = function (id) {
        var idex = this.allData.findIndex(function (data) { return data.id == id; });
        if (idex != -1) {
            this.allData.splice(idex, 1);
        }
    };
    ;
    AppAccTypes.prototype.findDupName = function (name, id, doc) {
        var _this = this;
        var dupId = undefined;
        //console.log(' find name : '+name +id);
        var index = doc.findIndex(function (data) { return (data.name == name && data.orgid == _this.orgId && data.id !== id); });
        //console.log( 'dup index ' + index) ; 
        if (index >= 0) {
            dupId = doc[index].id;
        }
        return dupId;
    };
    ;
    AppAccTypes.prototype.addFdata = function () {
        //console.log( ' Add F Data') ; 
        this.initData();
        var data = this.emptyData;
        data.id = -1;
        data.level = 1;
        this.fEditFlag = true;
        this.fId = -1;
        this.fData.unshift(data);
        this.editflag = true;
        this.crdr = 'D';
        data.orgid = this.orgId;
    };
    AppAccTypes.prototype.addSdata = function () {
        //console.log( ' Add S Data') ;
        if (!this.fPid || this.fPid == null) {
            alert('Plezse select level I for adding level II Data!');
        }
        //console.log( ' I i '+ this.fPid) ;
        this.initData();
        var data = this.emptyData;
        data.id = -1;
        data.level = 2;
        data.refid = this.fPid;
        data.crdr = this.fPcrdr;
        this.sEditFlag = true;
        this.sId = -1;
        this.sData.unshift(data);
        this.editflag = true;
        this.crdr = data.crdr;
        data.orgid = this.orgId;
        console.log(this.crdr + ' / ' + this.fPcrdr);
    };
    AppAccTypes.prototype.addTdata = function () {
        //console.log( ' Add T Data') ;
        if (!this.sPid || this.sPid == null) {
            alert('Plezse select level II for adding level II Data!');
        }
        //console.log( ' II id '+ this.sPid) ;
        this.initData();
        var data = this.emptyData;
        data.id = -1;
        data.level = 3;
        data.refid = this.sPid;
        data.crdr = this.sPcrdr;
        this.tEditFlag = true;
        this.tId = -1;
        this.tData.unshift(data);
        this.editflag = true;
        data.orgid = this.orgId;
        this.crdr = data.crdr;
        //console.log( this.tData.length) ; 
    };
    AppAccTypes.prototype.cancelFdata = function (id, index) {
        //console.log( 'cancell F Data') ; 
        this.initData();
        if (id === -1) {
            this.fData.splice(index, 1);
        }
    };
    ;
    AppAccTypes.prototype.cancelSdata = function (id, index) {
        //console.log( 'cancell S Data') ; 
        this.initData();
        if (id === -1) {
            this.sData.splice(index, 1);
        }
    };
    ;
    AppAccTypes.prototype.cancelTdata = function (id, index) {
        //console.log( 'cancell T Data') ; 
        this.initData();
        if (id === -1) {
            this.tData.splice(index, 1);
        }
    };
    ;
    AppAccTypes.prototype.saveFdata = function (id, index) {
        var _this = this;
        //console.log(' Save  ' + id + "/" + index);
        var dupid = this.findDupName(this.name, id, this.fData);
        //console.log(' dup id ' + dupid) ;
        if (dupid >= 0) {
            if (dupid != id) {
                alert("The name already exists, pls enter diferent name");
                return;
            }
        }
        this.fData[index].name = this.name;
        this.fData[index].seq = this.seq;
        this.fData[index].crdr = this.crdr;
        this.fData[index].level = 1;
        this.onclick(1, id, index);
        ////console.log(data);
        var data = this.fData[index];
        //console.log(data) ; 
        if (id == -1) {
            // insert
            this._data.insertData(this.table, data).subscribe(function (respData) {
                _this.fData[index].id = respData.id;
                _this.allData.push(data);
                _this.initData();
            }, function (respError) { _this.error = respError; });
        }
        else {
            this._data.updateData(this.table, data).subscribe(function (respData) {
                _this.updateAllData(data);
                _this.initData();
            }, function (respError) { _this.error = respError; });
        }
    };
    ;
    AppAccTypes.prototype.saveSdata = function (id, index) {
        var _this = this;
        //console.log(' Save  ' + id + "/" + index);
        var dupid = this.findDupName(this.name, id, this.sData);
        //console.log(' dup id ' + dupid) ;
        if (dupid >= 0) {
            if (dupid != id) {
                alert("The name already exists, pls enter diferent name");
                return;
            }
        }
        this.sData[index].name = this.name;
        this.sData[index].seq = this.seq;
        this.sData[index].crdr = this.crdr;
        this.sData[index].level = 2;
        this.onclick(2, id, index);
        ////console.log(data);
        var data = this.sData[index];
        //console.log(data) ; 
        if (id == -1) {
            // insert
            this._data.insertData(this.table, data).subscribe(function (respData) {
                _this.sData[index].id = respData.id;
                _this.allData.push(data);
                _this.initData();
            }, function (respError) { _this.error = respError; });
        }
        else {
            this._data.updateData(this.table, data).subscribe(function (respData) {
                _this.updateAllData(data);
                _this.initData();
            }, function (respError) { _this.error = respError; });
        }
    };
    ;
    AppAccTypes.prototype.saveTdata = function (id, index) {
        var _this = this;
        //console.log(' Save  ' + id + "/" + index);
        var dupid = this.findDupName(this.name, id, this.sData);
        //console.log(' dup id ' + dupid) ;
        if (dupid >= 0) {
            if (dupid != id) {
                alert("The name already exists, pls enter diferent name");
                return;
            }
        }
        this.tData[index].name = this.name;
        this.tData[index].seq = this.seq;
        this.tData[index].crdr = this.crdr;
        this.tData[index].level = 3;
        ////console.log(data);
        var data = this.tData[index];
        //console.log(data) ; 
        if (id == -1) {
            // insert
            this._data.insertData(this.table, data).subscribe(function (respData) {
                _this.tData[index].id = respData.id;
                _this.allData.push(data);
                _this.initData();
            }, function (respError) { _this.error = respError; });
        }
        else {
            this._data.updateData(this.table, data).subscribe(function (respData) {
                _this.updateAllData(data);
                _this.initData();
            }, function (respError) { _this.error = respError; });
        }
    };
    ;
    AppAccTypes.prototype.editFData = function (id, index) {
        //console.log( ' Edit F Data') ;
        this.initData();
        this.onclick(1, id, index);
        var data = this.fData[index];
        this.fEditFlag = true;
        this.editflag = true;
        this.name = this.fData[index].name;
        this.seq = this.fData[index].seq;
        this.crdr = this.fData[index].crdr;
        this.level = this.fData[index].level;
        this.fId = id;
    };
    AppAccTypes.prototype.editSData = function (id, index) {
        //console.log( ' Edit S Data') ;
        this.initData();
        this.onclick(2, id, index);
        var data = this.sData[index];
        this.sEditFlag = true;
        this.editflag = true;
        this.name = this.sData[index].name;
        this.seq = this.sData[index].seq;
        this.crdr = this.sData[index].crdr;
        this.level = this.sData[index].level;
        this.sId = id;
    };
    AppAccTypes.prototype.editTData = function (id, index) {
        //console.log( ' Edit T Data') ;
        this.initData();
        var data = this.tData[index];
        this.tEditFlag = true;
        this.editflag = true;
        this.name = this.tData[index].name;
        this.seq = this.tData[index].seq;
        this.crdr = this.tData[index].crdr;
        this.level = this.tData[index].level;
        this.tId = id;
    };
    AppAccTypes.prototype.deleteFData = function (id, index) {
        var _this = this;
        this.onclick(1, id, index);
        if (this.sData.length > 0) {
            alert('Child Level Exist for this record: ' + this.fData[index].name);
            return;
        }
        if (this.checkGl(id)) {
            alert('Ledger Defined for this record: ' + this.fData[index].name);
            return;
        }
        if (confirm(' Do you want to delete ' + this.fData[index].name + '?')) {
            this.fData.splice(index, 1);
            this.deleteAllData(id);
            this._data.deleteData(this.table, id)
                .subscribe(function (respData) {
            }, function (respError) { _this.error = respError; });
        }
    };
    ;
    AppAccTypes.prototype.deleteSData = function (id, index) {
        var _this = this;
        this.onclick(2, id, index);
        if (this.tData.length > 0) {
            alert('Child Level Exists for this record: ' + this.sData[index].name);
            return;
        }
        if (this.checkGl(id)) {
            alert('Ledger Defined for this record: ' + this.sData[index].name);
            return;
        }
        if (confirm(' Do you want to delete ' + this.sData[index].name + '?')) {
            this.sData.splice(index, 1);
            this.deleteAllData(id);
            this._data.deleteData(this.table, id)
                .subscribe(function (respData) {
            }, function (respError) { _this.error = respError; });
        }
    };
    ;
    AppAccTypes.prototype.deleteTData = function (id, index) {
        var _this = this;
        if (this.checkGl(id)) {
            alert('Ledger Defined for this record: ' + this.tData[index].name);
            return;
        }
        if (confirm(' Do you want to delete ' + this.tData[index].name + '?')) {
            this.tData.splice(index, 1);
            this.deleteAllData(id);
            this._data.deleteData(this.table, id)
                .subscribe(function (respData) {
            }, function (respError) { _this.error = respError; });
        }
    };
    ;
    AppAccTypes.prototype.crdrChange = function (value) {
        console.log(value);
        this.crdr = value;
    };
    return AppAccTypes;
}());
AppAccTypes = __decorate([
    core_1.Component({
        selector: "APP-TYPES",
        templateUrl: 'app/views/app.acc.types.html'
    }),
    __metadata("design:paramtypes", [app_data_services_1.AppDataService, app_common_service_1.AppCommonService])
], AppAccTypes);
exports.AppAccTypes = AppAccTypes;
//# sourceMappingURL=app.acc.types.js.map