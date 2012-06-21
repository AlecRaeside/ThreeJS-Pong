 

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
            z : 300,
        }
        scene.add( lightmid );  
         
        light = new THREE.DirectionalLight( 0xffffff,1);
        light.postion = {
            x:1,
            y:101,
            z:1
        }
        light.position.normalize()

       // scene.add( light );   
    }
    function camera() {
        camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.set( 10, 110, 700 );
        scene.add( camera );
        camera.lookAt( scene.position );
    }

    function action() {
        //To use enter the axis length
        //debugaxis(1000);
        var left_side = createSide();
        var top_side = createSide();
        var right_side = createSide();
        var bottom_side = createSide();
        solid_objects=[left_side,top_side,right_side,bottom_side]

        left_side.position.x=-200;
        left_side.rotation.z=Math.PI/2;
        top_side.position.y=200;
        
        right_side.position.x=200;
        right_side.rotation.z=Math.PI/2;
        bottom_side.position.y=-200;

        sphere = new THREE.Mesh(new THREE.SphereGeometry(20, 50, 50), 
             new THREE.MeshLambertMaterial({
                                //ambient: 0xffffff,
                                color: 0xffffff,
                                specular:0xffffff, 
                                shininess: 10, 
                                shading: THREE.SmoothShading 
                            })
        );
        sphere.position.x=110;
        sphere.position.y=100;


        scene.add(sphere);
       
    }

    function createSide() {
        var side_geo = new THREE.CubeGeometry(400,22,800)
        var side_params = {
                            ambient: 0xffffff,
                            color: 0xffffff, 
                            shading: THREE.SmoothShading 
                        }

        object = new THREE.Mesh( 
                            side_geo,
                            new THREE.MeshPhongMaterial(side_params)
                    );
         scene.add(object)
        return object;
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
        //sphere.position.x+=sphere.vx;
        //sphere.position.y+=sphere.vy;
        //sphere.position.z+=sphere.vz;
        //camera.lookAt( scene.position );
       
        renderer.render( scene, camera );

    }
