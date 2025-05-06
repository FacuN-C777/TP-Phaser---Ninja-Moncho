// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

//import game from "./game";

export default class endMenu extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("endMenu");
  }

  init(data) {
    // this is called before the scene is created
    // init variables
    // take data passed from other scenes
    // data object param {}
    this.score = data.score || 0;
  }

  preload() {
    // load assets
    this.load.image("background", "./public/assets/FondoMenu.jpg");
  }

  create() {
    this.add.image(400, 300, "background");

    if (this.score >= 100) {
      this.add.text(280, 200, "You win", {
        fontSize: "50px",
        color: "#000",
      });
      this.add.text(230, 250, `Your score was ${this.score}`, {
        fontSize: "30px",
        color: "#000",
      });
      this.add.text(150, 300, `Press "R" key to start again`, {
        fontSize: "30px",
        color: "#000",
      });
    } else {
      this.add.text(280, 200, "You lose", {
        fontSize: "50px",
        color: "#000",
      });
      this.add.text(250, 250, `Your score was ${this.score}`, {
        fontSize: "30px",
        color: "#000",
      });
      this.add.text(250, 300, `Reach 100 to win`, {
        fontSize: "30px",
        color: "#000",
      });
      this.add.text(150, 350, `Press "R" key to start again`, {
        fontSize: "30px",
        color: "#000",
      });
    }

    this.keydown = this.input.keyboard.addKeys("R");
  }

  update() {
    this.input.keyboard.on("keydown-R", () => {
      this.scene.start("game");
    });
  }
}
