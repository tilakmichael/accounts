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
var common_1 = require("@angular/common");
var AppCommonService = (function () {
    function AppCommonService(_date) {
        this._date = _date;
        //public url:string = "http://localhost:3000/api/acc/v1/";
        this.url = "/api/acc/v1/";
        this.periodiId = undefined;
        this.startDt = undefined;
        this.endDt = undefined;
        this.doc = {};
    }
    AppCommonService.prototype.range = function (start, count) {
        return Array.apply(0, Array(count))
            .map(function (element, index) {
            return (index + start);
        });
    };
    AppCommonService.prototype.getOrg = function () {
        return this.orgId;
    };
    AppCommonService.prototype.setOrg = function (id) {
        this.orgId = id;
    };
    AppCommonService.prototype.getOrgName = function () {
        return this.orgName;
    };
    AppCommonService.prototype.setOrgName = function (name) {
        this.orgName = name;
    };
    AppCommonService.prototype.getPeriodId = function () {
        return this.periodiId;
    };
    AppCommonService.prototype.setPeriodId = function (id) {
        this.periodiId = id;
    };
    AppCommonService.prototype.getstartDt = function () {
        return this.startDt;
    };
    AppCommonService.prototype.setStatDt = function (date) {
        this.startDt = date;
    };
    AppCommonService.prototype.getEndDt = function () {
        return this.endDt;
    };
    AppCommonService.prototype.setEndDt = function (date) {
        this.endDt = date;
    };
    AppCommonService.prototype.sqlDt2Jdt = function (date) {
        if (date == null || date == undefined || !date) {
            return;
        }
        var jsDate = this._date.transform(date, 'yyyy-MM-dd');
        console.log(jsDate);
        return jsDate;
    };
    AppCommonService.prototype.getPager = function (totalItems, currentPage, pageSize) {
        if (currentPage === void 0) { currentPage = 1; }
        if (pageSize === void 0) { pageSize = 10; }
        var totalPages = Math.ceil(totalItems / pageSize);
        var startPage, endPage;
        if (totalPages <= 10) {
            startPage = 1;
            endPage = totalPages;
        }
        else {
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 6;
            }
            else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = 10;
            }
            else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }
        var startIndex = (currentPage - 1) * pageSize;
        var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
        var pages = this.range(startPage, endPage);
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    };
    AppCommonService.prototype.findIndex = function (doc, filter) {
        console.log('filter : ' + filter);
        filter = '_doc.' + filter.trim();
        console.log(filter);
        var index = doc.findIndex(function (_doc) { return eval(filter); });
        console.log('fndindex' + index);
        return index;
    };
    AppCommonService.prototype.getUrl = function () {
        return this.url;
    };
    ;
    AppCommonService.prototype.setDoc = function (doc) {
        this.doc = doc;
    };
    AppCommonService.prototype.getDoc = function () {
        return this.doc;
    };
    AppCommonService.prototype.log = function (msg) {
        console.log(msg);
    };
    ;
    AppCommonService.prototype.getSlCode = function () {
        return this.slCode;
    };
    AppCommonService.prototype.getGlId = function () {
        return this.glid;
    };
    AppCommonService.prototype.getGlName = function () {
        return this.glName;
    };
    AppCommonService.prototype.setSlCode = function (slCode) {
        return this.slCode = slCode;
    };
    AppCommonService.prototype.setGlId = function (glId) {
        this.glid = glId;
    };
    AppCommonService.prototype.setGlName = function (glName) {
        this.glName = glName;
    };
    return AppCommonService;
}());
AppCommonService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [common_1.DatePipe])
], AppCommonService);
exports.AppCommonService = AppCommonService;
//# sourceMappingURL=app.common.service.js.map