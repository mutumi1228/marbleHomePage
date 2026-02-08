import * as THREE from 'https://cdn.jsdelivr.net/npm/three@r128/build/three.module.js';

const GLTFLoader = function(manager) {
  this.manager = manager || THREE.DefaultLoadingManager;
};

GLTFLoader.prototype = Object.assign(Object.create(THREE.EventDispatcher.prototype), {
  constructor: GLTFLoader,
  load: function(url, onLoad, onProgress, onError) {
    const scope = this;
    const resourcePath = THREE.LoaderUtils.extractUrlBase(url);
    
    const loader = new THREE.FileLoader(this.manager);
    loader.setPath(resourcePath);
    loader.setResponseType('arraybuffer');
    loader.load(THREE.LoaderUtils.extractUrlBase(url) + THREE.LoaderUtils.extractUrlBase(url).split('/').pop() === '' ? url.split('/').pop() : url, 
      function(data) {
        try {
          scope.parse(data, resourcePath, onLoad, onError);
        } catch(e) {
          onError(e);
        }
      },
      onProgress,
      onError
    );
  },
  parse: function(data, path, onLoad, onError) {
    // 簡易的なGLBパーサー
    const view = new DataView(data);
    const magic = String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3));
    
    if(magic !== 'glTF') {
      onError(new Error('Invalid GLB file'));
      return;
    }
    
    onError(new Error('GLTFLoader not fully implemented - use esm version'));
  }
});

if(!window.THREE) window.THREE = THREE;
window.THREE.GLTFLoader = GLTFLoader;
