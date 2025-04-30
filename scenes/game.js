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
  }

  preload() {
    // load assets
    this.load.image("sky", "./public/assets/cielo.webp");
    this.load.image("platform", "./public/assets/platform.png");
    this.load.image("diamond", "./public/assets/diamond.png");
    this.load.image("square", "./public/assets/square.png");
    this.load.image("triangle", "./public/assets/triangle.png");
    this.load.image("ninja", "./public/assets/Ninja.png");
  }

  create() {
    //background image
    this.add.image(400, 300, "sky").setScale(2);

    //platforms
    this.platform = this.physics.add.staticGroup();
    this.platform.create(400, 580, "platform").setScale(2).refreshBody();

    //player config
    this.player = this.physics.add
      .sprite(400, 300, "ninja")
      .setScale(0.2)
      .refreshBody();

    this.cursors = this.input.keyboard.createCursorKeys();

    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.platform, this.player);

    //timer config
    this.timeLeft = 60;
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
          this.add.text(280, 250, "Game Over", {
            fontSize: "50px",
            color: "#000",
          });
          this.timer.remove();
          this.physics.pause();
          //this.scene.start("winMenu");
        }
      },
      loop: true,
    });

    //colectables mechanic
    this.shapes = this.physics.add.group();
    this.collectables = this.time.addEvent({
      delay: 1000,
      callback: () => {
        let shape = Phaser.Math.RND.pick(["square", "triangle", "diamond"]);

        let x =
          this.player.x < 400
            ? Phaser.Math.Between(400, 800)
            : Phaser.Math.Between(0, 400);

        let sprite = this.shapes.create(x, 16, shape);
        sprite.setBounce(0.5);
        sprite.setCollideWorldBounds(true);
        sprite.setVelocity(Phaser.Math.Between(-200, 200), 20);
        sprite.allowGravity = false;
        sprite.value = Phaser.Math.Between(10, 50);
        this.physics.add.collider(this.shapes, this.platform);
      },
      loop: true,
    });

    this.physics.add.collider(
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
  }

  update() {
    //movement
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
    } else {
      this.player.setVelocityX(0);
    }
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-300);
    }

    //score tracking
  }
  hitShape(player, shape) {
    console.log(shape.value);
    shape.disableBody(true, true);
    this.score++;
    this.scoreText.setText("Score:" + this.score);
  }
}
