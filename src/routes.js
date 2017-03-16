function routes(handlers) {
    const routeArr = [
    {
        method: 'GET',
        path: '/js/{file*}',
        handler: handlers.js
    },
    {
        method: 'GET',
        path: '/',
        handler: handlers.index
    },
    {
        method: 'GET',
        path: '/version',
        handler: handlers.version
    },
    {
        method: 'POST',
        path: '/identify',
        handler: handlers.identifyPeople
    }];

    return routeArr;
}

module.exports = routes;
