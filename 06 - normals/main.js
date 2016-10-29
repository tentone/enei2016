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
renderer.setClearColor(0x000000);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//Scene
var scene = new THREE.Scene();

//Camera
var camera = new THREE.PerspectiveCamera(60, canvas.width/canvas.height, 0.1, 1000);
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

		//Specular
		var specular = new THREE.Texture(document.createElement("img"));
		specular.image.src = "../files/eyebot_specular.png";
		specular.image.onload = function()
		{
			specular.needsUpdate = true;
		}

		//Eyebot (with normal map)
		var material = new THREE.MeshPhongMaterial({color: 0x0000FF});
		material.specular.set(0x333333);
		material.shininess = 30;
		material.map = texture;
		material.normalMap = normal;
		material.specularMap = specular;
		
		eyebot = new THREE.Mesh(object.geometry, material);
		eyebot.scale.set(0.02, 0.02, 0.02);
		eyebot.position.set(0, -0.4, 0);
		scene.add(eyebot);
	});	
});

//Light
var light = new THREE.PointLight();
light.color = new THREE.Color(0xFFFFFF);
light.position.set(0, 2, 4);
light.castShadow = true;
scene.add(light);

//Call update loop
update();

//Logic update and render loop
function update()
{
	//Schedule update call for next frame
	requestAnimationFrame(update);

	//Rotate eyebot
	if(eyebot !== null)
	{
		eyebot.rotation.y += 0.02;
	}

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