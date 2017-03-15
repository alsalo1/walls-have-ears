console.log('server.js');
const Hapi = require('hapi');
require('hapi-bluebird');
const Handlers = require('./handlers.js');
const KontaktMQTT = require('./kontaktMQTT.js');
const routes = require('./routes.js');

const handlers = new Handlers();
const server   = new Hapi.Server();

server.connection({
    address: '0.0.0.0',
    port: 80
});

server.route(routes(handlers));

server.start().then(() => {
    console.log('Server started at', server.info.uri);
    const kontaktMQTT = new KontaktMQTT();
}).catch((err) => {
    console.log(JSON.stringify(err, null, 2));
});
