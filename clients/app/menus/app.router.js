"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var app_acc_gl_1 = require("../scripts/app.acc.gl");
var app_acc_orgs_1 = require("../scripts/app.acc.orgs");
var app_acc_home_1 = require("../scripts/app.acc.home");
var app_acc_lookups_1 = require("../scripts/app.acc.lookups");
var app_acc_types_1 = require("../scripts/app.acc.types");
var app_acc_period_1 = require("../scripts/app.acc.period");
var app_acc_slbook_1 = require("../scripts/app.acc.slbook");
var app_acc_book_1 = require("../scripts/app.acc.book");
var app_acc_sl_1 = require("../scripts/app.acc.sl");
var app_acc_doc_1 = require("../scripts/app.acc.doc");
var app_acc_docdet_1 = require("../scripts/app.acc.docdet");
var app_acc_rct_sel_1 = require("../scripts/app.acc.rct.sel");
var app_acc_recDoc_1 = require("../scripts/app.acc.recDoc");
var app_acc_rec_docdtl_1 = require("../scripts/app.acc.rec.docdtl");
var routes = [
    { path: '', component: app_acc_home_1.AppAccHome },
    { path: 'orgs', component: app_acc_orgs_1.AppAccOrgs },
    { path: 'lookups', component: app_acc_lookups_1.AppAccLookups },
    { path: 'types', component: app_acc_types_1.AppAccTypes },
    { path: 'period', component: app_acc_period_1.AppAccPeriod },
    { path: 'gl', component: app_acc_gl_1.AppAccGl },
    { path: 'slbook', component: app_acc_slbook_1.AppAccSlBook },
    { path: 'book', component: app_acc_book_1.AppAccBook },
    { path: 'sl', component: app_acc_sl_1.AppAccSl },
    { path: 'doc', component: app_acc_doc_1.AppAccDocs },
    { path: 'docdet/:doc', component: app_acc_docdet_1.AppAccDocDets },
    { path: 'recsel/:payRecJv', component: app_acc_rct_sel_1.AppAccRecSel },
    { path: 'recdoc/:payRecJv/:code', component: app_acc_recDoc_1.AppAccRecDoc },
    { path: 'recdet/:id/:code/:type', component: app_acc_rec_docdtl_1.AppAccRecDocDets }
];
exports.MenuRoutes = router_1.RouterModule.forRoot(routes);
exports.MenuComponents = [app_acc_rec_docdtl_1.AppAccRecDocDets, app_acc_recDoc_1.AppAccRecDoc, app_acc_orgs_1.AppAccOrgs, app_acc_types_1.AppAccTypes, app_acc_lookups_1.AppAccLookups, app_acc_home_1.AppAccHome, app_acc_period_1.AppAccPeriod, app_acc_gl_1.AppAccGl, app_acc_slbook_1.AppAccSlBook, app_acc_book_1.AppAccBook, app_acc_sl_1.AppAccSl, app_acc_doc_1.AppAccDocs, app_acc_docdet_1.AppAccDocDets, app_acc_rct_sel_1.AppAccRecSel];
//# sourceMappingURL=app.router.js.map