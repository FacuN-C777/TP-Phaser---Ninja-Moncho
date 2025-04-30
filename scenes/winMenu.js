// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

//import game from "./game";

export default class winMenu extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("winMenu");
  }

  init() {
    // this is called before the scene is created
    // init variables
    // take data passed from other scenes
    // data object param {}
    game.score;
  }

  preload() {
    // load assets
    this.load.image("background", "./public/assets/FondoMenu.jpg");
  }

  create() {
    this.add.image(400, 300, "background");
    this.add.text(280, 200, "You win", {
      fontSize: "50px",
      color: "#000",
    });
    this.add.text(300, 250, `Your score was ${score}`, {
      fontSize: "30px",
      color: "#000",
    });
    this.add.text(300, 300, `Press "Enter" key to start again`, {
      fontSize: "30px",
      color: "#000",
    });

    this.keydown = this.input.keyboard.addKeys("Enter");
  }

  update() {
    this.input.keyboard.on("keydown-Enter", () => {
      this.scene.start("game");
    });
  }
}
