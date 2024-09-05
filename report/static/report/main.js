import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls'
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
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
        camera.up.set(0, 1, 0);
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
    controls.target.set(0, 0, 0);
    controls.maxDistance = 400;
};

function showAscendingNear(){
    positionLabelHide();
    camera.position.set(-10, -50 , -90); //相機位置
    controls.target.set(30, 40 , -130); //中心點位置
    controls.maxDistance = 106;
    updateLabelsVisibility('a');
    mouseControl(camera.position.x, camera.position.y, camera.position.z, controls.target.x, controls.target.y, controls.target.z, 106);
};
function showAscendingFar(){
    positionLabelHide();
    camera.position.set(30, 30 , -130); //相機位置
    controls.target.set(35, 80, -130); //中心點位置
    controls.maxDistance = 41;
    updateLabelsVisibility('a');
    mouseControl(camera.position.x, camera.position.y, camera.position.z, controls.target.x, controls.target.y, controls.target.z, 41);
}
function showDescendingNear(){
    positionLabelHide();
    camera.position.set(15, 175 ,120);
    controls.target.set(-25, 0 , 105);
    controls.maxDistance = 168;                
    updateLabelsVisibility('d');
    mouseControl(camera.position.x, camera.position.y, camera.position.z, controls.target.x, controls.target.y, controls.target.z, 168); 
}
function showDescendingFar(){
    positionLabelHide();
    camera.position.set(-25, 0 , 115);
    controls.target.set(-75, -110 , 100);
    controls.maxDistance = 117;
    updateLabelsVisibility('d');
    mouseControl(camera.position.x, camera.position.y, camera.position.z, controls.target.x, controls.target.y, controls.target.z, 117);
}
function showTransverseNear(){
    positionLabelHide();
    camera.position.set(40, 90 , -140);
    controls.target.set(20, 120 , -20);
    controls.maxDistance = 125;
    updateLabelsVisibility('t');
    mouseControl(camera.position.x, camera.position.y, camera.position.z, controls.target.x, controls.target.y, controls.target.z, 125);
}
function showTransverseFar(){
    positionLabelHide();
    camera.position.set(10, 130 , -20);
    controls.target.set(15, 175 ,120);
    controls.maxDistance = 166;
    updateLabelsVisibility('t');
    mouseControl(camera.position.x, camera.position.y, camera.position.z, controls.target.x, controls.target.y, controls.target.z, 166);
}
function showCecum(){
    positionLabelHide();
    camera.position.set(-50, -110 , -80);
    controls.target.set(-30, -73, -88);
    controls.maxDistance = 41;
    updateLabelsVisibility('c');
    mouseControl(camera.position.x, camera.position.y, camera.position.z, controls.target.x, controls.target.y, controls.target.z, 41);
}
function showSigmoid(){
    positionLabelHide();
    camera.position.set(-81, -111 , 113);
    controls.target.set(-29, -129, 52);
    controls.maxDistance = 83;
    updateLabelsVisibility('s');
    mouseControl(camera.position.x, camera.position.y, camera.position.z, controls.target.x, controls.target.y, controls.target.z, 83);
}
function showRectum(){
    positionLabelHide();
    camera.position.set(-28, -146, 43); 
    controls.target.set(-30, -170, 53);
    controls.maxDistance = 30;
    updateLabelsVisibility('r');
    mouseControl(camera.position.x, camera.position.y, camera.position.z, controls.target.x, controls.target.y, controls.target.z, 30);
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
            controls.target.set(orbitX, orbitY, orbitZ);
            controls.maxDistance = maxDistance;
        }
        if(e.button==2){ //右鍵拉近中心點
            controls.target.set(camera.position.x+direction.x, camera.position.y+direction.y, camera.position.z+direction.z);
        }
    };
    document.addEventListener("mousedown", onMouseDown);
    onMouseWheel = () => {
        controls.maxDistance = maxDistance;
        controls.target.set(orbitX, orbitY, orbitZ);
    };
    document.addEventListener("wheel", onMouseWheel);
};


var loader = document.createElement("div");
loader.className = "loader";
loader.style.position = "absolute";
loader.style.top = "0";
document.body.appendChild(loader);

