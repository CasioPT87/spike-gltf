import React from 'react';
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

const PHOTOS = ['sevilla.jpg', 'cyclist.jpg'];
export default class GLTF extends React.Component {

  view = null;

  state = {
    photo: PHOTOS[0]  
  }

  componentDidMount() {
    this.setStart();
  }

  setStart = (elementToRemove = false) => {
    var container, controls;
		var camera, scene, renderer;

    container = this.view;
		camera = new THREE.PerspectiveCamera( 5, window.innerWidth / window.innerHeight, 0.25, 20 );
		camera.position.set( 1.0 , 0.6, 2.7 );

		scene = new THREE.Scene();

    new RGBELoader()
      .setDataType( THREE.UnsignedByteType )
      .load(process.env.PUBLIC_URL + '/aerodynamics_workshop_1k.hdr', (texture) => {
        var envMap = pmremGenerator.fromEquirectangular( texture ).texture;

        scene.environment = envMap;

        new THREE.TextureLoader().load(`${process.env.PUBLIC_URL}/${this.state.photo}`, (replacementImage) => {

          replacementImage.flipY = false;

          var loader = new GLTFLoader().setPath(`${process.env.PUBLIC_URL}/winetumbler/`);
          loader.load( 'EEVEE3js.gltf', (gltf) => {

            const mesh = gltf.scene.children.find(mesh => mesh.name === "PrintableArea");

            replacementImage.needsUpdate = true;

            const material = new THREE.MeshBasicMaterial({
              map: replacementImage
            });

            mesh.material = material;

            scene.add( gltf.scene );
            this.run(renderer, scene, camera);

          });
        })
      });

      renderer = new THREE.WebGLRenderer( { antialias: true } );
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize( window.innerWidth, window.innerHeight );
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.8;
      renderer.outputEncoding = THREE.sRGBEncoding;
      if (elementToRemove) container.removeChild(elementToRemove);
      container.appendChild( renderer.domElement );

      var pmremGenerator = new THREE.PMREMGenerator( renderer );
      pmremGenerator.compileEquirectangularShader();

      controls = new OrbitControls( camera, renderer.domElement );
      controls.addEventListener( 'change', () => { this.run(renderer, scene, camera) } ); // use if there is no animation loop
      controls.minDistance = 2;
      controls.maxDistance = 5
      controls.target.set( 0, 0, 0 );
      controls.update();
  }

  run(renderer, scene, camera) {
    renderer.render( scene, camera );
  }

  changeImage = () => {
    const { photo } = this.state;
    let index = PHOTOS.indexOf(photo);
    if (index === PHOTOS.length - 1) index = 0;
    else index++;
    const elementToRemove = this.view.children[0];
    this.setState({ photo: PHOTOS[index] }, () => this.setStart(elementToRemove));
  }
  
  render() {
    return (
      <div>
        <div ref={ref => (this.view = ref)} />
        <button style={{ position: 'fixed', top: '10px', padding: '0px' }} onClick={this.changeImage} >change image</button>
      </div>  
    )
  }
}