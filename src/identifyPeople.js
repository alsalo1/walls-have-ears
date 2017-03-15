const request = require('request-promise');
const Promise = require('bluebird');

const GROUP_ID = 'hackathon';
const SUBSCRIPTION_ID = 'cb09f1c28eed41389b17cef6fa493af0';

var Identify = {};

function detectFaces(url) {
    console.log("detect faces");
    var options = {
        method: 'POST',
        uri: 'https://westus.api.cognitive.microsoft.com/face/v1.0/detect',
        qs: {
            returnFaceId: true,
            returnFaceLandmarks: false

        },
        headers: {
            'Ocp-Apim-Subscription-Key': SUBSCRIPTION_ID
        },
        body: {
            url: url
        },
        json: true // Automatically parses the JSON string in the response
    };

    return request(options);
}

function identifyFaces(faces) {
    console.log("identify faces");
    var ids = [];
    faces.forEach(function(face) {
        ids.push(face.faceId);
    });

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
    console.log("finding names: " + identifyResults.length);
    return Promise.all(identifyResults.map(function(result) {
        if (result.candidates.length > 0) {
            return getName(result.candidates[0].personId);
        } else {
            return "not found";
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

Identify.findFace = function(url) {
    return detectFaces(url)
     .then(identifyFaces)
     .then(findNames);
}

module.exports = Identify;
