(function () {
    var fieldWidth = 800;
    var fieldHeight = 600;
    var playerX = 5;
    var playerY = 5;
    var playerRadius = 5;
    var leftArrowCode = 37;
    var rightArrowCode = 39;
    var upArrowCode = 38;
    var downArrowCode = 40;
    var stepSize = 3;
    var anim = new Kinetic.Animation();

    var stage = new Kinetic.Stage({
        container: "the-container",
        width: fieldWidth,
        height: fieldHeight,
    });

    var layer = new Kinetic.Layer();

    var field = new Kinetic.Rect({
        x: 0,
        y: 0,
        width: 800,
        height: 600,
        fill: "black",
        stroke: 'blue',
        strokeWidth: 20,
    })

    var player = new Kinetic.Circle({
        x: playerX,
        y: playerY,
        radius: playerRadius,
        fill: "red",
    })

    var trail = new Kinetic.Line({
        points: [],
        stroke: 'blue',
        strokeWidth: 7,
    });

    document.addEventListener('keydown', function (event) {
        anim.stop();
        if (event.keyCode == leftArrowCode) {
            animateInDirection(player, -stepSize, 0);
        }
        if (event.keyCode == rightArrowCode) {
            animateInDirection(player, stepSize, 0);
        }
        if (event.keyCode == upArrowCode) {
            animateInDirection(player, 0, -stepSize);
        }
        if (event.keyCode == downArrowCode) {
            animateInDirection(player, 0, stepSize);
        }
    })

    function animateInDirection(node, newX, newY) {
        anim = new Kinetic.Animation(function () {
            node.move({ x: newX, y: newY }, 0);
        }, layer);
        anim.start();
    }

    function stopAtPerimeter() {
        if (player.x() < playerRadius) {
            anim.stop();
            player.setPosition({ x: playerRadius, y: player.y() });
        }
        if (player.y() < playerRadius) {
            anim.stop();
            player.setPosition({ x: player.x(), y: playerRadius });
        }
        if (player.x() > fieldWidth - playerRadius) {
            anim.stop();
            player.setPosition({ x: fieldWidth - playerRadius, y: player.y() });
        }
        if (player.y() > fieldHeight - playerRadius) {
            anim.stop();
            player.setPosition({ x: player.x(), y: fieldHeight - playerRadius });
        }
        player.draw();
    }
    window.setInterval(stopAtPerimeter, 100);

    function drawTrail() {

        if (playerIsOnPerimeter()) {
            trail.attrs.points = [];
        }
        else {
            trail.attrs.points.push(player.x());
            trail.attrs.points.push(player.y());
            layer.draw()
        }
    }
    window.setInterval(drawTrail, 30);

    function playerIsOnPerimeter() {
        if (player.x() == playerRadius || player.y() == playerRadius
            || player.x() == fieldWidth - playerRadius
            || player.y() == fieldHeight - playerRadius) {
            return true;
        }
        else {
            return false;
        }
    }
    layer.add(field);
    layer.add(player);
    layer.add(trail);
    stage.add(layer);
    return stage;
}());