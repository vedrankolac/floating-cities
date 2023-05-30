import { PMREMGenerator } from "three";
import { RoomEnvironment } from "./RoomEnv";

export const createEnvMapFromScene = renderer => {
  const pmremGenerator = new PMREMGenerator(renderer);
  return pmremGenerator.fromScene(new RoomEnvironment(), 0.001).texture;
}