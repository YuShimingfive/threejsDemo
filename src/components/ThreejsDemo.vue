<template>
    <div ref="containerRef" id="threedPreview" style="width:90vw;height:90vh;position: relative">
        <canvas ref="canvasRef" style="width: 100%;height: 100%;">
        </canvas>
    </div>
</template>
<script>
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as THREE from "three"
import { defineComponent } from "vue";
export default defineComponent({
    name: "prevewModal",
})
</script>
<script setup>
import { ref, nextTick, onMounted } from "vue"
const containerRef = ref()
const canvasRef = ref()
const camera = ref()
/*3D模型 OBJ+MTL+JPG*/
onMounted(() => {
    render3dModel()
})
const render3dModel = () => {
    nextTick(async () => {
        const container = containerRef.value;
        const canvas = canvasRef.value;
        const renderer = new THREE.WebGLRenderer({ canvas });
        const scene = new THREE.Scene();
        camera.value = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        renderer.setSize(container.clientWidth, container.clientHeight)
        //控制器
        var controls = new OrbitControls(camera.value, renderer.domElement);
        // controls.enableZoom = false
        // controls.enablePan = false
        const mtlLoader = new MTLLoader();
        const objLoader = new OBJLoader();
        const textureLoader = new THREE.TextureLoader()
        const mtlUrl = "./model/threed/furniture.mtl"
        const objUrl = "./model/threed/furniture.obj"
        mtlLoader.load(mtlUrl, (materials) => {
            materials.preload();
            objLoader.setMaterials(materials);
            objLoader.load(objUrl, (object) => {
                object.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                        //设置模型皮肤
                        // child.material.map = textureLoader.load(imgUrl);
                    }
                });
                var box3 = new THREE.Box3();
                box3.setFromObject(object); //获取包围盒
                var size = box3.getSize(new THREE.Vector3());        //获取包围盒的大小，即模型的长宽高
                const x = (box3.max.x - box3.min.x)
                const y = (box3.max.y - box3.min.y)
                const z = (box3.max.z - box3.min.z)
                const maxDim = Math.max(x, y, z)
                const num = (maxDim * 0.01).toFixed(2)
                const scale = num / maxDim

                // object.scale.set(100 / size.x, 100 / size.y * 1.5, 74 / size.z); //见本段注释。换算得到实际大小。
                object.scale.set(scale, scale, scale);
                object.position.set(0, 0, 0)
                // camera.value.position.x = 0;
                // camera.value.position.y = size.y / 200
                camera.value.position.z = num
                scene.add(object);
            });
        });
        scene.add(new THREE.AmbientLight(0xffffff, 3));
        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera.value);
            setTimeout(() => {
                // window.URL.revokeObjectURL(mtlUrl)
                // window.URL.revokeObjectURL(objUrl)
                // window.URL.revokeObjectURL(imgUrl)
            }, 1000);
        }
        animate();
    })
}
</script>
<style></style>