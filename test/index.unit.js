'use strict';

var should = require('chai').should();

describe('Index Exports', function() {
  it('will export quantisnetcore-lib', function() {
    var quantisnetcore = require('../');
    should.exist(quantisnetcore.lib);
    should.exist(quantisnetcore.lib.Transaction);
    should.exist(quantisnetcore.lib.Block);
  });
});
