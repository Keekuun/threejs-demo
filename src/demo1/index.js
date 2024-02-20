import '@unocss/reset/tailwind.css'
import * as THREE from "three";

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
const material = new THREE.MeshBasicMaterial({color: '#2c62e9'});
const cube = new THREE.Mesh(geometry, material);
// cube.rotateY(Math.PI / 4);
scene.add(cube);

function animate() {
  requestAnimationFrame(animate);
  cube.rotateY(0.01);

  // 5. 渲染
  renderer.render(scene, camera);
}

animate();