var co = document.createElement("div");
co.style.position = "absolute";
co.style.top = "0";
co.textContent = "Connected";
co.setAttribute('id', 'controller-connected-area');
//co.id = "controller-connected-area";
document.body.appendChild(co);

var unco = document.createElement("div");
unco.style.position = "absolute";
unco.style.top = "15px";
unco.textContent = "Controller not connected.Press any button to start"
unco.setAttribute('id', 'controller-not-connected-area');
//unco.id = "controller-not-connected-area";
document.body.appendChild(unco);

window.addEventListener("gamepadconnected", (event) => {
  handleConnectDisconnect(event, true);
});

window.addEventListener("gamepaddisconnected", (event) => {
  handleConnectDisconnect(event, false);
});

function handleConnectDisconnect(event, connected) {
  const controllerAreaNotConnected = document.getElementById(
    "controller-not-connected-area"
  );
  const controllerAreaConnected = document.getElementById(
    "controller-connected-area"
  );

    const gamepad = event.gamepad;
    console.log(gamepad);

  if (connected) {
    console.log("connected");
    //controllerAreaNotConnected.element.id.add("hidden");
    //controllerAreaConnected.element.id.remove("hidden");
    loader.style.display = "none";
    controllerAreaNotConnected.style.display = "none";
    controllerAreaConnected.style.display = "block";
    controllerAreaConnected.style.color = "white";
    controllerIndex = event.gamepad.index;
  } else {
    console.log("notconnected");
    //controllerAreaNotConnected.element.id.remove("hidden");
    //controllerAreaConnected.element.id.add("hidden");
    loader.style.display = "block";
    controllerAreaNotConnected.style.display = "block";
    controllerAreaConnected.style.display = "none";
    controllerIndex = null;
  }
}

// ver 2
// const mouseControl = (cameraX, cameraY, cameraZ, orbitX, orbitY, orbitZ, maxDistance)=>{
//     document.addEventListener("mousedown", function(e){
//         const direction = new THREE.Vector3();
//         camera.getWorldDirection(direction);
//         if(e.button==0){ //左鍵做校正
//             camera.position.set(cameraX, cameraY, cameraZ);
//             controls.target.set(orbitX, orbitY, orbitZ);
//             controls.maxDistance = maxDistance;
//         }
//         if(e.button==2){ //右鍵拉近中心點
//             controls.target.set(camera.position.x+direction.x, camera.position.y+direction.y, camera.position.z+direction.z);
//         }
//     });
//     document.addEventListener("wheel", function(e){ //滑鼠滾動
//         controls.maxDistance = maxDistance;
//         controls.target.set(orbitX, orbitY, orbitZ); //中心點位置
//     });
// };


// ver 3 未完成
// const mouseControl = (cameraX, cameraY, cameraZ, orbitX, orbitY, orbitZ, maxDistance)=>{
//     var flag = 0;
//     var NewcameraX, NewcameraY, NewcameraZ;
//     controls.mouseButtons = {
//         LEFT: THREE.MOUSE.ROTATE,
//         RIGHT: THREE.MOUSE.PAN
//     }
//     camera.position.set(cameraX, cameraY, cameraZ);
//     controls.target.set(orbitX, orbitY, orbitZ);

