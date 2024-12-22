import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();

// Set background as #fafabb
// scene.background = new THREE.Color('#fafabb');
scene.background = new THREE.CubeTextureLoader().setPath('background/').load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);
// scene.fog = new THREE.Fog('#cccccc', 15, 30);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setAnimationLoop(animate);
renderer.shadowMap.enabled = true; // Enable shadow map
const controls = new OrbitControls(camera, renderer.domElement);

// 2. Camera =====================================================================================
camera.position.set(10, 10, 20);

// 3. Animate function ===========================================================================

let angle = 0; // Góc khởi đầu
const radius = 10; // Bán kính quỹ đạo

function animate() {
	// Cập nhật vị trí quả cầu theo quỹ đạo tròn
	if (sun) {
		angle += 0.01; // Tốc độ di chuyển
		sun.position.x = radius * Math.cos(angle);
		sun.position.z = radius * Math.sin(angle);
		sun.position.y = 30
		controls.update();
		renderer.render(scene, camera);
	}

	if (musicalNote && isPlayingMusic) {
		musicalNote.position.y += 0.025;
		if (musicalNote.position.y > 10) {
			musicalNote.position.y = 4;
		}
	}
}

// 4. Advance ====================================================================================
// a. Oxyz --------------------------------------------------------------------
const axesHelper = new THREE.AxesHelper(500);
scene.add(axesHelper);

// b. Sound

// sound

// Create an audio listener and add it to the camera
const listener = new THREE.AudioListener();
camera.add(listener);

// Do một chính sách của trình duyệt như Chrome nhằm hạn chế quảng cáo, autoplay không khả dụng. Do đó, nên thêm sự kiện click để bật âm thanh
function resumeAudioContext() {
	if (listener.context.state === 'suspended') {
		listener.context.resume().then(() => {
			console.log('AudioContext resumed');
		});
	}
}
document.addEventListener('click', resumeAudioContext, { once: true });
document.addEventListener('touchstart', resumeAudioContext, { once: true });

// Create a global audio source
const birdSound = new THREE.Audio(listener);

// Load a sound and set it as the Audio object's buffer
const birdAudioLoader = new THREE.AudioLoader();
birdAudioLoader.load('sounds/bird.mp3', function(buffer) {
	birdSound.setBuffer(buffer);
	birdSound.setLoop(true);
	birdSound.setVolume(0.5);
	birdSound.play();
	console.log('Sound loaded');
});


const windAudioLoader = new THREE.AudioLoader();
windAudioLoader.load('sounds/wind.mp3', function(buffer) {
	const windSound = new THREE.Audio(listener);
	windSound.setBuffer(buffer);
	windSound.setLoop(true);
	windSound.setVolume(0.5);
	windSound.play();
	console.log('Wind sound loaded');
});


let isPlayingMusic = false;
const musicAudioLoader = new THREE.AudioLoader();
let musicSound;
musicAudioLoader.load('sounds/music.mp3', function(buffer) {
	musicSound = new THREE.Audio(listener);
	musicSound.setBuffer(buffer);
	musicSound.setLoop(true);
	musicSound.setVolume(1.0);
	console.log('Music sound loaded');
});
const toggleMusic = () => {
	if (isPlayingMusic) {
		musicSound.pause();
		console.log('Music paused');
		isPlayingMusic = false;
	} else {
		musicSound.play();
		console.log('Music played');
		isPlayingMusic = true;
	}
}

// Sphere geometry
//d. Geometry ----------------------------------------------------------------
const sphereGeometry = new THREE.SphereGeometry(1, 32, 16);
const sunTexture = new THREE.TextureLoader().load('textures/sun.jpg');
const sunMaterial = new THREE.MeshPhongMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sphereGeometry, sunMaterial);
scene.add(sun);
sun.castShadow = true;
sun.receiveShadow = true;
sun.position.set(10, 20, 10);

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeTexture = new THREE.TextureLoader().load('textures/box.png')
const cubeMaterial = new THREE.MeshPhongMaterial({ map: cubeTexture });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);
cube.castShadow = true
cube.receiveShadow = true
cube.position.set(10, 2.5, 10);

