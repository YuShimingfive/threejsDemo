<template>
    <div ref="containerRef" id="threedPreview" style="width:100vw;height:100vh;position: relative">
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
        camera.value.position.set(100, 100, 100)
        renderer.setSize(container.clientWidth, container.clientHeight)
        //控制器
        var controls = new OrbitControls(camera.value, renderer.domElement);
        // controls.enableZoom = false
        // controls.enablePan = false
        const mtlLoader = new MTLLoader();
        const objLoader = new OBJLoader();
        const textureLoader = new THREE.TextureLoader()
        const mtlUrl = "./model/threed/demo.mtl"
        const objUrl = "./model/threed/demo.obj"
        const imgUrl = "./model/threed/demo.jpg"
        mtlLoader.load(mtlUrl, (materials) => {
            materials.preload();
            objLoader.setMaterials(materials);
            objLoader.load(objUrl, (object) => {
                object.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                        //设置模型皮肤
                        child.material.map = textureLoader.load(imgUrl);
                    }
                });
                var box3 = new THREE.Box3();
                box3.setFromObject(object); //获取包围盒
                var size = box3.getSize(new THREE.Vector3());        //获取包围盒的大小，即模型的长宽高
                console.log(size);
                
                object.scale.set(50,50,50); //见本段注释。换算得到实际大小。
                // object.scale.set(5 / size.x, 5 / size.x, 5 / size.x);
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