const pkg = require('../package.json');
const Identify = require('./identifyPeople.js');

function handlers() {
    function index(req, reply) {
        reply.view('index', {
            users: [
                'hello'
            ]
        });
    }

    function version(req, reply) {
        reply({version: pkg.version}).code(200);
    }

    function identifyPeople(req, reply) {
        if (!req.payload || !req.payload.url) {
            reply("Expected 'url' parameter").code(400);
            return;
        }
        let imageUrl = req.payload.url;
        Identify.findFace(imageUrl)
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
        version,
        identifyPeople
    };
}

module.exports = handlers;
