import React from 'react';
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

const PHOTOS = ['sevilla.jpg', 'cyclist.jpg', 'livelink.png'];
export default class GLTF extends React.Component {

  view = null;

  state = {
    photo: PHOTOS[0]  
  }

  componentDidMount() {
    this.setStart();
  }

  getUrl = async () => {
    const domain = 'https://preview-3d-pr2b-feature-mxdxpwg46a-ew.a.run.app'
    const mediaPath = 'api/v1/media/4';
    const res = await fetch(`${domain}/${mediaPath}`)
    if (res.ok) {
      const data = await res.json();
      return `${domain}${data.url}`
    }
  }

  getFile = async () => {
    const url = await this.getUrl();
    const res = await fetch(url);
    if (res.ok) {
      console.log('response is ok')
      const gltf = await res.arrayBuffer();
      console.log(gltf)
      return gltf;
    }
  }

  // getFile = async () => {
  //   const response = await fetch('http://localhost:4000/EEVEE3js.glb')
  //   const file = await response.arrayBuffer();
  //   return file;
  // }

  setStart = async (elementToRemove = false) => {
    var container, controls;
		var camera, scene, renderer;

    const file = await this.getFile();

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

          var loader = new GLTFLoader()
          loader.parse(file, '', (gltf) => {

            console.log('loaded file')
            console.log(gltf)

            const mesh = gltf.scenes[0].children.find(mesh => mesh.name === "PrintableArea");

            // const mesh = gltf.scenes[0].children[0];

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
      // pmremGenerator.compileEquirectangularShader();

      controls = new OrbitControls( camera, renderer.domElement );
      controls.addEventListener( 'change', () => { this.run(renderer, scene, camera) } );
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
