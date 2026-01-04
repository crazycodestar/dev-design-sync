export type SceneObject = {
  id: string;
  type: "rect";
  attrs: {
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string;
    stroke: string;
    strokeWidth: number;
  };
};

class Scene {
  private sceneObjects: SceneObject[];
  private sceneX: number;
  private sceneY: number;
  private offsetX: number;
  private offsetY: number;

  constructor() {
    this.sceneObjects = [];

    // Minus because the sceneToCanvas function does a substraction and we need to offset the scene to the center of the canvas
    this.sceneX = -window.innerWidth / 2;
    this.sceneY = -window.innerHeight / 2;

    this.offsetX = 0;
    this.offsetY = 0;
  }

  sceneToCanvas = (scrollX: number, scrollY: number) => {
    this.offsetX = this.sceneX - scrollX;
    this.offsetY = this.sceneY - scrollY;

    return { offsetX: this.offsetX, offsetY: this.offsetY };
  };

  canvasToScene = (scrollX: number, scrollY: number, zoom: number) => {
    const sceneX = (this.offsetX + scrollX) / zoom;
    const sceneY = (this.offsetY + scrollY) / zoom;

    return { sceneX, sceneY };
  };

  getSceneObjects = () => {
    return this.sceneObjects;
  };

  addSceneObject = (sceneObject: SceneObject) => {
    this.sceneObjects.push(sceneObject);
  };
}

export default Scene;
