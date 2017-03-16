const Hapi = require('hapi');
require('hapi-bluebird');
const DbConnector = require('./dbConnector.js');
const Handlers = require('./handlers.js');
const KontaktMQTT = require('./kontaktMQTT.js');
const routes = require('./routes.js');
const SuspicionHandler = require('./suspicionHandler.js');

const handlers = new Handlers();
const server   = new Hapi.Server();

function checkEnv() {
    const requiredVars = [
        'COGNITIVE_SUBSCRIPTION_ID',
        'KONTAKT_IO_API_KEY',
        'MY_SQL_PASSWORD',
        'MY_SQL_USER'
    ]

    requiredVars.forEach(key => {
        if (process.env[key] === undefined) {
            throw new Error(`Environment variable "${key}" must be defined.`);
        }
    });
}

checkEnv();

server.connection({
    address: '0.0.0.0',
    port: process.env.PORT || 8000
});

server.register([require('vision'), require('nes'), require('inert')])
.then(() => {
    server.views(require('./views'));
    server.route(routes(handlers));
})
.then(() => {
    return server.start();
})
.then(() => {
    console.log('Server started at', server.info.uri);
    const kontaktMQTT = new KontaktMQTT();
    const suspicionHandler = new SuspicionHandler(server);
    const dbConnector = new DbConnector(kontaktMQTT, suspicionHandler);
}).catch((err) => {
    console.error(JSON.stringify(err, null, 2), err);
});
