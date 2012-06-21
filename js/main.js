 

    var camera, scene, renderer,
    geometry, material, mesh;

    var radius = 400;
    var theta = 0;

    var pong_box = {
            width:400,
            height:400,
            depth:800
    }

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
            z : 500,
        }
        //scene.add( lightmid );

        var amb_light = new THREE.AmbientLight(0xffffff);
        scene.add(amb_light)  
         
        light = new THREE.DirectionalLight( 0xffffff,1);
        light.postion = {
            x:1,
            y:101,
            z:1
        }
        light.position.normalize()

        //scene.add( light );   
    }
    function camera() {
        camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.set( 10, 110, (pong_box.depth/2)+200 );
        scene.add( camera );
        camera.lookAt( scene.position );
    }

    function action() {
        //To use enter the axis length
        //debugaxis(1000);

        left_side = createSide();
        top_side = createSide();
        right_side = createSide();
        bottom_side = createSide();

        left_side.position.x=-200;
        left_side.rotation.z=Math.PI/2;
        top_side.position.y=200;
        
        right_side.position.x=200;
        right_side.rotation.z=Math.PI/2;
        bottom_side.position.y=-200;

        player = new THREE.Mesh( 
                             new THREE.CubeGeometry(40,40,1),
                            new THREE.MeshLambertMaterial({
                                ambient: 0x0000ff,
                                color: 0x0000ff,
                                shading: THREE.SmoothShading 
                            })
                    );
        player.material.opacity=0.3;
        player.position.z=pong_box.depth/2
        scene.add(player)

        sphere = new THREE.Mesh(new THREE.SphereGeometry(20, 50, 50), 
             new THREE.MeshLambertMaterial({
                                ambient: 0xffffff,
                                color: 0xffffff,
                                specular:0xffffff, 
                                shininess: 10, 
                                shading: THREE.SmoothShading 
                            })
        );
        sphere.position.x=110;
        sphere.position.y=100;

        sphere.vx=Math.random()-0.5;
        sphere.vy=Math.random()-0.5;
        sphere.vz=Math.random()-0.5;

        scene.add(sphere);
  
    }

    function createSide() {
        var side_geo = new THREE.CubeGeometry(pong_box.width,2,pong_box.depth)
        var side_params = {
                            ambient: Math.random()*0xffffff,
                            color: Math.random()*0xffffff,
                            specular:Math.random()*0xffffff, 
                            shading: THREE.SmoothShading 
                        }

        object = new THREE.Mesh( 
                            side_geo,
                            new THREE.MeshLambertMaterial(side_params)
                    );
         scene.add(object)
        return object;
    }

    function animate() {
        requestAnimationFrame( animate );
       //setTimeout(animate,2000);
        stats.begin();
        checkCollisions()
        moveBall();
        render();
        stats.end()
    }
    function checkCollisions() {
        if (Math.abs(sphere.position.x) >= right_side.position.x) {
            sphere.vx*=-1;
        }
        if (Math.abs(sphere.position.y) >= top_side.position.y) {
            sphere.vy*=-1;
        }
    }

    speed_multiplier = 10;
    function moveBall() {

        sphere.position.x+=sphere.vx*speed_multiplier;
        sphere.position.y+=sphere.vy*speed_multiplier;
        sphere.position.z+=sphere.vz*speed_multiplier;
        //console.log(sphere.position.x,sphere.position.y,sphere.position.z)
    }

    radius=50;

    function render() {
        theta += 3;
        //sphere.position.x+=sphere.vx;
        //sphere.position.y+=sphere.vy;
        //sphere.position.z+=sphere.vz;
        //camera.lookAt( scene.position );
       
        renderer.render( scene, camera );

    }

