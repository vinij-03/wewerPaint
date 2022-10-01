// import * as THREE from "three";
// // import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
// // import {FirstPersonControls} from 'three/examples/jsm/controls/FirstPersonControls'
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
// //import "./style.css";
// import { AnimationMixer } from "three";
// import { TubePainter } from 'three/examples/jsm/misc/TubePainter.js';
// import {VRButton} from "three/examples/jsm/webxr/VRButton.js"
// import ImmersiveControls from '@depasquale/three-immersive-controls';
// import * as CANNON from 'cannon-es'
// //import { FirstPersonVRControls } from "three-firstperson-vr-controls";
// import { threeToCannon, ShapeType } from 'three-to-cannon';
// import CannonDebugger from "cannon-es-debugger";
// //import VRControls from './VRcontrols';
// //import MotionController from 'three/examples/jsm/libs/motion-controllers.module'
// import soldier from './Soldier.glb'
// import sfl2 from './interior  20.glb'
// var scene, camera, renderer, mesh, clock, controls, mixer, action,cWorld,sceneCBody;
// var sceneMesh
// var ambientLight;
// var cannonDebugger
// var crate, crateTexture, crateNormalMap, crateBumpMap;
// var keyboard = {};
// var player = { height:2.5, speed:0.2, turnSpeed:Math.PI*0.02 };
// var USE_WIREFRAME = false;
// var initialPosition = { x : 0, y : 3, z : 2}
// var controller1, controller2
// const cursor = new THREE.Vector3();

// var loadingScreen = {
// 	scene: new THREE.Scene(),
// 	camera: new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 0.1, 100),
// 	box: new THREE.Mesh(
// 		new THREE.BoxGeometry(0.5,0.5,0.5),
// 		new THREE.MeshBasicMaterial({ color:0x4444ff })
// 	)
// };
// var loadingManager = null;
// var RESOURCES_LOADED = false;

// // Models index
// var models = {
// 	uzi: {
// 		glb : soldier,
// 		mesh: null,
// 		castShadow:false
// 	}
// };

// // Meshes index
// var meshes = {};


// function init(){
// 	scene = new THREE.Scene();
// 	camera = new THREE.PerspectiveCamera(90, 1280/720, 0.3, 1000);
// 	clock = new THREE.Clock();
// 	cWorld = new CANNON.World({
// 		gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
// 	  })

// 	cannonDebugger = new CannonDebugger(scene,cWorld)

// 	loadingScreen.box.position.set(0,0,5);
// 	loadingScreen.camera.lookAt(loadingScreen.box.position);
// 	loadingScreen.scene.add(loadingScreen.box);

// 	loadingManager = new THREE.LoadingManager();
// 	loadingManager.onProgress = function(item, loaded, total){
// 		console.log(item, loaded, total);
// 	};
// 	loadingManager.onLoad = function(){
// 		console.log("loaded all resources");
// 		RESOURCES_LOADED = true;
// 		onResourcesLoaded();
// 	};

// 	mesh = new THREE.Mesh(
// 		new THREE.BoxGeometry(1,1,1),
// 		new THREE.MeshPhongMaterial({color:0xff4444, wireframe:USE_WIREFRAME})
// 	);
// 	mesh.position.y += 1;
// 	mesh.receiveShadow = true;
// 	mesh.castShadow = true;
// 	scene.add(mesh);

// 	// meshFloor = new THREE.Mesh(
// 	// 	new THREE.PlaneGeometry(20,20, 10,10),
// 	// 	new THREE.MeshPhongMaterial({color:0xffffff, wireframe:USE_WIREFRAME})
// 	// );
// 	// meshFloor.rotation.x -= Math.PI / 2;
// 	// meshFloor.receiveShadow = true;
// 	// scene.add(meshFloor);


