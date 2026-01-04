import InteractiveCanvas from "./InteractiveCanvas";
import Scene from "./Scene";

class StaticCanvas {
  canvas: HTMLCanvasElement;
  interactiveCanvas: HTMLCanvasElement;
  camera: InteractiveCanvas;
  scene: Scene;

  width: number = 0;
  height: number = 0;

  dpr: number = window.devicePixelRatio || 1;

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.style.touchAction = "none";

    this.scene = new Scene();

    this.interactiveCanvas = document.createElement("canvas");
    this.interactiveCanvas.style.touchAction = "none";
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
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;

    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.interactiveCanvas.width = this.width * this.dpr;
    this.interactiveCanvas.height = this.height * this.dpr;

    this.interactiveCanvas.style.width = `${this.width}px`;
    this.interactiveCanvas.style.height = `${this.height}px`;

    this.interactiveCanvas.style.position = "absolute";
    this.interactiveCanvas.style.top = "0";
    this.interactiveCanvas.style.left = "0";
    this.interactiveCanvas.style.zIndex = "1000";
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
        width: 200,
        height: 200,
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

    // Scale for device pixel ratio (logical to physical pixels)
    ctx.scale(this.dpr, this.dpr);

    // Apply camera transform: scale by zoom, then translate by scroll
    // Note: scrollX/scrollY are in screen/logical pixel space
    // Canvas applies transforms in reverse order (last transform first),
    // so we do translate then scale to get scale-then-translate
    // This matches worldToScreen: screenX = worldX * zoom + scrollX
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
