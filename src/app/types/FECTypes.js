"use strict";
/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Api = exports.HttpClient = exports.ContentType = void 0;
var ContentType;
(function (ContentType) {
    ContentType["Json"] = "application/json";
    ContentType["FormData"] = "multipart/form-data";
    ContentType["UrlEncoded"] = "application/x-www-form-urlencoded";
    ContentType["Text"] = "text/plain";
})(ContentType || (exports.ContentType = ContentType = {}));
var HttpClient = /** @class */ (function () {
    function HttpClient(apiConfig) {
        var _a;
        if (apiConfig === void 0) { apiConfig = {}; }
        var _this = this;
        this.baseUrl = "";
        this.securityData = null;
        this.abortControllers = new Map();
        this.customFetch = function () {
            var fetchParams = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                fetchParams[_i] = arguments[_i];
            }
            return fetch.apply(void 0, fetchParams);
        };
        this.baseApiParams = {
            credentials: "same-origin",
            headers: {},
            redirect: "follow",
            referrerPolicy: "no-referrer",
        };
        this.setSecurityData = function (data) {
            _this.securityData = data;
        };
        this.contentFormatters = (_a = {},
            _a[ContentType.Json] = function (input) {
                return input !== null && (typeof input === "object" || typeof input === "string")
                    ? JSON.stringify(input)
                    : input;
            },
            _a[ContentType.Text] = function (input) {
                return input !== null && typeof input !== "string"
                    ? JSON.stringify(input)
                    : input;
            },
            _a[ContentType.FormData] = function (input) {
                return Object.keys(input || {}).reduce(function (formData, key) {
                    var property = input[key];
                    formData.append(key, property instanceof Blob
                        ? property
                        : typeof property === "object" && property !== null
                            ? JSON.stringify(property)
                            : "".concat(property));
                    return formData;
                }, new FormData());
            },
            _a[ContentType.UrlEncoded] = function (input) { return _this.toQueryString(input); },
            _a);
        this.createAbortSignal = function (cancelToken) {
            if (_this.abortControllers.has(cancelToken)) {
                var abortController_1 = _this.abortControllers.get(cancelToken);
                if (abortController_1) {
                    return abortController_1.signal;
                }
                return void 0;
            }
            var abortController = new AbortController();
            _this.abortControllers.set(cancelToken, abortController);
            return abortController.signal;
        };
        this.abortRequest = function (cancelToken) {
            var abortController = _this.abortControllers.get(cancelToken);
            if (abortController) {
                abortController.abort();
                _this.abortControllers.delete(cancelToken);
            }
        };
        this.request = function (_a) { return __awaiter(_this, void 0, void 0, function () {
            var secureParams, _b, requestParams, queryString, payloadFormatter, responseFormat;
            var _this = this;
            var body = _a.body, secure = _a.secure, path = _a.path, type = _a.type, query = _a.query, format = _a.format, baseUrl = _a.baseUrl, cancelToken = _a.cancelToken, params = __rest(_a, ["body", "secure", "path", "type", "query", "format", "baseUrl", "cancelToken"]);
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
                            this.securityWorker;
                        if (!_b) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.securityWorker(this.securityData)];
                    case 1:
                        _b = (_c.sent());
                        _c.label = 2;
                    case 2:
                        secureParams = (_b) ||
                            {};
                        requestParams = this.mergeRequestParams(params, secureParams);
                        queryString = query && this.toQueryString(query);
                        payloadFormatter = this.contentFormatters[type || ContentType.Json];
                        responseFormat = format || requestParams.format;
                        return [2 /*return*/, this.customFetch("".concat(baseUrl || this.baseUrl || "").concat(path).concat(queryString ? "?".concat(queryString) : ""), __assign(__assign({}, requestParams), { headers: __assign(__assign({}, (requestParams.headers || {})), (type && type !== ContentType.FormData
                                    ? { "Content-Type": type }
                                    : {})), signal: (cancelToken
                                    ? this.createAbortSignal(cancelToken)
                                    : requestParams.signal) || null, body: typeof body === "undefined" || body === null
                                    ? null
                                    : payloadFormatter(body) })).then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                                var r, data, _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            r = response;
                                            r.data = null;
                                            r.error = null;
                                            if (!!responseFormat) return [3 /*break*/, 1];
                                            _a = r;
                                            return [3 /*break*/, 3];
                                        case 1: return [4 /*yield*/, response[responseFormat]()
                                                .then(function (data) {
                                                if (r.ok) {
                                                    r.data = data;
                                                }
                                                else {
                                                    r.error = data;
                                                }
                                                return r;
                                            })
                                                .catch(function (e) {
                                                r.error = e;
                                                return r;
                                            })];
                                        case 2:
                                            _a = _b.sent();
                                            _b.label = 3;
                                        case 3:
                                            data = _a;
                                            if (cancelToken) {
                                                this.abortControllers.delete(cancelToken);
                                            }
                                            if (!response.ok)
                                                throw data;
                                            return [2 /*return*/, data];
                                    }
                                });
                            }); })];
                }
            });
        }); };
        Object.assign(this, apiConfig);
    }
    HttpClient.prototype.encodeQueryParam = function (key, value) {
        var encodedKey = encodeURIComponent(key);
        return "".concat(encodedKey, "=").concat(encodeURIComponent(typeof value === "number" ? value : "".concat(value)));
    };
    HttpClient.prototype.addQueryParam = function (query, key) {
        return this.encodeQueryParam(key, query[key]);
    };
    HttpClient.prototype.addArrayQueryParam = function (query, key) {
        var _this = this;
        var value = query[key];
        return value.map(function (v) { return _this.encodeQueryParam(key, v); }).join("&");
    };
    HttpClient.prototype.toQueryString = function (rawQuery) {
        var _this = this;
        var query = rawQuery || {};
        var keys = Object.keys(query).filter(function (key) { return "undefined" !== typeof query[key]; });
        return keys
            .map(function (key) {
            return Array.isArray(query[key])
                ? _this.addArrayQueryParam(query, key)
                : _this.addQueryParam(query, key);
        })
            .join("&");
    };
    HttpClient.prototype.addQueryParams = function (rawQuery) {
        var queryString = this.toQueryString(rawQuery);
        return queryString ? "?".concat(queryString) : "";
    };
    HttpClient.prototype.mergeRequestParams = function (params1, params2) {
        return __assign(__assign(__assign(__assign({}, this.baseApiParams), params1), (params2 || {})), { headers: __assign(__assign(__assign({}, (this.baseApiParams.headers || {})), (params1.headers || {})), ((params2 && params2.headers) || {})) });
    };
    return HttpClient;
}());
exports.HttpClient = HttpClient;
/**
 * @title OpenFEC
 * @version 1.0
 *
 * This application programming interface (API) allows you to explore the way candidates and committees fund their campaigns.
 *
 *  The Federal Election Commission (FEC) API is a RESTful web service supporting full-text and field-specific searches on FEC data. [Bulk downloads](https://www.fec.gov/data/advanced/?tab=bulk-data) are available on the current site. Information is tied to the underlying forms by file ID and image ID. Data are updated nightly.
 *
 *  There are a lot of data, and a good place to start is to use search to find interesting candidates and committees. Then, you can use their IDs to find report or line item details with the other endpoints. If you are interested in individual donors, check out contributor information in the `/schedule_a/` endpoints.
 *
 *  <b class="body" id="getting_started_head">Getting started with the openFEC API</b><br>
 *
 *  If you would like to use the FEC's API programmatically, you can sign up for your own API key using our form. Alternatively, you can still try out our API without an API key by using the web interface and using DEMO_KEY. Note that when you use the openFEC API you are subject to the [Terms of Service](https://github.com/fecgov/FEC/blob/master/TERMS-OF-SERVICE.md) and [Acceptable Use policy](https://github.com/fecgov/FEC/blob/master/ACCEPTABLE-USE-POLICY.md).
 *
 *  Signing up for an API key will enable you to place up to 1,000 calls an hour. Each call is limited to 100 results per page. You can email questions, comments or a request to get a key for 7,200 calls an hour (120 calls per minute) to <a href="mailto:APIinfo@fec.gov">APIinfo@fec.gov</a>. You can also ask questions and discuss the data in a community led [group](https://groups.google.com/forum/#!forum/fec-data).
 *
 *  The model definitions and schema are available at [/swagger](/swagger/). This is useful for making wrappers and exploring the data.
 *
 *  A few restrictions limit the way you can use FEC data. For example, you can’t use contributor lists for commercial purposes or to solicit donations. [Learn more here](https://www.fec.gov/updates/sale-or-use-contributor-information/).
 *
 *  [Inspect our source code](https://github.com/fecgov/openFEC). We welcome issues and pull requests!
 *
 *  <p><br></p> <h2 class="title" id="signup_head">Sign up for an API key</h2> <div id="apidatagov_signup">Loading signup form...</div>
 */
