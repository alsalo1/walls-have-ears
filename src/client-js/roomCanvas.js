var loaded = {
    img: false,
    script: false
}

function ready() {
    return loaded.img && loaded.script;
}

function setup() {
    window.onload = () => {
        getImg();
    }
    createContent();
}

function createContent() {
    loaded.script = document.getElementById('script');

    loaded.script.onload = () => {
        getImg();
    };

    loaded.script.onreadystatechange = () => {
        getImg();
    };
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
