window.onload = function () {
    var moveStep = 6,
        screenWidth = 640,
        screenHeight = 480,
        playerStartPosX = screenWidth / 2,
        playerStartPosY = screenHeight - 50,
        allProjectiles = [];

    var stage = new Kinetic.Stage({
        container: 'ship-container',
        width: screenWidth,
        height: screenHeight
    }),
        layer = new Kinetic.Layer,
        projectileLayer = new Kinetic.Layer,
        imageObj = new Image();

    imageObj.onload = function () {
        var playerShip = new Kinetic.Sprite({
            x: playerStartPosX,
            y: playerStartPosY,
            image: imageObj,
            animation: 'idlePosition',
            animations: {
                flyLeft: [
                    2, 0, 29, 35,
                    2, 40, 29, 42,
                    2, 86, 29, 39
                ],
                flyUp: [
                    39, 0, 38, 35,
                    39, 40, 38, 42,
                    39, 86, 38, 39
                ],
                flyDown: [
                    39, 0, 38, 35,
                    39, 40, 38, 42,
                    39, 86, 38, 39
                ],
                flyRight: [
                    86, 0, 28, 35,
                    86, 40, 28, 42,
                    86, 86, 28, 39
                ],
                idlePosition: [
                    39, 0, 38, 35,
                    39, 40, 38, 42,
                    39, 86, 38, 39
                ],
            },
            frameRate: 30
        });

        layer.add(playerShip);
        stage.add(layer);
        stage.add(projectileLayer);
        playerShip.start();

        window.addEventListener('keydown', function (ev) {
            switch (ev.keyCode) {
                case 37:
                    flyLeft();
                    break;
                case 38:
                    flyUp();
                    break;
                case 39:
                    flyRight();
                    break;
                case 40:
                    flyDown();
                    break;
            }
        });

        function flyLeft() {
            playerShip.animation('flyLeft');
            playerShip.setX(playerShip.attrs.x -= moveStep);
            if (playerShip.attrs.x < 0) {
                playerShip.attrs.x = 0;
            }
        };

        function flyRight() {
            playerShip.animation('flyRight');
            playerShip.setX(playerShip.attrs.x += moveStep);
            if (playerShip.attrs.x > screenWidth - 38) {
                playerShip.attrs.x = screenWidth - 38;
            }
        }

        function flyUp() {
            playerShip.animation('flyUp');
            playerShip.setY(playerShip.attrs.y -= moveStep);
            if (playerShip.attrs.y < 0) {
                playerShip.attrs.y = 0;
            }
        }

        function flyDown() {
            playerShip.animation('idlePosition');
            playerShip.setY(playerShip.attrs.y += moveStep);
            if (playerShip.attrs.y > screenHeight - 42) {
                playerShip.attrs.y = screenHeight - 42;
            }
        }

        function shoot() {
            var currentProjectile = new Kinetic.Sprite({
                x: playerShip.attrs.x + 19,
                y: playerShip.attrs.y,
                image: imageObj,
                animation: 'simpleFire',
                animations: {
                    simpleFire: [
                        9, 131, 3, 7,
                        4, 131, 3, 9
                    ]
                }
            })
            allProjectiles.push(currentProjectile);
            projectileLayer.add(currentProjectile);
            currentProjectile.start();
        }

        function updateProjectiles() {
            for (var i = 0, len = allProjectiles.length; i < len; i++) {
                allProjectiles[i].setY(allProjectiles[i].attrs.y -= 5);
                if (allProjectiles[i].attrs.y < 0) {
                    allProjectiles.shift();
                }
            }
        }

        window.addEventListener('keyup', function (ev) {
            switch (ev.keyCode) {
                case 32:
                    shoot();
                    break;
                default:
                    playerShip.animation('idlePosition');
                    break;
            }
        });


        function update() {
            updateProjectiles();
        }

        var runGame = setInterval(update, 10);
    };

    imageObj.src = 'images/spaceshipsprites.gif'
}