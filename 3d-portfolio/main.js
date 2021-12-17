import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio)
camera.position.setZ(30);
camera.position.setX(-3);

// renderer.render( scene, camera );

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial( { color: 0xFF6347  } );
const torus = new THREE.Mesh( geometry, material );

scene.add(torus);

// Point Light
const pointLight = new THREE.PointLight(0xFFFFFF)
pointLight.position.set(5, 5, 5) 
// Ambient Light
const ambientLight = new THREE.AmbientLight(0xFFFFFF)
// Helpers
const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 50)

scene.add(pointLight, ambientLight, lightHelper, gridHelper )

const controls = new OrbitControls(camera, renderer.domElement)

// Stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24)
  const material = new THREE.MeshStandardMaterial({color: 0xFFFFFF})
  const star = new THREE.Mesh(geometry, material)

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100))
  star.position.set(x, y, z)
  scene.add(star)
}

Array(200).fill().forEach(addStar)

// Space Background
const spaceTexture = new THREE.TextureLoader().load('space3.jpg')
scene.background = spaceTexture

// Avatar
const aarenTexture = new THREE.TextureLoader().load('aaren3.png')
const aaren = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3), 
  new THREE.MeshBasicMaterial({map: aarenTexture})
)
aaren.position.set(5, 5)
scene.add(aaren)

// Moon
const moonTexture = new THREE.TextureLoader().load('moon.jpeg')
const normalTexture = new THREE.TextureLoader().load('normal.jpeg')
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture
  }))
moon.position.setZ(30)
moon.position.setX(-10)
scene.add(moon)

// Piano
const loader = new GLTFLoader();

loader.load( '/piano/scene.gltf', function ( pianoGltf ) {
  const piano = pianoGltf.scene
  piano.position.set(5,5,-5)
  scene.add(piano);
  // pianoGltf.position.setZ(-10)

}, undefined, function ( error ) {

	console.error( error );

} );


// Scroll Animation
function moveCamera() {
  const t = document.body.getBoundingClientRect().top

  moon.rotateX(0.05)
  moon.rotateY(0.075)
  moon.rotateZ(0.05)

  aaren.rotateX(0.01)
  aaren.rotateY(0.01)

  camera.position.setX(t * 0.002)
  camera.position.setY(t * -0.001)
  camera.position.setZ(t * -0.01)
  
}

document.body.onscroll = moveCamera

// Animation / "Game" Loop
function animate() {
  requestAnimationFrame( animate )

  torus.rotation.x += 0.01
  torus.rotation.y += 0.005
  torus.rotation.z += 0.01

  // controls.update()
  renderer.render( scene, camera );
}

animate()