// 	ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
// 	scene.add(ambientLight);
// 	const dirLight = new THREE.DirectionalLight(0xffffff, 1);
//   dirLight.position.set(-60, 100, -10);
//   dirLight.castShadow = true;
//   dirLight.shadow.camera.top = 50;
//   dirLight.shadow.camera.bottom = -50;
//   dirLight.shadow.camera.left = -50;
//   dirLight.shadow.camera.right = 50;
//   dirLight.shadow.camera.near = 0.1;
//   dirLight.shadow.camera.far = 200;
//   dirLight.shadow.mapSize.width = 4096;
//   dirLight.shadow.mapSize.height = 4096;
//   scene.add(dirLight);

// 	crate = new THREE.Mesh(
// 		new THREE.BoxGeometry(3,3,3),
// 		new THREE.MeshPhongMaterial({
// 			color:0xffffff,
// 			map:crateTexture,
// 			bumpMap:crateBumpMap,
// 			normalMap:crateNormalMap
// 		})
// 	);

// 	// Load models
// 	// REMEMBER: Loading in Javascript is asynchronous, so you need
// 	// to wrap the code in a function and pass it the index. If you
// 	// don't, then the index '_key' can change while the model is being
// 	// downloaded, and so the wrong model will be matched with the wrong
// 	// index key.
// 	for( var _key in models ){
// 		(function(key){
// 				var glbLoader = new GLTFLoader(loadingManager);
// 				glbLoader.load(models[key].glb, function(mesh){
// 					mixer = new THREE.AnimationMixer(mesh.scene)
// 					action = mixer.clipAction(mesh.animations[3])
// 					action.play()
// 					mesh.scene.traverse(function(node){
// 						if( node instanceof THREE.Mesh ){
// 							if('castShadow' in models[key])
// 								node.castShadow = models[key].castShadow;
// 							else
// 								node.castShadow = true;

// 							if('receiveShadow' in models[key])
// 								node.receiveShadow = models[key].receiveShadow;
// 							else
// 								node.receiveShadow = true;
// 						}
// 					});
// 					models[key].mesh = mesh;

// 				});

// 		})(_key);
// 	}

// 	const dracoLoader = new DRACOLoader();
// 	dracoLoader.setDecoderPath('three/examples/js/libs/draco/gltf/')
// 	const loader = new GLTFLoader()
// 	loader.setDRACOLoader(dracoLoader)
// 	loader.load(sfl2, function(glb){
//     const root = glb.scene
// 	sceneMesh = glb.scene
//     scene.add(root)
// 	const {shape, offset, quaternion} = threeToCannon(sceneMesh, {type: ShapeType.HULL});
// 	sceneCBody = new CANNON.Body({
// 		type: CANNON.Body.STATIC,
// 	  })
// 	sceneCBody.addShape(shape,offset,quaternion) // make it face up
// 	cWorld.addBody(sceneCBody)
// 	},
// 	)

// 	mesh = new THREE.Mesh(
// 		new THREE.BoxGeometry(1,1,1),
// 		new THREE.MeshPhongMaterial({color:0xff4444, wireframe:USE_WIREFRAME})
// 	);

// 	mesh.position.y = 20

// 	camera.position.set(0, player.height, -5);
// 	camera.lookAt(new THREE.Vector3(0,player.height,0));

// 	renderer = new THREE.WebGLRenderer();
// 	renderer.setSize(window.innerWidth, window.innerHeight);

// 	renderer.shadowMap.enabled = true;
// 	renderer.shadowMap.type = THREE.BasicShadowMap;
// 	renderer.xr.enabled = true;
// 	function onResourcesLoaded(){

// 		// player weapon
// 		meshes["playerweapon"] = models.uzi.mesh.scene;
// 		meshes["playerweapon"].position.set(0,0,0);
// 		meshes["playerweapon"].scale.set(0.5,0.5,0.5);
// 		meshes['playerweapon'].rotation.y = Math.PI;
// 		//scene.add(meshes["playerweapon"]);
// 	}

// // 	const rig = new THREE.Object3D();
// // rig.add(camera);
// // scene.add(rig);

