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
	box.position.set(Math.random() * 20, Math.random() * 20, Math.random() * 20);
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

//Raycaster
var raycaster = new THREE.Raycaster();
var normalized = new THREE.Vector2();

var mouse = new Mouse();

//Call update loop
update();

//Logic update and render loop
function update()
{
	//Schedule update call for next frame
	requestAnimationFrame(update);

	mouse.update();

	if(mouse.buttonPressed(Mouse.LEFT))
	{
		//Normalize mouse coordinates (range -1 to 1)
		normalized.x = 2 * (mouse.position.x / canvas.width) - 1;
		normalized.y = 1 - 2 * (mouse.position.y / canvas.height);

		//Update raycaster ray position relative to camera
		raycaster.setFromCamera(normalized, camera);	

		//Get intersected objects
		var intersects = raycaster.intersectObjects(scene.children);
		for(var i = 0; i < intersects.length; i++)
		{
			intersects[i].object.material.color.set(0xFF6666);
		}
	}

	//Move point light
	light.position.x = 10 * Math.sin(Date.now() / 1000) + 10;

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
