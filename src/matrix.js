import * as THREE from 'three';
import numbers from './numbers';


const matrix_obj = new THREE.Object3D();
const matrix_size = 9;
const matrix_color = '#198';
const cube_size = 20;
const anim_step = 2;
const distance = cube_size / 5;

let scene;
let current_animation = null;
let keys_pressed = [];

matrix_obj.userData.cubes = [];

function is_key_supported(key) {
  return /[0-9]/.test(key)
}

export function create_cube(s) {
  const g = new THREE.BoxGeometry(s, s, s);
  // const m = new THREE.MeshBasicMaterial({
  const m = new THREE.MeshStandardMaterial({
    side: THREE.FrontSide,
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
      if (animated[i][j] && cubes[i][j].position.z != to.z) {
        return false;
      }
      if (!animated[i][j] && cubes[i][j].position.z != 0) {
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
        cube.position.z = Math.min(to.z, cube.position.z + anim_step);
      } else {
        cube.position.z = Math.max(0, cube.position.z - anim_step)
      }
      cube.material.color = new THREE.Color(matrix_color).lerp(new THREE.Color('#649'), cube.position.z / to.z);
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
    const to = new THREE.Vector3(0, 0, 50);
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
