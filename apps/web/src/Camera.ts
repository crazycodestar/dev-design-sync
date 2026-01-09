import type Renderer from "./Renderer";
import Scene from "./Scene";
import type { SceneObject } from "./types";

class Camera {
  private canvas: HTMLCanvasElement;
  private scene: Scene;

  scrollX: number = 0;
  scrollY: number = 0;

  zoom: number = 1;
  private maxZoom: number = 256;
  private minZoom: number = 0.1;

  private isSpacePressed: boolean = false;

  private isDragging: boolean = false;
  private lastMouseX: number = 0;
  private lastMouseY: number = 0;

  private hoveredObjectId: SceneObject["id"] | null = null;

  private boundingRectStrokeWidth: number = 2;
  private boundingRectStrokeStyle: string = "oklch(0.55 0.22 263)";

  constructor(renderer: Renderer) {
    this.canvas = renderer.canvas;
    this.scene = renderer.scene;

    // Offset the canvas to the center of the screen
    this.scrollX = window.innerWidth / 2;
    this.scrollY = window.innerHeight / 2;

    this.canvas.addEventListener("wheel", this.handleZoomAndPanWithMouseWheel, {
      passive: false,
    });
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
    this.canvas.addEventListener("mouseleave", this.handleMouseLeave);

    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === "Space") {
      this.isSpacePressed = true;
      // Avoid page scrolling while space is held for panning
      e.preventDefault();
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    if (e.code === "Space") {
      this.isSpacePressed = false;
      e.preventDefault();
    }
  };

  private handleMouseDown = (e: MouseEvent) => {
    // Middle mouse button (button 1) or left mouse button (button 0) while space is held
    if (e.button === 1 || (e.button === 0 && this.isSpacePressed)) {
      this.isDragging = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
      this.canvas.style.cursor = "grabbing";

      return;
    }

    if (e.button === 0) {
      const hitTestResult = this.hitTest(e.clientX, e.clientY);
      console.log(hitTestResult);

      return;
    }
  };

  hitTest(x: number, y: number) {
    const { x: worldX, y: worldY } = this.screenToWorld(x, y);
    return this.scene.getObjectAtPosition(worldX, worldY);
  }

  private handleMouseMove = (e: MouseEvent) => {
    if (this.isDragging) {
      this.hoveredObjectId = null;

      const deltaX = e.clientX - this.lastMouseX;
      const deltaY = e.clientY - this.lastMouseY;

      // Pan speed scales with zoom
      this.scrollX += deltaX;
      this.scrollY += deltaY;

      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
      // this.render();
    }

    const hitTestResult = this.hitTest(e.clientX, e.clientY);
    this.hoveredObjectId = hitTestResult?.id ?? null;
  };

  private handleMouseUp = (e: MouseEvent) => {
    if (this.isDragging && (e.button === 1 || e.button === 0)) {
      this.isDragging = false;
      this.lastMouseX = 0;
      this.lastMouseY = 0;
      this.canvas.style.cursor = "default";
    }
  };

  private handleMouseLeave = () => {
    if (this.isDragging) {
      this.isDragging = false;
      this.lastMouseX = 0;
      this.lastMouseY = 0;
      this.canvas.style.cursor = "default";
    }
  };

  // Handles zooming with the mouse wheel when Ctrl is held
  private handleZoomAndPanWithMouseWheel = (e: WheelEvent) => {
    e.preventDefault();
    this.hoveredObjectId = null;

    if (!(e.ctrlKey || e.metaKey)) {
      this.scrollX += e.deltaX * -1;
      this.scrollY += e.deltaY * -1;
      return;
    }

    const zoomIntensity = 0.01;
    const zoomFactor = Math.exp(-e.deltaY * zoomIntensity);

    this.zoomAtScreenPoint(zoomFactor, e.offsetX, e.offsetY);
  };

  screenToWorld(screenX: number, screenY: number) {
    return {
      x: (screenX - this.scrollX) / this.zoom,
      y: (screenY - this.scrollY) / this.zoom,
    };
  }

  worldToScreen(worldX: number, worldY: number) {
    return {
      x: worldX * this.zoom + this.scrollX,
      y: worldY * this.zoom + this.scrollY,
    };
  }

  // Zoom operation that keeps the point under the mouse cursor stationary in world space
  private zoomAtScreenPoint(factor: number, screenX: number, screenY: number) {
    // World point under cursor BEFORE zoom
    const before = this.screenToWorld(screenX, screenY);

    // Apply zoom
    const newZoom = Math.max(
      this.minZoom,
      Math.min(this.maxZoom, this.zoom * factor)
    );

    // Early out (prevents micro drift at limits)
    if (newZoom === this.zoom) return;

    this.zoom = newZoom;

    // World point under cursor AFTER zoom
    const after = this.screenToWorld(screenX, screenY);

    // Cancel drift (SCREEN SPACE)
    this.scrollX += (after.x - before.x) * this.zoom;
    this.scrollY += (after.y - before.y) * this.zoom;
  }

  drawUI = (ctx: CanvasRenderingContext2D) => {
    if (this.hoveredObjectId) {
      ctx.strokeStyle = this.boundingRectStrokeStyle;
      ctx.lineWidth = this.boundingRectStrokeWidth;

      const sceneObject = this.scene.getObjectById(this.hoveredObjectId);
      if (!sceneObject) return;

      const { x, y } = this.worldToScreen(
        sceneObject.attrs.x,
        sceneObject.attrs.y
      );
      const { x: x2, y: y2 } = this.worldToScreen(
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
    }
  };

  cleanup = () => {
    this.canvas.removeEventListener(
      "wheel",
      this.handleZoomAndPanWithMouseWheel
    );
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
    this.canvas.removeEventListener("mouseup", this.handleMouseUp);
    this.canvas.removeEventListener("mouseleave", this.handleMouseLeave);
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  };
}

export default Camera;
