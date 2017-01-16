window.sound = null;

(function raffleModule() {
const TRANSFORM_DURATION = 1000;
const TOTAL_COUNT = STAFF.length;

let scene, camera, renderer, controls, stats;

let objects = [];
let highlights = [];
let tableTargets = [];
let sphereTargets = [];
let gridTargets = [];

let spinning = false;
let theta = 0;
let DISTANCE = 4000;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = DISTANCE;

  // particle
  var geometry = new THREE.SphereGeometry( 5, 32, 32 );
  var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
  var sphere = new THREE.Mesh( geometry, material );
  scene.add( sphere );

  // table
  for (let i = 0; i < TOTAL_COUNT; i++) {
    const [tx, ty, name] = STAFF[i];

    const element = document.createElement('div');
    element.className = 'element';
    element.id = i;
    element.innerHTML = `
      <img src="photos/${name}.jpg" />
      <div class="details">${name}</div>`;

    const cssObject = new THREE.CSS3DObject(element);
    cssObject.position.x = _.random(-2000, 2000);
    cssObject.position.y = _.random(-2000, 2000);
    cssObject.position.z = _.random(-2000, 2000);
    scene.add(cssObject);

    objects.push(cssObject);

    const object = new THREE.Object3D();
    object.position.x = (tx * (120 + 10)) - 2100;
    object.position.y = -(ty * (166.7 + 10)) + 700;
    tableTargets.push(object);
  }

  // sphere
  const sphereVector = new THREE.Vector3();
  const spherical = new THREE.Spherical();

  for (let i = 0; i < TOTAL_COUNT; i ++) {
    const object = new THREE.Object3D();
    const phi = Math.acos(-1 + (2 * i) / TOTAL_COUNT);
    const theta = Math.sqrt(TOTAL_COUNT * Math.PI) * phi;

    spherical.set(800, phi, theta);
    object.position.setFromSpherical(spherical);
    sphereVector.copy(object.position).multiplyScalar(2);
    object.lookAt(sphereVector);
    sphereTargets.push(object);
  }

  // grid
  for (let i = 0; i < TOTAL_COUNT; i ++) {
    const object = new THREE.Object3D();
    const COLUMNS = 3;

    object.position.x = ((Math.floor(i / COLUMNS)) * 300) - 500;
    object.position.y = ((i % COLUMNS) * 300) - 300;
    object.position.z = 2000;
    gridTargets.push(object);
  }

  // renderer
  renderer = new THREE.CSS3DRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.style.position = 'absolute';
  document.getElementById('container').appendChild(renderer.domElement);

  // controls
  controls = new THREE.TrackballControls(camera, renderer.domElement);
  controls.rotateSpeed = 0.5;
  controls.minDistance = 500;
  controls.maxDistance = DISTANCE;
  controls.addEventListener('change', render);

  // audio
  const listener = new THREE.AudioListener();
  camera.add( listener );
  window.sound = new THREE.Audio( listener );
  const audioLoader = new THREE.AudioLoader();
  audioLoader.load( 'sounds/wwm.mp3', function( buffer ) {
    window.sound.setBuffer( buffer );
    window.sound.setLoop(true);
    window.sound.play();
  });

  window.addEventListener('resize', onWindowResize);

  // stats
  //stat = new Stats();
  //stat.domElement.style.position = 'absolute';
  //stat.domElement.style.right = '0px';
  //stat.domElement.style.top = '0px';
  //document.body.appendChild(stat.domElement);

  // trigger initial transform
  transform(objects, tableTargets);
}

function transform(objects, targets) {
  TWEEN.removeAll();

  for (let i = 0; i < objects.length; i ++) {
    const object = objects[i];
    const target = targets[i];
    const tp = target.position;
    const tr = target.rotation;
    const rp = _.random(1, 2, true) * TRANSFORM_DURATION;
    const rr = _.random(1, 2, true) * TRANSFORM_DURATION;

    new TWEEN.Tween(object.position)
      .to({ x: tp.x, y: tp.y, z: tp.z }, rp)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start();
    new TWEEN.Tween(object.rotation)
      .to({ x: tr.x, y: tr.y, z: tr.z }, rr)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start();
  }

  new TWEEN.Tween(this)
    .to({}, TRANSFORM_DURATION * 2)
    .onUpdate(render)
    .start();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

function animate() {
  TWEEN.update();
  controls.update();
  //stats.update();
}

function render() {
  renderer.render(scene, camera);
}

// exports
window.TRANSFORM_DURATION = TRANSFORM_DURATION;
window.initRaffles = init;
window.animateRaffles = animate;
window.renderRaffles = render;
window.transformRaffles = transform;
window.objects = objects;
window.highlights = highlights;
window.tableTargets = tableTargets;
window.sphereTargets = sphereTargets;
window.gridTargets = gridTargets;
})();