// //controls = new FirstPersonVRControls(camera, scene, rig);
// // Optionally enable vertical movement.
// //controls.verticalMovement = true;
// // You can also enable strafing, set movementSpeed, snapAngle and boostFactor.
// //controls.strafing = true;
// //const clock = new THREE.Clock();
// //controls = new VRControls(camera)
// 	controls = new ImmersiveControls(camera, renderer, scene, {initialPosition : { x : 0, y : 10.6, z : 4},floor : 9,mouseControls:true});
// 	console.log(controls)
// 	const painter1 = new TubePainter();
// 				scene.add( painter1.mesh );

// 				const painter2 = new TubePainter();
// 				scene.add( painter2.mesh );

// 				function onSelectStart() {

// 					this.userData.isSelecting = true;

// 				}

// 				function onSelectEnd() {

// 					this.userData.isSelecting = false;

// 				}

// 				function onSqueezeStart() {

// 					this.userData.isSqueezing = true;
// 					this.userData.positionAtSqueezeStart = this.position.y;
// 					this.userData.scaleAtSqueezeStart = this.scale.x;

// 				}

// 				function onSqueezeEnd() {

// 					this.userData.isSqueezing = false;

// 				}

// 				controller1 = renderer.xr.getController( 0 );
// 				controller1.addEventListener( 'selectstart', onSelectStart );
// 				controller1.addEventListener( 'selectend', onSelectEnd );
// 				controller1.addEventListener( 'squeezestart', onSqueezeStart );
// 				controller1.addEventListener( 'squeezeend', onSqueezeEnd );
// 				controller1.userData.painter = painter1;

// 				controller2 = renderer.xr.getController( 1 );
// 				controller2.addEventListener( 'selectstart', onSelectStart );
// 				controller2.addEventListener( 'selectend', onSelectEnd );
// 				controller2.addEventListener( 'squeezestart', onSqueezeStart );
// 				controller2.addEventListener( 'squeezeend', onSqueezeEnd );
// 				controller2.userData.painter = painter2;

// 				const geometry = new THREE.CylinderGeometry( 0.01, 0.02, 0.08, 5 );
// 				geometry.rotateX( - Math.PI / 2 );
// 				const material = new THREE.MeshStandardMaterial( { flatShading: true } );
// 				const mesh2 = new THREE.Mesh( geometry, material );

// 				const pivot = new THREE.Mesh( new THREE.IcosahedronGeometry( 0.01, 3 ) );
// 				pivot.name = 'pivot';
// 				pivot.position.z = - 0.05;
// 				mesh2.add( pivot );

// 				controller1.add( mesh2.clone() );
// 				controller2.add( mesh2.clone() );
// 	//controls.player = meshes["playerweapon"]
// 		//controls = new PointerLockControls(camera, renderer.domElement);
// 		//controls.maxPolarAngle = 3*Math.PI/4
// 	 //scene.add(controls.getObject());
// 	//  document.body.addEventListener(
// 	// 	'click',
// 	// 	function () {
// 	// 	controls.lock()
// 	// 	},
// 	// 	false
// 	// )
// 	//document.addEventListener('mousemove',onMouseMove)
// 	document.body.appendChild(VRButton.createButton(renderer));
// 	document.body.appendChild(renderer.domElement);
// 	cWorld.fixedStep()
// 	renderer.setAnimationLoop(animate)
// 	//animate();
// }


// // const onMouseMove = function(event)
// // {
// // 	if (controls.isLocked == true){
// // 		const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
// // 		const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
// // 		meshes["playerweapon"].rotation.y -= movementX*0.002
// // 	}
// // }	

// // Runs when all resources are loaded

// function animate(){
// 	// Play the loading screen until resources are loaded.
// 	if( RESOURCES_LOADED == false ){
// 		//requestAnimationFrame(animate);
// 		loadingScreen.box.position.x -= 0.05;
// 		if( loadingScreen.box.position.x < -10 ) loadingScreen.box.position.x = 10;
// 		loadingScreen.box.position.y = Math.sin(loadingScreen.box.position.x);

