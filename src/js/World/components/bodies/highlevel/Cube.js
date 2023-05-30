import { BoxGeometry, Mesh, Quaternion, Euler } from 'three';
import {
  RigidBodyDesc,
  ColliderDesc
} from '@dimforge/rapier3d-compat';

export class Cube {
  constructor(
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
  ) {
    this.material = material;
    this.size = size;
    this.translation = translation;
    this.rotation = rotation;
    this.rigidType = rigidType;
    this.physicsWorld = physicsWorld;
    this.name = name;
    this.widthSegments = widthSegments;
    this.heightSegments = heightSegments;
    this.depthSegments = depthSegments;
    
    this.create();
  }

  create = () => {
    this.geometry = new BoxGeometry(
      this.size.width,
      this.size.height,
      this.size.depth,
      this.widthSegments,
      this.heightSegments,
      this.depthSegments
    );
    
    this.mesh = new Mesh( this.geometry, this.material );
    this.mesh.position.x =  this.translation.x;
    this.mesh.position.y =  this.translation.y;
    this.mesh.position.z =  this.translation.z;
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    if (this.name !=='')  {
      this.mesh.name  = this.name;
    }

    this.rigidBodyDesc = null;
    this.rigidBody = null;
    this.collider = null;

    if (this.rigidType !== 'none') {
      if (this.rigidType === 'dynamic') {
        this.rigidBodyDesc = RigidBodyDesc.dynamic();
      } else if (this.rigidType === 'fixed') {
        this.rigidBodyDesc = RigidBodyDesc.fixed();
      }

      this.rigidBodyDesc.setTranslation(this.translation.x, this.translation.y, this.translation.z);
      const q = new Quaternion().setFromEuler(
        new Euler( this.rotation.x, this.rotation.y, this.rotation.z, 'XYZ' )
      )
      this.rigidBodyDesc.setRotation({ x: q.x, y: q.y, z: q.z, w: q.w });

      this.rigidBody = this.physicsWorld.createRigidBody(this.rigidBodyDesc);
      this.collider = ColliderDesc.cuboid(this.size.width / 2, this.size.height / 2, this.size.depth / 2);

      this.physicsWorld.createCollider(this.collider, this.rigidBody);
    }
  }

  destroy = () => {
    this.geometry.dispose();
    this.mesh = null;
    this.geometry = null;

    if (this.collider) {
      this.physicsWorld.removeCollider(this.collider);
      this.collider = null;
    }

    if (this.rigidBody) {
      this.physicsWorld.removeRigidBody(this.rigidBody); 
      this.rigidBody = null;
    }

    if (this.rigidBodyDesc) {
      this.rigidBodyDesc = null;
    }
  }
}