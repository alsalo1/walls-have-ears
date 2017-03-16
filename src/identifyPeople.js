const request = require('request-promise');
const req= require('request');
const Promise = require('bluebird');
const fs = require('fs');

const GROUP_ID = 'hackathon';
const SUBSCRIPTION_ID = process.env.COGNITIVE_SUBSCRIPTION_ID;

var Identify = {};

function detectFaces(url) {
    console.log("Detecting faces");
    var options = {
        method: 'POST',
        uri: 'https://westus.api.cognitive.microsoft.com/face/v1.0/detect',
        qs: {
            returnFaceId: true,
            returnFaceLandmarks: false

        },
        headers: {
            'Ocp-Apim-Subscription-Key': SUBSCRIPTION_ID,
            'Content-Type' : "application/octet-stream"
        },
        json: true // Automatically parses the JSON string in the response
    };

    return new Promise(function(resolve) {
        //console.log("open read stream")
        var stream = req.get(url).pipe(fs.createWriteStream('image.jpg'));
        stream.on('finish', function () {
            //console.log("open write stream")
            fs.createReadStream('image.jpg').pipe(req.post(options, function (error, response, body) {
                //console.log("response")
                resolve(body);
            }));
        });
    });
}



function identifyFaces(faces) {
    console.log("Identifying faces");
    var ids = [];
    faces.forEach(function(face) {
        ids.push(face.faceId);
    });

    if (ids.length == 0) {
        console.log("No faces found");
        return [];
    }

    var options = {
        method: 'POST',
        uri: 'https://westus.api.cognitive.microsoft.com/face/v1.0/identify',
        headers: {
            'Ocp-Apim-Subscription-Key': SUBSCRIPTION_ID
        },
        body: {
            "personGroupId": GROUP_ID,
            "faceIds": ids,
            "maxNumOfCandidatesReturned":1,
            "confidenceThreshold": 0.5
        },
        json: true // Automatically parses the JSON string in the response
    };

    return request(options);
}

function findNames(identifyResults) {
    console.log("Retrieving names: " + identifyResults.length);
    return Promise.all(identifyResults.map(function(result) {
        if (result.candidates.length > 0) {
            return getName(result.candidates[0].personId);
        } else {
            return "unidentified";
        }
    }));
}

function getName(personId) {
    var options = {
        uri: 'https://westus.api.cognitive.microsoft.com/face/v1.0/persongroups/' + GROUP_ID + '/persons/' + personId,
        headers: {
            'Ocp-Apim-Subscription-Key': SUBSCRIPTION_ID
        },
        json: true // Automatically parses the JSON string in the response
    };

    return request(options).then((person) => {
        return person.name;
    });
}

Identify.findFace = function(image) {
    return detectFaces(image)
     .then(identifyFaces)
     .then(findNames);
}

module.exports = Identify;
