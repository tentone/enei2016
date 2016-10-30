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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//Scene
var scene = new THREE.Scene();

//Camera
var camera = new THREE.PerspectiveCamera(100, canvas.width/canvas.height, 0.1, 1000);
camera.position.set(0, 0, 3);

//Container
var container = new THREE.Object3D();
container.add(camera);
scene.add(container);

//Cube camera
var cube_camera = new THREE.CubeCamera(0.1, 1000, 256);

var eyebot = null;

//Eyebot
var loader = new THREE.OBJLoader();
loader.load("../files/eyebot.obj", function(object)
{
	object.traverse(function(object)
	{
		//Texture
		var texture = new THREE.Texture(document.createElement("img"));
		texture.image.src = "../files/eyebot.png";
		texture.image.onload = function()
		{
			texture.needsUpdate = true;
		}

		//Normal
		var normal = new THREE.Texture(document.createElement("img"));
		normal.image.src = "../files/eyebot_normal.png";
		normal.image.onload = function()
		{
			normal.needsUpdate = true;
		}

		//Material
		var material = new THREE.MeshPhongMaterial();
		material.map = texture;
		material.normalMap = normal;
		material.envMap = cube_camera.renderTarget.texture;
		material.combine = THREE.MixOperation;
		material.reflectivity = 0.7;

		//Eyebot
		eyebot = new THREE.Mesh(object.geometry, material);
		eyebot.scale.set(0.02, 0.02, 0.02);
		scene.add(eyebot);

		//Cube map
		var path = "../files/cube/";
		var format = ".jpg";
		var urls =
		[
			path + "px" + format, path + "nx" + format,
			path + "py" + format, path + "ny" + format,
			path + "pz" + format, path + "nz" + format
		];

		var cube = new THREE.CubeTextureLoader().load(urls);
		cube.format = THREE.RGBFormat;
		
		scene.background = cube;
	});
});

//Light
var light = new THREE.PointLight();
light.color = new THREE.Color(0xBBBBBB);
light.position.set(0, 2, 4);
light.castShadow = true;
scene.add(light);

//Boxes
var boxes = [];
var geometry = new THREE.BoxGeometry(1, 1, 1);
boxes[0] = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial());
boxes[0].position.x = 5;
scene.add(boxes[0]);

boxes[1] = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: 0xFF0000}));
boxes[1].position.x = -5;
scene.add(boxes[1]);

boxes[2] = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: 0x00FF00}));
boxes[2].position.z = -5;
scene.add(boxes[2]);

boxes[3] = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: 0x0000FF}));
boxes[3].position.z = 5;
scene.add(boxes[3]);

//Mouse and keyboard
var mouse = new Mouse();
var keyboard = new Keyboard();

//Call update loop
update();

//Logic update and render loop
function update()
{
	//Schedule update call for next frame
	requestAnimationFrame(update);

	keyboard.update();
	mouse.update();

	if(eyebot !== null)
	{
		//Rotate camera
		if(mouse.buttonPressed(Mouse.LEFT))
		{
			var delta = mouse.delta.x * 0.004;
			container.rotation.y += delta;
		}
		else
		{
			container.rotation.y += 0.003;
		}

		//Change eyebot material reflectivity
		if(keyboard.keyPressed(Keyboard.UP) && eyebot.material.reflectivity < 1.0)
		{
			eyebot.material.reflectivity += 0.01;
			eyebot.material.needsUpdate = true;
		}
		if(keyboard.keyPressed(Keyboard.DOWN) && eyebot.material.reflectivity > 0.0)
		{
			eyebot.material.reflectivity -= 0.01;
			eyebot.material.needsUpdate = true;
		}

		//Update the cubemap
		eyebot.visible = false;
		cube_camera.position.copy(eyebot.position);
		cube_camera.updateCubeMap(renderer, scene);
		eyebot.visible = true;
	}

	//Rotate the cubes
	for(var i = 0; i < boxes.length; i++)
	{
		boxes[i].rotation.x += 0.01;
		boxes[i].rotation.z += 0.02;
	}

	camera.position.z += mouse.wheel * 0.005;

	//Render the scene
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