'use strict';

var createError = require('errno').create;

var QuantsisnetcoreNodeError = createError('QuantsisnetcoreNodeError');

var RPCError = createError('RPCError', QuantsisnetcoreNodeError);

module.exports = {
  Error: QuantsisnetcoreNodeError,
  RPCError: RPCError
};
