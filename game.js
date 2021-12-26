//Initialize context
kaboom({
    background: [ 0, 0, 0 ]
});

//Load assets
loadSprite("player", "assets/sprites/paperplane.png");
loadSprite("bg", "assets/sprites/background_glacial_mountains.png");
loadSprite("mg1", "assets/sprites/clouds_mg_1.png");
loadSprite("mg2", "assets/sprites/clouds_mg_2.png");
loadSprite("mg3", "assets/sprites/clouds_mg_3.png");
loadSprite("pillar-bottom", "assets/sprites/pillar-bottom.png");
loadSprite("pillar-top", "assets/sprites/pillar-top.png");
loadSprite("pillar-top-blue", "assets/sprites/pillar-top-blue.png");
loadSprite("pillar-bottom-blue", "assets/sprites/pillar-bottom-blue.png");
loadSprite("redpipe", "assets/sprites/pipe-red.png");
loadSprite("mountainobstacle", "assets/sprites/mountain_obstacle.png");
loadSprite("bubble", "assets/sprites/large-bubble.png");
loadSprite("heart", "assets/sprites/heart.png");
loadSprite("fireball", "assets/sprites/fireball.png");
loadSprite("iceball", "assets/sprites/iceball.png");
loadSprite("icedrop", "assets/sprites/icedrop.png");
loadSprite("button-jump", "assets/sprites/button-jump.png");
loadSprite("button-shoot", "assets/sprites/button-shoot.png");
loadSound("wing", "assets/audio/wing.wav");
loadSound("point", "assets/audio/point.wav");
loadSound("bang", "assets/audio/bang.wav");
loadSound("heart", "assets/audio/heart.wav");
loadSound("match", "assets/audio/match.wav");
loadSound("icedrop", "assets/audio/icedrop.wav");
loadSound("shoot", "assets/audio/shoot.wav");

let highScore = localStorage.getItem("highscore");
let score = 0;

