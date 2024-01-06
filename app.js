const scale = 2/3;
let fieldImg;
let actions = [];
let lastClick;
let time = 0;
let dist = 0;
let speed = 1; // feet per second

function preload() {
    fieldImg = loadImage('field.png');
}

function addTime() {
    var startX = actions[actions.length-1].start.x;
    var startY = actions[actions.length-1].start.y;
    var endX = actions[actions.length-1].end.x;
    var endY = actions[actions.length-1].end.y;

    var distT = sqrt((startX-endX)*(startX-endX) + (startY-endY)*(startY-endY)) * 54/(1544*scale);

    dist += distT;
    time += distT / speed;
}

function setup() {
    var canvas = createCanvas(1544*scale, 778*scale);
    canvas.parent("#canvasDiv");

    canvas.mouseClicked(() => {
        console.log("Click")
        if (!lastClick) {
            console.log("First")
            lastClick = {"x":mouseX, "y":mouseY};
            return;
        }

        actions.push({
            "type": "line",
            "start": {"x":lastClick.x, "y":lastClick.y},
            "end": {"x":mouseX, "y":mouseY}
        })
        addTime()

        lastClick = {"x":mouseX, "y":mouseY};
    })
}

function keyPressed() {
    if (keyCode > 48 && keyCode < 58) {
        var wtime = keyCode - 48;
        actions.push({
            "type": "line",
            "start": {"x":lastClick.x, "y":lastClick.y},
            "end": {"x":mouseX, "y":mouseY}
        })
        addTime()
        lastClick = {"x":mouseX, "y":mouseY};
        actions.push({
            "type": "wait",
            "time": wtime,
            "end": {"x":lastClick.x, "y":lastClick.y}
        })
        time += wtime;
    }
    if (keyCode == 85) {
        actions.pop();
        lastClick = {"x":actions[actions.length-1].end.x,"y":actions[actions.length-1].end.y}
    }
  }

function draw() {
    background(0);
    image(fieldImg, 0, 0, width, height);

    fill(255,255,255);
    textSize(30);
    text("Cycle Time: "+Math.round(time * 100) / 100, 10, 30);
    text("Distance: "+Math.round(dist * 100) / 100, 10, 70);

    if (actions.length > 0) {
        for (var i = 0; i < actions.length; i++) {
            var a = actions[i];
            if (a.type == "line"){
                stroke(255,255,255);
                line(a.start.x, a.start.y, a.end.x, a.end.y);
            }
            else if (a.type == "wait") {
                fill(255,255,255);
                ellipse(a.end.x, a.end.y, 30, 30);
                fill(0,0,0);
                textSize(16);
                text(a.time, a.end.x-5, a.end.y+2);
            }
        }

        line(actions[actions.length-1].end.x, actions[actions.length-1].end.y, mouseX, mouseY);
    } else if (lastClick) {
        stroke(255,255,255);
        line(lastClick.x, lastClick.y, mouseX, mouseY);
    }
}