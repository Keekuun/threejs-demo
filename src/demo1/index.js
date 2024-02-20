import '@unocss/reset/tailwind.css'
import 'uno.css'

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

// 1. 创建渲染器,指定渲染的分辨率和尺寸,然后添加到body中
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.pixelRatio = window.devicePixelRatio;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.append(renderer.domElement);

// 2. 创建场景
const scene = new THREE.Scene();

// 3. 创建相机
const camera = new THREE.PerspectiveCamera(
  75,                                         // 设置75度视野
  window.innerWidth / window.innerHeight,   // 相机的纵横比设置为画布的宽度除以其高度
  0.1,                                        // 近平面距离为0.01
  1000                                        // 远平面距离为1000
);


// 移动相机位置
camera.position.set(5, 5, 10);
// 设置相机看向原点的方向
camera.lookAt(0, 0, 0);

// 4. 创建物体
const axis = new THREE.AxesHelper(5); // 坐标辅助线物体
scene.add(axis);

// 添加立方体
const geometry = new THREE.BoxGeometry(3, 3, 3);
// const material = new THREE.MeshBasicMaterial({color: '#2c62e9'});
// 1.MeshBasicMaterial不受光源的影像，所以需要将Material改成MeshStandardMaterial；
const material = new THREE.MeshStandardMaterial({color: '#2c62e9'});
// 2.添加一个白色透明度为0.4的环境光，这个环境光会均匀地照亮场景中的所有物体表面，并且使用PBR（Physically-Based Rendering）渲染模型和材质自身的颜色进行混合得到新的颜色；
const ambientLight = new THREE.AmbientLight('#ffffff', 0.4);
scene.add(ambientLight);

// 3.添加一个白色的方向光，方向光从(10, 0, 10)照向原点(10, 0, 10)， 所以有两个面会收到这个方向光，表面的颜色会更偏亮。
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 0, 10);
scene.add(directionalLight);

const cube = new THREE.Mesh(geometry, material);
// cube.rotateY(Math.PI / 4);
scene.add(cube);

// 添加对场景内容进行旋转、放大缩小等控制操作
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

function animate() {
  requestAnimationFrame(animate);
  cube.rotateY(0.01);

  // 5. 渲染
  renderer.render(scene, camera);
}

animate();
