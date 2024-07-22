import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(-400, 0 , 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const sceneBox = document.getElementById("scene-box");
sceneBox.appendChild(renderer.domElement);

const COLON_POSIRION = {
    'panoramic view':0,
    'cecum':1,
    'ascending near':2,
    'ascending far':3,
    'transverse near':4,
    'transverse far':5,
    'descending near':6,
    'descending far':7,
    'sigmoid colon':8,
    'rectum':9
};
const params = {
    ColonoscopyPosition: 0,
    showPositionLabel: true,
    panoramic: ()=>{
        positionController.setValue(0);
    },
    previous:()=>{
        if (params.ColonoscopyPosition > 1) {
            params.ColonoscopyPosition--;
            positionController.setValue(params.ColonoscopyPosition);
        }
    },
    next: ()=>{
        if (params.ColonoscopyPosition < 9) {
            params.ColonoscopyPosition++;
            positionController.setValue(params.ColonoscopyPosition);
            // changeColon(params.ColonoscopyPosition);
        }
    },
    showFocusName: true,
    showMark: true,
    showSize: true,
    showCheckDate: true,
    updateFocusLabels:()=>{
        updateFocusLabels();
    }
};
const gui = new GUI();
const positionFoler = gui.addFolder("Position Controls");
const labelFoler = gui.addFolder('labels');

let positionController = positionFoler.add( params, 'ColonoscopyPosition', COLON_POSIRION ).onChange( changeColon );
positionFoler.add(params, 'panoramic').name('Panoramic View');
positionFoler.add(params, 'previous').name('Previous');
positionFoler.add(params, 'next').name('Next');
labelFoler.add(params, 'showPositionLabel').name('Show Position Labels').onChange(showAllLabels);
labelFoler.add(params, 'showFocusName').name('Show Focus Name').onChange(params.updateFocusLabels);
labelFoler.add(params, 'showMark').name('Show Mark').onChange(params.updateFocusLabels);
labelFoler.add(params, 'showSize').name('Show Size').onChange(params.updateFocusLabels);
labelFoler.add(params, 'showCheckDate').name('Show Check Date').onChange(params.updateFocusLabels);

positionFoler.open();
labelFoler.open();

function showAllLabels(checked) {
    if (checked) {
        positionLabelShow();
    } else {
        positionLabelHide();
    }
}
function changeColon(value){
    document.removeEventListener('mousedown', onMouseDown);
    document.removeEventListener('wheel', onMouseWheel);
    positionController.updateDisplay();
    if(value==0) showAll();
    else if(value==1) showCecum();
    else if(value==2) showAscendingNear();
    else if(value==3) showAscendingFar();
    else if(value==4) showTransverseNear();
    else if(value==5) showTransverseFar();
    else if(value==6) showDescendingNear();
    else if(value==7) showDescendingFar();
    else if(value==8) showSigmoid();
    else if(value==9) showRectum();
    else alert(value);
}

function showAll(){
    positionLabelShow();
    allFoucsShow();
    camera.position.set(-400, 0, 0);
    orbit.target.set(0, 0, 0);
    orbit.maxDistance = 400;
};

function showAscendingNear(){
    positionLabelHide();
    camera.position.set(-10, -50 , -90); //相機位置
    orbit.target.set(30, 40 , -130); //中心點位置
    orbit.maxDistance = 106;
    updateLabelsVisibility('a');
    mouseControl(camera.position.x, camera.position.y, camera.position.z, orbit.target.x, orbit.target.y, orbit.target.z, 106);
};
function showAscendingFar(){
    positionLabelHide();
    camera.position.set(30, 30 , -130); //相機位置
    orbit.target.set(35, 80, -130); //中心點位置
    orbit.maxDistance = 41;
    updateLabelsVisibility('a');
    mouseControl(camera.position.x, camera.position.y, camera.position.z, orbit.target.x, orbit.target.y, orbit.target.z, 41);
}
function showDescendingNear(){
    positionLabelHide();
    camera.position.set(15, 175 ,120);
    orbit.target.set(-25, 0 , 105);
    orbit.maxDistance = 168;                
    updateLabelsVisibility('d');
    mouseControl(camera.position.x, camera.position.y, camera.position.z, orbit.target.x, orbit.target.y, orbit.target.z, 168); 
}
function showDescendingFar(){
    positionLabelHide();
    camera.position.set(-25, 0 , 115);
    orbit.target.set(-75, -110 , 100);
    orbit.maxDistance = 117;
    updateLabelsVisibility('d');
    mouseControl(camera.position.x, camera.position.y, camera.position.z, orbit.target.x, orbit.target.y, orbit.target.z, 117);
}
function showTransverseNear(){
    positionLabelHide();
    camera.position.set(40, 90 , -140);
    orbit.target.set(20, 120 , -20);
    orbit.maxDistance = 125;
    updateLabelsVisibility('t');
    mouseControl(camera.position.x, camera.position.y, camera.position.z, orbit.target.x, orbit.target.y, orbit.target.z, 125);
}
function showTransverseFar(){
    positionLabelHide();
    camera.position.set(10, 130 , -20);
    orbit.target.set(15, 175 ,120);
    orbit.maxDistance = 166;
    updateLabelsVisibility('t');
    mouseControl(camera.position.x, camera.position.y, camera.position.z, orbit.target.x, orbit.target.y, orbit.target.z, 166);
}
function showCecum(){
    positionLabelHide();
    camera.position.set(-50, -110 , -80);
    orbit.target.set(-30, -73, -88);
    orbit.maxDistance = 41;
    updateLabelsVisibility('c');
    mouseControl(camera.position.x, camera.position.y, camera.position.z, orbit.target.x, orbit.target.y, orbit.target.z, 41);
}
function showSigmoid(){
    positionLabelHide();
    camera.position.set(-81, -111 , 113);
    orbit.target.set(-29, -129, 52);
    orbit.maxDistance = 83;
    updateLabelsVisibility('s');
    mouseControl(camera.position.x, camera.position.y, camera.position.z, orbit.target.x, orbit.target.y, orbit.target.z, 83);
}
function showRectum(){
    positionLabelHide();
    camera.position.set(-28, -146, 43); 
    orbit.target.set(-30, -170, 53);
    orbit.maxDistance = 30;
    updateLabelsVisibility('r');
    mouseControl(camera.position.x, camera.position.y, camera.position.z, orbit.target.x, orbit.target.y, orbit.target.z, 30);
}

// ver1
let onMouseDown = ()=>{};
let onMouseWheel = ()=>{}
const mouseControl = (cameraX, cameraY, cameraZ, orbitX, orbitY, orbitZ, maxDistance)=>{
    onMouseDown = (e) => {
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        if(e.button==0){ //左鍵做校正
            camera.position.set(cameraX, cameraY, cameraZ);
            orbit.target.set(orbitX, orbitY, orbitZ);
            orbit.maxDistance = maxDistance;
        }
        if(e.button==2){ //右鍵拉近中心點
            orbit.target.set(camera.position.x+direction.x, camera.position.y+direction.y, camera.position.z+direction.z);
        }
    };
    document.addEventListener("mousedown", onMouseDown);
    onMouseWheel = () => {
        orbit.maxDistance = maxDistance;
        orbit.target.set(orbitX, orbitY, orbitZ);
    };
    document.addEventListener("wheel", onMouseWheel);
};

// ver 2
// const mouseControl = (cameraX, cameraY, cameraZ, orbitX, orbitY, orbitZ, maxDistance)=>{
//     document.addEventListener("mousedown", function(e){
//         const direction = new THREE.Vector3();
//         camera.getWorldDirection(direction);
//         if(e.button==0){ //左鍵做校正
//             camera.position.set(cameraX, cameraY, cameraZ);
//             orbit.target.set(orbitX, orbitY, orbitZ);
//             orbit.maxDistance = maxDistance;
//         }
//         if(e.button==2){ //右鍵拉近中心點
//             orbit.target.set(camera.position.x+direction.x, camera.position.y+direction.y, camera.position.z+direction.z);
//         }
//     });
//     document.addEventListener("wheel", function(e){ //滑鼠滾動
//         orbit.maxDistance = maxDistance;
//         orbit.target.set(orbitX, orbitY, orbitZ); //中心點位置
//     });
// };


// ver 3 未完成
// const mouseControl = (cameraX, cameraY, cameraZ, orbitX, orbitY, orbitZ, maxDistance)=>{
//     var flag = 0;
//     var NewcameraX, NewcameraY, NewcameraZ;
//     orbit.mouseButtons = {
//         LEFT: THREE.MOUSE.ROTATE,
//         RIGHT: THREE.MOUSE.PAN
//     }
//     camera.position.set(cameraX, cameraY, cameraZ);
//     orbit.target.set(orbitX, orbitY, orbitZ);

//     document.addEventListener("mousedown", function(e){
//         if(e.button==2){ //右鍵做位移
//             orbit.target.set(orbitX, orbitY, orbitZ);
//             orbit.maxDistance = maxDistance;
//             NewcameraX = camera.position.x;
//             NewcameraY = camera.position.y;
//             NewcameraZ = camera.position.z;
//         }
//         if(e.button==4){
//             camera.position.set(cameraX, cameraY, cameraZ);
//             orbit.target.set(orbitX, orbitY, orbitZ);
//         }
//         if(e.button==0){ //左鍵拉近中心點
//             const direction = new THREE.Vector3();
//             camera.getWorldDirection(direction);
//             if(flag){
//                 camera.position.set(NewcameraX, NewcameraY, NewcameraZ);
//                 orbit.target.set(cameraX+direction.x, cameraY+direction.y, cameraZ+direction.z);
//                 // alert(direction.x);
//                 // alert(direction.y);
//                 // alert(direction.z);
//             }else{ // 點進來時 mousedown 左鍵算一次
//                 camera.position.set(cameraX, cameraY, cameraZ);
//                 orbit.target.set(orbitX, orbitY, orbitZ);
//                 NewcameraX = cameraX;
//                 NewcameraY = cameraY;
//                 NewcameraZ = cameraZ;
//             }
//             flag = 1;
//         }
//     });
//     document.addEventListener("wheel", function(e){ //滑鼠滾動
//         orbit.target.set(orbitX, orbitY, orbitZ); //中心點位置
//         NewcameraX = camera.position.x;
//         NewcameraY = camera.position.y;
//         NewcameraZ = camera.position.z;
//         orbit.maxDistance = maxDistance;
//     });
// };

const position = ['ascending near','ascending far', 'descending near','descending far', 'transverse near','transverse far', 'cecum', 'sigmoid', 'rectum'];
const positiondivlist = [];
const label_of_position = [];
for(const index in position){
    positiondivlist[index] = document.createElement( 'div' );
    positiondivlist[index].textContent = position[index];
    positiondivlist[index].className = 'label_of_position';
    positiondivlist[index].positionName = position[index].replace(/\s/g, '_');
    label_of_position[index] = new CSS2DObject( positiondivlist[index] );
    positiondivlist[index].addEventListener('pointerdown', function(){
        positionLabelHide();
        switch(positiondivlist[index].positionName){
            case 'ascending_near':
                positionController.setValue(2);
                break;
            case 'ascending_far':
                positionController.setValue(3);
                break;
            case 'descending_near':
                positionController.setValue(6);
                break;
            case 'descending_far':
                positionController.setValue(7);
                break;
            case 'transverse_near':
                positionController.setValue(5);
                break;
            case 'transverse_far':
                positionController.setValue(4);
                break;
            case 'cecum':
                positionController.setValue(1);
                break;
            case 'sigmoid':
                positionController.setValue(8);
                break;
            case 'rectum':
                positionController.setValue(9);
                break;
        }
    });
    switch(index){
        case "0": //ascending near
            label_of_position[index].position.set(0, -50, -230);
            break;
        case "1": //ascending far
            label_of_position[index].position.set(0, 30, -230);
            break;
        case "2": //descending near
            label_of_position[index].position.set(0, 180, 250);
            break;
        case "3": //descending far
            label_of_position[index].position.set(0, 0, 250);
            break;
        case "4": //transverse near
            label_of_position[index].position.set(0, 90, -130);
            break;
        case "5": //transverse far
            label_of_position[index].position.set(0, 160,-30);
            break;
        case "6": //cecum
            label_of_position[index].position.set(-50, -110 , -80);
            break;
        case "7": //sigmoid
            label_of_position[index].position.set(0, -200, 180);
            break;
        case "8": //rectum
            label_of_position[index].position.set(0, -200, 10);
            break;                    
    }
}

const positionLabelHide = ()=>{
    for(const la of label_of_position){
        la.element.classList.add('hidden');
    }
}

const positionLabelShow = () => {
    for(const la of label_of_position){
        la.element.classList.remove('hidden');
    } 
}

const allFoucsShow = () => {
    for(const la of label){
        la.element.classList.remove('hidden');
    }
}
const updateLabelsVisibility = (pos)=>{
    for(const labelDictionary of labelDictionaryList){
        const a = labelDictionary['position'].charCodeAt(0);
        const b = pos.charCodeAt(0);
        if(a==b){
            labelDictionary['label'].element.classList.remove('hidden');
            
        }else{
            labelDictionary['label'].element.classList.add('hidden');
        }
    }
}

const patient_Records = [];
const text = [];
const label = [];
const labelDictionaryList = []

// x>0往前；y>0往上；z>0 往右
//近升結腸位置初始值
var an_x=0;
var an_y=-10;
var an_z=-110;

//遠升結腸位置初始值
var af_x=0;
var af_y=50;
var af_z=-110;

//近降結腸位置初始值
var dn_x=-38;
var dn_y=80;
var dn_z=110;

//遠降結腸位置初始值
var df_x=-45;
var df_y=-40;
var df_z=105;

//近橫結腸位置初始值
var tn_x=20;
var tn_y=120;
var tn_z=-40;

//遠橫結腸位置初始值
var tf_x=20;
var tf_y=140;
var tf_z=0;

//盲腸位置初始值
var c_x=-30;
var c_y=-80;
var c_z=-110;

//乙狀結腸位置初始值
var s_x=-80;
var s_y=-135;
var s_z=90;

//直腸位置初始值
var r_x=-30;
var r_y=-155;
var r_z=55;

function updateFocusLabels(){
    for(const index in text){
        const {check_date, focus_name, mark, size,  image} = focuses[index];
        let content = "";
        if(params.showFocusName) content += `${focus_name}`;
        if(params.showMark) content += `${mark}`;
        if(params.showSize) content += `${size}`;
        if(params.showCheckDate) content += `${check_date}`;
        text[index].innerHTML = "<div><img src='/media/"+image+"' style='width:20px; height:20px;'>"+content.trim()+"</div>";
    }
};

for(const index in focuses){
    // console.log(index);
    const {patient_name, check_date, focus_name, focus_diagnosis, mark, size, position,  image, treatment_image} = focuses[index];
    console.log(patient_name, check_date, focus_name, focus_diagnosis, mark, size, position, image, treatment_image);
    patient_Records.push(focuses[index]);
    // add label object
    text[index] = document.createElement( 'div' );
    text[index].className = 'label';
    // text[index].textContent = focus_name+" "+mark+" "+check_date;
    updateFocusLabels();
    label[index] = new CSS2DObject(text[index] );
    let labelset = {
        label: label[index],
        position: position
    };
    labelDictionaryList.push(labelset);
    switch(position){
        case 'an':
            label[index].position.set(an_x, an_y, an_z);
            //an_x+=5;
            an_y+=3;
            //an_z-=2;
            break;
        case 'af':
            label[index].position.set(af_x, af_y, af_z);
            //af_x+=5;
            af_y+=3;
            //af_z-=2;
            break;
        case 'dn':
            label[index].position.set(dn_x, dn_y, dn_z);
            //dn_x+=3;
            dn_y-=10;
            break;
        case 'df':
            label[index].position.set(df_x, df_y, df_z);
            df_x-=3;
            df_y-=3;
            break;
        case 'tn':
            label[index].position.set(tn_x, tn_y, tn_z);
            tn_z+=10;
            break;
        case 'tf':
            label[index].position.set(tf_x, tf_y, tf_z);
            tf_z+=10;
            break;
        case 'c':
            label[index].position.set(c_x, c_y, c_z);
            //c_x+=5;
            c_y+=3;
            //c_z-=2;
            break;
        case 's':
            label[index].position.set(s_x, s_y, s_z);
            //s_x+=5;
            s_y-=5;
        // s_z-=2;
            break;
        case 'r':
            label[index].position.set(r_x, r_y, r_z);
            r_x+=5;
            r_y+=10;
            r_z-=2;
            break;
    };
    text[index].addEventListener('pointerdown', function(){
        Swal.fire({
            title: "大腸鏡報告",
            html: `
            <div class="slider-container">
                <div class="slider">
                    <div style="text-align: left; padding: 10px;">
                        <img src="/media/`+focuses[index]['image']+`" alt="Image 1" style="max-width: 100%; display: block; margin: 0 auto;">
                        <div class="description" style="text-align: center;">這是第一張圖片的描述</div>
                        <div>病灶名稱：`+focuses[index]['focus_name']+`</div>
                        <div>病人姓名：`+focuses[index]['patient_name']+`</div>
                        <div>檢查日期：`+focuses[index]['check_date']+`</div>
                        <div>診斷說明：`+focuses[index]['focus_diagnosis']+`</div>
                        <div>標記：`+focuses[index]['mark']+`</div>
                        <div>大小：`+focuses[index]['size']+`</div>
                        <div>病灶位置：`+focuses[index]['position']+`</div>
                        <div style="margin-top: 10px;">additional note</div>
                    </div>
                    <div style="text-align: left; padding: 10px;">
                        <img src="/media/`+focuses[index]['treatment_image']+`" alt="Image 2" style="max-width: 100%; display: block; margin: 0 auto;">
                        <div class="description" style="text-align: center;">這是第二張圖片的描述</div>
                    </div>
                </div>
                <button type="button" class="slick-prev slick-arrow">&larr;</button>
                <button type="button" class="slick-next slick-arrow">&rarr;</button>
            </div>
            `,
            // width: 800,
            // padding: '3em',
            didOpen: () => {
                $('.slider').slick({
                    dots: true,
                    infinite: true,
                    speed: 300,
                    slidesToShow: 1,
                    adaptiveHeight: true,
                    arrows: true,
                    prevArrow: $('.slick-prev'),
                    nextArrow: $('.slick-next')
                });
            }
        }); 
    });
}

// gltf loader
const gltfLoader = new GLTFLoader();
gltfLoader.load(
  '/static/full_colon.glb',
  gltf => {
    const model = gltf.scene;
    model.traverse((child)=>{
        if(child.isMesh){
            child.castShadow = true;
            const material = new THREE.MeshStandardMaterial({color:0xFF9EAA});
            child.material = material;
        }
    });
    model.position.set(0, 0, 0);
    for(const index in label){
        model.add( label[index] );
    }
    for(const index in label_of_position){
        model.add(label_of_position[index]);
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
document.body.appendChild( labelRenderer.domElement );

//軌道旋轉控制
const orbit = new OrbitControls(camera, labelRenderer.domElement);
orbit.mouseButtons = {
	LEFT: THREE.MOUSE.PAN,
	RIGHT: THREE.MOUSE.ROTATE
}

const ambientLight = new THREE.AmbientLight("#ffffff", 1);
scene.add(ambientLight);

const directionalLight1 = new THREE.DirectionalLight("#ffffff", 3);
directionalLight1.position.set(1, 1, 1);
directionalLight1.castShadow = true
scene.add(directionalLight1);
const directionalLight2 = new THREE.DirectionalLight("#ffffff", 2);
directionalLight2.position.set(-1, -1, -3);
scene.add(directionalLight2);

const animate = ()=>{
    orbit.update();
    // console.log("水平Azimuthal:", orbit.getAzimuthalAngle(), "垂直Polar:", orbit.getPolarAngle());
    // console.log(camera.position.x, camera.position.y, camera.position.z);
    // console.log(orbit.getDistance());
    renderer.render(scene, camera);
    labelRenderer.render( scene, camera );
    requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', function(){
    camera.aspect = this.window.innerWidth/this.window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(this.window.innerWidth, this.window.innerHeight);
    labelRenderer.setSize( this.window.innerWidth, this.window.innerHeight );
});