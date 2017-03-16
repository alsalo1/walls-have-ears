const pkg = require('../package.json');
const Identify = require('./identifyPeople.js');

function handlers() {
    function index(req, reply) {
        reply.view('index');
    }

    const img = {
        directory: {
            path: '../img'
        }
    };

    const js = {
        directory: {
            path: 'client-js'
        }
    };

    function version(req, reply) {
        reply({version: pkg.version}).code(200);
    }

    function identifyPeople(req, reply) {
        if (!req.payload) {
            reply("Expected image file").code(400);
            return;
        }
        Identify.findFace(req.payload)
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
