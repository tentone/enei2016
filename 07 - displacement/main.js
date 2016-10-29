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
renderer.setSize(canvas.width, canvas.height);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0xFFFFFF);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//Scene
var scene = new THREE.Scene();

//Camera
var camera = new THREE.PerspectiveCamera(60, canvas.width/canvas.height, 0.1, 1000);
camera.position.set(0, 0, 2);
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

//Displacement
var displacement = new THREE.Texture(document.createElement("img"));
displacement.image.src = "../files/crate_displacement.png";
displacement.image.onload = function()
{
	displacement.needsUpdate = true;
}

//Material
var material = new THREE.MeshPhongMaterial({color: 0xFFFFFF});
material.map = texture;
material.normalMap = normal;
material.displacementMap = displacement;
material.displacementScale = 0.2;
material.displacementBias = -0.0315;

//Box
var geometry = new THREE.BoxGeometry(1, 1, 1, 128, 128, 128);
var box = new THREE.Mesh(geometry, material);
scene.add(box);

//Light
var light = new THREE.PointLight();
light.color = new THREE.Color(0xBBBBBB);
light.position.set(0, 2, 4);
scene.add(light);

//Ambient light
var ambient = new THREE.AmbientLight();
ambient.color = new THREE.Color(0x999999);
scene.add(ambient);

//Call update loop
update();

//Logic update and render loop
function update()
{
	//Schedule update call for next frame
	requestAnimationFrame(update);

	box.rotation.x += 0.01;
	box.rotation.y += 0.008;

	//Render scene to screen
	renderer.render(scene, camera);
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