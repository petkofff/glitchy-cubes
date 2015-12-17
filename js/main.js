var scene, camera, renderer, composer, material, geometry, light;

var glitchPass = {}, rgbEffect, filmEffect, bokehPass;

var mouseX = 0, mouseY = 0;

var colors = [0x9BFF66, 0xffff66];

var cubes = [];

var Cube = window.Cube;

var stats;

function init (){
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	geometry = new THREE.BoxGeometry( 10, 10, 10);

	material = new THREE.MeshPhongMaterial({color: colors[Math.floor(Math.random()*colors.length)], shininess: 5});

	light = new THREE.DirectionalLight( 0xffffff, 0.5 );
	light.position.set( 0, 0, 20 );
	scene.add( light );

	//postprocessing
	composer = new THREE.EffectComposer( renderer );
	composer.addPass( new THREE.RenderPass( scene, camera ) );
	glitchPass = new THREE.GlitchPass(10,10);
	//glitchPass.renderToScreen = true;
	glitchPass.goWild=false;
	composer.addPass( glitchPass );

	filmEffect = new THREE.FilmPass(0.9,0.27,7000,0.3);
	filmEffect.renderToScreen = true;
	composer.addPass(filmEffect);

	camera.position.z = 400;

	var i = 0;
	for (;i<2500;i++){
		cubes.push(new Cube(geometry, material,{
			x: Math.random()*400-200,
			y: Math.random()*400-200,
			z: -Math.random()*1500,
			speed: {
				x: 0,
				y: 0,
				z: Math.random()+7
			},
			rotationSpeed: {
				x: (Math.random()-0.5)/7,
				y: (Math.random()-0.5)/7
			}
		}));
		scene.add(cubes[i].mesh);
	}
	
	stats = new Stats();
	stats.setMode( 0 ); // 0: fps, 1: ms, 2: mb

	// align top-left
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';

	document.body.appendChild( stats.domElement );

}

init ();

function updateCubes (cubes, camera){
	
	cubes.forEach(function(cube, index, array){

		cube.move()

		if (glitchPass.goWild === false && cube.colidesWithCamera(camera) === true) {
			glitchPass.goWild=true;

			setTimeout(function(){
				glitchPass.goWild=false;
			}, Math.random()*500 + 500);
		}

		var removeAfter = 100;
		if (cube.mesh.position.z >= camera.position.z + removeAfter) {
			cube.set({
				x: Math.random()*400-200,
				y: Math.random()*400-200,
				z: -1500 + camera.position.z + removeAfter,
				speed: {
					z: Math.random()+7
				},
				rotationSpeed: {
					x: (Math.random()-0.5)/7,
					y: (Math.random()-0.5)/7
				}
			});
		}
	});
}

var render = function () {
  requestAnimationFrame(render);
  
  stats.begin();
  
	camera.position.x += ( mouseX - camera.position.x ) * .05;
	camera.position.y += ( - mouseY - camera.position.y ) * .05 ;

	//light.position.x = camera.position.x;
	//light.position.y = camera.position.y;

	updateCubes (cubes, camera);
	
	stats.end();
	
	composer.render();
	//renderer.render(scene, camera);
};

render();

document.onmousemove = function(e){
  var k = 683;
	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;
	mouseX = ( e.pageX - windowHalfX ) / 2 * (k/window.innerWidth);
	mouseY = ( e.pageY - windowHalfY ) / 2 * (k/window.innerHeight);
}

window.onresize = function() {
 camera.aspect = window.innerWidth / window.innerHeight;
 camera.updateProjectionMatrix();
 renderer.setSize( window.innerWidth, window.innerHeight );
}
