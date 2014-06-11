//TODO: Refactor this file to reuse the code and to handle the stage outside.
window.onload = function () {
    var screenWidth = 640,
        screenHeight = 640,
        playerShip,
        playerStartPosX = screenWidth / 2,
        playerStartPosY = screenHeight - 50,
        moveStep = 7,
        enemies = [],
        playerProjectiles = [],
        enemyProjectiles = [],
        HUDLayer = new Kinetic.Layer(),
        playerLayer = new Kinetic.Layer(),
        projectileLayer = new Kinetic.Layer(),
        enemyLayer = new Kinetic.Layer(),
        enemyProjectileLayer = new Kinetic.Layer(),
        playerSpriteSheet = new Image(),
        enemySprite = new Image(),
        score = 0,
        scoreText;

    var stage = new Kinetic.Stage({
        container: 'ship-container',
        width: screenWidth,
        height: screenHeight
    });

    playerSpriteSheet.onload = function () {

        initHUD();
        initEnemies();
        initPlayer();

        executeMovementInput();
        executeShootingInput();

        stage.add(HUDLayer);
        stage.add(playerLayer);
        stage.add(projectileLayer);
        stage.add(enemyProjectileLayer);
        stage.add(enemyLayer);

        function update() {
            updateProjectiles();
            updateEnemyProjectiles();
            hitEnemies();
        }
        function generateEnemies() {
            initEnemies();
        }
        setInterval(update, 10);
        setInterval(generateEnemies, 1000);
        setInterval(moveEnemies, 10);
        setInterval(function () {
            for (var i = 0; i < enemies.length; i++) {
                enemyShoot(enemies[i]);
            }
        }, 1000);
    };

    function enemyShoot(enemy) {
        var currentEnemyProjectile = new Kinetic.Sprite({
            x: enemy.attrs.x + 20,
            y: enemy.attrs.y,
            image: playerSpriteSheet,
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
        });

        enemyProjectiles.push(currentEnemyProjectile);
        enemyProjectileLayer.add(currentEnemyProjectile);
        currentEnemyProjectile.start();
    }

    function moveEnemies() {
        var goingLeft = false;
        var goingRight = false;
        for (var i = 0; i < enemies.length; i++) {
            enemies[i].move({ x: 0, y: 1 });
        }
        enemyLayer.draw();
    }

    function initPlayer() {
        playerShip = new Kinetic.Sprite({
            x: playerStartPosX,
            y: playerStartPosY,
            image: playerSpriteSheet,
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
        var enemy = new Kinetic.Image({
            x: Math.floor(Math.random() * screenWidth - 100),
            y: -50,
            width: enemySprite.width,
            heigth: enemySprite.height,
            image: enemySprite,
        });

        enemyShoot(enemy);

        enemies.push(enemy);
        enemyLayer.add(enemy);
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
                    playerShoot();
                    break;
                default:
                    playerShip.animation('idlePosition');
                    break;
            }
        });

        document.getElementById('body').addEventListener('click', function myfunction() {
            playerShoot();
        });

        function playerShoot() {
            var currentProjectile = new Kinetic.Sprite({
                x: playerShip.attrs.x + 20,
                y: playerShip.attrs.y,
                image: playerSpriteSheet,
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
            playerProjectiles.push(currentProjectile);
            projectileLayer.add(currentProjectile);
            currentProjectile.start();
        }
    }

    function updateProjectiles() {
        if (playerProjectiles.length > 0) {
            for (var i = 0; i < playerProjectiles.length; i++) {
                playerProjectiles[i].setY(playerProjectiles[i].attrs.y -= 5);
                if (playerProjectiles[i].attrs.y < 0) {
                    playerProjectiles[i].destroy();
                    playerProjectiles.splice(i, 1);
                    projectileLayer.draw();
                }
            }
        }
    }

    function updateEnemyProjectiles() {
        for (var i = 0; i < enemyProjectiles.length; i++) {
            enemyProjectiles[i].setY(enemyProjectiles[i].attrs.y += 5);
            if (enemyProjectiles[i].attrs.y >= screenHeight) {
			    enemyProjectiles[i].remove();
                enemyProjectiles[i].destroy();
				enemyProjectiles.splice(i, 1);
                enemyProjectileLayer.draw();
            }
        }
    }

    function hitEnemies() {
        if (playerProjectiles.length > 0 && enemies.length > 0) {
            for (var i = 0; i < playerProjectiles.length; i++) {
                var currentProjectile = playerProjectiles[i];
                for (var j = 0; j < enemies.length; j++) {
                    var currentEnemy = enemies[j];
                    if (currentProjectile.x() >= currentEnemy.x()
                        && currentProjectile.x() < currentEnemy.x() + currentEnemy.width()
                        && currentProjectile.y() <= currentEnemy.y() + currentEnemy.height()) {

                        enemies[j].destroy();
                        enemies.splice(j, 1);
                        enemyLayer.draw();

                        playerProjectiles[i].destroy();
                        playerProjectiles.splice(i, 1);
                        projectileLayer.draw();

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
    playerSpriteSheet.src = 'images/spaceshipsprites.gif';
    enemySprite.src = 'images/enemy.gif';
}
