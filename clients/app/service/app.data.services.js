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
var http_1 = require("@angular/http");
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
var app_common_service_1 = require("./app.common.service");
require("rxjs/add/operator/map");
require("rxjs/add/operator/catch");
require("rxjs/add/Observable/throw");
var AppDataService = (function () {
    function AppDataService(_http, _common) {
        this._http = _http;
        this._common = _common;
        //public url:String = "http://localhost:3000/api/"; 
        this.url = "/";
    }
    ;
    AppDataService.prototype.getData = function (table) {
        var url = this.getUrl(table);
        return this._http.get(url)
            .map(function (resp) { return resp.json(); })
            .catch(function (error) {
            console.error(error);
            return Observable_1.Observable.throw(error);
        });
    };
    ;
    AppDataService.prototype.insertData = function (table, data) {
        var url = this.getUrl(table);
        var header = new http_1.Headers();
        header.append('content-type', 'application/json');
        return this._http.post(url, JSON.stringify(data), { headers: header })
            .map(function (resp) { return resp.json(); })
            .catch(function (error) {
            console.error(error);
            return Observable_1.Observable.throw(error);
        });
    };
    ;
    AppDataService.prototype.updateData = function (table, data) {
        var url = this.getUrl(table);
        var header = new http_1.Headers();
        header.append('content-type', 'application/json');
        return this._http.put(url, JSON.stringify(data), { headers: header })
            .map(function (resp) { return resp.json(); })
            .catch(function (error) {
            console.error(error);
            return Observable_1.Observable.throw(error);
        });
    };
    ;
    AppDataService.prototype.deleteData = function (table, id) {
        var url = this.getUrl(table);
        url = url + '/' + id;
        var header = new http_1.Headers();
        header.append('content-type', 'application/json');
        return this._http.delete(url)
            .map(function (resp) { return resp.json(); })
            .catch(function (error) {
            console.error(error);
            return Observable_1.Observable.throw(error);
        });
    };
    ;
    AppDataService.prototype.getUrl = function (table) {
        var url = this._common.getUrl();
        this._common.log(url);
        console.log(url + table);
        return url + table;
    };
    ;
    return AppDataService;
}());
AppDataService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http, app_common_service_1.AppCommonService])
], AppDataService);
exports.AppDataService = AppDataService;
//# sourceMappingURL=app.data.services.js.map