const globeGeometry = new THREE.SphereGeometry(5, 40, 16);
const globeTexture = new THREE.TextureLoader().load('textures/box2.jpg');
const globeMaterial = new THREE.MeshPhongMaterial({ map: globeTexture });
const globe = new THREE.Mesh(globeGeometry, globeMaterial);
scene.add(globe);
globe.castShadow = true;
globe.receiveShadow = true;
globe.position.set(20, 2.5, 10);
globe.scale.set(0.1, 0.1, 0.1);

// Load model

const houseLoader = new GLTFLoader();
houseLoader.load('models/house.glb', (gltf) => {
	const house = gltf.scene
	house.position.set(10, 0, 10)
	scene.add(house);
	house.traverse(function(child) {
		if (child.isMesh) {
			child.castShadow = true;
			child.receiveShadow = true;
		}
	});
});

const birdLoader = new GLTFLoader();
birdLoader.load('models/bird.glb', (gltf) => {
	const bird = gltf.scene
	bird.position.set(10, 5, 10)
	bird.add(birdSound)
	scene.add(bird);
	bird.traverse(function(child) {
		if (child.isMesh) {
			child.castShadow = true;
			child.receiveShadow = true;
		}
	});
});

const mailboxLoader = new GLTFLoader();
mailboxLoader.load('models/mailbox.glb', (gltf) => {
	const mailbox = gltf.scene
	mailbox.position.set(15, 5, 0)
	mailbox.scale.set(0.005, 0.005, 0.005)
	mailbox.add(birdSound)
	scene.add(mailbox);
	mailbox.traverse(function(child) {
		if (child.isMesh) {
			child.castShadow = true;
			child.receiveShadow = true;
		}
	});
});

const tableLoader = new GLTFLoader();
tableLoader.load('models/table.glb', (gltf) => {
	const table = gltf.scene
	table.position.set(10, 1, 5)
	table.scale.set(1, 1, 1)
	scene.add(table);
	table.traverse(function(child) {
		if (child.isMesh) {
			child.castShadow = true;
			child.receiveShadow = true;
		}
	});
});


const stereoLoader = new GLTFLoader();
stereoLoader.load('models/stereo.glb', (gltf) => {
	const stereo = gltf.scene
	stereo.position.set(10, 4, 5)
	stereo.scale.set(10, 10, 10)
	scene.add(stereo);
	stereo.traverse(function(child) {
		if (child.isMesh) {
			child.castShadow = true;
			child.receiveShadow = true;
			child.userData.name = 'stereo';
		}
	});
});


const musicalNoteLoader = new GLTFLoader();
let musicalNote;
musicalNoteLoader.load('models/musical_note.glb', (gltf) => {
	musicalNote = gltf.scene
	musicalNote.position.set(7.5, 4, 4.5)
	musicalNote.scale.set(0.1, 0.1, 0.1)
	scene.add(musicalNote);
	musicalNote.traverse(function(child) {
		if (child.isMesh) {
			child.castShadow = true;
			child.receiveShadow = true;
		}
	});
});


// e. Light ----------------------------------------------------------------

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); // soft white light
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 4);
directionalLight.position.set(-5, 10, -10);
directionalLight.castShadow = true;
directionalLight.shadow.camera.left = -50;
directionalLight.shadow.camera.right = 50;
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.bottom = -50;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

const sunLight = new THREE.PointLight(0xffffaa, 500, 50); // Màu vàng nhạt, cường độ 2, khoảng cách chiếu sáng 50
sunLight.castShadow = true;
sun.add(sunLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 100); // Color, intensity, distance

pointLight.position.set(10, 10, 10);

pointLight.castShadow = true;
scene.add(pointLight);

const sphereSize = 1;
const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
scene.add(pointLightHelper);


// f. Interaction ----------------------------------------------------------------

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

	raycaster.setFromCamera(mouse, camera);
	const intersects = raycaster.intersectObjects(scene.children, true);
	for (let i = 0; i < intersects.length; i++) {
		console.log(intersects[i].object.userData.name);
		if (intersects[i].object.userData.name === 'stereo') {
			toggleMusic();
			break;
		}
	}
}

window.addEventListener('click', onMouseClick, false);
