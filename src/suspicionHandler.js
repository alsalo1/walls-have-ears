function suspicionHandler() {
    const gatewayLocations = {
        '1xwzn':  { x: 1001, y: 73, ppm: 32.5 }
    };

    function rssiToPixels(ppm, rssi) {

    }

    function suspicion(data) {
        let loc = gatewayLocations[data.source];
        let pixels = rssiToPixels(loc.ppm, data.rssi);
        /*notifySuspicion({
            user: data.user,
            location: {
                x: loc.x,
                y: loc.y,
                radius: pixels
            }
        });*/
    }

    return {
        suspicion
    };
}

module.exports = suspicionHandler;
