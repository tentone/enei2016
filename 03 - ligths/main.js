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

//Scene
var scene = new THREE.Scene();

//Camera
var camera = new THREE.PerspectiveCamera(60, canvas.width/canvas.height, 0.1, 1000);
camera.position.set(0, 0, 3);
scene.add(camera);

//Sphere
var material = new THREE.MeshPhongMaterial();
var geometry = new THREE.SphereGeometry(1, 64, 64);
var sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

//Light
var light = new THREE.PointLight();
light.color = new THREE.Color(0xAA0000);
light.position.set(0, 0, 3);
scene.add(light);

//Ambient light
var ambient = new THREE.AmbientLight();
ambient.color = new THREE.Color(0x333333);
scene.add(ambient);

//Call update loop
update();

//Logic update and render loop
function update()
{
	//Schedule update call for next frame
	requestAnimationFrame(update);

	//Move point light
	light.position.x = 5 * Math.sin(Date.now() / 1000);

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