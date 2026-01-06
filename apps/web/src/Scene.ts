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

  getObjectById = (id: string): SceneObject | null => {
    return (
      this.sceneObjects.find((sceneObject) => sceneObject.id === id) ?? null
    );
  };

  getObjectAtPosition = (
    worldX: number,
    worldY: number
  ): SceneObject | null => {
    for (let i = this.sceneObjects.length - 1; i >= 0; i--) {
      const sceneObject = this.sceneObjects[i];
      if (
        sceneObject.attrs.x <= worldX &&
        sceneObject.attrs.x + sceneObject.attrs.width >= worldX &&
        sceneObject.attrs.y <= worldY &&
        sceneObject.attrs.y + sceneObject.attrs.height >= worldY
      )
        return sceneObject;
    }
    return null;
  };
}

export default Scene;
