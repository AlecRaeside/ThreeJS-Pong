 

    var camera, scene, renderer,
    geometry, material, mesh;

    var radius = 400;
    var theta = 0;

    window.onload=function() { init(); };

    function init() {
        stats = new Stats();
        document.body.appendChild( stats.domElement );
        scene = new THREE.Scene();

        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
       
        lights();
        camera();
        action();
        
        document.body.appendChild( renderer.domElement );

        animate();
    }
    
    function lights() {
       

        var light = new THREE.PointLight( 0xffffff,1.1,900);
        light.position = {
            x : 0,
            y : 0,
            z : 0,
        }
        scene.add( light );  
    }
    function camera() {
        camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.set( 1, 1, 1 );
        scene.add( camera );
        camera.lookAt( scene.position );
    }

    function action() {
        //To use enter the axis length
        //debugaxis(1000);

        var geometry = new THREE.CubeGeometry( 300, 300, 300 );
            
        object = new THREE.Mesh( 
                            geometry,
                            new THREE.MeshLambertMaterial({
                                ambient: 0xff0000,
                                color: 0xff0000,
                                specular:0xffffff, 
                                shininess: 20, 
                                shading: THREE.SmoothShading 
                            })
                    );
        object.doubleSided=true

        scene.add(object)
    }

    function animate() {
        requestAnimationFrame( animate );
        stats.begin();
        render();
        stats.end()
    }

    function render() {
        theta += 0.4;

        //camera.position.x = radius * Math.sin( theta * Math.PI / 360 );
        //camera.position.y = radius * Math.sin( theta * Math.PI / 360 );
        //camera.position.z = radius * Math.cos( theta * Math.PI / 360 );
        camera.lookAt( scene.position );
       
        renderer.render( scene, camera );

    }