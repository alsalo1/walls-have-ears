const Mysql = require('mysql');

function dbConnector(kontaktMQTT, suspicionHandler) {
    const options = {
        host: 'ears.westeurope.cloudapp.azure.com',
        user: process.env.MY_SQL_USER,
        password: process.env.MY_SQL_PASSWORD,
        database: 'testSchema',
        multipleStatements: true
    };

    const dbConnection = Mysql.createConnection(options);

    function insertData(data) {
        data.forEach((el) => {
            let query;

            if(el.trackingId.length < 17) {
                query = 'CALL addTagIdToStream(?, ?, 20)';
            } else {
                query = 'CALL addMacIdToStream(?, ?, 20)';
            }

            dbConnection.query(query, [el.sourceId, el.trackingId], (err, rows) => {
                if(err) {
                    console.log('DB error', err.stack);
                } else {
                    if(rows[0][0].userName != null && rows[0][0].occurences == 0) {
                        console.log(rows[0][0]);
                        suspicionHandler.suspicion({
                            user: rows[0][0].userName,
                            source: el.sourceId,
                            rssi: el.rssi
                        });
                    }
                }
            });
        });
    }

    dbConnection.connect((err) => {
        if(err) {
            console.log('DB connect error', err.stack);
        } else {
            console.log('DB connected');
            kontaktMQTT.setMsgCb(insertData);
        }
    });
}

module.exports = dbConnector;
