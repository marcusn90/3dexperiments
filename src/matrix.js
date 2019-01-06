import * as THREE from 'three';
import numbers from './numbers';


const matrix_obj = new THREE.Object3D();
const matrix_size = 9;
const matrix_color = '#f11';
const cube_size = 30;
const anim_step = 0.1;
const distance = cube_size / 5;

let scene;
let current_animation = null;
let keys_pressed = [9,8,7,6,5,4,3,2,1];

matrix_obj.userData.cubes = [];

function is_key_supported(key) {
  return /[0-9]/.test(key)
}

export function create_cube(s) {
  const g = new THREE.BoxGeometry(s, s, s);
  // const m = new THREE.MeshBasicMaterial({
  const m = new THREE.MeshStandardMaterial({
    side: THREE.FrontSide,
    // wireframe: true
  });
  const c = new THREE.Mesh(g, m);
  c.castShadow = true;
  return c;
}

function create_matrix(scene) {
  for (let i = 0; i < matrix_size; i++) {
    matrix_obj.userData.cubes[i] = [];
    for (let j = 0; j < matrix_size; j++) {
      const c = create_cube(cube_size);
      c.position.set(j * (cube_size + distance) + cube_size / 2, -1 * (i * (cube_size + distance) + cube_size / 2), 0);
      c.material.color = new THREE.Color(matrix_color);
      matrix_obj.userData.cubes[i][j] = c;
      matrix_obj.add(c);
    }
  }

  const side_length = matrix_size * cube_size + (matrix_size - 1) * distance;
  matrix_obj.position.set(-side_length / 2, side_length / 2, 0);

  document.addEventListener('keyup', (e) => {
    if (is_key_supported(e.key)) {
      keys_pressed.push(e.key);
    }
  });

  return matrix_obj;
}

function is_complete(animated, to) {
  const { cubes } = matrix_obj.userData;

  for (let i = 0; i < matrix_size; i++) {
    for (let j = 0; j < matrix_size; j++) {
      if (animated[i][j] && cubes[i][j].scale.z != to.z/cubes[i][j].geometry.parameters.width) {
        return false;
      }
      if (!animated[i][j] && cubes[i][j].scale.z != 1) {
        return false;
      }
    }
  }

  return true;
}

function animate_matrix(animated, to) {
  const { cubes } = matrix_obj.userData;

  for (let i = 0; i < matrix_size; i++) {
    for (let j = 0; j < matrix_size; j++) {
      const cube = cubes[i][j];
      if (animated[i][j]) {
        cube.scale.z = Math.min(to.z/cube.geometry.parameters.width, cube.scale.z + anim_step);
      } else {
        cube.scale.z = Math.max(1, cube.scale.z - anim_step)
      }
      cube.material.color = new THREE.Color('#22e').lerp(new THREE.Color(matrix_color), 1 / cube.scale.z);
      cube.position.z = cube.geometry.parameters.width * cube.scale.z / 2;
    }
  }

  return is_complete(animated, to);
}

function animate_number(num) {
  if (current_animation === num) {
    const animated = numbers[num];
    if (!animated) {
      return;
    }
    const to = new THREE.Vector3(0, 0, 100);
    let complete = animate_matrix(animated, to);
    if (complete) {
      current_animation = null;
    }
  }
}

function animate_key(key) {
  if (/[0-9]/.test(key)) {
    animate_number(key);
  }
}

function reset_matrix() {
  matrix_obj.children.forEach(c => {
    c.position.z = 0;
    c.material.color = new THREE.Color(matrix_color);
  });
}

export function update_matrix() {
  if (current_animation === null) {
    if (keys_pressed.length > 0) {
      current_animation = keys_pressed.shift()
    }
  } else {
    animate_key(current_animation);
  }
}

const matrix = {
  create: create_matrix,
  update: update_matrix
}

export default matrix;
