 

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
       
        

        lightmid = new THREE.PointLight( 0xffffff,1,1000);
        lightmid.position = {
            x : 0,
            y : 0,
            z : -300,
        }
        scene.add( lightmid );  
         
        light = new THREE.DirectionalLight( 0xffffff,1);
        light.postion = {
            x:1,
            y:0,
            z:0
        }
        light.position.normalize()

        //scene.add( light );   
    }
    function camera() {
        camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.set( 40, 20, -550 );
        scene.add( camera );
        camera.lookAt( scene.position );
    }

    function action() {
        //To use enter the axis length
        debugaxis(1000);

        var geometry = new THREE.CubeGeometry( 420, 420, 420, 1, 1, 1, [], { px: true, nx: true, py: true, ny: true, pz: false, nz: false } );

        object = new THREE.Mesh( 
                            geometry,
                            new THREE.MeshPhongMaterial({
                                ambient: 0xffffff,
                                color: 0xffffff, 
                                shading: THREE.SmoothShading 
                            })
                    );
        object.doubleSided=true
        sphere = new THREE.Mesh(new THREE.SphereGeometry(20, 50, 50), 
             new THREE.MeshLambertMaterial({
                                //ambient: 0xffffff,
                                color: 0xffffff,
                                specular:0xffffff, 
                                shininess: 10, 
                                shading: THREE.SmoothShading 
                            })
        );
       // sphere.overdraw = true;
        scene.add(sphere);

        scene.add(object)
    }

    function animate() {
        requestAnimationFrame( animate );
        stats.begin();
        render();
        stats.end()
    }
    radius=50;
    function render() {
        theta += 3;
        sphere.position.z+=1;
        sphere.position.x+=1;
        sphere.position.y+=0.5;
       // light.position.x = camera.position.x = radius * Math.sin( theta * Math.PI / 360 );
       // light.position.y = camera.position.y = radius * Math.sin( theta * Math.PI / 360 );
       // light.position.z = camera.position.z = radius * Math.cos( theta * Math.PI / 360 );
        camera.lookAt( scene.position );
        sphere.position.x =  radius * Math.sin( theta * Math.PI / 360 );
        sphere.position.y = radius * Math.sin( theta * Math.PI / 360 );
        sphere.position.z = radius * Math.cos( theta * Math.PI / 360 )+100;
        camera.lookAt( scene.position );
       
        renderer.render( scene, camera );

    }