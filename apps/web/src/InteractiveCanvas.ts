class InteractiveCanvas {
  private canvas: HTMLCanvasElement;

  width: number = 0;
  height: number = 0;

  scrollX: number = 0;
  scrollY: number = 0;

  zoom: number = 1;
  maxZoom: number = 10;
  minZoom: number = 0.1;

  private isDragging: boolean = false;
  private lastMouseX: number = 0;
  private lastMouseY: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvas.style.touchAction = "none";
    this.setupCanvas();

    this.scrollX = window.innerWidth / 2;
    this.scrollY = window.innerHeight / 2;

    this.canvas.addEventListener("wheel", this.handleZoomAndPanWithMouseWheel, {
      passive: false,
    });
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
    this.canvas.addEventListener("mouseleave", this.handleMouseLeave);
  }

  private setupCanvas = () => {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.width = `${window.innerWidth}px`;
    this.canvas.style.height = `${window.innerHeight}px`;
    this.canvas.style.position = "absolute";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.zIndex = "1000";

    this.width = window.innerWidth;
    this.height = window.innerHeight;
  };

  private handleMouseDown = (e: MouseEvent) => {
    // Middle mouse button (button 1)
    if (e.button === 1) {
      this.isDragging = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
      this.canvas.style.cursor = "grabbing";
    }
  };

  private handleMouseMove = (e: MouseEvent) => {
    if (this.isDragging) {
      const deltaX = e.clientX - this.lastMouseX;
      const deltaY = e.clientY - this.lastMouseY;

      // Pan speed scales with zoom
      this.scrollX += deltaX;
      this.scrollY += deltaY;

      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
      // this.render();
    }
  };

  private handleMouseUp = (e: MouseEvent) => {
    if (this.isDragging && e.button === 1) {
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
    if (!(e.ctrlKey || e.metaKey)) {
      this.scrollX += e.deltaX * -1;
      this.scrollY += e.deltaY * -1;
      return;
    }

    const zoomIntensity = 0.001;
    const zoomFactor = Math.exp(-e.deltaY * zoomIntensity);

    this.zoomAtScreenPoint(zoomFactor, e.offsetX, e.offsetY);
  };

  screenToWorld(screenX: number, screenY: number) {
    return {
      x: (screenX - this.scrollX) / this.zoom,
      y: (screenY - this.scrollY) / this.zoom,
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

  cleanup = () => {
    this.canvas.removeEventListener(
      "wheel",
      this.handleZoomAndPanWithMouseWheel
    );
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
    this.canvas.removeEventListener("mouseup", this.handleMouseUp);
    this.canvas.removeEventListener("mouseleave", this.handleMouseLeave);
  };
}

export default InteractiveCanvas;
