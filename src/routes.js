function routes(handlers) {
    const routeArr = [{
        method: 'GET',
        path: '/version',
        handler: handlers.version
    }];

    return routeArr;
}

module.exports = routes;
