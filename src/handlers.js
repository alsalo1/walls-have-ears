const pkg = require('../package.json');
const Identify = require('./identifyPeople.js');
const request = require('request-promise');

function handlers() {
    function index(req, reply) {
        reply.view('index');
    }

    const img = {
        directory: {
            path: `${__dirname}/../img`
        }
    };

    const js = {
        directory: {
            path: `${__dirname}/client-js`
        }
    };

    function version(req, reply) {
        reply({version: pkg.version}).code(200);
    }

    function identifyPeople(req, reply) {
        if (!req.payload && !req.payload.url) {
            reply("Expected 'url' paramater").code(400);
            return;
        }
        Identify.findFace(req.payload.url)
        .then((names) => {
            reply({"identities" : names}).code(200);
        })
        .catch((err) => {
            console.log(JSON.stringify(err, null, 2));
            reply({"identities" : []}).code(500);
        });
    }

    return {
        index,
        img,
        js,
        version,
        identifyPeople
    };
}

module.exports = handlers;
