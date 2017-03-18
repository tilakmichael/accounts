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
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
var core_1 = require("@angular/core");
var app_data_services_1 = require("../service/app.data.services");
var app_common_service_1 = require("../service/app.common.service");
var AppAccRecDocDets = (function () {
    function AppAccRecDocDets(_data, _common, _bldr, _route, _actrout, _loc) {
        this._data = _data;
        this._common = _common;
        this._bldr = _bldr;
        this._route = _route;
        this._actrout = _actrout;
        this._loc = _loc;
        this.table = 'docdet';
        this.error = [];
        this.detRows = [];
        this.allDetRows = [];
        this.allDocRows = [];
        //public emptyDoc={} ;
        this.pager = {};
        this.editFlag = false;
        this.detRowFlag = false;
        this.editId = undefined;
        this.orgId = undefined;
        this.prdId = undefined;
        this.glId = undefined;
        this.lgrname = undefined;
        this.crdr = 'D';
        this.hcrdr = 'C';
        this.docnotready = true;
        this.emptyHDoc = { id: -1, code: null, docno: null, docdate: null, orgid: null, prdid: null, refno: null, refdate: null, describ: null, amount: null, status: null, type: null };
        this.emptyData = { id: -1, docid: 1, glid: null, slid: null, describ: null, amount: null, crdr: null, orgid: null };
        this.allgl = [];
        this.glrows = [];
        this.allsl = [];
        this.slrows = [];
        this.slglrows = [];
        this.docId = this._actrout.snapshot.params['id'];
        this.slcode = this._actrout.snapshot.params['code'];
        this.type = this._actrout.snapshot.params['type'];
        console.log(this.docId + ' / ' + this.slcode + ' / ' + this.type);
    }
    ;
    AppAccRecDocDets.prototype.ngOnInit = function () {
        var _this = this;
        this.initSetup();
        if (this.docId >= 0) {
            this.docnotready = false;
            this._data.getData('docdet/' + this.docId)
                .subscribe(function (resp) {
                _this.allDocRows = resp.map(function (_obj) { return _obj; });
                _this.allDetRows = _this.allDocRows.filter(function (_data) { return _data.glid != _this.glId; });
                _this._common.log(resp);
                _this.setPage(1);
                _this.sumDetData();
                _this.detRowFlag = (_this.allDetRows.length > 0);
                console.log('det row length' + _this.detRows.length);
            }, function (error) { _this.error = error; });
        }
        ;
        // get allgl anf glrows
        console.log('get gl' + this.orgId);
        this._data.getData('gl')
            .subscribe(function (resp) {
            _this.allgl = resp;
            console.log('get gl count ' + _this.allgl.length);
            _this.glrows = _this.allgl.filter(function (_data) { return _data.orgid == _this.orgId && _data.id !== _this.glId; });
            console.log('get gl count ' + _this.glrows.length);
        }, function (error) { _this.error = error; });
        // get allgl anf glrows
        console.log('get sl');
        this._data.getData('sl')
            .subscribe(function (resp) {
            _this.allsl = resp;
            console.log('get sl count ' + _this.allsl.length);
            _this.slrows = _this.allsl.filter(function (_data) { return _data.orgid == _this.orgId; });
            console.log('get sl count ' + _this.slrows.length);
        }, function (error) { _this.error = error; });
    };
    AppAccRecDocDets.prototype.onCancel = function () {
        console.log('cancel data');
        this.editFlag = false;
        this.editId = undefined;
        if (this.docId > 0) {
            this.adddHeadr(false, this.docId);
        }
        this._loc.back();
    };
    AppAccRecDocDets.prototype.initSetup = function () {
        console.log(' initsetup  ' + this.docId);
        this.orgId = this._common.getOrg();
        this.prdId = this._common.getPeriodId();
        this.typeName = 'Payment';
        if (this.type == 'R') {
            this.hcrdr = 'D';
            this.crdr = 'C';
            this.typeName = 'Receipt';
        }
        if (this.docId < 0) {
            var eDoc = this.emptyHDoc;
            eDoc.type = this.type;
            eDoc.code = this.slcode;
            eDoc.orgid = this.orgId;
            eDoc.prdid = this.prdId;
            eDoc.docdate = this._common.sqlDt2Jdt(new Date());
            this.formDatas = this._bldr.group(eDoc);
        }
        else {
            var eDoc = this._common.getDoc();
            this.formDatas = this._bldr.group(eDoc);
            this.formDatas.controls['docdate'].setValue(this._common.sqlDt2Jdt(eDoc['docdate']));
            this.formDatas.controls['refdate'].setValue(this._common.sqlDt2Jdt(eDoc['refdate']));
            console.log(eDoc);
            this._common.setDoc({});
        }
        //console.log(' sl code' + eDoc['code'] + ' / '+ this.slcode) ;
        if (this.slcode !== null && this.slcode !== undefined) {
            if (this.slcode == this._common.getSlCode()) {
                this.lgrname = this._common.getGlName();
                this.glId = this._common.getGlId();
            }
            if (!this.glId) {
                alert('An Issue Found, please contact Admin!');
                this._common.setSlCode(null);
                this._common.setGlId(null);
                this._common.setGlName(null);
            }
        }
    };
    AppAccRecDocDets.prototype.glChange = function (_event) {
        console.log('gl chnge ', _event);
        this.initGlSl(_event);
    };
    AppAccRecDocDets.prototype.initGlSl = function (glId) {
        console.log('initglsl');
        var idx = this._common.findIndex(this.glrows, 'id==' + glId);
        if (idx >= 0) {
            var bookledger = this.glrows[idx].bookledger;
            console.log('SL Code ' + bookledger);
            if (bookledger == 'SL') {
                console.log('sl rwos' + this.slrows.length);
                this.slglrows = this.slrows.filter(function (_data) { return _data.glid == glId; });
                console.log('sl ros' + this.slglrows.length);
            }
            else {
                this.slglrows = [];
            }
        }
    };
    AppAccRecDocDets.prototype.initData = function (newData, doc) {
        console.log('init data');
        console.log('alldocrec ' + this.allDocRows.length);
        console.log(this.allDocRows);
        this.editFlag = true;
        this.editId = -1;
        this.emptyData.id = -1;
        this.emptyData.orgid = this.formDatas.controls['orgid'].value;
        this.emptyData.docid = this.formDatas.controls['id'].value;
        this.emptyData.crdr = this.crdr;
        this.emptyData.glid = null;
        this.emptyData.amount = 0;
        this.emptyData.describ = null;
        //if (this.formDatas.controls['crdr'].value  == 'C' ) {
        //   this.emptyData.crdr = 'D' ;
        //}
        this.detData = this._bldr.group(this.emptyData);
        if (!newData && doc) {
            console.log('edit data');
            this.editId = doc.id;
            this.detData = this._bldr.group(doc);
            this.initGlSl(doc.glid);
        }
    };
    AppAccRecDocDets.prototype.adddHeadr = function (insertFlag, id) {
        var _this = this;
        console.log('addheader');
        var sum = 0;
        if (!insertFlag) {
            console.log('alldocrec ' + this.allDocRows.length);
            console.log(this.allDocRows);
            var idx = this._common.findIndex(this.allDocRows, 'glid===' + this.glId);
            if (idx >= 0) {
                for (var x in this.allDetRows) {
                    console.log(x);
                    console.log(this.allDetRows[x].amount);
                    sum += this.allDetRows[x].amount;
                }
                console.log('updating  header ' + sum);
                if (this.allDocRows[idx].amount != sum) {
                    this.allDocRows[idx].amount = sum;
                    this._data.updateData('docdet', this.allDocRows[idx]).subscribe(function (respData) {
                    }, function (respError) { _this.error = respError; });
                    this._data.updateData('doc', this.formDatas.value).subscribe(function (respData) {
                    }, function (respError) { _this.error = respError; });
                }
            }
            return;
        }
        console.log('insert header  ' + sum);
        var data = this.emptyData;
        data.glid = this.glId;
        data.crdr = this.hcrdr;
        data.docid = id;
        data.orgid = this.orgId;
        data.amount = sum;
        data.describ = 'Paid Amount in Doc:' + this.formDatas.controls['code'].value + '-' + this.formDatas.controls['docno'].value;
        this._data.insertData('docdet', data).subscribe(function (respData) {
            data.id = respData.id;
            _this.allDocRows.push(JSON.parse(JSON.stringify(data)));
            console.log('alldocrec ' + _this.allDocRows.length);
            console.log(_this.allDocRows);
        }, function (respError) { _this.error = respError; });
        console.log('alldocrec ' + this.allDocRows.length);
        console.log(this.allDocRows);
        console.log('end of  header');
    };
    AppAccRecDocDets.prototype.sumDetData = function () {
        console.log('sum data ' + this.allDetRows.length);
        if (this.allDetRows.length > 0) {
            if (this.allDetRows.length > 1) {
                var sum = 0;
                for (var x in this.allDetRows) {
                    console.log(x);
                    console.log(this.allDetRows[x].amount);
                    sum += this.allDetRows[x].amount;
                }
                this.formDatas.controls['amount'].setValue(sum);
            }
            else {
                console.log('sum data 2 ' + this.allDetRows[0].amount);
                this.formDatas.controls['amount'].setValue(this.allDetRows[0].amount);
            }
            console.log('sum data 2 ' + this.formDatas.controls['amount'].value);
            if (this.allDetRows.length > 10) {
                this.setPage(this.pager.curentPage);
            }
        }
    };
    AppAccRecDocDets.prototype.addDetData = function () {
        console.log('Add Data');
        this.initData(true, null);
        this.detRows.unshift(this.emptyData);
    };
    AppAccRecDocDets.prototype.deleteDetData = function (id, index) {
        var _this = this;
        if (confirm("Delete this detail? ")) {
            this._data.deleteData(this.table, id).subscribe(function (resp) {
                _this._common.log(resp);
                if (resp.affectedRows >= 1) {
                    _this.detRows.splice(index, 1);
                    var indx = _this._common.findIndex(_this.allDetRows, 'id==' + id);
                    if (indx >= 0) {
                        _this.allDetRows.splice(indx, 1);
                    }
                    indx = _this._common.findIndex(_this.allDocRows, 'id==' + id);
                    if (indx >= 0) {
                        _this.allDocRows.splice(indx, 1);
                    }
                    console.log('alldocrec ' + _this.allDocRows.length);
                    console.log(_this.allDocRows);
                    _this.sumDetData();
                }
                _this.detRowFlag = (_this.allDetRows.length > 0);
            }, function (error) { return _this.error = error; });
        }
    };
    AppAccRecDocDets.prototype.deleteData = function (id) {
        var _this = this;
        id = id | this.docId;
        if (this.allDetRows.length > 0) {
            alert('Please Delete the details information');
            return;
        }
        if (confirm("Delete this Document? ")) {
            var idx = this._common.findIndex(this.allDocRows, 'glid==' + this.glId);
            if (idx >= 0) {
                this._data.deleteData(this.table, this.allDocRows[idx].id).subscribe(function (resp) {
                }, function (error) { return _this.error = error; });
            }
            this._data.deleteData('doc', id).subscribe(function (resp) {
            }, function (error) { return _this.error = error; });
            this._loc.back();
        }
    };
    AppAccRecDocDets.prototype.editDetData = function (id, index) {
        console.log(' Data');
        this.initData(false, this.detRows[index]);
        console.log('alldocrec ' + this.allDocRows.length);
        console.log(this.allDocRows);
    };
    AppAccRecDocDets.prototype.onDetCancel = function (id, index) {
        console.log('cancel data');
        this.editFlag = false;
        this.editId = undefined;
        if (id == -1) {
            this.detRows.splice(index, 1);
        }
    };
    AppAccRecDocDets.prototype.saveData = function () {
        var _this = this;
        console.log(' insert data  ');
        var data = this.formDatas.value;
        var docid = data.id;
        console.log(' insert data  ' + docid);
        if (docid < 0) {
            console.log('insert doc');
            this._data.insertData('doc', data).subscribe(function (respData) {
                data.id = respData.id;
                _this.formDatas.controls['id'].setValue(data.id);
                _this.adddHeadr(true, data.id);
                _this.docId = data.id;
                _this.docnotready = false;
            }, function (respError) { _this.error = respError; });
        }
        else {
            console.log('update data');
            this._data.updateData('doc', data).subscribe(function (respData) {
                _this.adddHeadr(false, data.id);
            }, function (respError) { _this.error = respError; });
        }
    };
    ;
    AppAccRecDocDets.prototype.saveDetData = function (id, index) {
        var _this = this;
        console.log('insert det doc');
        var data = this.formDatas.value;
        var detData = this.detData.value;
        var docid = data.id;
        if (docid < 0) {
            alert('please save the document first');
            return;
            //        console.log('insert doc'  ) ;
            //        if (!this.formDatas.valid) {
            //          alert('Please make sure docment required data are entered ') ; 
            //          return ; 
            //        } 
            //        this._data.insertData('doc', data).subscribe(respData => {
            //             data.id = respData.id ; 
            //             this.formDatas.controls['id'].setValue(data.id) ;
            //             this.adddHeadr(true , data.id) 
            //         }, respError => { this.error = respError });
        }
        console.log(' Save  ' + id + "/" + data.id + ' / ' + index);
        //console.log(' dup id ' + dupid) ;
        if (id == -1) {
            console.log('insert data');
            console.log(detData);
            //this.glData[index].orgid = this.orgId ;
            // insert
            this._data.insertData(this.table, detData).subscribe(function (respData) {
                _this.detRows[index] = detData;
                _this.detRows[index].id = respData.id;
                _this.allDetRows.push(_this.detRows[index]);
                _this.allDocRows.push(_this.detRows[index]);
                _this.detRowFlag = (_this.allDetRows.length > 0);
                _this.sumDetData();
            }, function (respError) { _this.error = respError; });
        }
        else {
            console.log('update data');
            this._data.updateData(this.table, detData).subscribe(function (respData) {
                _this.detRows[index] = detData;
                var alidx = _this._common.findIndex(_this.allDetRows, 'id == ' + id);
                console.log('update all data ' + alidx);
                if (alidx >= 0) {
                    _this.allDetRows[alidx] = detData;
                    console.log(_this.allDetRows[alidx]);
                    _this.sumDetData();
                }
                //this.updateGlData(data) ;
            }, function (respError) { _this.error = respError; });
        }
        this.onDetCancel(-2, -2);
        console.log('alldocrec ' + this.allDocRows.length);
        console.log(this.allDocRows);
    };
    ;
    AppAccRecDocDets.prototype.setPage = function (page) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.pager = this._common.getPager(this.allDetRows.length, page, 5);
        this.detRows = this.allDetRows.slice(this.pager.startIndex, this.pager.endIndex + 1);
        console.log(this.detRows[0]);
    };
    return AppAccRecDocDets;
}());
AppAccRecDocDets = __decorate([
    core_1.Component({
        selector: 'APP-DOC-REC-DET`',
        templateUrl: 'app/views/app.acc.dockdet.html'
    }),
    __metadata("design:paramtypes", [app_data_services_1.AppDataService, app_common_service_1.AppCommonService, forms_1.FormBuilder, router_1.Router, router_1.ActivatedRoute, common_1.Location])
], AppAccRecDocDets);
exports.AppAccRecDocDets = AppAccRecDocDets;
//# sourceMappingURL=app.acc.rec.docdtl.js.map