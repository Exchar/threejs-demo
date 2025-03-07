import * as THREE from 'three'
interface Option{
    width?:number,
    height?:number,
    antialias?:boolean
}
export class BaseRender{
    canvasEl:HTMLCanvasElement|null = null
    renderer: THREE.WebGLRenderer
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera

    constructor(el:string | HTMLCanvasElement|undefined,options:Option){
        this.canvasEl = el ? this.getQueryElement(el): null;

        // 创建threejs场景
        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(0xbfbfbf);

        // 创建threejs相机
        // 参数值为 视野角度,长宽比,近截面,远截面
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 0

        // 创建webgl渲染器
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvasEl || undefined,
            antialias: options.antialias || false
        });
        if(!this.canvasEl){
            document.body.appendChild(this.renderer.domElement);
        }
        // 设置canvasEl
        this.canvasEl = this.canvasEl || this.renderer.domElement;
        // 设置渲染尺寸
        this.renderer.setSize(options.width || window.innerWidth, options.height ||window.innerHeight);
        this.renderer.render(this.scene,this.camera)

        this.startResizeWatcher();

    }
    startRender(){
        // console.log(this.renderer)
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(()=>this.startRender());
    }
    getQueryElement(el:string | HTMLCanvasElement):HTMLCanvasElement|null{
        return typeof el==='string' ? document.querySelector(el) : el
    }
    startResizeWatcher(){
        window.addEventListener('resize',()=>{
            this.renderer.setSize(window.innerWidth,window.innerHeight)
        })
    }
}