//TODO: Refactor this file to reuse the code and to handle the stage outside.
window.onload = function () {
    var playerShip,
        moveStep = 7,
        screenWidth = 640,
        screenHeight = 480,
        playerStartPosX = screenWidth / 2,
        playerStartPosY = screenHeight - 50,
        allProjectiles = [],
        allEnemies = [],
        score = 0,
        HUDLayer = new Kinetic.Layer(),
        playerLayer = new Kinetic.Layer(),
        projectileLayer = new Kinetic.Layer(),
        enemyLayer = new Kinetic.Layer(),
        imageObj = new Image(),
        enemyImage = new Image(),
        scoreText;

    var stage = new Kinetic.Stage({
        container: 'ship-container',
        width: screenWidth,
        height: screenHeight
    });

    imageObj.onload = function () {

        initHUD();
        initEnemies();
        initPlayer();

        executeMovementInput();
        executeShootingInput();

        stage.add(HUDLayer);
        stage.add(playerLayer);
        stage.add(projectileLayer);
        stage.add(enemyLayer);

        function update() {
            updateProjectiles();
            hitEnemies();
        }

        var runGame = setInterval(update, 10);
    };
    function initPlayer() {
        playerShip = new Kinetic.Sprite({
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


        playerLayer.add(playerShip);
        playerShip.start();
    }
    function initHUD() {
        var blackRect = new Kinetic.Rect({
            width: screenWidth,
            height: screenHeight,
            fill: "black",
        });

        scoreText = new Kinetic.Text({
            x: 15,
            y: 15,
            text: '0',
            fontSize: 20,
            fontFamily: 'Calibri',
            fill: 'yellow'
        });

        HUDLayer.add(blackRect);
        HUDLayer.add(scoreText);
    }

    function initEnemies() {
        var enemy = new Kinetic.Sprite({
            x: screenWidth / 2,
            y: 50,
            image: enemyImage,
            animation: 'idlePosition',
            animations: {
                idlePosition: [
                    0, 0, 139, 136,
                    39, 140, 139, 143,
                    39, 186, 139, 140
                ],
            },
            frameRate: 20
        });

        allEnemies.push(enemy);
        enemyLayer.add(enemy);
        enemy.start();
    }

    function executeMovementInput() {
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
    }
    function executeShootingInput() {
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
    }
    function updateProjectiles() {
        if (allProjectiles.length > 0) {
            for (var i = 0, len = allProjectiles.length; i < len; i++) {
                allProjectiles[i].setY(allProjectiles[i].attrs.y -= 5);
                if (allProjectiles[i].attrs.y < 0) {
                    allProjectiles[i].remove();
                    allProjectiles.shift();
                }
            }
        }
    }

    function hitEnemies() {
        if (allProjectiles.length > 0 && allEnemies.length > 0) {
            for (var i = 0; i < allProjectiles.length; i++) {
                var currentProjectile = allProjectiles[i];
                for (var j = 0; j < allEnemies.length; j++) {
                    var currentEnemy = allEnemies[j];
                    if ((currentProjectile.x() > (currentEnemy.x()) && currentProjectile.x() < (currentEnemy.x() + 60))
                        && (currentProjectile.y() < (currentEnemy.y() + 60))) {
                        allProjectiles[i].remove();
                        allProjectiles.shift();
                        updateScore();
                    }
                }
            }
        }
    }
    function updateScore() {
        score += 10;
        scoreText.text(score);
        HUDLayer.draw();
        console.log(scoreText.text());
    }
    imageObj.src = 'images/spaceshipsprites.gif';
    enemyImage.src = 'images/enemy.gif';
}