var Api = /** @class */ (function (_super) {
    __extends(Api, _super);
    function Api() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.v1 = {
            /**
             * @description This endpoint contains Final Audit Reports approved by the Commission since inception. The search can be based on information about the audited committee (Name, FEC ID Number, Type, Election Cycle) or the issues covered in the report.
             *
             * @tags audit
             * @name AuditCaseList
             * @request GET:/v1/audit-case/
             * @secure
             */
            auditCaseList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/audit-case/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description This lists the options for the categories and subcategories available in the /audit-search/ endpoint.
             *
             * @tags audit
             * @name AuditCategoryList
             * @request GET:/v1/audit-category/
             * @secure
             */
            auditCategoryList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/audit-category/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description This lists the options for the primary categories available in the /audit-search/ endpoint.
             *
             * @tags audit
             * @name AuditPrimaryCategoryList
             * @request GET:/v1/audit-primary-category/
             * @secure
             */
            auditPrimaryCategoryList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/audit-primary-category/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Combines the election and reporting dates with Commission meetings, conferences, outreach, Advisory Opinions, rules, litigation dates and other events into one calendar. State and report type filtering is no longer available.
             *
             * @tags dates
             * @name CalendarDatesList
             * @request GET:/v1/calendar-dates/
             * @secure
             */
            calendarDatesList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/calendar-dates/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Returns CSV or ICS for downloading directly into calendar applications like Google, Outlook or other applications. Combines the election and reporting dates with Commission meetings, conferences, outreach, Advisory Opinions, rules, litigation dates and other events into one calendar. State filtering now applies to elections, reports and reporting periods. Presidential pre-primary report due dates are not shown on even years. Filers generally opt to file monthly rather than submit over 50 pre-primary election reports. All reporting deadlines are available at /reporting-dates/ for reference. This is [the sql function](https://github.com/fecgov/openFEC/blob/develop/data/migrations/V40__omnibus_dates.sql) that creates the calendar.
             *
             * @tags dates
             * @name CalendarDatesExportList
             * @request GET:/v1/calendar-dates/export/
             * @secure
             */
            calendarDatesExportList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/calendar-dates/export/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description This endpoint is useful for finding detailed information about a particular candidate. Use the `candidate_id` to find the most recent information about that candidate.
             *
             * @tags candidate
             * @name CandidateDetail
             * @request GET:/v1/candidate/{candidate_id}/
             * @secure
             */
            candidateDetail: function (candidateId, query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/candidate/".concat(candidateId, "/"), method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description This endpoint is useful for finding detailed information about a particular committee or filer. Use the `committee_id` to find the most recent information about the committee.
             *
             * @tags committee
             * @name CandidateCommitteesDetail
             * @request GET:/v1/candidate/{candidate_id}/committees/
             * @secure
             */
            candidateCommitteesDetail: function (candidateId, query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/candidate/".concat(candidateId, "/committees/"), method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Explore a filer's characteristics over time. This can be particularly useful if the committees change treasurers, designation, or `committee_type`.
             *
             * @tags committee
             * @name CandidateCommitteesHistoryDetail
             * @request GET:/v1/candidate/{candidate_id}/committees/history/
             * @secure
             */
            candidateCommitteesHistoryDetail: function (candidateId, query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/candidate/".concat(candidateId, "/committees/history/"), method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Explore a filer's characteristics over time. This can be particularly useful if the committees change treasurers, designation, or `committee_type`.
             *
             * @tags committee
             * @name CandidateCommitteesHistoryDetail2
             * @request GET:/v1/candidate/{candidate_id}/committees/history/{cycle}/
             * @originalName candidateCommitteesHistoryDetail
             * @duplicate
             * @secure
             */
            candidateCommitteesHistoryDetail2: function (cycle, candidateId, query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/candidate/".concat(candidateId, "/committees/history/").concat(cycle, "/"), method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description All official records and reports filed by or delivered to the FEC. Note: because the filings data includes many records, counts for large result sets are approximate; you will want to page through the records until no records are returned.
             *
             * @tags filings
             * @name CandidateFilingsDetail
             * @request GET:/v1/candidate/{candidate_id}/filings/
             * @secure
             */
            candidateFilingsDetail: function (candidateId, query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/candidate/".concat(candidateId, "/filings/"), method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Find out a candidate's characteristics over time. This is particularly useful if the candidate runs for the same office in different districts or you want to know more about a candidate's previous races. This information is organized by `candidate_id`, so it won't help you find a candidate who ran for different offices over time; candidates get a new ID for each office.
             *
             * @tags candidate
             * @name CandidateHistoryDetail
             * @request GET:/v1/candidate/{candidate_id}/history/
             * @secure
             */
            candidateHistoryDetail: function (candidateId, query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/candidate/".concat(candidateId, "/history/"), method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Find out a candidate's characteristics over time. This is particularly useful if the candidate runs for the same office in different districts or you want to know more about a candidate's previous races. This information is organized by `candidate_id`, so it won't help you find a candidate who ran for different offices over time; candidates get a new ID for each office.
             *
             * @tags candidate
             * @name CandidateHistoryDetail2
             * @request GET:/v1/candidate/{candidate_id}/history/{cycle}/
             * @originalName candidateHistoryDetail
             * @duplicate
             * @secure
             */
            candidateHistoryDetail2: function (cycle, candidateId, query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/candidate/".concat(candidateId, "/history/").concat(cycle, "/"), method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description This endpoint provides information about a committee's Form 3, Form 3X, or Form 3P financial reports, which are aggregated by two-year period. We refer to two-year periods as a `cycle`. The cycle is named after the even-numbered year and includes the year before it. To obtain totals from 2013 and 2014, you would use 2014. In odd-numbered years, the current cycle is the next year — for example, in 2015, the current cycle is 2016. For presidential and Senate candidates, multiple two-year cycles exist between elections.
             *
             * @tags candidate
             * @name CandidateTotalsDetail
             * @request GET:/v1/candidate/{candidate_id}/totals/
             * @secure
             */
            candidateTotalsDetail: function (candidateId, query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/candidate/".concat(candidateId, "/totals/"), method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Fetch basic information about candidates, and use parameters to filter results to the candidates you're looking for. Each result reflects a unique FEC candidate ID. That ID is particular to the candidate for a particular office sought. If a candidate runs for the same office multiple times, the ID stays the same. If the same person runs for another office — for example, a House candidate runs for a Senate office — that candidate will get a unique ID for each office.
             *
             * @tags candidate
             * @name CandidatesList
             * @request GET:/v1/candidates/
             * @secure
             */
            candidatesList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/candidates/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Fetch basic information about candidates and their principal committees. Each result reflects a unique FEC candidate ID. That ID is assigned to the candidate for a particular office sought. If a candidate runs for the same office over time, that ID stays the same. If the same person runs for multiple offices — for example, a House candidate runs for a Senate office — that candidate will get a unique ID for each office. The candidate endpoints primarily use data from FEC registration [Form 1](https://www.fec.gov/pdf/forms/fecfrm1.pdf) for committee information and [Form 2](https://www.fec.gov/pdf/forms/fecfrm2.pdf) for candidate information.
             *
             * @tags candidate
             * @name CandidatesSearchList
             * @request GET:/v1/candidates/search/
             * @secure
             */
            candidatesSearchList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/candidates/search/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Aggregated candidate receipts and disbursements grouped by cycle.
             *
             * @tags candidate
             * @name CandidatesTotalsList
             * @request GET:/v1/candidates/totals/
             * @secure
             */
            candidatesTotalsList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/candidates/totals/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Candidate total receipts and disbursements aggregated by `aggregate_by`.
             *
             * @tags candidate
             * @name CandidatesTotalsAggregatesList
             * @request GET:/v1/candidates/totals/aggregates/
             * @secure
             */
            candidatesTotalsAggregatesList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/candidates/totals/aggregates/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description This endpoint is useful for finding detailed information about a particular committee or filer. Use the `committee_id` to find the most recent information about the committee.
             *
             * @tags committee
             * @name CommitteeDetail
             * @request GET:/v1/committee/{committee_id}/
             * @secure
             */
            committeeDetail: function (committeeId, query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/committee/".concat(committeeId, "/"), method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description This endpoint is useful for finding detailed information about a particular candidate. Use the `candidate_id` to find the most recent information about that candidate.
             *
             * @tags candidate
             * @name CommitteeCandidatesDetail
             * @request GET:/v1/committee/{committee_id}/candidates/
             * @secure
             */
            committeeCandidatesDetail: function (committeeId, query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/committee/".concat(committeeId, "/candidates/"), method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Find out a candidate's characteristics over time. This is particularly useful if the candidate runs for the same office in different districts or you want to know more about a candidate's previous races. This information is organized by `candidate_id`, so it won't help you find a candidate who ran for different offices over time; candidates get a new ID for each office.
             *
             * @tags candidate
             * @name CommitteeCandidatesHistoryDetail
             * @request GET:/v1/committee/{committee_id}/candidates/history/
             * @secure
             */
            committeeCandidatesHistoryDetail: function (committeeId, query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/committee/".concat(committeeId, "/candidates/history/"), method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Find out a candidate's characteristics over time. This is particularly useful if the candidate runs for the same office in different districts or you want to know more about a candidate's previous races. This information is organized by `candidate_id`, so it won't help you find a candidate who ran for different offices over time; candidates get a new ID for each office.
             *
             * @tags candidate
             * @name CommitteeCandidatesHistoryDetail2
             * @request GET:/v1/committee/{committee_id}/candidates/history/{cycle}/
             * @originalName committeeCandidatesHistoryDetail
             * @duplicate
             * @secure
             */
            committeeCandidatesHistoryDetail2: function (committeeId, cycle, query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/committee/".concat(committeeId, "/candidates/history/").concat(cycle, "/"), method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description All official records and reports filed by or delivered to the FEC. Note: because the filings data includes many records, counts for large result sets are approximate; you will want to page through the records until no records are returned.
             *
             * @tags filings
             * @name CommitteeFilingsDetail
             * @request GET:/v1/committee/{committee_id}/filings/
             * @secure
             */
            committeeFilingsDetail: function (committeeId, query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/committee/".concat(committeeId, "/filings/"), method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Explore a filer's characteristics over time. This can be particularly useful if the committees change treasurers, designation, or `committee_type`.
             *
             * @tags committee
             * @name CommitteeHistoryDetail
             * @request GET:/v1/committee/{committee_id}/history/
             * @secure
             */
            committeeHistoryDetail: function (committeeId, query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/committee/".concat(committeeId, "/history/"), method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Explore a filer's characteristics over time. This can be particularly useful if the committees change treasurers, designation, or `committee_type`.
             *
             * @tags committee
             * @name CommitteeHistoryDetail2
             * @request GET:/v1/committee/{committee_id}/history/{cycle}/
             * @originalName committeeHistoryDetail
             * @duplicate
             * @secure
             */
            committeeHistoryDetail2: function (committeeId, cycle, query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/committee/".concat(committeeId, "/history/").concat(cycle, "/"), method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Each report represents the summary information from Form 3, Form 3X and Form 3P. These reports have key statistics that illuminate the financial status of a given committee. Things like cash on hand, debts owed by committee, total receipts, and total disbursements are especially helpful for understanding a committee's financial dealings. By default, this endpoint includes both amended and final versions of each report. To restrict to only the final versions of each report, use `is_amended=false`; to retrieve only reports that have been amended, use `is_amended=true`. Several different reporting structures exist, depending on the type of organization that submits financial information. To see an example of these reporting requirements, look at the summary and detailed summary pages of Form 3, Form 3X, and Form 3P. DISCLAIMER: The field labels contained within this resource are subject to change.  We are attempting to succinctly label these fields while conveying clear meaning to ensure accessibility for all users.
             *
             * @tags financial
             * @name CommitteeReportsDetail
             * @request GET:/v1/committee/{committee_id}/reports/
             * @secure
             */
            committeeReportsDetail: function (committeeId, query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/committee/".concat(committeeId, "/reports/"), method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description This endpoint provides information about a committee's Form 3, Form 3X, or Form 3P financial reports, which are aggregated by two-year period. We refer to two-year periods as a `cycle`. The cycle is named after the even-numbered year and includes the year before it. To obtain totals from 2013 and 2014, you would use 2014. In odd-numbered years, the current cycle is the next year — for example, in 2015, the current cycle is 2016. For presidential and Senate candidates, multiple two-year cycles exist between elections.
             *
             * @tags financial
             * @name CommitteeTotalsDetail
             * @request GET:/v1/committee/{committee_id}/totals/
             * @secure
             */
            committeeTotalsDetail: function (committeeId, query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/committee/".concat(committeeId, "/totals/"), method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Fetch basic information about committees and filers. Use parameters to filter for particular characteristics.
             *
             * @tags committee
             * @name CommitteesList
             * @request GET:/v1/committees/
             * @secure
             */
            committeesList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/committees/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description 52 U.S.C. 30118 allows "communications by a corporation to its stockholders and executive or administrative personnel and their families or by a labor organization to its members and their families on any subject," including the express advocacy of the election or defeat of any Federal candidate.  The costs of such communications must be reported to the Federal Election Commission under certain circumstances.
             *
             * @tags communication cost
             * @name CommunicationCostsList
             * @request GET:/v1/communication_costs/
             * @secure
             */
            communicationCostsList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/communication_costs/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Communication cost aggregated by candidate ID and committee ID.
             *
             * @tags communication cost
             * @name CommunicationCostsAggregatesList
             * @request GET:/v1/communication_costs/aggregates/
             * @secure
             */
            communicationCostsAggregatesList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/communication_costs/aggregates/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Communication cost aggregated by candidate ID and committee ID.
             *
             * @tags communication cost
             * @name CommunicationCostsByCandidateList
             * @request GET:/v1/communication_costs/by_candidate/
             * @secure
             */
            communicationCostsByCandidateList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/communication_costs/by_candidate/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Total communications costs aggregated across committees on supported or opposed candidates by cycle or candidate election year.
             *
             * @tags communication cost
             * @name CommunicationCostsTotalsByCandidateList
             * @request GET:/v1/communication_costs/totals/by_candidate/
             * @secure
             */
            communicationCostsTotalsByCandidateList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/communication_costs/totals/by_candidate/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Basic information about electronic files coming into the FEC, posted as they are received.
             *
             * @tags efiling
             * @name EfileFilingsList
             * @request GET:/v1/efile/filings/
             * @secure
             */
            efileFilingsList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/efile/filings/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Basic information about electronic files coming into the FEC, posted as they are received.
             *
             * @tags efiling
             * @name EfileForm1List
             * @request GET:/v1/efile/form1/
             * @secure
             */
            efileForm1List: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/efile/form1/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Basic information about electronic files coming into the FEC, posted as they are received.
             *
             * @tags efiling
             * @name EfileForm2List
             * @request GET:/v1/efile/form2/
             * @secure
             */
            efileForm2List: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/efile/form2/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Key financial data reported periodically by committees as they are reported. This feed includes summary information from the the House F3 reports, the presidential F3p reports and the PAC and party F3x reports. Generally, committees file reports on a quarterly or monthly basis, but some must also submit a report 12 days before primary elections. Therefore, during the primary season, the period covered by this file may be different for different committees. These totals also incorporate any changes made by committees, if any report covering the period is amended. DISCLAIMER: The field labels contained within this resource are subject to change.  We are attempting to succinctly label these fields while conveying clear meaning to ensure accessibility for all users.
             *
             * @tags efiling
             * @name EfileReportsHouseSenateList
             * @request GET:/v1/efile/reports/house-senate/
             * @secure
             */
            efileReportsHouseSenateList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/efile/reports/house-senate/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Key financial data reported periodically by committees as they are reported. This feed includes summary information from the the House F3 reports, the presidential F3p reports and the PAC and party F3x reports. Generally, committees file reports on a quarterly or monthly basis, but some must also submit a report 12 days before primary elections. Therefore, during the primary season, the period covered by this file may be different for different committees. These totals also incorporate any changes made by committees, if any report covering the period is amended. DISCLAIMER: The field labels contained within this resource are subject to change.  We are attempting to succinctly label these fields while conveying clear meaning to ensure accessibility for all users.
             *
             * @tags efiling
             * @name EfileReportsPacPartyList
             * @request GET:/v1/efile/reports/pac-party/
             * @secure
             */
            efileReportsPacPartyList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/efile/reports/pac-party/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Key financial data reported periodically by committees as they are reported. This feed includes summary information from the the House F3 reports, the presidential F3p reports and the PAC and party F3x reports. Generally, committees file reports on a quarterly or monthly basis, but some must also submit a report 12 days before primary elections. Therefore, during the primary season, the period covered by this file may be different for different committees. These totals also incorporate any changes made by committees, if any report covering the period is amended. DISCLAIMER: The field labels contained within this resource are subject to change.  We are attempting to succinctly label these fields while conveying clear meaning to ensure accessibility for all users.
             *
             * @tags efiling
             * @name EfileReportsPresidentialList
             * @request GET:/v1/efile/reports/presidential/
             * @secure
             */
            efileReportsPresidentialList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/efile/reports/presidential/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description FEC election dates since 1995.
             *
             * @tags dates
             * @name ElectionDatesList
             * @request GET:/v1/election-dates/
             * @secure
             */
            electionDatesList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/election-dates/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description An electioneering communication is any broadcast, cable or satellite communication that fulfills each of the following conditions: _The communication refers to a clearly identified federal candidate._ _The communication is publicly distributed by a television station, radio station, cable television system or satellite system for a fee._ _The communication is distributed within 60 days prior to a general election or 30 days prior to a primary election to federal office._
             *
             * @tags electioneering
             * @name ElectioneeringList
             * @request GET:/v1/electioneering/
             * @secure
             */
            electioneeringList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/electioneering/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Electioneering communications costs aggregates
             *
             * @tags electioneering
             * @name ElectioneeringAggregatesList
             * @request GET:/v1/electioneering/aggregates/
             * @secure
             */
            electioneeringAggregatesList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/electioneering/aggregates/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Electioneering costs aggregated by candidate
             *
             * @tags electioneering
             * @name ElectioneeringByCandidateList
             * @request GET:/v1/electioneering/by_candidate/
             * @secure
             */
            electioneeringByCandidateList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/electioneering/by_candidate/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Total electioneering communications spent on candidates by cycle or candidate election year
             *
             * @tags electioneering
             * @name ElectioneeringTotalsByCandidateList
             * @request GET:/v1/electioneering/totals/by_candidate/
             * @secure
             */
            electioneeringTotalsByCandidateList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/electioneering/totals/by_candidate/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Look at the top-level financial information for all candidates running for the same office. Choose a 2-year cycle, and `house`, `senate` or `presidential`. If you are looking for a Senate seat, you will need to select the state using a two-letter abbreviation. House races require state and a two-digit district number. Since this endpoint reflects financial information, it will only have candidates once they file financial reporting forms. Query the `/candidates` endpoint to retrieve an-up-to-date list of all the candidates that filed to run for a particular seat.
             *
             * @tags financial
             * @name ElectionsList
             * @request GET:/v1/elections/
             * @secure
             */
            electionsList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/elections/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description List elections by cycle, office, state, and district.
             *
             * @tags financial
             * @name ElectionsSearchList
             * @request GET:/v1/elections/search/
             * @secure
             */
            electionsSearchList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/elections/search/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description List elections by cycle, office, state, and district.
             *
             * @tags financial
             * @name ElectionsSummaryList
             * @request GET:/v1/elections/summary/
             * @secure
             */
            electionsSummaryList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/elections/summary/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description All official records and reports filed by or delivered to the FEC. Note: because the filings data includes many records, counts for large result sets are approximate; you will want to page through the records until no records are returned.
             *
             * @tags filings
             * @name FilingsList
             * @request GET:/v1/filings/
             * @secure
             */
            filingsList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/filings/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Search legal documents by document type, or across all document types using keywords, parameter values and ranges. This endpoint uses elasticsearch-dsl pagination.For pagination, use both `from_hit` and `hits_returned` parameters. `from_hit` defines the offset from the first result you want to fetch. `hits_returned` allows you to configure the maximum results to be returned. By default `from_hit` = 0 and `hits_returned` = 20, endpoint will return the first 20 documents (i.e. 0 to 19). if set `from_hit` = 20 and `hits_returned` = 20, endpoint will return documents range from 21 to 40 (i.e. 20 to 39). The maximum value of `hits_returned` is 200.
             *
             * @tags legal
             * @name LegalSearchList
             * @request GET:/v1/legal/search/
             * @secure
             */
            legalSearchList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/legal/search/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Search for candidates or committees by name. If you're looking for information on a particular person or group, using a name to find the `candidate_id` or `committee_id` on this endpoint can be a helpful first step.
             *
             * @tags audit
             * @name NamesAuditCandidatesList
             * @request GET:/v1/names/audit_candidates/
             * @secure
             */
            namesAuditCandidatesList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/names/audit_candidates/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Search for candidates or committees by name. If you're looking for information on a particular person or group, using a name to find the `candidate_id` or `committee_id` on this endpoint can be a helpful first step.
             *
             * @tags audit
             * @name NamesAuditCommitteesList
             * @request GET:/v1/names/audit_committees/
             * @secure
             */
            namesAuditCommitteesList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/names/audit_committees/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Search for candidates or committees by name. If you're looking for information on a particular person or group, using a name to find the `candidate_id` or `committee_id` on this endpoint can be a helpful first step.
             *
             * @tags search
             * @name NamesCandidatesList
             * @request GET:/v1/names/candidates/
             * @secure
             */
            namesCandidatesList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/names/candidates/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Search for candidates or committees by name. If you're looking for information on a particular person or group, using a name to find the `candidate_id` or `committee_id` on this endpoint can be a helpful first step.
             *
             * @tags search
             * @name NamesCommitteesList
             * @request GET:/v1/names/committees/
             * @secure
             */
            namesCommitteesList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/names/committees/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description The Operations log contains details of each report loaded into the database. It is primarily used as status check to determine when all of the data processes, from initial entry through review are complete.
             *
             * @tags filings
             * @name OperationsLogList
             * @request GET:/v1/operations-log/
             * @secure
             */
            operationsLogList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/operations-log/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Net receipts per candidate. Filter with `contributor_state='US'` for national totals
             *
             * @tags presidential
             * @name PresidentialContributionsByCandidateList
             * @request GET:/v1/presidential/contributions/by_candidate/
             * @secure
             */
            presidentialContributionsByCandidateList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/presidential/contributions/by_candidate/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Contribution receipts by size per candidate. Filter by candidate_id, election_year and/or size
             *
             * @tags presidential
             * @name PresidentialContributionsBySizeList
             * @request GET:/v1/presidential/contributions/by_size/
             * @secure
             */
            presidentialContributionsBySizeList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/presidential/contributions/by_size/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Contribution receipts by state per candidate. Filter by candidate_id and/or election_year
             *
             * @tags presidential
             * @name PresidentialContributionsByStateList
             * @request GET:/v1/presidential/contributions/by_state/
             * @secure
             */
            presidentialContributionsByStateList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/presidential/contributions/by_state/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Coverage end date per candidate. Filter by candidate_id and/or election_year
             *
             * @tags presidential
             * @name PresidentialCoverageEndDateList
             * @request GET:/v1/presidential/coverage_end_date/
             * @secure
             */
            presidentialCoverageEndDateList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/presidential/coverage_end_date/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Financial summary per candidate. Filter by candidate_id and/or election_year
             *
             * @tags presidential
             * @name PresidentialFinancialSummaryList
             * @request GET:/v1/presidential/financial_summary/
             * @secure
             */
            presidentialFinancialSummaryList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/presidential/financial_summary/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Use this endpoint to look up the RAD Analyst for a committee. The mission of the Reports Analysis Division (RAD) is to ensure that campaigns and political committees file timely and accurate reports that fully disclose their financial activities.  RAD is responsible for reviewing statements and financial reports filed by political committees participating in federal elections, providing assistance and guidance to the committees to properly file their reports, and for taking appropriate action to ensure compliance with the Federal Election Campaign Act (FECA).
             *
             * @tags filer resources
             * @name RadAnalystList
             * @request GET:/v1/rad-analyst/
             * @secure
             */
            radAnalystList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/rad-analyst/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description FEC election dates since 1995.
             *
             * @tags dates
             * @name ReportingDatesList
             * @request GET:/v1/reporting-dates/
             * @secure
             */
            reportingDatesList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/reporting-dates/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Each report represents the summary information from Form 3, Form 3X and Form 3P. These reports have key statistics that illuminate the financial status of a given committee. Things like cash on hand, debts owed by committee, total receipts, and total disbursements are especially helpful for understanding a committee's financial dealings. By default, this endpoint includes both amended and final versions of each report. To restrict to only the final versions of each report, use `is_amended=false`; to retrieve only reports that have been amended, use `is_amended=true`. Several different reporting structures exist, depending on the type of organization that submits financial information. To see an example of these reporting requirements, look at the summary and detailed summary pages of Form 3, Form 3X, and Form 3P. DISCLAIMER: The field labels contained within this resource are subject to change.  We are attempting to succinctly label these fields while conveying clear meaning to ensure accessibility for all users.
             *
             * @tags financial
             * @name ReportsDetail
             * @request GET:/v1/reports/{entity_type}/
             * @secure
             */
            reportsDetail: function (entityType, query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/reports/".concat(entityType, "/"), method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description This description is for both ​`/schedules​/schedule_a​/` and ​ `/schedules​/schedule_a​/{sub_id}​/`. This endpoint provides itemized receipts. Schedule A records describe itemized receipts, including contributions from individuals. If you are interested in contributions from an individual, use the `/schedules/schedule_a/` endpoint. For a more complete description of all Schedule A records visit [About receipts data](https://www.fec.gov/campaign-finance-data/about-campaign-finance-data/about-receipts-data/). If you are interested in our "is_individual" methodology visit our [methodology page](https://www.fec.gov/campaign-finance-data/about-campaign-finance-data/methodology/). ​The `/schedules​/schedule_a​/` endpoint is not paginated by page number. This endpoint uses keyset pagination to improve query performance and these indices are required to properly page through this large dataset. To request the next page, you should append the values found in the `last_indexes` object from pagination to the URL of your last request as additional parameters. For example, when sorting by `contribution_receipt_date`, you might receive a page of results with the two scenarios of following pagination information: case #1: ``` pagination: { pages: 2152643, per_page: 20, is_count_exact: False, count: 43052850, last_indexes: { last_index: "230880619", last_contribution_receipt_date: "2014-01-01" } } ``` <br/> case #2 (results which include contribution_receipt_date = NULL): ``` pagination: { pages: 2152644, per_page: 20, count: 43052850, is_count_exact: False, last_indexes: { last_index: "230880639", sort_null_only: True } } ``` To fetch the next page of sorted results, append `last_index=230880619` and `last_contribution_receipt_date=2014-01-01` to the URL and when reaching `contribution_receipt_date=NULL`, append `last_index=230880639` and `sort_null_only=True`. We strongly advise paging through these results using sort indices. The default sort is acending by `contribution_receipt_date` (`deprecated`, will be descending). If you do not page using sort indices, some transactions may be unintentionally filtered out. Calls to ​`/schedules​/schedule_a​/` may return many records. For large result sets, the record counts found in the pagination object are approximate; you will need to page through the records until no records are returned. To avoid throwing the "out of range" exception on the last page, one recommandation is to use total count and `per_page` to control the traverse loop of results. ​The `/schedules​/schedule_a​/{sub_id}​/` endpoint returns a single transaction, but it does include a pagination object class. Please ignore the information in that object class.
             *
             * @tags receipts
             * @name SchedulesScheduleAList
             * @request GET:/v1/schedules/schedule_a/
             * @secure
             */
            schedulesScheduleAList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/schedules/schedule_a/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description This endpoint provides itemized individual contributions received by a committee, aggregated by the contributor’s employer name. If you are interested in our “is_individual” methodology, review the [methodology page](https://www.fec.gov/campaign-finance-data/about-campaign-finance-data/methodology). Unitemized individual contributions are not included.
             *
             * @tags receipts
             * @name SchedulesScheduleAByEmployerList
             * @request GET:/v1/schedules/schedule_a/by_employer/
             * @secure
             */
            schedulesScheduleAByEmployerList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/schedules/schedule_a/by_employer/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description This endpoint provides itemized individual contributions received by a committee, aggregated by the contributor’s occupation. If you are interested in our “is_individual” methodology, review the [methodology page](https://www.fec.gov/campaign-finance-data/about-campaign-finance-data/methodology). Unitemized individual contributions are not included.
             *
             * @tags receipts
             * @name SchedulesScheduleAByOccupationList
             * @request GET:/v1/schedules/schedule_a/by_occupation/
             * @secure
             */
            schedulesScheduleAByOccupationList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/schedules/schedule_a/by_occupation/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description This endpoint provides individual contributions received by a committee, aggregated by size: ``` - $200 and under - $200.01 - $499.99 - $500 - $999.99 - $1000 - $1999.99 - $2000 + ``` The $200.00 and under category includes contributions of $200 or less combined with unitemized individual contributions.
             *
             * @tags receipts
             * @name SchedulesScheduleABySizeList
             * @request GET:/v1/schedules/schedule_a/by_size/
             * @secure
             */
            schedulesScheduleABySizeList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/schedules/schedule_a/by_size/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description This endpoint provides itemized individual contributions received by a committee, aggregated by size of contribution and candidate. If you are interested in our “is_individual” methodology, review the [methodology page](https://www.fec.gov/campaign-finance-data/about-campaign-finance-data/methodology). Unitemized individual contributions are not included.
             *
             * @tags receipts
             * @name SchedulesScheduleABySizeByCandidateList
             * @request GET:/v1/schedules/schedule_a/by_size/by_candidate/
             * @secure
             */
            schedulesScheduleABySizeByCandidateList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/schedules/schedule_a/by_size/by_candidate/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description This endpoint provides itemized individual contributions received by a committee, aggregated by the contributor’s state. If you are interested in our “is_individual” methodology, review the [methodology page](https://www.fec.gov/campaign-finance-data/about-campaign-finance-data/methodology). Unitemized individual contributions are not included.
             *
             * @tags receipts
             * @name SchedulesScheduleAByStateList
             * @request GET:/v1/schedules/schedule_a/by_state/
             * @secure
             */
            schedulesScheduleAByStateList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/schedules/schedule_a/by_state/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description This endpoint provides itemized individual contributions received by a committee, aggregated by contributor’s state and candidate. If you are interested in our “is_individual” methodology, review the [methodology page](https://www.fec.gov/campaign-finance-data/about-campaign-finance-data/methodology). Unitemized individual contributions are not included.
             *
             * @tags receipts
             * @name SchedulesScheduleAByStateByCandidateList
             * @request GET:/v1/schedules/schedule_a/by_state/by_candidate/
             * @secure
             */
            schedulesScheduleAByStateByCandidateList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/schedules/schedule_a/by_state/by_candidate/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Itemized individual contributions aggregated by contributor’s state, candidate, committee type and cycle. If you are interested in our “is_individual” methodology, review the [methodology page](https://www.fec.gov/campaign-finance-data/about-campaign-finance-data/methodology). Unitemized individual contributions are not included.
             *
             * @tags receipts
             * @name SchedulesScheduleAByStateByCandidateTotalsList
             * @request GET:/v1/schedules/schedule_a/by_state/by_candidate/totals/
             * @secure
             */
            schedulesScheduleAByStateByCandidateTotalsList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/schedules/schedule_a/by_state/by_candidate/totals/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description This endpoint provides itemized individual contributions received by a committee, aggregated by contributor’s state, committee type and cycle. If you are interested in our “is_individual” methodology, review the [methodology page](https://www.fec.gov/campaign-finance-data/about-campaign-finance-data/methodology). Unitemized individual contributions are not included.
             *
             * @tags receipts
             * @name SchedulesScheduleAByStateTotalsList
             * @request GET:/v1/schedules/schedule_a/by_state/totals/
             * @secure
             */
            schedulesScheduleAByStateTotalsList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/schedules/schedule_a/by_state/totals/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description This endpoint provides itemized individual contributions received by a committee, aggregated by the contributor’s ZIP code. If you are interested in our “is_individual” methodology, review the [methodology page](https://www.fec.gov/campaign-finance-data/about-campaign-finance-data/methodology). Unitemized individual contributions are not included.
             *
             * @tags receipts
             * @name SchedulesScheduleAByZipList
             * @request GET:/v1/schedules/schedule_a/by_zip/
             * @secure
             */
            schedulesScheduleAByZipList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/schedules/schedule_a/by_zip/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Efiling endpoints provide real-time campaign finance data received from electronic filers. Efiling endpoints only contain the most recent four months of data and don't contain the processed and coded data that you can find on other endpoints.
             *
             * @tags receipts
             * @name SchedulesScheduleAEfileList
             * @request GET:/v1/schedules/schedule_a/efile/
             * @secure
             */
            schedulesScheduleAEfileList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/schedules/schedule_a/efile/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description This description is for both ​`/schedules​/schedule_a​/` and ​ `/schedules​/schedule_a​/{sub_id}​/`. This endpoint provides itemized receipts. Schedule A records describe itemized receipts, including contributions from individuals. If you are interested in contributions from an individual, use the `/schedules/schedule_a/` endpoint. For a more complete description of all Schedule A records visit [About receipts data](https://www.fec.gov/campaign-finance-data/about-campaign-finance-data/about-receipts-data/). If you are interested in our "is_individual" methodology visit our [methodology page](https://www.fec.gov/campaign-finance-data/about-campaign-finance-data/methodology/). ​The `/schedules​/schedule_a​/` endpoint is not paginated by page number. This endpoint uses keyset pagination to improve query performance and these indices are required to properly page through this large dataset. To request the next page, you should append the values found in the `last_indexes` object from pagination to the URL of your last request as additional parameters. For example, when sorting by `contribution_receipt_date`, you might receive a page of results with the two scenarios of following pagination information: case #1: ``` pagination: { pages: 2152643, per_page: 20, is_count_exact: False, count: 43052850, last_indexes: { last_index: "230880619", last_contribution_receipt_date: "2014-01-01" } } ``` <br/> case #2 (results which include contribution_receipt_date = NULL): ``` pagination: { pages: 2152644, per_page: 20, count: 43052850, is_count_exact: False, last_indexes: { last_index: "230880639", sort_null_only: True } } ``` To fetch the next page of sorted results, append `last_index=230880619` and `last_contribution_receipt_date=2014-01-01` to the URL and when reaching `contribution_receipt_date=NULL`, append `last_index=230880639` and `sort_null_only=True`. We strongly advise paging through these results using sort indices. The default sort is acending by `contribution_receipt_date` (`deprecated`, will be descending). If you do not page using sort indices, some transactions may be unintentionally filtered out. Calls to ​`/schedules​/schedule_a​/` may return many records. For large result sets, the record counts found in the pagination object are approximate; you will need to page through the records until no records are returned. To avoid throwing the "out of range" exception on the last page, one recommandation is to use total count and `per_page` to control the traverse loop of results. ​The `/schedules​/schedule_a​/{sub_id}​/` endpoint returns a single transaction, but it does include a pagination object class. Please ignore the information in that object class.
             *
             * @tags receipts
             * @name SchedulesScheduleADetail
             * @request GET:/v1/schedules/schedule_a/{sub_id}/
             * @secure
             */
            schedulesScheduleADetail: function (subId, query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/schedules/schedule_a/".concat(subId, "/"), method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Schedule B filings describe itemized disbursements. This data explains how committees and other filers spend their money. These figures are reported as part of forms F3, F3X and F3P. The data are divided in two-year periods, called `two_year_transaction_period`, which is derived from the `report_year` submitted of the corresponding form. If no value is supplied, the results will default to the most recent two-year period that is named after the ending, even-numbered year. Due to the large quantity of Schedule B filings, this endpoint is not paginated by page number. Instead, you can request the next page of results by adding the values in the `last_indexes` object from `pagination` to the URL of your last request. For example, when sorting by `disbursement_date`, you might receive a page of results with the following pagination information: ``` pagination: { pages: 965191, per_page: 20, count: 19303814, is_count_exact: False, last_indexes: { last_index: "230906248", last_disbursement_date: "2014-07-04" } } ``` To fetch the next page of sorted results, append `last_index=230906248` and `last_disbursement_date=2014-07-04` to the URL.  We strongly advise paging through these results by using the sort indices (defaults to sort by disbursement date, e.g. `last_disbursement_date`), otherwise some resources may be unintentionally filtered out. This resource uses keyset pagination to improve query performance and these indices are required to properly page through this large dataset. Note: because the Schedule B data includes many records, counts for large result sets are approximate; you will want to page through the records until no records are returned.
             *
             * @tags disbursements
             * @name SchedulesScheduleBList
             * @request GET:/v1/schedules/schedule_b/
             * @secure
             */
            schedulesScheduleBList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/schedules/schedule_b/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Schedule B disbursements aggregated by disbursement purpose category. To avoid double counting, memoed items are not included. Purpose is a combination of transaction codes, category codes and disbursement description. Inspect the `disbursement_purpose` sql function within the migrations for more details.
             *
             * @tags disbursements
             * @name SchedulesScheduleBByPurposeList
             * @request GET:/v1/schedules/schedule_b/by_purpose/
             * @secure
             */
            schedulesScheduleBByPurposeList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/schedules/schedule_b/by_purpose/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Schedule B disbursements aggregated by recipient name. To avoid double counting, memoed items are not included.
             *
             * @tags disbursements
             * @name SchedulesScheduleBByRecipientList
             * @request GET:/v1/schedules/schedule_b/by_recipient/
             * @secure
             */
            schedulesScheduleBByRecipientList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/schedules/schedule_b/by_recipient/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Schedule B disbursements aggregated by recipient committee ID, if applicable. To avoid double counting, memoed items are not included.
             *
             * @tags disbursements
             * @name SchedulesScheduleBByRecipientIdList
             * @request GET:/v1/schedules/schedule_b/by_recipient_id/
             * @secure
             */
            schedulesScheduleBByRecipientIdList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/schedules/schedule_b/by_recipient_id/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Efiling endpoints provide real-time campaign finance data received from electronic filers. Efiling endpoints only contain the most recent four months of data and don't contain the processed and coded data that you can find on other endpoints.
             *
             * @tags disbursements
             * @name SchedulesScheduleBEfileList
             * @request GET:/v1/schedules/schedule_b/efile/
             * @secure
             */
            schedulesScheduleBEfileList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/schedules/schedule_b/efile/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Schedule B filings describe itemized disbursements. This data explains how committees and other filers spend their money. These figures are reported as part of forms F3, F3X and F3P. The data are divided in two-year periods, called `two_year_transaction_period`, which is derived from the `report_year` submitted of the corresponding form. If no value is supplied, the results will default to the most recent two-year period that is named after the ending, even-numbered year. Due to the large quantity of Schedule B filings, this endpoint is not paginated by page number. Instead, you can request the next page of results by adding the values in the `last_indexes` object from `pagination` to the URL of your last request. For example, when sorting by `disbursement_date`, you might receive a page of results with the following pagination information: ``` pagination: { pages: 965191, per_page: 20, count: 19303814, is_count_exact: False, last_indexes: { last_index: "230906248", last_disbursement_date: "2014-07-04" } } ``` To fetch the next page of sorted results, append `last_index=230906248` and `last_disbursement_date=2014-07-04` to the URL.  We strongly advise paging through these results by using the sort indices (defaults to sort by disbursement date, e.g. `last_disbursement_date`), otherwise some resources may be unintentionally filtered out. This resource uses keyset pagination to improve query performance and these indices are required to properly page through this large dataset. Note: because the Schedule B data includes many records, counts for large result sets are approximate; you will want to page through the records until no records are returned.
             *
             * @tags disbursements
             * @name SchedulesScheduleBDetail
             * @request GET:/v1/schedules/schedule_b/{sub_id}/
             * @secure
             */
            schedulesScheduleBDetail: function (subId, query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/schedules/schedule_b/".concat(subId, "/"), method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Schedule C shows all loans, endorsements and loan guarantees a committee receives or makes. The committee continues to report the loan until it is repaid.
             *
             * @tags loans
             * @name SchedulesScheduleCList
             * @request GET:/v1/schedules/schedule_c/
             * @secure
             */
            schedulesScheduleCList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/schedules/schedule_c/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Schedule C shows all loans, endorsements and loan guarantees a committee receives or makes. The committee continues to report the loan until it is repaid.
             *
             * @tags loans
             * @name SchedulesScheduleCDetail
             * @request GET:/v1/schedules/schedule_c/{sub_id}/
             * @secure
             */
            schedulesScheduleCDetail: function (subId, query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/schedules/schedule_c/".concat(subId, "/"), method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Schedule D, it shows debts and obligations owed to or by the committee that are required to be disclosed.
             *
             * @tags debts
             * @name SchedulesScheduleDList
             * @request GET:/v1/schedules/schedule_d/
             * @secure
             */
            schedulesScheduleDList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/schedules/schedule_d/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Schedule D, it shows debts and obligations owed to or by the committee that are required to be disclosed.
             *
             * @tags debts
             * @name SchedulesScheduleDDetail
             * @request GET:/v1/schedules/schedule_d/{sub_id}/
             * @secure
             */
            schedulesScheduleDDetail: function (subId, query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/schedules/schedule_d/".concat(subId, "/"), method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Schedule E covers the line item expenditures for independent expenditures. For example, if a super PAC bought ads on TV to oppose a federal candidate, each ad purchase would be recorded here with the expenditure amount, name and id of the candidate, and whether the ad supported or opposed the candidate. An independent expenditure is an expenditure for a communication "expressly advocating the election or defeat of a clearly identified candidate that is not made in cooperation, consultation, or concert with, or at the request or suggestion of, a candidate, a candidate’s authorized committee, or their agents, or a political party or its agents." Aggregates by candidate do not include 24 and 48 hour reports. This ensures we don't double count expenditures and the totals are more accurate. You can still find the information from 24 and 48 hour reports in `/schedule/schedule_e/`. Due to the large quantity of Schedule E filings, this endpoint is not paginated by page number. Instead, you can request the next page of results by adding the values in the `last_indexes` object from `pagination` to the URL of your last request. For example, when sorting by `expenditure_amount`, you might receive a page of results with the following pagination information: ``` "pagination": { "count": 152623, "is_count_exact": True, "last_indexes": { "last_index": "3023037", "last_expenditure_amount": -17348.5 }, "per_page": 20, "pages": 7632 } } ``` To fetch the next page of sorted results, append `last_index=3023037` and `last_expenditure_amount=` to the URL.  We strongly advise paging through these results by using the sort indices (defaults to sort by disbursement date, e.g. `last_disbursement_date`), otherwise some resources may be unintentionally filtered out.  This resource uses keyset pagination to improve query performance and these indices are required to properly page through this large dataset. Note: because the Schedule E data includes many records, counts for large result sets are approximate; you will want to page through the records until no records are returned.
             *
             * @tags independent expenditures
             * @name SchedulesScheduleEList
             * @request GET:/v1/schedules/schedule_e/
             * @secure
             */
            schedulesScheduleEList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/schedules/schedule_e/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Schedule E receipts aggregated by recipient candidate. To avoid double counting, memoed items are not included.
             *
             * @tags independent expenditures
             * @name SchedulesScheduleEByCandidateList
             * @request GET:/v1/schedules/schedule_e/by_candidate/
             * @secure
             */
            schedulesScheduleEByCandidateList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/schedules/schedule_e/by_candidate/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Efiling endpoints provide real-time campaign finance data received from electronic filers. Efiling endpoints only contain the most recent four months of data and don't contain the processed and coded data that you can find on other endpoints.
             *
             * @tags independent expenditures
             * @name SchedulesScheduleEEfileList
             * @request GET:/v1/schedules/schedule_e/efile/
             * @secure
             */
            schedulesScheduleEEfileList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/schedules/schedule_e/efile/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Total independent expenditure on supported or opposed candidates by cycle or candidate election year.
             *
             * @tags independent expenditures
             * @name SchedulesScheduleETotalsByCandidateList
             * @request GET:/v1/schedules/schedule_e/totals/by_candidate/
             * @secure
             */
            schedulesScheduleETotalsByCandidateList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/schedules/schedule_e/totals/by_candidate/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Schedule F, it shows all special expenditures a national or state party committee makes in connection with the general election campaigns of federal candidates. These coordinated party expenditures do not count against the contribution limits but are subject to other limits, these limits are detailed in Chapter 7 of the FEC Campaign Guide for Political Party Committees.
             *
             * @tags party-coordinated expenditures
             * @name SchedulesScheduleFList
             * @request GET:/v1/schedules/schedule_f/
             * @secure
             */
            schedulesScheduleFList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/schedules/schedule_f/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Schedule F, it shows all special expenditures a national or state party committee makes in connection with the general election campaigns of federal candidates. These coordinated party expenditures do not count against the contribution limits but are subject to other limits, these limits are detailed in Chapter 7 of the FEC Campaign Guide for Political Party Committees.
             *
             * @tags party-coordinated expenditures
             * @name SchedulesScheduleFDetail
             * @request GET:/v1/schedules/schedule_f/{sub_id}/
             * @secure
             */
            schedulesScheduleFDetail: function (subId, query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/schedules/schedule_f/".concat(subId, "/"), method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Schedule H4 filings describe disbursements for allocated federal/nonfederal activity. This data demonstrates how separate segregated funds, party committees and nonconnected committees that are active in both federal and nonfederal elections, and have established separate federal and nonfederal accounts, allocate their activity. These figures are reported on Form 3X. The data are divided in two-year periods, called `two_year_transaction_period`, which are derived from the `report_year` submitted on Form 3X. If no value is supplied, the results will default to the most recent two-year period.
             *
             * @tags disbursements
             * @name SchedulesScheduleH4List
             * @request GET:/v1/schedules/schedule_h4/
             * @secure
             */
            schedulesScheduleH4List: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/schedules/schedule_h4/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Efiling endpoints provide real-time campaign finance data received from electronic filers. Efiling endpoints only contain the most recent four months of data and don't contain the processed and coded data that you can find on other endpoints.
             *
             * @tags disbursements
             * @name SchedulesScheduleH4EfileList
             * @request GET:/v1/schedules/schedule_h4/efile/
             * @secure
             */
            schedulesScheduleH4EfileList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/schedules/schedule_h4/efile/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description State laws and procedures govern elections for state or local offices as well as how candidates appear on election ballots. Contact the appropriate state election office for more information.
             *
             * @tags filer resources
             * @name StateElectionOfficeList
             * @request GET:/v1/state-election-office/
             * @secure
             */
            stateElectionOfficeList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/state-election-office/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description Provides cumulative receipt totals by entity type, over a two year cycle. Totals are adjusted to avoid double counting. This is [the sql](https://github.com/fecgov/openFEC/blob/develop/data/migrations/V41__large_aggregates.sql) that creates these calculations.
             *
             * @tags financial
             * @name TotalsByEntityList
             * @request GET:/v1/totals/by_entity/
             * @secure
             */
            totalsByEntityList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/totals/by_entity/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description This endpoint provides information about an inaugural committee's Form 13 report of donations accepted. The data is aggregated by the contributor and the two-year period. We refer to two-year periods as a `cycle`.
             *
             * @tags financial
             * @name TotalsInauguralCommitteesByContributorList
             * @request GET:/v1/totals/inaugural_committees/by_contributor/
             * @secure
             */
            totalsInauguralCommitteesByContributorList: function (query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/totals/inaugural_committees/by_contributor/", method: "GET", query: query, secure: true }, params));
            },
            /**
             * @description This endpoint provides information about a committee's Form 3, Form 3X, or Form 3P financial reports, which are aggregated by two-year period. We refer to two-year periods as a `cycle`. The cycle is named after the even-numbered year and includes the year before it. To obtain totals from 2013 and 2014, you would use 2014. In odd-numbered years, the current cycle is the next year — for example, in 2015, the current cycle is 2016. For presidential and Senate candidates, multiple two-year cycles exist between elections.
             *
             * @tags financial
             * @name TotalsDetail
             * @request GET:/v1/totals/{entity_type}/
             * @secure
             */
            totalsDetail: function (entityType, query, params) {
                if (params === void 0) { params = {}; }
                return _this.request(__assign({ path: "/v1/totals/".concat(entityType, "/"), method: "GET", query: query, secure: true }, params));
            },
        };
        return _this;
    }
    return Api;
}(HttpClient));
exports.Api = Api;
