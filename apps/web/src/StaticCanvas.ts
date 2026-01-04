import InteractiveCanvas from "./InteractiveCanvas";
import Scene from "./Scene";

class StaticCanvas {
  canvas: HTMLCanvasElement;
  interactiveCanvas: HTMLCanvasElement;
  camera: InteractiveCanvas;
  scene: Scene;

  width: number = 0;
  height: number = 0;

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.style.touchAction = "none";

    this.scene = new Scene();

    this.interactiveCanvas = document.createElement("canvas");
    this.camera = new InteractiveCanvas(this.interactiveCanvas);

    this.setup();
    this.loop();
    window.addEventListener("resize", this.setup);
  }

  cleanup() {
    this.camera.cleanup();
    window.removeEventListener("resize", this.setup);
  }

  private setup = () => {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.width = `${window.innerWidth}px`;
    this.canvas.style.height = `${window.innerHeight}px`;

    this.width = window.innerWidth;
    this.height = window.innerHeight;
  };

  handleCreateElement() {
    const x =
      this.scene.getSceneObjects().length > 0 ? Math.random() * this.width : 0;
    const y =
      this.scene.getSceneObjects().length > 0 ? Math.random() * this.height : 0;

    const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

    this.scene.addSceneObject({
      id: crypto.randomUUID(),
      type: "rect",
      attrs: {
        x,
        y,
        width: 100,
        height: 100,
        fill: color,
        stroke: "black",
        strokeWidth: 1,
      },
    });
  }

  private loop = () => {
    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save();

    ctx.translate(this.camera.scrollX, this.camera.scrollY);
    ctx.scale(this.camera.zoom, this.camera.zoom);

    this.scene.getSceneObjects().forEach((sceneObject) => {
      switch (sceneObject.type) {
        case "rect":
          ctx.fillStyle = sceneObject.attrs.fill;
          ctx.fillRect(
            sceneObject.attrs.x,
            sceneObject.attrs.y,
            sceneObject.attrs.width,
            sceneObject.attrs.height
          );
      }
    });

    ctx.restore();

    requestAnimationFrame(this.loop);
  };
}

export default StaticCanvas;
