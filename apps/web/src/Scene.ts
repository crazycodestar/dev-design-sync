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

  constructor() {
    this.sceneObjects = [];
  }

  getSceneObjects = () => {
    return this.sceneObjects;
  };

  addSceneObject = (sceneObject: SceneObject) => {
    this.sceneObjects.push(sceneObject);
  };
}

export default Scene;
