const pkg = require('../package.json');

function handlers() {
    function version(req, reply) {
        reply({version: pkg.version}).code(200);
    }

    return {
        version
    };
}

module.exports = handlers;
