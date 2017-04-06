'use strict';

exports.ScoreFunction = require('./score-function');
exports.ScriptScoreFunction = require('./script-score-function');
exports.WeightFunction = require('./score-function'); // Alias for `ScoreFunction`
exports.RandomScoreFunction = require('./random-score-function');
exports.FieldValueFactorFunction = require('./field-value-factor-function');
exports.DecayScoreFunction = require('./decay-score-function');
