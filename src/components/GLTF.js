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


// {
//   "asset" : {
//       "generator" : "Khronos glTF Blender I/O v1.2.75",
//       "version" : "2.0"
//   },
//   "scene" : 0,
//   "scenes" : [
//       {
//           "name" : "Scene",
//           "nodes" : [
//               0,
//               1,
//               2,
//               5,
//               7
//           ]
//       }
//   ],
//   "nodes" : [
//       {
//           "mesh" : 0,
//           "name" : "11oz_MetalMug",
//           "translation" : [
//               0.0002756565809249878,
//               -0.04828420281410217,
//               0.0008838623762130737
//           ]
//       },
//       {
//           "name" : "BezierCircle.001",
//           "translation" : [
//               0.00027565821073949337,
//               0.03139990568161011,
//               0.0008838610956445336
//           ]
//       },
//       {
//           "mesh" : 1,
//           "name" : "PrintableArea",
//           "scale" : [
//               0.09700000286102295,
//               1,
//               0.03150000050663948
//           ],
//           "translation" : [
//               0.00027565821073949337,
//               0.03139990568161011,
//               0.0008838610956445336
//           ]
//       },
//       {
//           "mesh" : 2,
//           "name" : "ClearTopAcylic_Slide",
//           "rotation" : [
//               -0.0307586919516325,
//               0,
//               0,
//               0.999526858329773
//           ],
//           "scale" : [
//               0.9451638460159302,
//               0.9451637864112854,
//               0.9451637864112854
//           ],
//           "translation" : [
//               4.358736623544246e-05,
//               0.010321158915758133,
//               -0.004552803002297878
//           ]
//       },
//       {
//           "mesh" : 3,
//           "name" : "RubberLid",
//           "scale" : [
//               0.9733083248138428,
//               0.9451638460159302,
//               0.9733083248138428
//           ],
//           "translation" : [
//               0,
//               0.024007316678762436,
//               0
//           ]
//       },
//       {
//           "children" : [
//               3,
//               4
//           ],
//           "mesh" : 4,
//           "name" : "AcrylicTop",
//           "scale" : [
//               1.0488730669021606,
//               1.0488731861114502,
//               1.0488730669021606
//           ],
//           "translation" : [
//               0.00010051866411231458,
//               0.05734308063983917,
//               0.0009218424092978239
//           ]
//       },
//       {
//           "mesh" : 5,
//           "name" : "ClearTopAcylic_Slide.002",
//           "rotation" : [
//               -0.0307586919516325,
//               0,
//               0,
//               0.999526858329773
//           ],
//           "scale" : [
//               0.9451638460159302,
//               0.9451637864112854,
//               0.9451637864112854
//           ],
//           "translation" : [
//               4.358736623544246e-05,
//               0.010321158915758133,
//               -0.004552803002297878
//           ]
//       },
//       {
//           "children" : [
//               6
//           ],
//           "mesh" : 6,
//           "name" : "ArcylicTop_Duplicate",
//           "scale" : [
//               1.0488730669021606,
//               1.0488731861114502,
//               1.0488730669021606
//           ],
//           "translation" : [
//               0.00010051866411231458,
//               0.05734308063983917,
//               0.0009218424092978239
//           ]
//       }
//   ],
//   "materials" : [
//       {
//           "doubleSided" : true,
//           "emissiveFactor" : [
//               0,
//               0,
//               0
//           ],
//           "name" : "Metalbottle_coat",
//           "pbrMetallicRoughness" : {
//               "baseColorFactor" : [
//                   0.799102783203125,
//                   0.799102783203125,
//                   0.799102783203125,
//                   1
//               ],
//               "metallicFactor" : 0,
//               "roughnessFactor" : 0.125
//           }
//       },
//       {
//           "doubleSided" : true,
//           "emissiveFactor" : [
//               0,
//               0,
//               0
//           ],
//           "name" : "Metalbottle_inside",
//           "pbrMetallicRoughness" : {
//               "baseColorFactor" : [
//                   0.12743771076202393,
//                   0.12743771076202393,
//                   0.12743771076202393,
//                   1
//               ],
//               "metallicFactor" : 0.75,
//               "roughnessFactor" : 0.15000000596046448
//           }
//       },
//       {
//           "doubleSided" : true,
//           "emissiveFactor" : [
//               0,
//               0,
//               0
//           ],
//           "name" : "printableArea",
//           "pbrMetallicRoughness" : {
//               "baseColorTexture" : {
//                   "index" : 0,
//                   "texCoord" : 0
//               },
//               "metallicFactor" : 0,
//               "roughnessFactor" : 0.125
//           }
//       },
//       {
//           "alphaMode" : "BLEND",
//           "emissiveFactor" : [
//               0,
//               0,
//               0
//           ],
//           "name" : "Transparency",
//           "pbrMetallicRoughness" : {
//               "baseColorTexture" : {
//                   "index" : 1,
//                   "texCoord" : 0
//               },
//               "metallicFactor" : 1,
//               "roughnessFactor" : 0.11999999731779099
//           }
//       },
//       {
//           "doubleSided" : true,
//           "emissiveFactor" : [
//               0,
//               0,
//               0
//           ],
//           "name" : "rubbernotcomp.002",
//           "pbrMetallicRoughness" : {
//               "baseColorFactor" : [
//                   0.38005632162094116,
//                   0.38005632162094116,
//                   0.38005632162094116,
//                   1
//               ],
//               "metallicFactor" : 0,
//               "roughnessFactor" : 0.6781818270683289
//           }
//       }
//   ],
//   "meshes" : [
//       {
//           "name" : "Cube.006",
//           "primitives" : [
//               {
//                   "attributes" : {
//                       "POSITION" : 0,
//                       "NORMAL" : 1,
//                       "TEXCOORD_0" : 2
//                   },
//                   "indices" : 3,
//                   "material" : 0
//               },
//               {
//                   "attributes" : {
//                       "POSITION" : 4,
//                       "NORMAL" : 5,
//                       "TEXCOORD_0" : 6
//                   },
//                   "indices" : 7,
//                   "material" : 1
//               }
//           ]
//       },
//       {
//           "name" : "Plane.002",
//           "primitives" : [
//               {
//                   "attributes" : {
//                       "POSITION" : 8,
//                       "NORMAL" : 9,
//                       "TEXCOORD_0" : 10
//                   },
//                   "indices" : 11,
//                   "material" : 2
//               }
//           ]
//       },
//       {
//           "name" : "Cube.012",
//           "primitives" : [
//               {
//                   "attributes" : {
//                       "POSITION" : 12,
//                       "NORMAL" : 13
//                   },
//                   "indices" : 14,
//                   "material" : 3
//               }
//           ]
//       },
//       {
//           "name" : "Cylinder.000",
//           "primitives" : [
//               {
//                   "attributes" : {
//                       "POSITION" : 15,
//                       "NORMAL" : 16
//                   },
//                   "indices" : 17,
//                   "material" : 4
//               }
//           ]
//       },
//       {
//           "name" : "Cube.013",
//           "primitives" : [
//               {
//                   "attributes" : {
//                       "POSITION" : 18,
//                       "NORMAL" : 19
//                   },
//                   "indices" : 20,
//                   "material" : 3
//               }
//           ]
//       },
//       {
//           "name" : "Cube.017",
//           "primitives" : [
//               {
//                   "attributes" : {
//                       "POSITION" : 21,
//                       "NORMAL" : 22
//                   },
//                   "indices" : 14,
//                   "material" : 3
//               }
//           ]
//       },
//       {
//           "name" : "Cube.016",
//           "primitives" : [
//               {
//                   "attributes" : {
//                       "POSITION" : 23,
//                       "NORMAL" : 24
//                   },
//                   "indices" : 25,
//                   "material" : 3
//               }
//           ]
//       }
//   ],
//   "textures" : [
//       {
//           "source" : 0
//       },
//       {
//           "source" : 1
//       }
//   ],
//   "images" : [
//       {
//           "mimeType" : "image/jpeg",
//           "name" : "PrintableAreaL",
//           "uri" : "PrintableAreaL.jpg"
//       },
//       {
//           "mimeType" : "image/png",
//           "name" : "glass(Transparency)",
//           "uri" : "glassTransparency.png"
//       }
//   ],
//   "accessors" : [
//       {
//           "bufferView" : 0,
//           "componentType" : 5126,
//           "count" : 2688,
//           "max" : [
//               0.04588210582733154,
//               0.1136147603392601,
//               0.04588210955262184
//           ],
//           "min" : [
//               -0.04588210955262184,
//               -0.00016919357585720718,
//               -0.04588210955262184
//           ],
//           "type" : "VEC3"
//       },
//       {
//           "bufferView" : 1,
//           "componentType" : 5126,
//           "count" : 2688,
//           "type" : "VEC3"
//       },
//       {
//           "bufferView" : 2,
//           "componentType" : 5126,
//           "count" : 2688,
//           "type" : "VEC2"
//       },
//       {
//           "bufferView" : 3,
//           "componentType" : 5123,
//           "count" : 15930,
//           "type" : "SCALAR"
//       },
//       {
//           "bufferView" : 4,
//           "componentType" : 5126,
//           "count" : 2395,
//           "max" : [
//               0.03885505720973015,
//               0.1136147603392601,
//               0.03885505720973015
//           ],
//           "min" : [
//               -0.03885505720973015,
//               0.01602899841964245,
//               -0.03885505720973015
//           ],
//           "type" : "VEC3"
//       },
//       {
//           "bufferView" : 5,
//           "componentType" : 5126,
//           "count" : 2395,
//           "type" : "VEC3"
//       },
//       {
//           "bufferView" : 6,
//           "componentType" : 5126,
//           "count" : 2395,
//           "type" : "VEC2"
//       },
//       {
//           "bufferView" : 7,
//           "componentType" : 5123,
//           "count" : 11904,
//           "type" : "SCALAR"
//       },
//       {
//           "bufferView" : 8,
//           "componentType" : 5126,
//           "count" : 1813,
//           "max" : [
//               0.4727659523487091,
//               0.03134039044380188,
//               1.4565379619598389
//           ],
//           "min" : [
//               -0.47276607155799866,
//               -0.03137841448187828,
//               -0.9247465133666992
//           ],
//           "type" : "VEC3"
//       },
//       {
//           "bufferView" : 9,
//           "componentType" : 5126,
//           "count" : 1813,
//           "type" : "VEC3"
//       },
//       {
//           "bufferView" : 10,
//           "componentType" : 5126,
//           "count" : 1813,
//           "type" : "VEC2"
//       },
//       {
//           "bufferView" : 11,
//           "componentType" : 5123,
//           "count" : 7200,
//           "type" : "SCALAR"
//       },
//       {
//           "bufferView" : 12,
//           "componentType" : 5126,
//           "count" : 2674,
//           "max" : [
//               0.012458769604563713,
//               -0.006880974862724543,
//               0.025558767840266228
//           ],
//           "min" : [
//               -0.012458769604563713,
//               -0.021715620532631874,
//               -0.017127500846982002
//           ],
//           "type" : "VEC3"
//       },
//       {
//           "bufferView" : 13,
//           "componentType" : 5126,
//           "count" : 2674,
//           "type" : "VEC3"
//       },
//       {
//           "bufferView" : 14,
//           "componentType" : 5123,
//           "count" : 16008,
//           "type" : "SCALAR"
//       },
//       {
//           "bufferView" : 15,
//           "componentType" : 5126,
//           "count" : 4480,
//           "max" : [
//               0.03674837201833725,
//               -0.025670714676380157,
//               0.03674837201833725
//           ],
//           "min" : [
//               -0.03674837574362755,
//               -0.030445070937275887,
//               -0.03674837201833725
//           ],
//           "type" : "VEC3"
//       },
//       {
//           "bufferView" : 16,
//           "componentType" : 5126,
//           "count" : 4480,
//           "type" : "VEC3"
//       },
//       {
//           "bufferView" : 17,
//           "componentType" : 5123,
//           "count" : 18432,
//           "type" : "SCALAR"
//       },
//       {
//           "bufferView" : 18,
//           "componentType" : 5126,
//           "count" : 12237,
//           "max" : [
//               0.03691127523779869,
//               0.011069518513977528,
//               0.03967469930648804
//           ],
//           "min" : [
//               -0.03691128268837929,
//               -0.007705008145421743,
//               -0.03691128268837929
//           ],
//           "type" : "VEC3"
//       },
//       {
//           "bufferView" : 19,
//           "componentType" : 5126,
//           "count" : 12237,
//           "type" : "VEC3"
//       },
//       {
//           "bufferView" : 20,
//           "componentType" : 5123,
//           "count" : 60528,
//           "type" : "SCALAR"
//       },
//       {
//           "bufferView" : 21,
//           "componentType" : 5126,
//           "count" : 2674,
//           "max" : [
//               0.012458769604563713,
//               -0.006880974862724543,
//               0.025558767840266228
//           ],
//           "min" : [
//               -0.012458769604563713,
//               -0.021715620532631874,
//               -0.017127500846982002
//           ],
//           "type" : "VEC3"
//       },
//       {
//           "bufferView" : 22,
//           "componentType" : 5126,
//           "count" : 2674,
//           "type" : "VEC3"
//       },
//       {
//           "bufferView" : 23,
//           "componentType" : 5126,
//           "count" : 10094,
//           "max" : [
//               0.03691127523779869,
//               0.011069518513977528,
//               0.03967469930648804
//           ],
//           "min" : [
//               -0.03691128268837929,
//               -0.007705008145421743,
//               -0.03691128268837929
//           ],
//           "type" : "VEC3"
//       },
//       {
//           "bufferView" : 24,
//           "componentType" : 5126,
//           "count" : 10094,
//           "type" : "VEC3"
//       },
//       {
//           "bufferView" : 25,
//           "componentType" : 5123,
//           "count" : 60528,
//           "type" : "SCALAR"
//       }
//   ],
//   "bufferViews" : [
//       {
//           "buffer" : 0,
//           "byteLength" : 32256,
//           "byteOffset" : 0
//       },
//       {
//           "buffer" : 0,
//           "byteLength" : 32256,
//           "byteOffset" : 32256
//       },
//       {
//           "buffer" : 0,
//           "byteLength" : 21504,
//           "byteOffset" : 64512
//       },
//       {
//           "buffer" : 0,
//           "byteLength" : 31860,
//           "byteOffset" : 86016
//       },
//       {
//           "buffer" : 0,
//           "byteLength" : 28740,
//           "byteOffset" : 117876
//       },
//       {
//           "buffer" : 0,
//           "byteLength" : 28740,
//           "byteOffset" : 146616
//       },
//       {
//           "buffer" : 0,
//           "byteLength" : 19160,
//           "byteOffset" : 175356
//       },
//       {
//           "buffer" : 0,
//           "byteLength" : 23808,
//           "byteOffset" : 194516
//       },
//       {
//           "buffer" : 0,
//           "byteLength" : 21756,
//           "byteOffset" : 218324
//       },
//       {
//           "buffer" : 0,
//           "byteLength" : 21756,
//           "byteOffset" : 240080
//       },
//       {
//           "buffer" : 0,
//           "byteLength" : 14504,
//           "byteOffset" : 261836
//       },
//       {
//           "buffer" : 0,
//           "byteLength" : 14400,
//           "byteOffset" : 276340
//       },
//       {
//           "buffer" : 0,
//           "byteLength" : 32088,
//           "byteOffset" : 290740
//       },
//       {
//           "buffer" : 0,
//           "byteLength" : 32088,
//           "byteOffset" : 322828
//       },
//       {
//           "buffer" : 0,
//           "byteLength" : 32016,
//           "byteOffset" : 354916
//       },
//       {
//           "buffer" : 0,
//           "byteLength" : 53760,
//           "byteOffset" : 386932
//       },
//       {
//           "buffer" : 0,
//           "byteLength" : 53760,
//           "byteOffset" : 440692
//       },
//       {
//           "buffer" : 0,
//           "byteLength" : 36864,
//           "byteOffset" : 494452
//       },
//       {
//           "buffer" : 0,
//           "byteLength" : 146844,
//           "byteOffset" : 531316
//       },
//       {
//           "buffer" : 0,
//           "byteLength" : 146844,
//           "byteOffset" : 678160
//       },
//       {
//           "buffer" : 0,
//           "byteLength" : 121056,
//           "byteOffset" : 825004
//       },
//       {
//           "buffer" : 0,
//           "byteLength" : 32088,
//           "byteOffset" : 946060
//       },
//       {
//           "buffer" : 0,
//           "byteLength" : 32088,
//           "byteOffset" : 978148
//       },
//       {
//           "buffer" : 0,
//           "byteLength" : 121128,
//           "byteOffset" : 1010236
//       },
//       {
//           "buffer" : 0,
//           "byteLength" : 121128,
//           "byteOffset" : 1131364
//       },
//       {
//           "buffer" : 0,
//           "byteLength" : 121056,
//           "byteOffset" : 1252492
//       }
//   ],
//   "buffers" : [
//       {
//           "byteLength" : 1373548,
//           "uri" : "EEVEE3js.bin"
//       }
//   ]
// }