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
        new Identify.findFace("https://www.linkedin.com/mpr/mpr/p/1/000/101/306/13ae4eb.jpg")
        .then((names) => {
            reply({"Identification results: " : JSON.stringify(names)}).code(200);
        })
        .catch((err) => {
            console.log(JSON.stringify(err, null, 2));
            reply({"Identification results" : []}).code(500);
        });
    }

    return {
        index,
        version,
        identifyPeople
    };
}

module.exports = handlers;
