"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaceType = exports.Party = void 0;
var Party;
(function (Party) {
    Party["Democratic"] = "D";
    Party["Republican"] = "R";
    Party["Libertarian"] = "L";
    Party["Green"] = "G";
    Party["Independent"] = "I";
    Party["Nonpartisan"] = "N";
})(Party || (exports.Party = Party = {}));
var RaceType;
(function (RaceType) {
    RaceType["General"] = "general";
    RaceType["Primary"] = "primary";
    RaceType["PrimaryRunoff"] = "primary_runoff";
    RaceType["Convention"] = "convention";
    RaceType["Special"] = "special";
})(RaceType || (exports.RaceType = RaceType = {}));
