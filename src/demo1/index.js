import '@unocss/reset/tailwind.css'
import * as THREE from "three";

// 1. 创建渲染器,指定渲染的分辨率和尺寸,然后添加到body中
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.pixelRatio = window.devicePixelRatio;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.append(renderer.domElement);

// 2. 创建场景
const scene = new THREE.Scene();

// 3. 创建相机
const camera = new THREE.PerspectiveCamera(
  75,                                     // 设置75度视野
  window.innerWidth / window.innerHeight, // 相机的纵横比设置为画布的宽度除以其高度
  0.1,                                    // 近平面距离为0.01
  1000                                    // 远平面距离为1000
);

// 4. 创建物体
const axis = new THREE.AxesHelper(5); // 坐标辅助线物体
scene.add(axis);

// 5. 渲染
renderer.render(scene, camera);

