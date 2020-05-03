import NewQuaxObject from './NewQuaxObject'
import OBJECT_TYPES from '../constants/object-types'
import * as THREE from "three";

class ThreeCanvasObject extends NewQuaxObject {
    constructor(processor) {
        super(processor)
        this.numInlets = 3
        this.numOutlets = 1
        this.type = OBJECT_TYPES.THREE_CANVAS
        this.hasDSP = true
        this.shapes = {}
        this.animate = this.animate.bind(this)
        
    }

    animate() {
        requestAnimationFrame( this.animate );
        this.renderer.render( this.scene, this.camera );
    }

    initializeThree(width, height, callback) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, width/height, 0.1, 1000 );
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( width, height );
        this.camera.position.z = 5;
        this.animate()
        callback(this.renderer) 
    }

    addShape(shape) {        
        this.scene.add( shape );
    }

    sendData() {
        for (let i in this.receivers[0]) {
            const randVal = this.attributes.min + Math.random() * (this.attributes.min + this.attributes.max)
            this.processor.objects[i].receiveData(this.receivers[0][i], randVal)
        }        
    }

    receiveData(inlet, data) {
        this.parseMessage(data)
    }

    parseMessage(message) {

    }

    updateAttributes(newAttributes) {
        
    }

    addReceiver(outletIndex, inletIndex, inputID) {
        this.receivers[outletIndex][inputID] = inletIndex
    }
    
}

export default ThreeCanvasObject