scene("game", () => {
    let score = 0;
    let lives = 1;

    layers([
        "bg",
        "game",
        "mg", 
        "ui",
    ], "game")
    
    //background
    add([
        sprite("bg", {width: width(), height: height()}),
        layer("bg")
    ]);
    add([
        sprite("mg3", {width: width(), height: height()}),
        layer("bg")
    ]);
    add([
        sprite("mg2", {width: width(), height: height()}),
        layer("bg")
    ]);
    add([
        sprite("mg1", {width: width(), height: height()}),
        layer("mg")
    ]);

    const scoreText = add([
        text("Score: 0", {
            font: "sinko",
            size: 32
        }),
        pos(10, 10),
        layer("ui")
    ]);

    //make player
    const player = add([
        sprite("player"),
        scale(1.5),
        pos(200, 40),
        area({scale: 0.7}),
        origin("center"),
        body(),
        health(1),
        layer("ui")
    ]);

    //UI Heart
    const hearts = add([
        sprite("heart"),
        scale(4),
        pos(10, 60),
        layer("ui")
    ])

    //UI Heart Text
    const hpText = add([
        pos(50, 55),
        layer("ui"),
        text("1", {
            font: "sinko",
            size: 32
        })
    ]);

    //UI Iceball
    const iceballsAmmoIcon = add([
        sprite("iceball"),
        scale(0.8),
        pos(90, 55),
        layer("ui")
    ])

    //UI Iceball Text
    const iceballsAmmoText = add([
        pos(140, 55),
        layer("ui"),
        text("5", {
            font: "sinko",
            size: 32
        })
    ]);

    function makeHearts() {
        add([
            sprite("heart"),
            pos(width() - 90, height()/2),
            scale(4),
            "heart", 
            area(),
            layer("ui"),
            origin("botleft"),
            cleanup(3)
        ])
    }

    function makeIcedrops() {
        add([
            sprite("icedrop"),
            pos(width() + 120, height()/2),
            scale(1),
            "icedrop", 
            area(),
            layer("ui"),
            origin("botleft"),
            cleanup(3)
        ])
    }

    function makeFireballs() {
        add([
            sprite("fireball"),
            pos(width() - 90, height()/2),
            scale(1),
            "fireball", 
            area(),
            layer("game"),
            origin("botleft"),
            cleanup(3)
        ])
    }

    // Shoot Iceballs
    let shots = 5;

    function shootIceball() {
        if (shots > 0) {
            iceball = add([
                sprite("iceball"),
                pos(player.pos.x + 40, player.pos.y + 40),
                scale(1),
                "iceball", 
                area(),
                layer("game"),
                origin("botleft"),
                lifespan(5, { fade: 0.5 }),
                cleanup(3)
            ])
            play("shoot");
            shots--;
            iceballsAmmoText.text--;
        } else {
            console.log("Out of iceballs")
        }
    }

    action("iceball", (iceball) => {
        iceball.move(320, 0);
    });

    onCollide("fireball", "iceball", (fireball) => {
        play("match");
        destroy(fireball);
        score += 5;
        scoreText.text = "Score: " + score;
    });

    let redPipeCounter = 0;
    let redPipeDirection = -40;
    let pipeCounter = 0;

    function makePipes() {
        const OFFSET = rand(-100, 100);
        let pipeGap = rand(300, 350);

        if (pipeCounter < 5) {
            pipeGap = rand(240, 280);
        } else if (pipeCounter < 10) {
            pipeGap = 200;
        } else {
            pipeGap = 190;
        }
        
        //Red bottom pipe
        if (redPipeCounter === 4) {
            redPipeDirection = Math.random() < 0.5;

            add([
                sprite("pillar-bottom-blue", {flipY: false, flipX: false}),
                pos(width(), height()/2 + OFFSET + pipeGap/2),
                "redpipe",
                area(),
                {passed: false},
                lifespan(15),
                cleanup(3),
                scale(1)
            ]);
            
            //Red top pipe
            add([
                sprite("pillar-top-blue", {flipY: true, flipX: true}),
                pos(width(), height()/2 + OFFSET - pipeGap/2),
                origin("botleft"),
                "redpipe",
                area(),
                lifespan(15),
                cleanup(3),
                scale(1)
            ]);

            redPipeCounter = -1;
        } else {
            //Regular bottom pipe
            add([
                sprite("pillar-bottom", {flipY: false, flipX: false}),
                pos(width(), height()/2 + OFFSET + pipeGap/2),
                "pipe",
                area(),
                {passed: false},
                lifespan(15),
                cleanup(3),
                scale(1)
            ]);
            
            //Regular top pipe
            add([
                sprite("pillar-top", {flipY: true, flipX: true}),
                pos(width(), height()/2 + OFFSET - pipeGap/2),
                origin("botleft"),
                "pipe",
                area(),
                lifespan(15),
                cleanup(3),
                scale(1)
            ]);
        }
    }

    
    loop(1.5, () => {
        makePipes();
        redPipeCounter++;
        pipeCounter++;
    });

    loop(15, () => {
        makeFireballs();
    })

    loop(30, () => {
        makeHearts();
    })

    loop(60, () => {
        makeIcedrops();
    })

    //Bubbles behind player every 0.1 seconds 
    loop(0.1, () => {
        add([
            sprite("bubble"),
            pos(player.pos.x - 80, player.pos.y + rand(-20, 20)),
            "bubble",
            scale(rand(1, 3)),
            area(),
            lifespan(1, {fade: 1}),
            cleanup(3)
        ]);
    });

    action("bubble", (bubble) => {
        bubble.move(-160, 0);
    });
    
    //move hearts
    action("heart", (heart) => {
        heart.move(-160, 0);
    });

    action("icedrop", (icedrop) => {
        icedrop.move(-160, 0);
    });
    action("fireball", (fireball) => {
        fireball.move(-320, 0);
    });

    //move pipes and check if player has passed pipe
    action("pipe", (pipe) => {
        pipe.move(-160, 0);

        if (pipe.passed === false && pipe.pos.x < player.pos.x) {
            pipe.passed = true;
            score += 1;
            scoreText.text = "Score: " + score;
            
        }
    });

    action("redpipe", (redpipe) => {
        if (redPipeDirection) {
            redpipe.move(-160, -15);
        } else {
            redpipe.move(-160, 15);
        }

        if (redpipe.passed === false && redpipe.pos.x < player.pos.x) {
            redpipe.passed = true;
            score += 1;
            scoreText.text = "Score: " + score;
            
        }
        
    });
    
    //collision detection with pipe
    player.onCollide("pipe", (pipe) => {
        play("bang");
        player.hurt(1);
        hearts.text = player.hp(1);
        //Remove area from this pipe, otherwise player can be hurt more than one time
        //from the same pipe
        pipe.area = false;
    });

    player.onCollide("redpipe", (redpipe) => {
        play("bang");
        player.hurt(1);
        hearts.text = player.hp(1);
        //Remove area from this pipe, otherwise player can be hurt more than one time
        //from the same pipe
        redpipe.area = false;
    });

    player.onCollide("fireball", (fireball) => {
        play("bang");
        player.hurt(1);
        hearts.text = player.hp(1);
        destroy(fireball);
    });

    player.onCollide("heart", (heart) => {
        play("heart");
        if (player.hp(1) < 3) {
            player.heal(1);
        }
        destroy(heart);
        hpText.text = player.hp(1);
    });

    player.onCollide("icedrop", (icedrop) => {
        play("icedrop");
        if (shots < 5) {
            shots = 5;
        }
        destroy(icedrop);
        iceballsAmmoText.text = 5;
    });

    player.on("hurt", () => {
        hpText.text = player.hp(1);

        //Change scale, color and angle of player and camera, then back to normal after 0.2 seconds
        player.scale = 1;
        player.color = rgb(255, 0, 0);
        player.angle = 25;
        camScale(1.05);
        camRot(1);
        wait(0.2, () => {
            player.scale = 1.5;
            player.color = rgb(255, 255, 255);
            player.angle = 0;
            camScale(1);
            camRot(0);
        })
    });

    //On death, go to gameover
    player.on("death", () => {
        hpText.text = player.hp(1);
        go("gameover", score);
    });

    //If player outside screen, go to gameover
    player.action(() => {
        if(player.pos.y > height() + 60 || player.pos.y < -60) {
            go("gameover", score);
        }
        
    });

    function jump() {
        player.jump(575);
        play("wing");
        player.angle = -25;
        wait(0.35, () => {
            player.angle = 0;
        });
    }

    //Press space to jump and angle player up for 0.35 seconds
    keyPress("space", () => {
        jump();
    });

    //Press enter to shoot iceballs
    keyPress("enter", () => {
        shootIceball();
    });

});

//Gameover scene
scene("gameover", (score) => {
    add([
        sprite("bg", {width: width(), height: height()}),
        layer("bg")
    ]);

    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highscore",highScore);
    }

    add([
        text("GAME OVER\n" + "score: " + score + "\nhighscore: " + highScore, {
            font: "sinko",
            size: 64
        }),
        pos(width()/2,height()/2),
        origin("center")
    ]);

    keyPress("space", () => {
        go("game");
    });
});

//Start scene
scene("start", (score) => {
    add([
        sprite("bg", {width: width(), height: height()}),
        layer("bg")
    ]);

    add([
        text("PRESS SPACE TO START\n\n CONTROLS:\n SPACE TO JUMP\n ENTER TO SHOOT", {
            font: "sinko",
            size: 64
        }),
        pos(width()/2,height()/2),
        origin("center")
    ]);

    keyPress("space", () => {
        go("game");
    });
});

go("start");


