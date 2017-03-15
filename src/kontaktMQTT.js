const MQTT = require('mqtt');

function kontaktMQTT() {
    const options = {
        host: 'ovs.kontakt.io',
        port: '8083',
        protocol: 'mqtts',
        username: 'wallsHaveEars',
        password: process.env.KONTAKT_IO_API_KEY
    };

    let msgCb = null;

    const client = MQTT.connect(options);

    client.on('connect', () => {
        console.log('MQTT client connected');
        client.subscribe('/presence/stream/8c5bdd4a-3393-4a6c-90fc-0d900c58842d');
    });

    client.on('message', (topic, msg) => {
        msgObj = JSON.parse(msg.toString());

        let filteredObj = msgObj.filter((el) => {
            return (el.proximity === 'IMMEDIATE' || el.proximity === 'NEAR');
        });

        if(msgCb != null) {
            msgCb(filteredObj);
        }

        filteredObj = filteredObj.filter((el) => {
            return (el.trackingId === 'xb8g' || el.trackingId === 'SEjA' || el.trackingId === 'fb:ed:84:b3:47:93');
        });

        if(filteredObj.length > 0) {
            console.log('filteredObj', JSON.stringify(filteredObj, null, 2));
        }
    });

    client.on('error', (err) => {
        console.error('ERROR', err);
    });

    function setMsgCb(cb) {
        msgCb = cb;
    }

    return {
        setMsgCb
    };
}

module.exports = kontaktMQTT;
