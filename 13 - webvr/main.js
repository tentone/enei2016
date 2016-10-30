"use strict";

//Create canvas element
var canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position = "absolute";
canvas.style.width = canvas.width + "px";
canvas.style.height = canvas.height + "px";
canvas.style.top = "0px";
canvas.style.left = "0px";
document.body.appendChild(canvas);

//WebGl renderer
var renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(canvas.width, canvas.height);
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//Scene
var scene = new THREE.Scene();

//Camera
var camera = new THREE.PerspectiveCamera(60, canvas.width/canvas.height, 0.1, 1000);
camera.position.set(10, 10, 20);
scene.add(camera);

//Texture
var texture = new THREE.Texture(document.createElement("img"));
texture.image.src = "../files/crate.png";
texture.image.onload = function()
{
	texture.needsUpdate = true;
}

//Normal
var normal = new THREE.Texture(document.createElement("img"));
normal.image.src = "../files/crate_normal.png";
normal.image.onload = function()
{
	normal.needsUpdate = true;
}

//Material
var material = new THREE.MeshPhongMaterial({color: 0xFFFFFF});
material.map = texture;
material.normalMap = normal;

//Box geometry
var geometry = new THREE.BoxGeometry(1, 1, 1);

//Create boxes (individual materials)
for(var i = 0; i < 400; i++)
{
	var box = new THREE.Mesh(geometry, material.clone());

	//Random rotation and position
	box.position.set(Math.random() * 20 - 10, Math.random() * 20, Math.random() * 20 - 10);
	box.rotation.set(Math.random() * 3.14, Math.random() * 3.14, Math.random() * 3.14);
	box.scale.multiplyScalar(Math.random() * 0.75 + 0.25);

	//Turn shadow casting / receiving on
	box.castShadow = true;
	box.receiveShadow = true;

	//Avoid transformation matrix recalculation every frame
	box.updateMatrix();
	box.matrixAutoUpdate = false;

	//Add box
	scene.add(box);
}

//Ground
var ground = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshPhongMaterial());
ground.scale.set(100, 1, 100);
ground.position.set(10, -1, 10);
ground.castShadow = true;
ground.receiveShadow = true;
scene.add(ground);

//Point Light
var light = new THREE.PointLight();
light.color = new THREE.Color(0xFFFFFF);
light.position.set(0, 10, -3);
light.castShadow = true;
scene.add(light);

//Ambient light
var ambient = new THREE.AmbientLight();
ambient.color = new THREE.Color(0x999999);
scene.add(ambient);

var controls = new THREE.VRControls(camera);
var effect = new THREE.VREffect(renderer);

if(WEBVR.isAvailable())
{
	document.body.appendChild(WEBVR.getButton(effect));
}

//Call update loop
update();

//Logic update and render loop
function update()
{
	//Schedule update call for next frame
	requestAnimationFrame(update);

	//Move point light
	light.position.x = 10 * Math.sin(Date.now() / 1000) + 10;

	//Update camera rotation and pos from HMD
	controls.update();

	//Render scene to HMD
	effect.render(scene, camera);
}

//Resize
function resize()
{
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	renderer.setSize(canvas.width, canvas.height);

	camera.aspect = canvas.width / canvas.height;
	camera.updateProjectionMatrix();
}
