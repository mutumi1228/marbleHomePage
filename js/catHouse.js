document.addEventListener('DOMContentLoaded', function() {
    console.log('catHouse.js loaded');
    console.log('THREE available:', typeof THREE !== 'undefined');
    console.log('GLTFLoader available:', typeof THREE.GLTFLoader !== 'undefined');

    const container = document.getElementById('catHouse-container');

    if (!container) {
        console.error('ERROR: catHouse-container element not found');
        return;
    }

    console.log('Container found:', container);
    console.log('Container dimensions:', container.clientWidth, 'x', container.clientHeight);

    try {
        const scene = new THREE.Scene();
        scene.background = null;  // 透明な背景

        const width = container.clientWidth || 300;
        const height = container.clientHeight || 300;

        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        renderer.setSize(width, height);
        renderer.setClearColor(0x000000, 0);  // 透明
        container.appendChild(renderer.domElement);

        console.log('Three.js setup complete');

        // ライト
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // テスト用キューブ
        const testGeometry = new THREE.BoxGeometry(1, 1, 1);
        const testMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const testCube = new THREE.Mesh(testGeometry, testMaterial);
        scene.add(testCube);
        camera.position.z = 3;

        let modelLoaded = false;
        let animatingModel = null;

        // GLTFLoaderでGLBファイルを読み込み
        if (typeof THREE.GLTFLoader !== 'undefined') {
            const loader = new THREE.GLTFLoader();
            console.log('Loading catHouse.glb...');
            
            loader.load(
                '../models/catHouse.glb',
                (gltf) => {
                    console.log('✓ Model loaded successfully!');
                    const model = gltf.scene;
                    
                    // モデルのバウンディングボックスを計算
                    const box = new THREE.Box3().setFromObject(model);
                    const size = box.getSize(new THREE.Vector3());
                    const center = box.getCenter(new THREE.Vector3());
                    
                    console.log('Model size:', size);
                    console.log('Model center:', center);
                    
                    // モデルをセンターに配置
                    model.position.sub(center);
                    
                    // スケール調整（最大サイズが2になるように）
                    const maxDim = Math.max(size.x, size.y, size.z);
                    const scale = 2 / maxDim;
                    model.scale.multiplyScalar(scale);
                    
                    console.log('Model scale:', scale);
                    
                    // シーンからテストキューブを削除
                    scene.remove(testCube);
                    
                    // モデルを追加
                    scene.add(model);
                    
                    modelLoaded = true;
                    animatingModel = model;
                    
                    // カメラ位置を調整
                    camera.position.z = 5;
                    
                    console.log('✓ Model added to scene and scaled');
                },
                (progress) => {
                    const percent = (progress.loaded / progress.total * 100).toFixed(0);
                    console.log('Loading:', percent + '%');
                },
                (error) => {
                    console.error('✗ Error loading model:', error);
                    console.error('Error details:', error.message);
                    console.error('Stack:', error.stack);
                    
                    // ページにもエラーを表示
                    const errorDiv = document.createElement('div');
                    errorDiv.style.color = 'red';
                    errorDiv.style.padding = '10px';
                    errorDiv.style.background = 'rgba(0,0,0,0.5)';
                    errorDiv.innerHTML = 'Model load error: ' + error.message;
                    container.appendChild(errorDiv);
                }
            );
        } else {
            console.warn('⚠ GLTFLoader not available - showing fallback cube');
        }

        // アニメーションループ
        const animate = () => {
            requestAnimationFrame(animate);
            
            if (modelLoaded && animatingModel) {
                animatingModel.rotation.y += 0.01;
            } else {
                testCube.rotation.x += 0.01;
                testCube.rotation.y += 0.01;
            }
            
            renderer.render(scene, camera);
        };
        animate();

    } catch (e) {
        console.error('Error in catHouse.js:', e.message);
        console.error(e.stack);
    }
});