var Nes = require('nes');

var loaded = {
    img: false,
    script: false,
    websocket: false
}

function ready() {
    return loaded.img && loaded.script && loaded.websocket;
}

function setup() {
    window.onload = () => {
        getImg();
    }

    try {
        loaded.script = document.getElementById('script');
    } catch (e) {
        console.error(e);
        return;
    }

    loaded.script.onload = () => {
        getImg();
    };

    loaded.script.onreadystatechange = () => {
        getImg();
    };

    makeSocket();
}

function makeSocket() {
    loaded.websocket = false;

    var socket;
    try {
        var location = window.location;
        socket = new Nes.Client(`ws://${location.host}${location.pathname}`);
    } catch (e) {
        console.error(e);
        return;
    }

    socket.connect(err => {
        if (err) {
            console.log(err);
            return makeSocket();
        }

        loaded.websocket = socket;
        getImg();
    });

    socket.onupdate = handleUpdate;
}

function handleUpdate(update) {
    console.log(`update: ${update}`);
}

function paint() {
    if (!ready()) {
        return;
    }

    var canvas = document.getElementById('roomCanvas');
    var img = loaded.img;
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0,0);
}

function getImg() {
    if (!loaded.img) {
        var newImg = new Image();

        newImg.onload = function() {
            loaded.img = newImg;

            paint();
        }

        newImg.src = 'img/floorplan.png';
    } else {
        paint();
    }
}

setup();
