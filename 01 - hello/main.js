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

//Material (defines how the object surface in draw)
var material = new THREE.MeshBasicMaterial({color: 0xFF0000});

//Geometry (defines the object form)
var geometry = new THREE.BoxGeometry(1, 1, 1);

//Mesh (combines a geometry and a material)
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

//Call update loop
update();

//Logic update and render loop
function update()
{
	//Schedule update call for next frame
	requestAnimationFrame(update);

	//Rotate box
	//cube.rotation.y += 0.01;
	//cube.rotation.x += 0.02;
	
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