// 		renderer.render(loadingScreen.scene, loadingScreen.camera);
// 		return;
// 	}

// 	//requestAnimationFrame(animate);

// 	controls.update();

// 	var time = Date.now() * 0.0005;
// 	var delta = clock.getDelta();

// 	mixer.update(delta)
// 	mesh.rotation.x += 0.01;
// 	mesh.rotation.y += 0.02;
// 	crate.rotation.y += 0.01;
// 	// Uncomment for absurdity!
// 	// meshes["pirateship"].rotation.z += 0.01;

// 	if(keyboard[87]){ // W key
// 		//controls.moveForward(1)
// 	}
// 	if(keyboard[83]){ // S key
// 		//controls.moveForward(-1)
// 	}
// 	if(keyboard[65]){ // A key
// 		//controls.moveRight(-1)
// 	}
// 	if(keyboard[68]){ // D key
// 		//controls.moveRight(1)

// 	}

// 	if(keyboard[37]){ // left arrow key
// 		camera.rotation.y -= player.turnSpeed;
// 	}
// 	if(keyboard[39]){ // right arrow key
// 		camera.rotation.y += player.turnSpeed;
// 	}


// 	// position the object in front of the camera
// 	meshes["playerweapon"].position.set(
// 		controls.cameraData.worldPosition.x,
// 		controls.cameraData.worldPosition.y-0.8,
// 		controls.cameraData.worldPosition.z
// 	);
//   //meshes['playerweapon'].rotation.y = controls.cameraData.worldRotation.y
// 	//meshes["playerweapon"].lookAt(controls.cameraData.worldPosition)
// 	/*
// 	meshes["playerweapon"].rotation.set(
// 		camera.rotation.x,
// 		camera.rotation.y,
// 		camera.rotation.z
// 	);
// */
// //console.log(controls.camera.up)
// 	//console.log(controls.cameraData.worldRotation)
// 	// console.log(meshes["playerweapon"].rotation)
// 	handleController( controller1 );
// 				handleController( controller2 );
// 	cannonDebugger.update()
// 	renderer.render(scene, camera);
// }

// function handleController( controller ) {

// 	const userData = controller.userData;
// 	const painter = userData.painter;

// 	const pivot = controller.getObjectByName( 'pivot' );

// 	if ( userData.isSqueezing === true ) {

// 		const delta = ( controller.position.y - userData.positionAtSqueezeStart ) * 5;
// 		const scale = Math.max( 0.1, userData.scaleAtSqueezeStart + delta );

// 		pivot.scale.setScalar( scale );
// 		painter.setSize( scale );

// 	}

// 	cursor.setFromMatrixPosition( pivot.matrixWorld );

// 	if ( userData.isSelecting === true ) {

// 		painter.lineTo( cursor );
// 		painter.update();

// 	} else {

// 		painter.moveTo( cursor );

// 	}

// }

// function keyDown(event){
// 	keyboard[event.keyCode] = true;
// }

// function keyUp(event){
// 	keyboard[event.keyCode] = false;
// }

// window.addEventListener('keydown', keyDown);
// window.addEventListener('keyup', keyUp);

// window.onload = init;



import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TubePainter } from './lib/Painter';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import ImmersiveControls from '@depasquale/three-immersive-controls';
import sfl2 from './interior.glb'
import soldier from './Soldier.glb'
import { Color } from 'three';
import { io } from "socket.io-client"
let camera, scene, renderer;
let controller1, controller2;
let sceneMesh = null
const cursor = new THREE.Vector3();

let socket = null
let controls;
let gameScene
let meshes = {}
let joinedRoom = false;
let dracoLoader,loader
init();
animate();

