const pkg = require('../package.json');
const Identify = require('./identifyPeople.js');

function handlers() {
    function version(req, reply) {
        reply({version: pkg.version}).code(200);
    }

    function identifyPeople(req, reply) {
        new Identify.findFace("https://www.linkedin.com/mpr/mpr/p/1/000/101/306/13ae4eb.jpg")
        .then((result) => {
            reply({"identify " : true}).code(200);
        })
        .catch((err) => {
            console.log(JSON.stringify(err, null, 2));
            reply({"identify" : false}).code(500);
        });
    }

    return {
        version,
        identifyPeople
    };
}

module.exports = handlers;
