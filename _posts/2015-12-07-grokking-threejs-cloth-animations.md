---
title: "Grokking Three.js: Cloth Animations"
tags: ["three.js", "javascript", "webgl"]
description: "A close reading of Three.js's cloth animation example & a sample use case"
hide_sidebar: true
excerpt: ""
comments: true
--- 

<link href="/assets/threejs-cloth/styles/styles.css" rel="stylesheet">
<div class='container'>
    <div class='row'>
    </div>
    <div class="jumbotron">
      <h1> A quick demonstration - <small>writeup soon!</small></h1>
    </div>
    <div class='row'>
      <h1 class='col-md-6'> Choose a pattern:</h1>
    </div>
    <div class='row controls'>
          <div class='col-md-1'>
            <div class='thumbnail'>
              <a href="#">
                <img class="active" src="/assets/threejs-cloth/images/pattern-1.png" />
              </a>
            </div>
          </div> 
          <div class='col-md-1'>
            <div class='thumbnail'>
              <a href="#">
                <img src="/assets/threejs-cloth/images/pattern-2.png" />
              </a>
            </div>
          </div> 
          <div class='col-md-1'>
            <div class='thumbnail'>
              <a href="#">
                <img src="/assets/threejs-cloth/images/pattern-3.png" />
              </a>
            </div>
          </div> 
          <div class='col-md-1'>
            <div class='thumbnail'>
              <a href="#">
                <img src="/assets/threejs-cloth/images/pattern-4.png" />
              </a>
            </div>
          </div> 
          <div class='col-md-1'>
            <div class='thumbnail'>
              <a href="#">
                <img src="/assets/threejs-cloth/images/pattern-5.png" />
              </a>
            </div>
          </div> 
          <div class='col-md-1'>
            <div class='thumbnail'>
              <a href="#">
                <img src="/assets/threejs-cloth/images/pattern-6.png" />
              </a>
            </div>
          </div> 
          <div class='col-md-1'>
            <div class='thumbnail'>
              <a href="#">
                <img src="/assets/threejs-cloth/images/pattern-7.png" />
              </a>
            </div>
          </div> 
          <div class='col-md-1'>
            <div class='thumbnail'>
              <a href="#">
                <img src="/assets/threejs-cloth/images/pattern-8.png" />
              </a>
            </div>
          </div>
          <div class='col-md-1'>
            <div class='thumbnail'>
              <a href="#">
                <img src="/assets/threejs-cloth/images/pattern-9.png" />
              </a>
            </div>
          </div> 
    </div>
</div>
<div class='container'>
  <div class='row'>
    <div id='canvas-wrapper' class='col-md-7'>
    </div>
    <div class="col-md-3">
    <h1> Rotation:</h1>
      <div class='btn-group' role="group">
        <button class='btn btn-default btn-lg rotate' data-direction="left" data-container="body" data-toggle="popover" data-placement="bottom" data-content="">
          <span class="fa fa-reply"></span>
         </button>
        <button class='btn btn-default btn-lg rotate'>
          <span class="fa fa-pause"></span>
        </button>
        <button class='active btn-default btn btn-lg rotate' data-direction="right">
          <span class="fa fa-share"></span>
        </button>
      </div>
    </div>
  </div>
</div>
<script type="x-shader/x-fragment" id="fragmentShaderDepth">
      uniform sampler2D texture;
      varying vec2 vUV;

      vec4 pack_depth( const in float depth ) {

      const vec4 bit_shift = vec4( 256.0 * 256.0 * 256.0, 256.0 * 256.0, 256.0, 1.0 );
      const vec4 bit_mask  = vec4( 0.0, 1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0 );
      vec4 res = fract( depth * bit_shift );
      res -= res.xxyz * bit_mask;
      return res;

      }

      void main() {

      vec4 pixel = texture2D( texture, vUV );

      if ( pixel.a < 0.5 ) discard;

      gl_FragData[ 0 ] = pack_depth( gl_FragCoord.z );

      }
</script>
<!--
    // GLSL vertex shader 
    // http://threejs.org/examples/#webgl_animation_cloth
    -->
<script type="x-shader/x-fragment" id="vertexShaderDepth">

      varying vec2 vUV;

      void main() {

      vUV = 0.75 * uv;

      vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

      gl_Position = projectionMatrix * mvPosition;

      }
</script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r73/three.js"></script>
<script src="/assets/threejs-cloth/js/cloth.js"></script>
<script src="/assets/threejs-cloth/js/main.js"></script>