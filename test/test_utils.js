/**
 * Created by grizet_j on 9/21/2015.
 */
module.exports = TEST;

var Matrix2 = require('../src/matrix2.js');
var Matrix3 = require('../src/matrix3.js');
var Matrix4 = require('../src/matrix4.js');
var Vector2 = require('../src/vector2.js');
var Vector3 = require('../src/vector3.js');
var Vector4 = require('../src/vector4.js');

function TEST() {}

TEST.relativeError = function(calculated, correct) {
    if (calculated.isNumber && correct.isNumber && correct != 0.0) {
        var diff = Math.abs(calculated - correct);
        return diff / correct;
    }
    return 0.0;
};


TEST.relativeTest = function(test, output, expectedOutput) {
    var errorThreshold = 0.0005;
    var error = Math.abs(TEST.relativeError(output, expectedOutput));
    test.ok(error < errorThreshold, "relativeTest: difference is under " + errorThreshold);
};

TEST.absoluteTest = function(test, output, expectedOutput) {
    var errorThreshold = 0.0005;
    var error = Math.abs(TEST.absoluteError(output, expectedOutput));
    test.ok(error < errorThreshold, "absoluteTest: difference is under " + errorThreshold);
};

TEST.makeMatrix = function (rows, cols) {
    if (rows != cols) {
        return null;
    }

    if (cols == 2) {
        return Matrix2.zero;
    }
    if (cols == 3) {
        return Matrix3.zero;
    }
    if (cols == 4) {
        return Matrix4.zero;
    }
    return null;
};

TEST.parseMatrix = function(input) {
    input = input.trim();
    rows = input.split("\n");
    values = [];
    col_count = 0;
    for (i = 0; i < rows.length; i++) {
        rows[i] = rows[i].trim();
        cols = rows[i].split(" ");
        for (j = 0; j < cols.length; j++) {
            cols[j] = cols[j].trim();
        }

        for (j = 0; j < cols.length; j++) {
            if (cols[j].isEmpty) {
                continue;
            }
            if (i == 0) {
                col_count++;
            }
            values.add(parseFloat(cols[j]));
        }
    }

    var m = makeMatrix(rows.length, col_count);
    for (j = 0; j < rows.length; j++) {
        for (i = 0; i < col_count; i++) {
            m[m.index(j, i)] = values[j * col_count + i];
            //m[i][j] = values[j*col_count+i];
        }
    }

    return m;
};

TEST.parseVector = function(v) {
    v = v.trim();
    pattern = new RegExp('[\\s]+',true, false);
    rows = v.split(pattern.toString());
    values = [];
    for (i = 0; i < rows.length; i++) {
        rows[i] = rows[i].trim();
        if (rows[i].isEmpty) {
            continue;
        }
        values.add(parseFloat(rows[i]));
    }

    var r;
    if (values.length == 2) {
        r = new Vector2(values[0], values[1]);
    } else if (values.length == 3) {
        r = new Vector3(values[0], values[1], values[2]);
    } else if (values.length == 4) {
        r = new Vector4(values[0], values[1], values[2], values[3]);
    }

    return r;
};
