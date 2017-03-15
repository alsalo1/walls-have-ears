const MQTT = require('mqtt');

function kontaktMQTT() {
    const options = {
        host: 'ovs.kontakt.io',
        port: '8083',
        protocol: 'mqtts',
        username: 'wallsHaveEars',
        password: process.env.KONTAKT_IO_API_KEY
    };

    const client = MQTT.connect(options);

    client.on('connect', () => {
        console.log('MQTT client connected');
        client.subscribe('/presence/stream/8c5bdd4a-3393-4a6c-90fc-0d900c58842d');
    });

    client.on('message', (topic, msg) => {
        console.log('topic', topic);
        msgObj = JSON.parse(msg.toString());
        console.log('msgObj', JSON.stringify(msgObj, null, 2));
    });

    client.on('error', (err) => {
        console.log('ERROR', JSON.stringify(err, null, 2))
    });
}

module.exports = kontaktMQTT;
