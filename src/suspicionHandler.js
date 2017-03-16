function suspicionHandler(server) {
    const gatewayLocations = {
        '1xwzn':  { x: 1001, y: 73, ppm: 32.5 }
    };

    function rssiToPixels(ppm, rssi) {
        return 0;
    }

    function suspicion(data) {
        let loc = gatewayLocations[data.source];
        let pixels = rssiToPixels(loc.ppm, data.rssi);

        server.broadcast({
            user: data.user,
            location: {
                x: loc.x,
                y: loc.y,
                radius: pixels
            },
            isOK: data.isOK
        });
    }

    return {
        suspicion
    };
}

module.exports = suspicionHandler;
