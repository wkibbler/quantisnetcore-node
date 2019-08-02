'use strict';

var path = require('path');
var async = require('async');
var spawn = require('child_process').spawn;

var QuantsisnetdRPC = require('@quantisnetevo/quantisnetd-rpc');
var rimraf = require('rimraf');
var quantisnetcore = require('@quantisnetevo/quantisnetcore-lib');
var chai = require('chai');
var should = chai.should();

var index = require('..');
var log = index.log;
log.debug = function() {};
var QuantsisnetcoreNode = index.Node;
var QuantsisnetService = index.services.Quantsisnet;

describe('Quantsisnet Cluster', function() {
  var node;
  var daemons = [];
  var execPath = path.resolve(__dirname, process.env.HOME, './.quantisnetcore/data/quantisnetd')
  var nodesConf = [
    {
      datadir: path.resolve(__dirname, './data/node1'),
      conf: path.resolve(__dirname, './data/node1/quantisnet.conf'),
      rpcuser: 'quantisnet',
      rpcpassword: 'local321',
      rpcport: 30521,
      zmqpubrawtx: 'tcp://127.0.0.1:30611',
      zmqpubhashblock: 'tcp://127.0.0.1:30611'
    },
    {
      datadir: path.resolve(__dirname, './data/node2'),
      conf: path.resolve(__dirname, './data/node2/quantisnet.conf'),
      rpcuser: 'quantisnet',
      rpcpassword: 'local321',
      rpcport: 30522,
      zmqpubrawtx: 'tcp://127.0.0.1:30622',
      zmqpubhashblock: 'tcp://127.0.0.1:30622'
    },
    {
      datadir: path.resolve(__dirname, './data/node3'),
      conf: path.resolve(__dirname, './data/node3/quantisnet.conf'),
      rpcuser: 'quantisnet',
      rpcpassword: 'local321',
      rpcport: 30523,
      zmqpubrawtx: 'tcp://127.0.0.1:30633',
      zmqpubhashblock: 'tcp://127.0.0.1:30633'
    }
  ];

  before(function(done) {
    log.info('Starting 3 quantisnetd daemons');
    this.timeout(200000);
    async.each(nodesConf, function(nodeConf, next) {
      var opts = [
        '--regtest',
        '--datadir=' + nodeConf.datadir,
        '--conf=' + nodeConf.conf
      ];

      rimraf(path.resolve(nodeConf.datadir, './regtest'), function(err) {
        if (err) {
          return done(err);
        }

        var process = spawn(execPath, opts, {stdio: 'inherit'});

        var client = new QuantsisnetdRPC({
          protocol: 'http',
          host: '127.0.0.1',
          port: nodeConf.rpcport,
          user: nodeConf.rpcuser,
          pass: nodeConf.rpcpassword
        });

        daemons.push(process);

        async.retry({times: 10, interval: 5000}, function(ready) {
          client.getInfo(ready);
        }, next);

      });

    }, done);
  });

  after(function(done) {
    this.timeout(10000);
    setTimeout(function() {
      async.each(daemons, function(process, next) {
        process.once('exit', next);
        process.kill('SIGINT');
      }, done);
    }, 1000);
  });

  it('step 1: will connect to three quantisnetd daemons', function(done) {
    this.timeout(20000);
    var configuration = {
      network: 'regtest',
      services: [
        {
          name: 'quantisnetd',
          module: QuantsisnetService,
          config: {
            connect: [
              {
                rpchost: '127.0.0.1',
                rpcport: 30521,
                rpcuser: 'quantisnet',
                rpcpassword: 'local321',
                zmqpubrawtx: 'tcp://127.0.0.1:30611'
              },
              {
                rpchost: '127.0.0.1',
                rpcport: 30522,
                rpcuser: 'quantisnet',
                rpcpassword: 'local321',
                zmqpubrawtx: 'tcp://127.0.0.1:30622'
              },
              {
                rpchost: '127.0.0.1',
                rpcport: 30523,
                rpcuser: 'quantisnet',
                rpcpassword: 'local321',
                zmqpubrawtx: 'tcp://127.0.0.1:30633'
              }
            ]
          }
        }
      ]
    };

    var regtest = quantisnetcore.Networks.get('regtest');
    should.exist(regtest);

    node = new QuantsisnetcoreNode(configuration);

    node.on('error', function(err) {
      log.error(err);
    });

    node.on('ready', function() {
      done();
    });

    node.start(function(err) {
      if (err) {
        return done(err);
      }
    });

  });

  it('step 2: receive block events', function(done) {
    this.timeout(10000);
    node.services.quantisnetd.once('tip', function(height) {
      height.should.equal(1);
      done();
    });
    node.generateBlock(1, function(err, hashes) {
      if (err) {
        return done(err);
      }
      should.exist(hashes);
    });
  });

  it('step 3: get blocks', function(done) {
    async.times(3, function(n, next) {
      node.getBlock(1, function(err, block) {
        if (err) {
          return next(err);
        }
        should.exist(block);
        next();
      });
    }, done);
  });

});
