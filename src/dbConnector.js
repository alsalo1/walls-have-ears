const Mysql = require('mysql');

function dbConnector(kontaktMQTT) {
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
                query = 'CALL addTagIdToStream(?, ?, 10); SELECT @userName, @occurences';
            } else {
                query = 'CALL addMacIdToStream(?, ?, 10); SELECT @userName, @occurences';
            }

            dbConnection.query(query, [el.sourceId, el.trackingId], (err, rows) => {
                if(err) {
                    console.log('DB error', err.stack);
                } else {
                    if(rows[2][0]['@userName'] != null) {
                        console.log(rows[2][0]);
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
