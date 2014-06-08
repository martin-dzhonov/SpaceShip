(function () {
    var fieldWidth = 800;
    var fieldHeight = 600;

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
    })

    var playerX = 6;
    var playerY = 6;
    var playerRadius = 6;
    var playerCircle = new Kinetic.Circle({
        x: playerX,
        y: playerY,
        radius: playerRadius,
        fill: "red",
    })

    layer.add(field);
    layer.add(playerCircle);
    stage.add(layer);

    var leftArrowCode = 37;
    var rightArrowCode = 39;
    var upArrowCode = 38;
    var downArrowCode = 40;
    var stepSize = 4;

    var anim = new Kinetic.Animation();
    document.addEventListener('keydown', function (event) {
        if (event.keyCode == leftArrowCode) {
            animateInDirection(playerCircle, -stepSize, 0);
        }
        if (event.keyCode == rightArrowCode) {
            animateInDirection(playerCircle, stepSize, 0);
        }
        if (event.keyCode == upArrowCode) {
            animateInDirection(playerCircle, 0, -stepSize);
        }
        if (event.keyCode == downArrowCode) {
            animateInDirection(playerCircle, 0, stepSize);
        }
        if (event.keyCode == 32) {
            anim.stop();
        }
    })

    function animateInDirection(node, newX, newY) {
        anim.stop();
        anim = new Kinetic.Animation(function () {
            node.move({ x: newX, y: newY }, 1);
        }, layer);
        if (!anim.isRunning()) {
            anim.start();
        }
    }
    return stage;
}());