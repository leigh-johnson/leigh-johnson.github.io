var $ = window.jQuery;

$('.controls a').click(function(e){
  e.preventDefault();
});

var camera, scene, renderer;
var clothGeometry;
var object;
var rotate = {};
rotate.right = true;

var pinsFormation = [];
var pins = [10];

pinsFormation.push( pins );

//pins = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30 ];
for (i = 0; i < 60; i++) { 
    pins.push(i);
}
pinsFormation.push( pins );
/*
pins = [ 0 ];
pinsFormation.push( pins );

pins = []; // cut the rope ;)
pinsFormation.push( pins );
*/

//pins = [ 0, cloth.w / 2, cloth.w ]; // three pins
//pinsFormation.push( pins );

pins = pinsFormation[ 1 ];

init();
animate();
function init() {

        container = $('#canvas-wrapper');
  console.log(container)

        // scene

        scene = new THREE.Scene();
        scene.fog = new THREE.Fog( 0x080808, 420, 10000 );

        // camera


        camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.y = 50;
        camera.position.z = 1500;
        scene.add( camera );

    // pole

        var poleMat = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, shininess: 100 } );


        var mesh = new THREE.Mesh( new THREE.BoxGeometry(1500, 25,25 ), poleMat );
        mesh.scale.set(.8,.8,.8);
        mesh.position.y = -125 + 750/2;
        mesh.position.x = -10;
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        scene.add( mesh );

        // lights

        var light, materials;

        scene.add( new THREE.AmbientLight( 0x555555 ) );

        light = new THREE.DirectionalLight( 0xdfebff,1.5);
        //light.position.set( 50, 200, 100 );
        light.position.set( 0,1,0);
        light.position.multiplyScalar( 1 );

        light.castShadow = true;
        // light.shadowCameraVisible = true;

        light.shadowMapWidth = 1024;
        light.shadowMapHeight = 1024;

        var d = 300;

        light.shadowCameraLeft = -d;
        light.shadowCameraRight = d;
        light.shadowCameraTop = d;
        light.shadowCameraBottom = -d;

        light.shadowCameraFar = 1000;

        camera.add( light );
  
        //leftLight = light;
        //light.position.set( 1000, 100, 50);
        //scene.add(leftLight);
        
        //var directionalLightHelper = new THREE.DirectionalLightHelper(light, 20);
        //scene.add(directionalLightHelper);

        // cloth material
        var createClothTexture = function(url){
          var clothTexture = THREE.ImageUtils.loadTexture(url);
          clothTexture.wrapS = clothTexture.wrapT = THREE.RepeatWrapping;
          clothTexture.anisotropy = 56;
          clothTexture.repeat.set(12, 4);
          return clothTexture
        };
        
        var createClothMaterial = function(clothTexture){
          var clothMaterial = new THREE.MeshPhongMaterial( {
            specular: 0x030303,
            emissive: 0x111111,
            map: clothTexture,
            side: THREE.DoubleSide,
            alphaTest: 0.5
          } );
          return clothMaterial
        };
  
        // ground
 

        var groundTexture = THREE.ImageUtils.loadTexture( "/assets/threejs-cloth/images/wood.png" );
        groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set( 25, 25 );
        groundTexture.anisotropy = 36;

        var groundMaterial = new THREE.MeshPhongMaterial( { map: groundTexture, color: 0xf7f7f7, specular: 0x1e1e1e, shininess: 30, shading: THREE.FlatShading } );
        //groundMaterial.lightMap = light;
        var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), groundMaterial );
        mesh.position.y = -250;
        mesh.rotation.x = - Math.PI / 2;
        
        mesh.receiveShadow = true;
        mesh.rog = false;
        scene.add( mesh );
 

        // cloth geometry
        clothGeometry = new THREE.ParametricGeometry( clothFunction, cloth.w, cloth.h );
        clothGeometry.dynamic = true;
        // create initial texture, material
        var initClothTexture = createClothTexture('/assets/threejs-cloth/images/pattern-1.png');
        var initClothMaterial = createClothMaterial(initClothTexture);

        var uniforms = { texture:  { type: "t", value: initClothTexture } };
        var vertexShader = document.getElementById( 'vertexShaderDepth' ).textContent;
        var fragmentShader = document.getElementById( 'fragmentShaderDepth' ).textContent;

        // cloth mesh
        
        object = new THREE.Mesh(clothGeometry, initClothMaterial );
        object.scale.set(0.8,0.8,0.8);
        object.position.set( 0, 50, 0 );
        object.castShadow = true;
        scene.add( object );
  
        //light.target = object;
        
        // update clothObject with new pattern src
        var updateClothTexture = function(object, src){
          this.clothTexture = createClothTexture(src);
          ///this.clothMaterial = createClothMaterial(this.clothTexture);
          //var uniforms = { texture:  { type: "t", value: this.clothTexture } };
          object.material.map = this.clothTexture;
        }
        
        // change pattern
        $('a').click(function(){
           var src = $('img', this).attr('src');
           updateClothTexture(object, src)        
        });

        object.customDepthMaterial = new THREE.ShaderMaterial( {
          uniforms: uniforms,
          vertexShader: vertexShader,
          fragmentShader: fragmentShader,
          side: THREE.DoubleSide
        } );


        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        
        renderer.setSize( container.width(), container.height());
        renderer.setClearColor( scene.fog.color );

        container.append( renderer.domElement );

        renderer.gammaInput = true;
        renderer.gammaOutput = true;

        //renderer.shadowMap.enabled = true;

        //stats = new Stats();
        //container.appendChild( stats.domElement );

        //

        //window.addEventListener( 'resize', onWindowResize, false );

}

var forceScale = 2000;
var strengthScale = 7000;
function animate() {

  requestAnimationFrame( animate );

  var time = Date.now();

  windStrength = Math.cos( time / strengthScale) * 20 + 40;
  windForce.set( Math.sin( time / forceScale ), Math.cos( time / 3000 ), Math.sin( time / 1000 ) ).normalize().multiplyScalar( windStrength );

  simulate(time);
  render();
  //stats.update();

}
function render() {

  var timer = Date.now() * 0.0003;
  var position = 0;

  var p = cloth.particles;

  for ( var i = 0, il = p.length; i < il; i ++ ) {

    clothGeometry.vertices[ i ].copy( p[ i ].position );

  }
  clothGeometry.computeFaceNormals();
  
  clothGeometry.computeVertexNormals();

  clothGeometry.normalsNeedUpdate = true;
  clothGeometry.verticesNeedUpdate = true;

  
  if ( rotate.left ) {
    camera.position.x = Math.cos(timer ) * 1500;
    camera.position.z = Math.sin(timer) * 1500;

  }
   if ( rotate.right) {
    camera.position.x = - Math.sin(timer ) * 1500;
    camera.position.z = - Math.cos(timer ) * 1500;

  }

  camera.lookAt( scene.position );

  renderer.render( scene, camera );

}

// degrees to radians.
Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};
 
// radians to degrees.
Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};

// toggle rotation
$('.rotate').click(function(){
  direction = $(this).data('direction');
 $('.rotate.active').removeClass('active');
  $(this).addClass('active');
  rotate = {};
  if (direction){
    rotate[direction] = true;
  }
});