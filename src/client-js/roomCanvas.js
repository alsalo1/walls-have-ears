var Nes = require('nes');

var loaded = {
    img: false,
    script: false,
    websocket: false
}

    /*
    {
            user: data.user,
            location: {
                x: loc.x,
                y: loc.y,
                radius: pixels
            },
            isOK: data.isOK
        }
    */
var state = {
    'test': {
        user: 'test',
        location: {
            x: 20,
            y: 40,
            radius: 9
        },
        isOK: true
    }
};

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

        socket.onUpdate = handleUpdate;
        socket.onError = e => {
            console.error(e);
            makeSocket();
        }
        socket.onDisconnect = () => {
            console.log('disconnect');
            makeSocket();
        }

        getImg();
    });
}

function handleUpdate(update) {
    console.log(`update`);
    if (update.user) {
        state[update.user] = update;
    }

    paint();
}

function paint() {
    if (!ready()) {
        return;
    }

    var canvas = document.getElementById('roomCanvas');
    var img = loaded.img;
    canvas.width = img.width;
    canvas.height = img.height;

    console.log(`${canvas.width}, ${canvas.height}`);

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0,0);

    Object.keys(state).forEach(key => {
        var update = state[key];
        console.log(`${JSON.stringify(update)}`);
        ctx.fillStyle = update.isOK ? 'green' : 'red';

        ctx.beginPath();
        ctx.arc(update.location.x, update.location.y, update.location.radius, 0, Math.PI*2, false);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
        console.log(`${key} drawn`);
    });
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
