import type { SceneObject } from "./types";
import Camera from "./Camera";
import Scene from "./Scene";
import type Renderer from "./Renderer";

class Controller {
  camera: Camera;
  canvas: HTMLCanvasElement;
  scene: Scene;

  selectedObjectId: SceneObject["id"] | null = null;

  private boundingRectStrokeWidth: number = 1.5;
  private boundingRectStrokeStyle: string = "oklch(0.55 0.22 263)";
  private controlHandleSize: number = 8;

  constructor(renderer: Renderer) {
    this.camera = renderer.camera;
    this.canvas = renderer.canvas;
    this.scene = renderer.scene;

    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    window.addEventListener("keydown", this.handleKeyDown);
  }

  private handleMouseDown = (e: MouseEvent) => {
    if (e.button === 0) {
      const hitTestResult = this.camera.hitTest(e.clientX, e.clientY);

      if (!hitTestResult) this.selectedObjectId = null;
      else this.selectedObjectId = hitTestResult.id;

      return;
    }
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" || e.key === "Delete") {
      this.selectedObjectId = null;
    }
  };

  drawControllerUI = (ctx: CanvasRenderingContext2D) => {
    if (this.selectedObjectId) {
      ctx.strokeStyle = this.boundingRectStrokeStyle;
      ctx.lineWidth = this.boundingRectStrokeWidth;

      const sceneObject = this.scene.getObjectById(this.selectedObjectId);
      if (!sceneObject) return;

      const { x, y } = this.camera.worldToScreen(
        sceneObject.attrs.x,
        sceneObject.attrs.y
      );
      const { x: x2, y: y2 } = this.camera.worldToScreen(
        sceneObject.attrs.x + sceneObject.attrs.width,
        sceneObject.attrs.y + sceneObject.attrs.height
      );
      const width = x2 - x;
      const height = y2 - y;

      ctx.strokeRect(
        x - this.boundingRectStrokeWidth / 2,
        y - this.boundingRectStrokeWidth / 2,
        width + this.boundingRectStrokeWidth,
        height + this.boundingRectStrokeWidth
      );

      // Draw control handles
      ctx.lineWidth = this.boundingRectStrokeWidth * 2;
      ctx.strokeStyle = this.boundingRectStrokeStyle;
      ctx.fillStyle = "#ffffff";

      ctx.strokeRect(
        x - this.controlHandleSize / 2,
        y - this.controlHandleSize / 2,
        this.controlHandleSize,
        this.controlHandleSize
      );
      ctx.fillRect(
        x - this.controlHandleSize / 2,
        y - this.controlHandleSize / 2,
        this.controlHandleSize,
        this.controlHandleSize
      );

      ctx.strokeRect(
        x2 - this.controlHandleSize / 2,
        y2 - this.controlHandleSize / 2,
        this.controlHandleSize,
        this.controlHandleSize
      );
      ctx.fillRect(
        x2 - this.controlHandleSize / 2,
        y2 - this.controlHandleSize / 2,
        this.controlHandleSize,
        this.controlHandleSize
      );

      ctx.strokeRect(
        x - this.controlHandleSize / 2,
        y2 - this.controlHandleSize / 2,
        this.controlHandleSize,
        this.controlHandleSize
      );
      ctx.fillRect(
        x - this.controlHandleSize / 2,
        y2 - this.controlHandleSize / 2,
        this.controlHandleSize,
        this.controlHandleSize
      );

      ctx.strokeRect(
        x2 - this.controlHandleSize / 2,
        y - this.controlHandleSize / 2,
        this.controlHandleSize,
        this.controlHandleSize
      );
      ctx.fillRect(
        x2 - this.controlHandleSize / 2,
        y - this.controlHandleSize / 2,
        this.controlHandleSize,
        this.controlHandleSize
      );
    }
  };

  cleanup = () => {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    window.removeEventListener("keydown", this.handleKeyDown);
  };
}

export default Controller;
