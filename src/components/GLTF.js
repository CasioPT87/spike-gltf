import React from 'react';
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { RoughnessMipmapper } from 'three/examples/jsm/utils/RoughnessMipmapper';
export default class GLTF extends React.Component {

  view = null;

  // componentDidMount() {
  //   var scene = new THREE.Scene();
  //   var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
  //   var renderer = new THREE.WebGLRenderer();
  //   renderer.setSize( window.innerWidth, window.innerHeight );
  //   document.body.appendChild( renderer.domElement );
  //   var geometry = new THREE.BoxGeometry( 1, 1, 1 );
  //   var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  //   var cube = new THREE.Mesh( geometry, material );
  //   scene.add( cube );
  //   camera.position.z = 5;
  //   this.animate(scene, camera, renderer, cube);
  // }

  // animate = (scene, camera, renderer, cube) => {
  //   requestAnimationFrame(() => this.animate(scene, camera, renderer, cube) );
  //   cube.rotation.x += 0.01;
  //   cube.rotation.y += 0.01;
  //   renderer.render( scene, camera );
  // }

  componentDidMount() {

    var container, controls;
		var camera, scene, renderer;

    container = this.view;
		camera = new THREE.PerspectiveCamera( 5, window.innerWidth / window.innerHeight, 0.25, 20 );
		camera.position.set( 1.0 , 0.6, 2.7 );

		scene = new THREE.Scene();

    new RGBELoader()
      .setDataType( THREE.UnsignedByteType )
      // .setPath( 'textures/equirectangular/' )
      // .load( 'dresden_station_night_1k.hdr', function ( texture ) {
      .load(process.env.PUBLIC_URL + '/aerodynamics_workshop_1k.hdr', (texture) => {
        var envMap = pmremGenerator.fromEquirectangular( texture ).texture;

        scene.background = new THREE.Color( 0xf7f7f7 );
        scene.environment = envMap;

        texture.dispose();
        pmremGenerator.dispose();

        this.run(renderer, scene, camera);

        // model

        // use of RoughnessMipmapper is optional
        var roughnessMipmapper = new RoughnessMipmapper(renderer);

        console.log(`${process.env.PUBLIC_URL}/winetumbler/`)

        var loader = new GLTFLoader()
        .setPath(`${process.env.PUBLIC_URL}/winetumbler/`);
        loader.load( 'EEVEE3js.gltf', (gltf) => {

          gltf.scene.traverse( function (child) {

            if (child.isMesh) {
              roughnessMipmapper.generateMipmaps(child.material );
            }
          });

          scene.add( gltf.scene );
          roughnessMipmapper.dispose();
          this.run(renderer, scene, camera);

        });
      });

      renderer = new THREE.WebGLRenderer( { antialias: true } );
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize( window.innerWidth, window.innerHeight );
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.8;
      renderer.outputEncoding = THREE.sRGBEncoding;
      container.appendChild( renderer.domElement );

      var pmremGenerator = new THREE.PMREMGenerator( renderer );
      pmremGenerator.compileEquirectangularShader();

      controls = new OrbitControls( camera, renderer.domElement );
      controls.addEventListener( 'change', () => { this.run(renderer, scene, camera) } ); // use if there is no animation loop
      controls.minDistance = 2;
      controls.maxDistance = 5
      controls.target.set( 0, 0, 0 );
      controls.update();

      // window.addEventListener( 'resize', onWindowResize, false );

  }

  run(renderer, scene, camera) {
    renderer.render( scene, camera );
  }
  
  render() {
    return (
      <div ref={ref => (this.view = ref)} />
    )
  }
  
}