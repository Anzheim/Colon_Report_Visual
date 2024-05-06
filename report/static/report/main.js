import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(-400, 0 , 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const sceneBox = document.getElementById("scene-box");
sceneBox.appendChild(renderer.domElement);

const threeShapes = [];

for(const el of shapes){
    const {type, color} = el;
    console.log(type, color);
    let geometry;
    switch(type){
        case 'Sphere':
            geometry = new THREE.SphereGeometry(1, 50, 50);
            break;
        case 'Box':
            geometry = new THREE.BoxGeometry(1, 1, 1);
            break;
        case 'Cylinder':
            const radiusTop = Math.random()*0.5+0.1;
            const radiusBottom = Math.random()*0.5+0.1;
            const height = Math.random()*2+1;
            const radiusSegments = 32;
            geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments);
            break;
    }
    const material = new THREE.MeshPhongMaterial({color:color});
    const shape = new THREE.Mesh(geometry, material);

    shape.position.x = (Math.random()-0.5)*5;
    shape.position.y = Math.random()*2+1;
    shape.position.z = (Math.random()-0.5)*5;
    
    scene.add(shape);
    threeShapes.push(shape);
}

const patient_Records = [];
const text = [];
const label = [];

// x>0往前；y>0往上；z>0 往右
//升結腸位置初始值
var a_x=0;
var a_y=0;
var a_z=-110;

//降結腸位置初始值
var d_x=0;
var d_y=0;
var d_z=0;

var c_x=0;
var c_y=0;
var c_z=0;

for(const index in focuses){
    // console.log(index);
    const {patient_name, check_date, focus_name, focus_diagnosis, mark, position,  image} = focuses[index];
    console.log(patient_name, check_date, focus_name, focus_diagnosis, mark, position, image);
    patient_Records.push(focuses[index]);
    // add label object
    text[index] = document.createElement( 'div' );
    text[index].className = 'label';
    text[index].textContent = check_date+focus_name;
    label[index] = new CSS2DObject( text[index] );
    switch(position){
        case "a":
            // a_x+=5;
            a_y+=10;
            a_z-=2;
            label[index].position.set(a_x, a_y, a_z);
            break;
        case "d":
            label[index].position.set(-30, 0, 120);
            break;
        case "c":
            label[index].position.set(0, 0, 150);
            break;
    }
    //model.add( label1 ); 放去model裡
}

// add label object
// const text1 = document.createElement( 'div' );
// text1.className = 'label';
// text1.textContent = '鋸齒狀';
// const label1 = new CSS2DObject( text1 );
// label1.position.set(-30, 0, 120); //降結腸
// model.add( label1 ); 放去model裡

// add label object
// const text2 = document.createElement( 'div' );
// text2.className = 'label';
// text2.textContent = '花瓣狀';
// const label2 = new CSS2DObject( text2 );
// label2.position.set(10, 10, -110); //升結腸
// model.add( label2 ); 放去model裡


// gltf loader
const gltfLoader = new GLTFLoader();
gltfLoader.load(
  './static/full_colon.glb',
  gltf => {
    // const mesh = gltf.scene.children[0];
    // scene.add(mesh);
    const model = gltf.scene;
    model.traverse((child)=>{
        if(child.isMesh){
            child.castShadow = true;
            const material = new THREE.MeshStandardMaterial({color:0xdb5a6b, roughness:1});
            child.material = material;
        }
    });
    model.position.set(0, 0, 0);
    // model.scale.set(0.5, 0.5, 0.5);
    for(const index in label){
        model.add( label[index] );
    }
    scene.add(model);
  }
);

// init CSS2DRenderer
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize( window.innerWidth, window.innerHeight );
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0';
labelRenderer.domElement.style.color = 'white';
labelRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild( labelRenderer.domElement );

//軌道旋轉控制
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

const ambientLight = new THREE.AmbientLight("#ffffff", 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("#ffffff", 2);
directionalLight.position.set(1, 2, 3);
scene.add(directionalLight);


const animate = ()=>{

    threeShapes.forEach(shape=>{
        shape.rotation.x += 0.01;
        shape.rotation.y += 0.01;
    })
    renderer.render(scene, camera);
    labelRenderer.render( scene, camera );
    requestAnimationFrame(animate);
}
animate();
// renderer.setAnimationLoop(animate);

window.addEventListener('resize', function(){
    camera.aspect = this.window.innerWidth/this.window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(this.window.innerWidth, this.window.innerHeight);
    labelRenderer.setSize( this.window.innerWidth, this.window.innerHeight );
});