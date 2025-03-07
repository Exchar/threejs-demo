import { BaseRender } from "../../utils";
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

class CutstomRender extends BaseRender {
    controls: OrbitControls
    constructor(){
        super(undefined,{});
        this.addOrbitController()
        this.camera.position.set( 0, 0, 10 );

        // this.addGridHelper()

        // 天空盒实现
        // this.addViewGeometryWidthSkyBox()

        // 全景贴图实现
        this.addViewGeometryWithTexture()

        this.startRender()
    }
    addOrbitController(){
        // 初始化完成后添加轨道控制器
        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls = controls
        controls.autoRotate = true
        controls.autoRotateSpeed = 1
        controls.enableDamping = true
        controls.enableZoom = false
    }

    addViewGeometryWithTexture(){
        // 创建一个球体
        const geometry = new THREE.SphereGeometry( 5, 32, 16 );
        // 创建材质
        const material = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('/src/assets/livingRoom.jpg')
        })

        const mesh = new THREE.Mesh(geometry,material)
        this.scene.add(mesh)

        // 添加贴图之后缩放相机
        mesh.geometry.scale(5,5,-5)
    }

    // 天空盒实现
    addViewGeometryWidthSkyBox(){
        // 添加一个正方体
        const geometry = new THREE.BoxGeometry( 10, 10, 10 );
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        const mesh = new THREE.Mesh( geometry, material );
        this.scene.add( mesh );

        
        // 获取各个面的贴图
        const images = [
            '/src/assets/left.png',
            '/src/assets/right.png',
            '/src/assets/top.png',
            '/src/assets/bottom.png',
            '/src/assets/front.png',
            '/src/assets/back.png',
        ]

        const textureLoader = new THREE.TextureLoader();
        const textures:THREE.MeshBasicMaterial[] = []
        images.forEach((item,index)=>{
            console.log(item)
            textureLoader.load(item,(texture)=>{
                console.log(texture)
                const material = new THREE.MeshBasicMaterial( { map:texture } );
                textures.push(material)
            },undefined,()=>{})
        })
        // const cube = new THREE.Mesh( new THREE.CubeGeometry( 20, 20, 20 ), new THREE.MeshFaceMaterial(textures) );
        const cube = new THREE.Mesh( geometry, textures );
        // this.scene.add( mesh );
        this.scene.add(cube)
        this.renderer.render(this.scene, this.camera);
        // 添加贴图之后缩放相机
        cube.geometry.scale(5,5,-5)
    }
    addGridHelper(){
        // 添加GridHelper
        const size = 100;
        const divisions = 20;
        
        const gridHelper = new THREE.GridHelper( size, divisions );
        this.scene.add( gridHelper );
    }

    startRender(): void {
        this.renderer.render(this.scene, this.camera);
        this.controls.update()
        // 渲染时一直让相机固定
        this.camera.lookAt(0,0,0)
        requestAnimationFrame(() => this.startRender());
    }
}
new CutstomRender()