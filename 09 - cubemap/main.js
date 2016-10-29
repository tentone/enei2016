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
scene.add(camera);

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
		cube.mapping = THREE.CubeReflectionMapping;
		scene.background = cube;

		//Material
		var material = new THREE.MeshPhongMaterial();
		material.map = texture;
		material.normalMap = normal;
		material.envMap = cube;
		material.combine = THREE.MixOperation;
		material.reflectivity = 1.0;

		//Eyebot
		eyebot = new THREE.Mesh(object.geometry, material);
		eyebot.scale.set(0.02, 0.02, 0.02);
		scene.add(eyebot);
	});
});

//Light
var light = new THREE.PointLight();
light.color = new THREE.Color(0xCCCCCC);
light.position.set(0, 2, 4);
light.castShadow = true;
scene.add(light);

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

	mouse.update();
	keyboard.update();

	if(eyebot !== null)
	{
		//Rotate scene
		if(mouse.buttonPressed(Mouse.LEFT))
		{
			var delta = mouse.delta.x * 0.004;
			eyebot.rotation.y -= delta;
			scene.rotation.y += delta;
		}
		else
		{
			eyebot.rotation.y -= 0.003;
			scene.rotation.y += 0.003;
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
	}
	
	camera.position.z += mouse.wheel * 0.005;

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