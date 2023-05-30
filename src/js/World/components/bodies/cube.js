import { BoxGeometry, Mesh, Quaternion, Euler } from 'three';
import {
  RigidBodyDesc,
  ColliderDesc
} from '@dimforge/rapier3d-compat';

const cube = (
    material,
    size,
    translation,
    rotation,
    rigidType = 'dynamic',
    physicsWorld,
    name = '',
    widthSegments = 1,
    heightSegments = 1,
    depthSegments = 1
  ) => {

  const geometry = new BoxGeometry(
    size.width,
    size.height,
    size.depth,
    widthSegments,
    heightSegments,
    depthSegments
  );
  
  const mesh = new Mesh( geometry, material );
  mesh.position.x = translation.x;
  mesh.position.y = translation.y;
  mesh.position.z = translation.z;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  if (name !=='')  {
    mesh.name  = name;
  }

  let rigidBodyDesc = null;
  let rigidBody = null;
  let collider = null;

  if (rigidType !== 'none') {
    if (rigidType === 'dynamic') {
      rigidBodyDesc = RigidBodyDesc.dynamic();
    } else if (rigidType === 'fixed') {
      rigidBodyDesc = RigidBodyDesc.fixed();
    }

    rigidBodyDesc.setTranslation(translation.x, translation.y, translation.z);
    const q = new Quaternion().setFromEuler(
      new Euler( rotation.x, rotation.y, rotation.z, 'XYZ' )
    )
    rigidBodyDesc.setRotation({ x: q.x, y: q.y, z: q.z, w: q.w });

    rigidBody = physicsWorld.createRigidBody(rigidBodyDesc);
    collider = ColliderDesc.cuboid(size.width / 2, size.height / 2, size.depth / 2);

    physicsWorld.createCollider(collider, rigidBody);
  }

  return {
    geometry,
    mesh,
    collider,
    rigidBody
  };
}

export { cube };