//     document.addEventListener("mousedown", function(e){
//         if(e.button==2){ //右鍵做位移
//             controls.target.set(orbitX, orbitY, orbitZ);
//             controls.maxDistance = maxDistance;
//             NewcameraX = camera.position.x;
//             NewcameraY = camera.position.y;
//             NewcameraZ = camera.position.z;
//         }
//         if(e.button==4){
//             camera.position.set(cameraX, cameraY, cameraZ);
//             controls.target.set(orbitX, orbitY, orbitZ);
//         }
//         if(e.button==0){ //左鍵拉近中心點
//             const direction = new THREE.Vector3();
//             camera.getWorldDirection(direction);
//             if(flag){
//                 camera.position.set(NewcameraX, NewcameraY, NewcameraZ);
//                 controls.target.set(cameraX+direction.x, cameraY+direction.y, cameraZ+direction.z);
//                 // alert(direction.x);
//                 // alert(direction.y);
//                 // alert(direction.z);
//             }else{ // 點進來時 mousedown 左鍵算一次
//                 camera.position.set(cameraX, cameraY, cameraZ);
//                 controls.target.set(orbitX, orbitY, orbitZ);
//                 NewcameraX = cameraX;
//                 NewcameraY = cameraY;
//                 NewcameraZ = cameraZ;
//             }
//             flag = 1;
//         }
//     });
//     document.addEventListener("wheel", function(e){ //滑鼠滾動
//         controls.target.set(orbitX, orbitY, orbitZ); //中心點位置
//         NewcameraX = camera.position.x;
//         NewcameraY = camera.position.y;
//         NewcameraZ = camera.position.z;
//         controls.maxDistance = maxDistance;
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
const controls = new TrackballControls(camera, labelRenderer.domElement);
controls.mouseButtons = {
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

const cursor = document.createElement('div');
cursor.style.width = '20px';
cursor.style.height = '20px';
cursor.style.backgroundColor = 'red';
cursor.style.borderRadius = '50%';
cursor.style.position = 'absolute';
cursor.style.pointerEvents = 'none'; // 讓游標不可被點擊
cursor.style.zIndex = '999';

labelRenderer.domElement.appendChild(cursor);

// document.addEventListener('mousemove', (event) => { // 更新遊標位置
//     cursor.style.left = `${event.clientX}px`;
//     cursor.style.top = `${event.clientY}px`;
//   });


// 設定 cursor 的初始位置在畫面中央
let cursorX = window.innerWidth / 2; 
let cursorY = window.innerHeight / 2;
cursor.style.left = `${cursorX}px`;
cursor.style.top = `${cursorY}px`;

let controllerIndex = null;
let leftPressed = false;
let rightPressed = false;
let upPressed = false;
let downPressed = false;

let leftMoved = false;
let rightMoved = false;
let upMoved = false;
let downMoved = false;

let leftRotate = false;
let rightRotate = false;
let upRotate = false;
let downRotate = false;

let APressed = false;
let BPressed = false;
let XPressed = false;
let YPressed = false;

let PrevPressed = false;
let NextPressed = false;

let prevPrevPressed = 0; // 記錄上一個 PrevPressed 的狀態
let prevNextPressed = 0; // 記錄上一個 NextPressed 的狀態

function controllerInput() {
    if (controllerIndex !== null) {
        const gamepad = navigator.getGamepads()[controllerIndex];
  
        const buttons = gamepad.buttons;
        upPressed = buttons[12].pressed ? 1 : 0; // 上鍵
        downPressed = buttons[13].pressed ? 1 : 0; // 下鍵
        PrevPressed = buttons[14].pressed ? 1 : 0; // 上一段大腸
        NextPressed = buttons[15].pressed ? 1 : 0; // 下一段大腸
    
        const stickDeadZone = 0.5; // 搖桿靈敏度
        const leftRightValueLEFT = gamepad.axes[0]; // 左右搖桿，左負右正，範圍-1~1，0為中間，超過0.4才算按下
        if (leftRightValueLEFT >= stickDeadZone) {
            rightMoved = true;
        } else if (leftRightValueLEFT <= -stickDeadZone) {
            leftMoved = true;
        }else{
            leftMoved = false;
            rightMoved = false;
        }
    
        const upDownValueLEFT = gamepad.axes[1]; // 上下搖桿，上負下正，範圍-1~1，0為中間，超過0.4才算按下
    
        if (upDownValueLEFT >= stickDeadZone) {
            downMoved = true;
        } else if (upDownValueLEFT <= -stickDeadZone) {
            upMoved = true;
        } else{
            upMoved = false;
            downMoved = false;
        }

        const rotateY = gamepad.axes[2];
        const rotateX = gamepad.axes[3];
        // 右搖桿控制相機旋轉繞x,y軸旋轉
        if(Math.abs(rotateX) > 0.1 || Math.abs(rotateY) > 0.1){
            camera.rotation.x += rotateX * Math.PI;
            camera.rotation.y -= rotateY * Math.PI;
        }
        APressed = buttons[0].pressed ? 1 : 0;
        BPressed = buttons[1].pressed ? 1 : 0;
        XPressed = buttons[2].pressed ? 1 : 0;
        YPressed = buttons[3].pressed ? 1 : 0;

        leftPressed = buttons[4].pressed ? 1 : 0; // 上一張照片
        rightPressed = buttons[5].pressed ? 1 : 0; // 下一張照片

        // 檢查 PrevPressed 是否從按下變為放開
        if (prevPrevPressed === 1 && PrevPressed === 0) {
            // 在這裡處理 PrevPressed 放開的邏輯
            console.log("PrevPressed 按鈕放開");
            params.previous();
        }

        // 檢查 NextPressed 是否從按下變為放開
        if (prevNextPressed === 1 && NextPressed === 0) {
            // 在這裡處理 NextPressed 放開的邏輯
            console.log("NextPressed 按鈕放開");
            params.next();
        }
        // 更新 prevPrevPressed 和 prevNextPressed 狀態
        prevPrevPressed = PrevPressed;
        prevNextPressed = NextPressed;
    }
}

function moveCursor() {
    if (upMoved) {
      // 光標往上移動
      cursorY -= 6;
      cursor.style.top = `${cursorY}px`;
    }
    if (downMoved) {
      // 光標往下移動
      cursorY += 6;
      cursor.style.top = `${cursorY}px`;
    }
    if (leftMoved) {
      // 光標往左移動
      cursorX -= 6;
      cursor.style.left = `${cursorX}px`;
    }
    if (rightMoved) {
      // 光標往右移動  
      cursorX += 6;
      cursor.style.left = `${cursorX}px`;
    }
    // 如果光標超出畫面範圍，就停在邊界
    if (cursorX < 0) {
      cursorX = 0;
    }else if (cursorX > window.innerWidth-20) {
        cursorX = window.innerWidth-20;
    }
    if (cursorY < 0) {
        cursorY = 0;
    }else if (cursorY > window.innerHeight-20) {
        cursorY = window.innerHeight-20;
    }
}
function buttonpressed() {
    if (upPressed) { //放大畫面
        console.log("Zoom in");
        //模擬滑鼠滾動使相機朝中心點拉近
        const eventZoomIn = new WheelEvent('wheel', { deltaY: -20 });
        labelRenderer.domElement.dispatchEvent(eventZoomIn);
    } 
    if (downPressed) { //縮小畫面
        console.log("Zoom out");
        const eventZoomOut = new WheelEvent('wheel', { deltaY: 20 });
        labelRenderer.domElement.dispatchEvent(eventZoomOut);
    }
    if (leftPressed) {
        console.log("left")
        $('.slick-prev').click();
    }
    if (rightPressed) {
        console.log("right");
        $('.slick-next').click();
    }
    //當A被按下時，根據 CursorX, CursorY 的位置來進行網頁點擊label元素
    if (APressed) {
        console.log("A");
        const elements = document.elementsFromPoint(cursorX, cursorY); // 取得游標所在位置的元素
        console.log(cursorX, cursorY);
        elements.forEach((element) => { // 對每個元素進行迴圈，element 是點擊位置的每個元素
            if (element.classList.contains('label') || element.classList.contains('label_of_position')) { // 如果元素有 label 或 label_of_position 這個 class
                element.dispatchEvent(new Event('pointerdown')); // 觸發元素的 pointerdown 事件
            }
        });
    }
    if (BPressed) {
        positionController.setValue(0);
        camera.up.set(0, 1, 0);
    }
    if (XPressed) {
        console.log("X");
        // 關閉 Swal 彈窗
        Swal.close();
    }
//     if (YPressed) {
//         console.log("Y")
//  }
}

const rotationSpeed = 0.5;

function DragControls() {
    if(leftRotate){
        console.log("leftRotate");
    }
    if(rightRotate){
        console.log("rightRotate");
    }
    if(upRotate){
        console.log("upRotate");
    }
    if(downRotate){
        console.log("downRotate");
    }
}

const animate = ()=>{
    controls.update();
    controllerInput();
    moveCursor();
    buttonpressed();
    DragControls();
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