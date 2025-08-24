"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hydrateStateExpenditures = hydrateStateExpenditures;
function hydrateStateExpenditures(stateExpenditures, allExpenditures) {
    var populatedStateExpenditures = {
        by_committee: {},
        by_race: {},
        total: stateExpenditures.total,
    };
    // Populate expenditures by committee
    var committeeIds = Object.keys(stateExpenditures.by_committee);
    for (var _i = 0, committeeIds_1 = committeeIds; _i < committeeIds_1.length; _i++) {
        var committeeId = committeeIds_1[_i];
        populatedStateExpenditures.by_committee[committeeId] = {
            expenditures: [],
            total: stateExpenditures.by_committee[committeeId]["total"],
        };
        populatedStateExpenditures.by_committee[committeeId]["expenditures"] =
            stateExpenditures.by_committee[committeeId]["expenditures"].map(function (expenditureId) { return allExpenditures[expenditureId]; });
    }
    // Populate expenditures by race
    var raceIds = Object.keys(stateExpenditures.by_race);
    for (var _a = 0, raceIds_1 = raceIds; _a < raceIds_1.length; _a++) {
        var raceId = raceIds_1[_a];
        populatedStateExpenditures.by_race[raceId] = {
            expenditures: [],
            details: stateExpenditures.by_race[raceId]["details"],
            total: stateExpenditures.by_race[raceId]["total"],
        };
        populatedStateExpenditures.by_race[raceId]["expenditures"] =
            stateExpenditures.by_race[raceId]["expenditures"].map(function (expenditureId) { return allExpenditures[expenditureId]; });
    }
    return populatedStateExpenditures;
}
