window.onload = function () {
    var moveStep = 7,
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
                    2, 0, 30, 36,
                    2, 40, 30, 43,
                    2, 86, 30, 40
                ],
                flyUp: [
                    39, 0, 39, 36,
                    39, 40, 39, 43,
                    39, 86, 39, 40
                ],
                flyDown: [
                    39, 0, 39, 36,
                    39, 40, 39, 43,
                    39, 86, 39, 40
                ],
                flyRight: [
                    86, 0, 29, 36,
                    86, 40, 29, 43,
                    86, 86, 29, 40
                ],
                idlePosition: [
                    39, 0, 39, 36,
                    39, 40, 39, 43,
                    39, 86, 39, 40
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
                case 65:
                    flyLeft();
                    break;
                case 38:
                case 87:
                    flyUp();
                    break;
                case 39:
                case 68:
                    flyRight();
                    break;
                case 40:
                case 83:
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
                    ],
                    rocket: [
                        16, 131, 4, 7,
                        24, 131, 4, 9,
                        32, 131, 4, 11,
                        40, 131, 4, 13,
                        47, 131, 6, 15,
                        56, 131, 4, 14,
                        64, 131, 4, 12
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
                    allProjectiles[i].remove();
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

        document.getElementById('body').addEventListener('click', function myfunction() {
            shoot();
        });


        function update() {
            updateProjectiles();
        }

        var runGame = setInterval(update, 10);
    };

    imageObj.src = 'images/spaceshipsprites.gif'
}