 

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
       
        var corner_intensity = 1;
        lightTL = new THREE.PointLight( 0xffffff,corner_intensity,600);
        lightTL.position = {
            x : -100,
            y : 100,
            z : 00,
        }
        lightTR = new THREE.PointLight( 0xffffff,corner_intensity,300);
        lightTR.position = {
            x : 100,
            y : 100,
            z : 00,
        }
        lightBL = new THREE.PointLight( 0xffffff,corner_intensity,300);
        lightBL.position = {
            x : -100,
            y : -100,
            z : 0,
        }
        lightBR = new THREE.PointLight( 0xffffff,corner_intensity,300);
        lightBR.position = {
            x : 100,
            y : -100,
            z : 0,
        }
        //scene.add( lightTL );

        lightmid = new THREE.PointLight( 0xffffff,1,300);
        lightmid.position = {
            x : 0,
            y : 0,
            z : 0,
        }
        scene.add( lightmid );  
        //scene.add( lightTR );  
        //scene.add( lightBL );  
        //scene.add( lightBR );  

        //light = new THREE.DirectionalLight( 0xffffff,0.11);
        //light.position = {
         //   x : 0,
            //y : 0,
           // z : -10,
       // }
       // scene.add( light );
   // light = new THREE.AmbientLight( 0xffffff);

     //   scene.add( light );   
    }
    function camera() {
        camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.set( 40, 20, -320 );
        scene.add( camera );
        camera.lookAt( scene.position );
    }

    function action() {
        //To use enter the axis length
        debugaxis(1000);

        var geometry = new THREE.CubeGeometry( 220, 220, 220, 1, 1, 1, [], { px: true, nx: true, py: true, ny: true, pz: false, nz: false } );

        object = new THREE.Mesh( 
                            geometry,
                            new THREE.MeshPhongMaterial({
                                //ambient: 0xff0000,
                                color: 0xeeeeee,
                                specular:0xeeeeee, 
                                shininess: 3, 
                                shading: THREE.SmoothShading 
                            })
                    );
        object.doubleSided=true
        sphere = new THREE.Mesh(new THREE.SphereGeometry(20, 50, 50), 
             new THREE.MeshLambertMaterial({
                                ambient: 0xffffff,
                                color: 0xffffff,
                                specular:0xffffff, 
                                shininess: 10, 
                                shading: THREE.SmoothShading 
                            })
        );
        sphere.overdraw = true;
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