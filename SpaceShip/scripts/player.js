//TODO: Refactor this file to reuse the code and to handle the stage outside.
window.onload = function () {
    var screenWidth = 640,
        screenHeight = 620;

    var playerShip,
        playerStartPosX = screenWidth / 2,
        playerStartPosY = screenHeight - 100,
        moveStep = 7;

    var enemies = [],
        playerProjectiles = [],
        enemyProjectiles = [],
        explosions = [];

    var HUDLayer = new Kinetic.Layer(),
        playerLayer = new Kinetic.Layer(),
        projectileLayer = new Kinetic.Layer(),
        enemyLayer = new Kinetic.Layer(),
        enemyProjectileLayer = new Kinetic.Layer(),
        playerSpriteSheet = new Image(),
        firstEnemySprite = new Image(),
        secondEnemySprite = new Image(),
        starSkyImageObj = new Image(),
        score = 0,
        scoreText;

    var stage = new Kinetic.Stage({
        container: 'ship-container',
        width: screenWidth,
        height: screenHeight
    });

    starSkyImageObj.onload = function () {

        initHUD();
        initPlayer();

        window.addEventListener('keydown', executeMovementInput);
        window.addEventListener('click', playerShoot);

        addLayers();

        var enemyGeneration = setInterval(generateEnemies, 2500);

        var enemyShooting = setInterval(function () {
            for (var i = 0; i < enemies.length; i++) {
                enemyShoot(enemies[i]);
            }
        }, 2000);

        var runGame = setInterval(update, 10);

        function update() {
            moveEnemies();
            destroyOutOfScreenProjectiles();
            hitEnemies();
            hitPlayer();
            stopExplosions()
        }

        function hitPlayer() {
            if (enemyProjectiles.length > 0) {
                for (var i = 0; i < enemyProjectiles.length; i++) {
                    var currentProjectyle = enemyProjectiles[i];
                    // TODO: Fix magic numbers!
                    if ((currentProjectyle.attrs.x >= playerShip.attrs.x) &&
                        (currentProjectyle.attrs.x <= playerShip.attrs.x + 38) &&
                        (currentProjectyle.attrs.y >= playerShip.attrs.y) &&
                        (currentProjectyle.attrs.x <= playerShip.attrs.y + 42)) {

                        playerShip.animation('explode');
                        window.removeEventListener('keydown', executeMovementInput);
                        window.removeEventListener('click', playerShoot);
                        clearInterval(runGame);
                        clearInterval(enemyGeneration);
                        clearInterval(enemyShooting);
                    }
                }
            }
        }
    };

    function initHUD() {

        var starSky = new Kinetic.Image({
            x: 0,
            y: 0,
            image: starSkyImageObj,
            width: 640,
            height: 640
        });
        HUDLayer.add(starSky);

        scoreText = new Kinetic.Text({
            x: 15,
            y: 15,
            text: '0',
            fontSize: 20,
            fontFamily: 'Calibri',
            fill: 'yellow'
        });

        HUDLayer.add(scoreText);
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
                explode: [
					18, 363, 44, 44,
					103, 367, 33, 35,
					19, 516, 35, 35,
					97, 514, 39, 34,
					177, 512, 40, 41,
					17, 442, 45, 44,
					93, 440, 56, 50,
					6, 586, 62, 56,
					81, 580, 70, 68,
					159, 576, 76, 73
                ]
            },
            frameRate: 10,
        });


        playerLayer.add(playerShip);
        playerShip.start();
    }

    function executeMovementInput(ev) {
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

    function playerShoot() {
        var currentProjectile = new Kinetic.Sprite({
            x: playerShip.attrs.x + 20,
            y: playerShip.attrs.y,
            image: playerSpriteSheet,
            animation: 'rocket',
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

    function addLayers() {
        stage.add(HUDLayer);
        stage.add(enemyLayer);
        stage.add(playerLayer);
        stage.add(projectileLayer);
        stage.add(enemyProjectileLayer);
    }

    function generateEnemies() {
        
        var enemyWidth = 64;
        var enemyHeight = 95;

        var sprite = firstEnemySprite;

        var rndSpriteNum = getRandomInt(0, 1);

        switch (rndSpriteNum) {
            case 0:
                sprite = firstEnemySprite;
                break;
            case 1:
                sprite = secondEnemySprite;
                break;
        }
        
        var rndFormationNum = getRandomInt(0, 3);
        
        switch (rndFormationNum) {
            case 0:
                //single
                var enemy = new Kinetic.Image({
                    x: getRandomInt(0, screenWidth - enemyWidth),
                    y: -enemyHeight,
                    width: enemyWidth,
                    heigth: enemyHeight,
                    image: sprite,
                });
                enemies.push(enemy);
                enemyLayer.add(enemy);
                break;
            case 1:
                //triangle formation
                var middle = new Kinetic.Image({
                    x: getRandomInt(enemyWidth + 10, screenWidth - (enemyWidth * 2)),
                    y: -enemyHeight,
                    width: enemyWidth,
                    heigth: enemyHeight,
                    image: sprite,
                });
                var left = new Kinetic.Image({
                    x: middle.x() - enemyWidth,
                    y: -enemyHeight * 2,
                    width: enemyWidth,
                    heigth: enemyHeight,
                    image: sprite,
                });
                var right = new Kinetic.Image({
                    x: middle.x() + enemyWidth,
                    y: -enemyHeight * 2,
                    width: enemyWidth,
                    heigth: enemyHeight,
                    image: sprite,
                });
                enemies.push(middle);
                enemyLayer.add(middle);
                enemies.push(left);
                enemyLayer.add(left);
                enemies.push(right);
                enemyLayer.add(right);
                break;
            case 2:
                //diagonal
                var second = new Kinetic.Image({
                    x: getRandomInt(enemyWidth + 10, screenWidth - (enemyWidth * 2)),
                    y: -enemyHeight * 2,
                    width: enemyWidth,
                    heigth: enemyHeight,
                    image: sprite,
                });
                var first = new Kinetic.Image({
                    x: second.x() - enemyWidth,
                    y: -enemyHeight,
                    width: enemyWidth,
                    heigth: enemyHeight,
                    image: sprite,
                });
                var third = new Kinetic.Image({
                    x: second.x() + enemyWidth,
                    y: -enemyHeight * 3,
                    width: enemyWidth,
                    heigth: enemyHeight,
                    image: sprite,
                });
                enemies.push(first);
                enemyLayer.add(first);
                enemies.push(second);
                enemyLayer.add(second);
                enemies.push(third);
                enemyLayer.add(third);
                break;
            case 3:
                //nothing spawns
                break;
        }
    }

    function enemyShoot(enemy) {
        var rnd = getRandomInt(0, 1);
        switch (rnd) {
            case 0:
                var currentEnemyProjectile = new Kinetic.Sprite({
                    x: enemy.attrs.x + 30,
                    y: enemy.attrs.y + 50,
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
                break;
        }

    }

    function moveEnemies() {
        for (var i = 0; i < enemies.length; i++) {
            enemies[i].move({ x: 0, y: 1 });
            if (enemies[i].y() > screenHeight) {
                enemies[i].destroy();
                enemies.splice(i, 1);
            }
        }
        enemyLayer.draw();
    }

    function destroyOutOfScreenProjectiles() {
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
        if (enemyProjectiles.length > 0) {
            for (var j = 0; j < enemyProjectiles.length; j++) {
                enemyProjectiles[j].setY(enemyProjectiles[j].attrs.y += 5);
                if (enemyProjectiles[j].attrs.y >= screenHeight) {

                    enemyProjectiles[j].destroy();
                    enemyProjectiles.splice(j, 1);
                    enemyProjectileLayer.draw();
                }
            }
        }
    }

    function playExplosionAt(x, y) {
        var explosion = new Kinetic.Sprite({
            x: x,
            y: y,
            image: playerSpriteSheet,
            animation: 'explode',
            animations: {
                explode: [
					18, 363, 44, 44,
					103, 367, 33, 35,
					19, 516, 35, 35,
					97, 514, 39, 34,
					177, 512, 40, 41,
					17, 442, 45, 44,
					93, 440, 56, 50,
					6, 586, 62, 56,
					81, 580, 70, 68,
					159, 576, 76, 73
                ]
            },
            frameRate: 10,
        });


        explosions.push(explosion);
        projectileLayer.add(explosion);
        explosion.start();
    }

    function hitEnemies() {
        if (playerProjectiles.length > 0 && enemies.length > 0) {
            for (var i = 0; i < playerProjectiles.length; i++) {
                var currentProjectile = playerProjectiles[i];
                for (var j = 0; j < enemies.length; j++) {
                    var currentEnemy = enemies[j];

                    //collision detection
                    if (currentProjectile.x() >= currentEnemy.x()
                        && currentProjectile.x() < currentEnemy.x() + currentEnemy.width()
                        && currentProjectile.y() <= currentEnemy.y() + currentEnemy.height()) {

                        playExplosionAt(currentEnemy.x() + 20, currentEnemy.y() + 30);

                        //remove destroyed enemy
                        enemies[j].destroy();
                        enemies.splice(j, 1);
                        enemyLayer.draw();

                        //remove destroyed projectile
                        playerProjectiles[i].destroy();
                        playerProjectiles.splice(i, 1);
                        projectileLayer.draw();

                        updateScore();
                    }
                }
            }
        }
    }

    function stopExplosions() {
        for (var i = 0; i < explosions.length; i++) {
            if (explosions[i].frameIndex() === 9) {
                explosions[i].destroy();
            }
        }
    }

    function updateScore() {
        score += 150;
        scoreText.text(score);
        HUDLayer.draw();
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    playerSpriteSheet.src = 'images/player-sprite.png';
    firstEnemySprite.src = 'images/enemy1.png';
    secondEnemySprite.src = 'images/enemy2.png';
    starSkyImageObj.src = 'images/starry-sky.jpg';
}
