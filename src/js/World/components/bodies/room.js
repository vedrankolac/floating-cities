import { Quaternion, Euler } from "three";
import {
  RigidBodyDesc,
  ColliderDesc
} from '@dimforge/rapier3d-compat';

const room = (physicsWorld, floorSize, isVisible = false) => {
  const wallTickness = 1;

  const floor = {
    size: {
      width:  floorSize/2,
      height: wallTickness,
      depth:  floorSize/2,
    },
    translation: {
      x: 0,
      y: -100,
      z: 0
    },
    rotation: {
      x: 0,
      y: 0,
      z: 0
    }
  }

  const floorRigidBodyDesc = RigidBodyDesc.fixed();
  floorRigidBodyDesc.setTranslation(floor.translation.x, floor.translation.y, floor.translation.z);
  // const floorq = new Quaternion().setFromEuler(
  //   new Euler( floor.rotation.x, floor.rotation.y, floor.rotation.z, 'XYZ' )
  // )
  // floorRigidBodyDesc.setRotation({ x: q.x, y: q.y, z: q.z, w: q.w });
  const floorRigidBody = physicsWorld.createRigidBody(floorRigidBodyDesc);
  let floorCollider = ColliderDesc.cuboid(floor.size.width, floor.size.height, floor.size.depth);
  physicsWorld.createCollider(floorCollider, floorRigidBody);

  // const ceeling = {
  //   size: {
  //     width:  floorSize/2,
  //     height: wallTickness,
  //     depth:  floorSize/2,
  //   },
  //   translation: {
  //     x: 0,
  //     y: floorSize + 1,
  //     z: 0
  //   },
  //   rotation: {
  //     x: 0,
  //     y: 0,
  //     z: 0
  //   }
  // }

  // const ceelingRigidBodyDesc = RigidBodyDesc.fixed();
  // ceelingRigidBodyDesc.setTranslation(ceeling.translation.x, ceeling.translation.y, ceeling.translation.z);
  // // const floorq = new Quaternion().setFromEuler(
  // //   new Euler( ceeling.rotation.x, ceeling.rotation.y, ceeling.rotation.z, 'XYZ' )
  // // )
  // // ceelingRigidBodyDesc.setRotation({ x: q.x, y: q.y, z: q.z, w: q.w });
  // const ceelingRigidBody = physicsWorld.createRigidBody(ceelingRigidBodyDesc);
  // let ceelingCollider = ColliderDesc.cuboid(ceeling.size.width, ceeling.size.height, ceeling.size.depth);
  // physicsWorld.createCollider(ceelingCollider, ceelingRigidBody);

  // const wallLeft = {
  //   size: {
  //     width:  wallTickness,
  //     height: floorSize/2,
  //     depth:  floorSize/2
  //   },
  //   translation: {
  //     x: -floorSize/2 - 1,
  //     y: floorSize/2,
  //     z: 0,
  //   },
  //   rotation: {
  //     x: 0,
  //     y: 0,
  //     z: 0
  //   }
  // }

  // const wallLeftRigidBodyDesc = RigidBodyDesc.fixed();
  // wallLeftRigidBodyDesc.setTranslation(wallLeft.translation.x, wallLeft.translation.y, wallLeft.translation.z);
  // // const q = new Quaternion().setFromEuler(
  // //   new Euler( wallLeft.rotation.x, wallLeft.rotation.y, wallLeft.rotation.z, 'XYZ' )
  // // )
  // // wallLeftRigidBodyDesc.setRotation({ x: q.x, y: q.y, z: q.z, w: q.w });
  // const wallLeftRigidBody = physicsWorld.createRigidBody(wallLeftRigidBodyDesc);
  // let wallLeftCollider = ColliderDesc.cuboid(wallLeft.size.width, wallLeft.size.height, wallLeft.size.depth);
  // physicsWorld.createCollider(wallLeftCollider, wallLeftRigidBody);

  // const wallRight = {
  //   size: {
  //     width:  wallTickness,
  //     height: floorSize/2,
  //     depth:  floorSize/2
  //   },
  //   translation: {
  //     x: floorSize/2 + 1,
  //     y: floorSize/2,
  //     z: 0,
  //   },
  //   rotation: {
  //     x: 0,
  //     y: 0,
  //     z: 0
  //   }
  // }

  // const wallRightRigidBodyDesc = RigidBodyDesc.fixed();
  // wallRightRigidBodyDesc.setTranslation(wallRight.translation.x, wallRight.translation.y, wallRight.translation.z);
  // // const q = new Quaternion().setFromEuler(
  // //   new Euler( wallRight.rotation.x, wallRight.rotation.y, wallRight.rotation.z, 'XYZ' )
  // // )
  // // wallRightRigidBodyDesc.setRotation({ x: q.x, y: q.y, z: q.z, w: q.w });
  // const wallRightRigidBody = physicsWorld.createRigidBody(wallRightRigidBodyDesc);
  // let wallRightCollider = ColliderDesc.cuboid(wallRight.size.width, wallRight.size.height, wallRight.size.depth);
  // physicsWorld.createCollider(wallRightCollider, wallRightRigidBody);

  // const wallBack = {
  //   size: {
  //     width:  floorSize/2,
  //     height: floorSize/2,
  //     depth:  wallTickness
  //   },
  //   translation: {
  //     x: 0,
  //     y: floorSize/2,
  //     z: -floorSize/2 - 1,
  //   },
  //   rotation: {
  //     x: 0,
  //     y: 0,
  //     z: 0
  //   }
  // }

  // const wallBackRigidBodyDesc = RigidBodyDesc.fixed();
  // wallBackRigidBodyDesc.setTranslation(wallBack.translation.x, wallBack.translation.y, wallBack.translation.z);
  // // const q = new Quaternion().setFromEuler(
  // //   new Euler( wallBack.rotation.x, wallBack.rotation.y, wallBack.rotation.z, 'XYZ' )
  // // )
  // // wallBackRigidBodyDesc.setRotation({ x: q.x, y: q.y, z: q.z, w: q.w });
  // const wallBackRigidBody = physicsWorld.createRigidBody(wallBackRigidBodyDesc);
  // let wallBackCollider = ColliderDesc.cuboid(wallBack.size.width, wallBack.size.height, wallBack.size.depth);
  // physicsWorld.createCollider(wallBackCollider, wallBackRigidBody);

  // const wallFront = {
  //   size: {
  //     width:  floorSize/2,
  //     height: floorSize/2,
  //     depth:  wallTickness
  //   },
  //   translation: {
  //     x: 0,
  //     y: floorSize/2,
  //     z: floorSize/2 + 1,
  //   },
  //   rotation: {
  //     x: 0,
  //     y: 0,
  //     z: 0
  //   }
  // }

  // const wallFrontRigidBodyDesc = RigidBodyDesc.fixed();
  // wallFrontRigidBodyDesc.setTranslation(wallFront.translation.x, wallFront.translation.y, wallFront.translation.z);
  // // const q = new Quaternion().setFromEuler(
  // //   new Euler( wallFront.rotation.x, wallFront.rotation.y, wallFront.rotation.z, 'XYZ' )
  // // )
  // // wallFrontRigidBodyDesc.setRotation({ x: q.x, y: q.y, z: q.z, w: q.w });
  // const wallFrontRigidBody = physicsWorld.createRigidBody(wallFrontRigidBodyDesc);
  // let wallFrontCollider = ColliderDesc.cuboid(wallFront.size.width, wallFront.size.height, wallFront.size.depth);
  // physicsWorld.createCollider(wallFrontCollider, wallFrontRigidBody);

  // return {
  //   floorRigidBody,
  //   ceelingRigidBody,
  //   wallLeftRigidBody,
  //   wallRightRigidBody,
  //   wallBackRigidBody,
  //   wallFrontRigidBody
  // };
}

export { room };