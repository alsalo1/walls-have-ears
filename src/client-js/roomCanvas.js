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
        socket = new WebSocket(`ws://${window.location}`);
    } catch (e) {
        console.error(e);
        return;
    }

    socket.onOpen = () => {
        loaded.websocket = socket;
    };

    socket.onmessage = handleUpdate;

    socket.onerror = makeSocket;
    socket.onclose = makeSocket;
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
