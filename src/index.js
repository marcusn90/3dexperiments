import * as THREE from 'three';
window.THREE = THREE;
require('three/examples/js/controls/OrbitControls')

import World from './world';

import matrix from './matrix';

let scene, camera, camera2, renderer, controls, cube, butterly, planet, plane, normals = [];

function setup_scene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color('#000');
}

function setup_camera() {
  camera = new THREE.PerspectiveCamera(75, World.RATIO, 1, 4001);
  
  camera.position.set(360,100,400);
  camera.lookAt(0, 0, 0);
  // camera2 = new THREE.PerspectiveCamera(75, World.RATIO, 1, 4001);
  
  // camera2.position.set(-360,100,400);
  // camera2.lookAt(0, 0, 0);
}

function setup_renderer() {
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(World.WIDTH, World.HEIGHT);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.gammaInput = true;
  renderer.gammaOutput = true;

  // renderer.autoClear = false; // to have 2 viewports

  document.body.appendChild(renderer.domElement);
  document.body.style.margin = 0;
  document.body.style.padding = 0;
}

function orbit_controls() {
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  // const controls2 = new THREE.OrbitControls(camera2, renderer.domElement);
}

function axes_helper() {
  scene.add(new THREE.AxesHelper(100));
}

function object_normal_helper(obj, size = 5) {
  const n = new THREE.FaceNormalsHelper(obj, size);
  normals.push(n);
  scene.add(n);
}

function create_plane() {
  const g = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
  const m = new THREE.MeshPhongMaterial( { color: 0x080808, side: THREE.DoubleSide } );
  plane = new THREE.Mesh(g, m);
  plane.rotation.set(Math.PI / 2, 0, 0);

  plane.receiveShadow = true;

  scene.add(plane);
}

function ambient_light(intencity) {
  scene.add(new THREE.AmbientLight(0xFFFFFF, intencity))
}

function directional_light(show_helper = false) {
  const light = new THREE.DirectionalLight(0xFFFFFF, 1);
  light.position.set(0, 500, 500);
  light.castShadow = true;
  
  scene.add(light);

  if (show_helper) {
    scene.add(new THREE.DirectionalLightHelper(light, 5));
  }

  // const helper = new THREE.CameraHelper( light.shadow.camera );
  // scene.add( helper );
}


function spot_light() {
  const l = new THREE.SpotLight( 0xffffff, 0.3 );
  l.position.set( -200, 150, 500 );
  l.angle = Math.PI / 4;
  l.penumbra = 0.05;
  l.decay = 2;
  l.distance = 25100;
  l.castShadow = true;

  // l.lookAt(0,6000,0)

  scene.add(l)

}

function create_box(s) {
  const g = new THREE.BoxGeometry(s, s, s);
  // const m = new THREE.MeshBasicMaterial({
  const m = new THREE.MeshStandardMaterial({
    side: THREE.BackSide,
    color: '#469'
  });
  const c = new THREE.Mesh(g, m);

  c.receiveShadow = true;
  c.position.z= -400
  scene.add(c)
}

function add_helper_text() {
  const p = document.createElement('p');
  p.textContent = '[hint: type numbers from keyboard to see animation]';
  p.style.position = 'absolute';
  p.style.top = '20px';
  p.style.left = '20px';
  p.style.color = '#fff';
  p.style.fontFamily = 'monospace';

  document.body.append(p);
}

function init() {
  setup_scene();
  setup_camera();
  setup_renderer();
  World.init();

  ambient_light(0.1);
  // directional_light();
  spot_light();


  // axes_helper();
  orbit_controls();

  // create_plane();

  create_box(3000);

  // const c1 = create_cube(100)
  // c1.receiveShadow = true;
  // c1.position.z = 120
  // scene.add(c1)

  scene.add(matrix.create());
  add_helper_text();
}

function update() {
  World.update();
  matrix.update();
}

function main_loop() {
  update();
  // renderer.clear();
  renderer.render(scene, camera);

  // renderer.setViewport(0,0,World.WIDTH/2,World.HEIGHT);
  // renderer.setScissor(0,0,World.WIDTH/2,World.HEIGHT);
  // renderer.setScissorTest(true);
  // renderer.render(scene, camera);

  // renderer.setViewport(World.WIDTH/2,0,World.WIDTH,World.HEIGHT);
  // renderer.setScissor(World.WIDTH/2,0,World.WIDTH,World.HEIGHT);
  // renderer.setScissorTest(true);
  // renderer.render(scene, camera2);

  requestAnimationFrame(main_loop);
}

init();
main_loop();