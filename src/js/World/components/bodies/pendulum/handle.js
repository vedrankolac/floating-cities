import { BoxGeometry, Mesh, Quaternion, Euler, Group } from 'three';
import {
  RigidBodyDesc,
  ColliderDesc
} from '@dimforge/rapier3d-compat';
import { shiftHandleUVs } from './shiftHandleUVs';

const handle = (
    conf,
    physicsWorld,
    widthSegments = 1,
    heightSegments = 1,
    depthSegments = 1
  ) => {

  const geometry = new BoxGeometry(
    conf.size.width,
    conf.size.height,
    conf.size.depth,
    widthSegments,
    heightSegments,
    depthSegments
  );
  const mesh = new Mesh(geometry, conf.material);
  mesh.position.x = conf.anchor.x;
  mesh.position.y = conf.anchor.y;
  mesh.position.z = conf.anchor.z;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  const group = new Group();
  group.add(mesh);
  shiftHandleUVs(conf, mesh.geometry.attributes.uv);
  group.name = 'handle';

  const rigidBodyDesc = RigidBodyDesc.dynamic();
  rigidBodyDesc.setTranslation(conf.translation.x, conf.translation.y, conf.translation.z);
  const q = new Quaternion().setFromEuler(
    new Euler(conf.rotation.x, conf.rotation.y, conf.rotation.z, 'XYZ')
  )
  rigidBodyDesc.setRotation({x: q.x, y: q.y, z: q.z, w: q.w});

  const rigidBody = physicsWorld.createRigidBody(rigidBodyDesc);
  const collider = ColliderDesc.cuboid(conf.size.width / 2, conf.size.height / 2, conf.size.depth / 2)
    .setRestitution(0.7)
    .setTranslation(
        conf.anchor.x,
        conf.anchor.y,
        conf.anchor.z
      );

  physicsWorld.createCollider(collider, rigidBody);

  // add in loop.updatableBodies to trigger
  // rigidBody.tick = (delta) => {
  //   const treshold = Math.random();
  //   const impulseRange = 1.4;
  //   if (treshold < 0.02) {
  //     rigidBody.applyTorqueImpulse({
  //       x: 0,
  //       y: 0,
  //       z: Math.random() * impulseRange - impulseRange/2,
  //     }, true);
  //   }
  // };

  return {
    mesh: group,
    collider: collider,
    rigidBody: rigidBody
  };
}

export { handle };