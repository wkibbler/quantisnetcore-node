Quantsisnetcore Node
============

A Quantsisnet full node for building applications and services with Node.js. A node is extensible and can be configured to run additional services. At the minimum a node has an interface to [Quantsisnet Core (quantisnetd) v0.13.0](https://github.com/quantisnetpay/quantisnet/tree/v0.13.0.x) for more advanced address queries. Additional services can be enabled to make a node more useful such as exposing new APIs, running a block explorer and wallet service.

## Usages

### As a standalone server

```bash
git clone https://github.com/quantisnetevo/quantisnetcore-node
cd quantisnetcore-node
npm install
./bin/quantisnetcore-node start
```

When running the start command, it will seek for a .quantisnetcore folder with a quantisnetcore-node.json conf file.
If it doesn't exist, it will create it, with basic task to connect to quantisnetd.

Some plugins are available :

- Insight-API : `./bin/quantisnetcore-node addservice @quantisnetevo/insight-api`
- Insight-UI : `./bin/quantisnetcore-node addservice @quantisnetevo/insight-ui`

You also might want to add these index to your quantisnet.conf file :
```
-addressindex
-timestampindex
-spentindex
```

### As a library

```bash
npm install @quantisnetevo/quantisnetcore-node
```

```javascript
const quantisnetcore = require('@quantisnetevo/quantisnetcore-node');
const config = require('./quantisnetcore-node.json');

let node = quantisnetcore.scaffold.start({ path: "", config: config });
node.on('ready', function() {
    //Quantsisnet core started
    quantisnetd.on('tx', function(txData) {
        let tx = new quantisnetcore.lib.Transaction(txData);
    });
});
```

## Prerequisites

- Quantsisnet Core (quantisnetd) (v0.13.0) with support for additional indexing *(see above)*
- Node.js v8+
- ZeroMQ *(libzmq3-dev for Ubuntu/Debian or zeromq on OSX)*
- ~20GB of disk storage
- ~1GB of RAM

## Configuration

Quantsisnetcore includes a Command Line Interface (CLI) for managing, configuring and interfacing with your Quantsisnetcore Node.

```bash
quantisnetcore-node create -d <quantisnet-data-dir> mynode
cd mynode
quantisnetcore-node install <service>
quantisnetcore-node install https://github.com/yourname/helloworld
quantisnetcore-node start
```

This will create a directory with configuration files for your node and install the necessary dependencies.

Please note that [Quantsisnet Core](https://github.com/quantisnetpay/quantisnet/tree/master) needs to be installed first.

For more information about (and developing) services, please see the [Service Documentation](docs/services.md).

## Add-on Services

There are several add-on services available to extend the functionality of Bitcore:

- [Insight API](https://github.com/quantisnetevo/insight-api/tree/master)
- [Insight UI](https://github.com/quantisnetevo/insight-ui/tree/master)
- [Bitcore Wallet Service](https://github.com/quantisnetevo/quantisnetcore-wallet-service/tree/master)

## Documentation

- [Upgrade Notes](docs/upgrade.md)
- [Services](docs/services.md)
  - [Quantsisnetd](docs/services/quantisnetd.md) - Interface to Quantsisnet Core
  - [Web](docs/services/web.md) - Creates an express application over which services can expose their web/API content
- [Development Environment](docs/development.md) - Guide for setting up a development environment
- [Node](docs/node.md) - Details on the node constructor
- [Bus](docs/bus.md) - Overview of the event bus constructor
- [Release Process](docs/release.md) - Information about verifying a release and the release process.


## Setting up dev environment (with Insight)

Prerequisite : Having a quantisnetd node already runing `quantisnetd --daemon`.

Quantsisnetcore-node : `git clone https://github.com/quantisnetevo/quantisnetcore-node -b develop`
Insight-api (optional) : `git clone https://github.com/quantisnetevo/insight-api -b develop`
Insight-UI (optional) : `git clone https://github.com/quantisnetevo/insight-ui -b develop`

Install them :
```
cd quantisnetcore-node && npm install \
 && cd ../insight-ui && npm install \
 && cd ../insight-api && npm install && cd ..
```

Symbolic linking in parent folder :
```
npm link ../insight-api
npm link ../insight-ui
```

Start with `./bin/quantisnetcore-node start` to first generate a ~/.quantisnetcore/quantisnetcore-node.json file.
Append this file with `"@quantisnetevo/insight-ui"` and `"@quantisnetevo/insight-api"` in the services array.

## Contributing

Please send pull requests for bug fixes, code optimization, and ideas for improvement. For more information on how to contribute, please refer to our [CONTRIBUTING](https://github.com/quantisnetevo/quantisnetcore/blob/master/CONTRIBUTING.md) file.

## License

Code released under [the MIT license](https://github.com/quantisnetevo/quantisnetcore-node/blob/master/LICENSE).

Copyright 2016-2018 Quantsisnet Core Group, Inc.

- bitcoin: Copyright (c) 2009-2015 Bitcoin Core Developers (MIT License)
