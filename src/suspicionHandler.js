function suspicionHandler(server, notifier) {
    const gatewayLocations = {
        '1xwzn': { x: 1001, y: 73, ppm: 32.5 },
        'ZWZIm': { x: 315, y: 390, ppm: 32.5 }
    };

    function rssiToPixels(ppm, rssi) {
        let dist = 3;

        if(rssi < -77) {
            rssi += 77;
            rssi = Math.abs(rssi);
            dist = rssi;
        }

        return dist * ppm;
    }

    function suspicion(data) {
        let loc = { x: -1, y: -1, ppm: 32.5 };

        if(gatewayLocations.hasOwnProperty(data.source)) {
            loc = gatewayLocations[data.source];
        }

        let pixels = rssiToPixels(loc.ppm, data.rssi);

        /*console.log({
            user: data.user,
            location: {
                x: loc.x,
                y: loc.y,
                radius: pixels
            },
            isOK: data.isOK
        });*/

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
