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