function init() {
	socketInit("room1")
	const container = document.createElement('div');
	document.body.appendChild(container);

	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x222222);

	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10000);
	camera.position.set(0, 1.6, 0);
	// controls = new OrbitControls( camera, container );
	// controls.target.set( 0, 1.6, 0 );
	// controls.update();
	// const tableGeometry = new THREE.BoxGeometry( 0.5, 0.8, 0.5 );
	// const tableMaterial = new THREE.MeshStandardMaterial( {
	// 	color: 0x444444,
	// 	roughness: 1.0,
	// 	metalness: 0.0
	// } );
	// const table = new THREE.Mesh( tableGeometry, tableMaterial );
	// table.position.y = 0.35;
	// table.position.z = 0.85;
	// scene.add( table );

	// const floorGometry = new THREE.PlaneGeometry( 4, 4 );
	// const floorMaterial = new THREE.MeshStandardMaterial( {
	// 	color: 0x222222,
	// 	roughness: 1.0,
	// 	metalness: 0.0
	// } );
	// const floor = new THREE.Mesh( floorGometry, floorMaterial );
	// floor.rotation.x = - Math.PI / 2;
	// scene.add( floor );

	// const grid = new THREE.GridHelper( 10, 20, 0x111111, 0x111111 );
	// // grid.material.depthTest = false; // avoid z-fighting
	// scene.add( grid );

	const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
	scene.add(ambientLight);
	const dirLight = new THREE.DirectionalLight(0xffffff, 1);
	dirLight.position.set(-60, 100, -10);
	dirLight.castShadow = true;
	dirLight.shadow.camera.top = 50;
	dirLight.shadow.camera.bottom = -50;
	dirLight.shadow.camera.left = -50;
	dirLight.shadow.camera.right = 50;
	dirLight.shadow.camera.near = 0.1;
	dirLight.shadow.camera.far = 200;
	dirLight.shadow.mapSize.width = 4096;
	dirLight.shadow.mapSize.height = 4096;
	scene.add(dirLight);

	dracoLoader = new DRACOLoader();
	dracoLoader.setDecoderPath('three/examples/js/libs/draco/gltf/')
	loader = new GLTFLoader()
	//loader.setDRACOLoader(dracoLoader)
	loader.load("https://elasticbeanstalk-ap-south-1-889470011136.s3.ap-south-1.amazonaws.com/interior.glb", function (glb) {
		sceneMesh = glb.scene
		const root = glb.scene
		root.scale.set(0.065, 0.065, 0.065)
		root.position.y = -2
		scene.add(root)

	})
	//scene.add( new THREE.HemisphereLight( 0x888877, 0x777788 ) );

	// const light = new THREE.DirectionalLight( 0xffffff, 0.5 );
	// light.position.set( 0, 4, 0 );
	// scene.add( light );

	//

	const painter1 = new TubePainter();
	console.log()
	scene.add(painter1.mesh);
	painter1.changeColor(new Color(0xff00ff))
	const painter2 = new TubePainter();
	scene.add(painter2.mesh);

	//

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.xr.enabled = true;
	container.appendChild(renderer.domElement);

	document.body.appendChild(VRButton.createButton(renderer));

	// controllers

	function onSelectStart() {

		this.userData.isSelecting = true;

	}

	function onSelectEnd() {

		this.userData.isSelecting = false;

	}

	function onSqueezeStart() {

		this.userData.isSqueezing = true;
		this.userData.positionAtSqueezeStart = this.position.y;
		this.userData.scaleAtSqueezeStart = this.scale.x;

	}

	function onSqueezeEnd() {

		this.userData.isSqueezing = false;

	}

	controls = new ImmersiveControls(camera, renderer, scene)
	console.log(controls)
	controller1 = renderer.xr.getController(0);
	controller1.addEventListener('selectstart', onSelectStart);
	controller1.addEventListener('selectend', onSelectEnd);
	controller1.addEventListener('squeezestart', onSqueezeStart);
	controller1.addEventListener('squeezeend', onSqueezeEnd);
	controller1.userData.painter = painter1;

	controller2 = renderer.xr.getController(1);
	controller2.addEventListener('selectstart', onSelectStart);
	controller2.addEventListener('selectend', onSelectEnd);
	controller2.addEventListener('squeezestart', onSqueezeStart);
	controller2.addEventListener('squeezeend', onSqueezeEnd);
	controller2.userData.painter = painter2;

	//

	const geometry = new THREE.CylinderGeometry(0.01, 0.02, 0.08, 5);
	geometry.rotateX(- Math.PI / 2);
	const material = new THREE.MeshStandardMaterial({ flatShading: true });
	const mesh = new THREE.Mesh(geometry, material);

	const pivot = new THREE.Mesh(new THREE.IcosahedronGeometry(0.01, 3))

	pivot.name = 'pivot';
	pivot.position.z = - 0.05;
	mesh.add(pivot);

	controller1.add(mesh.clone());
	controller2.add(mesh.clone());

	//

	window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

