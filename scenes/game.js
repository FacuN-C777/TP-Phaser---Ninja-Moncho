// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class game extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("game");
  }

  init() {
    // this is called before the scene is created
    // init variables
    // take data passed from other scenes
    // data object param {}
    this.canJump = false;
    this.spawnerTime = 1000;
  }

  preload() {
    // load assets
    this.load.image("sky", "./public/assets/cielo.webp");
    this.load.image("platform", "./public/assets/platform.png");
    this.load.image("diamond", "./public/assets/diamond.png");
    this.load.image("square", "./public/assets/square.png");
    this.load.image("triangle", "./public/assets/triangle.png");
    this.load.image("ninja", "./public/assets/Ninja.png");
    this.load.image("background", "./public/assets/FondoMenu.jpg");
    this.load.image("bomb", "./public/assets/bomb.png");
  }

  create() {
    //background image
    this.add.image(400, 300, "sky").setScale(2);

    //platforms
    this.platform = this.physics.add.staticGroup();
    this.platform.create(400, 580, "platform").setScale(2).refreshBody();
    this.platformB = this.physics.add.staticGroup();
    this.platformB.create(120, 200, "platform");
    this.platformB.create(400, 380, "platform");

    //player config
    this.player = this.physics.add
      .sprite(400, 300, "ninja")
      .setScale(0.2)
      .refreshBody();

    this.cursors = this.input.keyboard.createCursorKeys();

    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(
      this.platform,
      this.player,
      () => {
        this.canJump = true;
      },
      null,
      this
    );
    this.physics.add.collider(
      this.platformB,
      this.player,
      () => {
        this.canJump = true;
      },
      null,
      this
    );

    //timer config
    this.timeLeft = 40;
    this.timerText = this.add.text(680, 20, "time:" + this.timeLeft, {
      fontSize: "25px",
      color: "#000",
    });

    this.timer = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.timeLeft--;
        this.timerText.setText("time:" + this.timeLeft);

        if (this.timeLeft <= 0) {
          this.scene.start("endMenu", { score: this.score });
        }
      },
      loop: true,
    });

    //colectables mechanic
    this.shapes = this.physics.add.group();
    this.rampingDificulty = this.time.addEvent({
      delay: 5000,
      callback: () => {
        this.spawnerTime -= 100;
        this.time.removeEvent(this.collectables);
        this.collectables = this.time.addEvent({
          delay: this.spawnerTime,
          callback: () => {
            this.spawnerLogic();
          },

          loop: true,
        });
      },
      loop: 5,
    });

    this.collectables = this.time.addEvent({
      delay: this.spawnerTime,
      callback: () => {
        this.spawnerLogic();
      },

      loop: true,
    });

    this.physics.add.overlap(
      this.player,
      this.shapes,
      this.hitShape,
      null,
      this
    );

    this.score = 0;
    this.scoreText = this.add.text(20, 20, "Score:" + this.score, {
      fontSize: "25px",
      color: "#000",
    });

    this.keydown = this.input.keyboard.addKeys("R");

    this.input.keyboard.on("keydown-R", () => {
      this.scene.restart();
    });
  }

  update() {
    //movement
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200);
    } else {
      this.player.setVelocityX(0);
    }
    if (
      this.cursors.up.isDown &&
      this.player.body.touching.down &&
      this.canJump
    ) {
      this.canJump = false;
      this.player.setVelocityY(-300);
    }

    this.input.keyboard.on("keydown-R", () => {
      this.scene.restart();
    });
  }
  hitShape(player, shape) {
    shape.disableBody(true, true);
    this.score += shape.value;
    this.scoreText.setText("Score:" + this.score);
  }

  loseValue(shape, platform) {
    shape.value -= 5;
    if (shape.value <= 0) {
      shape.destroy();
    }
  }

  spawnerLogic() {
    let shape = Phaser.Math.RND.pick(["square", "triangle", "diamond", "bomb"]);

    let x =
      this.player.x < 400
        ? Phaser.Math.Between(400, 800)
        : Phaser.Math.Between(0, 400);

    let sprite = this.shapes.create(x, 16, shape);
    sprite.setBounce(0.7);
    sprite.setCollideWorldBounds(true);
    sprite.setVelocity(Phaser.Math.Between(-200, 200), 20);
    sprite.allowGravity = false;
    if (shape == "square") {
      sprite.value = 6;
    } else if (shape == "triangle") {
      sprite.value = 10;
    } else if (shape == "diamond") {
      sprite.value = 20;
    } else {
      sprite.value = -100;
    }
    this.physics.add.collider(
      this.shapes,
      this.platform,
      this.loseValue,
      null,
      this
    );
  }
}
