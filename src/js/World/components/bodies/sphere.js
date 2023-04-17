import { SphereGeometry, Mesh, Quaternion, Euler } from 'three';
import {
  RigidBodyDesc,
  ColliderDesc,
  ActiveEvents
} from '@dimforge/rapier3d-compat';

const sphere = (
    material,
    size,
    translation,
    rotation,
    physicsWorld,
    props = {
      collisionEvents: false
    },
  ) => {

  const geometry = new SphereGeometry(size.radius, 64, 64);
  const mesh = new Mesh( geometry, material );
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.collisionCounter = 0.1;
  mesh.hue = props.hue;

  const rigidBodyDesc = RigidBodyDesc.dynamic();
  rigidBodyDesc.setTranslation(translation.x, translation.y, translation.z);
  const q = new Quaternion().setFromEuler(
    new Euler( rotation.x, rotation.y, rotation.z, 'XYZ' )
  )
  rigidBodyDesc.setRotation({ x: q.x, y: q.y, z: q.z, w: q.w });

  const rigidBody = physicsWorld.createRigidBody(rigidBodyDesc);
  rigidBody.iname = 'sphere';
  rigidBody.mesh = mesh;

  let collider = null;
  if (!props.collisionEvents) {
    collider = ColliderDesc.ball(size.radius)
    .setRestitution(0.9);
  } else {
    collider = ColliderDesc.ball(size.radius)
    .setRestitution(0.9)
    .setActiveEvents(ActiveEvents.COLLISION_EVENTS);
  }

  physicsWorld.createCollider(collider, rigidBody);

  return {
    mesh: mesh,
    collider: collider,
    rigidBody: rigidBody
  };
}

export { sphere };