//

function handleController(controller) {

	const userData = controller.userData;
	const painter = userData.painter;

	const pivot = controller.getObjectByName('pivot');

	if (userData.isSqueezing === true) {

		const delta = (controller.position.y - userData.positionAtSqueezeStart) * 5;
		const scale = Math.max(0.1, userData.scaleAtSqueezeStart + delta);

		pivot.scale.setScalar(scale);
		painter.setSize(scale);

	}

	cursor.setFromMatrixPosition(pivot.matrixWorld);

	if (userData.isSelecting === true) {

		painter.lineTo(cursor);
		painter.update();

	} else {

		painter.moveTo(cursor);

	}

}

function animate() {

	renderer.setAnimationLoop(render);

}

function render() {
	if (sceneMesh) {
		
	}
	if(joinedRoom){
		let user = {
            userId: socket.id,
            userName: "User",
            roomId: "room1",
            avatarId: 1,
            position: controls.cameraData.worldPosition,
            rotation: controls.cameraData.worldRotation
        }
		let data = {
			room: "room1",
			user: user
		}
		//console.log(data)
		socket.emit("update", data)
		for(let user in gameScene.users){
			//console.log(gameScene.users[user].position)
			if (gameScene.users[user].userId != socket.id){
				if(user in meshes){
					meshes[user].position.x = gameScene.users[user].position.x
					meshes[user].position.y = gameScene.users[user].position.y - 1.6
					meshes[user].position.z = gameScene.users[user].position.z
					//[user].rotation.y = gameScene.users[user].rotation.y
					meshes[user].setRotationFromEuler(new THREE.Euler(0, 0, 0))
					meshes[user].applyQuaternion(gameScene.users[user].rotation)
					//meshes[user].position.set(gameScene.users[user].position.x, gameScene.users[user].position.y, gameScene.users[user].position.z)
				}
				else{
					meshes[user] = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0x00ff00}))
					loader.load("https://elasticbeanstalk-ap-south-1-889470011136.s3.ap-south-1.amazonaws.com/Soldier.glb", function (glb) {
						scene.add(glb.scene)
						meshes[user] = glb.scene
						gameScene.users[user].loaded = true
						console.log("Loaded")
					})
				}
			}
		}
	}
	handleController(controller1);
	handleController(controller2);
	controls.update()
	renderer.render(scene, camera);

}

function socketInit(roomId) {
	socket = io("http://localhost:3001");
	socket.on("connect", () => {
		console.log("Connected to server");
		console.log("Socket ID: "+socket.id);
		let data = {
			room: roomId
		}
		socket.emit("joinRoom", data)
	})
	socket.on("joinedRoom", (data) => {
		console.log(data)
		joinedRoom = true
		gameScene = data
		//loadPlayers(data)
	})
	socket.on("newupdate", (data) => {
		gameScene = data
	})
}

function loadPlayers(data) {
	for (let user of data.users) {
		console.log(user)
	}
}