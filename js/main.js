

var camera, scene, renderer,
geometry, material, mesh;
speed_multiplier = 15;

var player_size = {
    width:100,
    height:100
}

var radius = 400;
var theta = 0;

var pong_box = {
        width:400,
        height:400,
        depth:800
}
var sphere_radius=20;

window.onload=function() { init(); };

function init() {
    stats = new Stats();
    document.body.appendChild( stats.domElement );
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth-10, window.innerHeight-10 );
    
    scene.fog = new THREE.FogExp2( 0x000000, 0.001 );

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
        z : 0,
    }
  //  scene.add( lightmid );
    lightbehind = new THREE.PointLight( 0xffffff,1,1300);
    lightbehind.position = {
        x : 0,
        y : 0,
        z : (pong_box.depth/2)+50,
    }
    //scene.add( lightbehind );

    sphere_light= new THREE.PointLight( 0xffffff,1,500);
    sphere_light.position = {
        x : 0,
        y : 0,
        z : 0,
    }
    scene.add( sphere_light );

    var amb_light = new THREE.AmbientLight(0xffffff);
    //scene.add(amb_light)  
     
    light = new THREE.DirectionalLight( 0xffffff,0.7,400);
    light.position = new THREE.Vector3(1,1,1)
    scene.add( light );  
    light = new THREE.DirectionalLight( 0xffffff,0.7,400);
    light.position = new THREE.Vector3(-1,1,1)
    scene.add( light );
    light = new THREE.DirectionalLight( 0xffffff,0.5,400);
    light.position = new THREE.Vector3(1,-1,1)
    scene.add( light );  
    light = new THREE.DirectionalLight( 0xffffff,0.5,400);
    light.position = new THREE.Vector3(-1,-1,1)
    scene.add( light ); 
}
function camera() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( 0, 190, (pong_box.depth/2)+300 );
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
                         new THREE.CubeGeometry(player_size.width,player_size.height,3),
                        new THREE.MeshLambertMaterial({
                            
                            color: 0xffffff,
                            shading: THREE.SmoothShading 
                        })
                );
    player.material.opacity=0.2;
    player.material.transparent=true;
 
    player.position.z=pong_box.depth/2
    scene.add(player)

    sphere = new THREE.Mesh(new THREE.SphereGeometry(sphere_radius,10,10), 
         new THREE.MeshLambertMaterial({
                            ambient: 0xffffff,
                            color: 0xffffff,
                            specular:0xffffff, 
                            shininess: 10, 
                            shading: THREE.SmoothShading 
                        })
    );
    sphere.position.x=0;
    sphere.position.y=0;

    sphere.vx=(Math.random()-0.5)*(speed_multiplier/2);
    sphere.vy=(Math.random()-0.5)*(speed_multiplier/2);

    sphere.vz=(Math.random()*2-2)*speed_multiplier;
   // sphere.vz=-1;
    console.log(sphere)

    scene.add(sphere);


    player_plane = new THREE.Mesh(new THREE.PlaneGeometry(pong_box.width,pong_box.height),
                                        new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0, transparent: true })
                                    )
    player_plane.rotation.x=Math.PI/2;
    player_plane.position.z=pong_box.depth/2;

    scene.add(player_plane)
    keyboard = new THREEx.KeyboardState();
    renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );

}

var mouse2D = new THREE.Vector2(0, 0);
var mouse3D = new THREE.Vector3(0, 0, 0);
var SELECTED;

function createSide() {
    var side_geo = new THREE.CubeGeometry(pong_box.width,1,pong_box.depth)
    var side_params = {
                        ambient:0xffffff,
                        color: Math.random()*0xffffff,
                        specular:Math.random()*0xffffff, 
                        shininess:10,
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
    //setTimeout(animate,2000);
    stats.begin();

    playerMovement();

    checkCollisions();
    moveBall();
    render();
    stats.end()
}
function checkCollisions() {
    if (Math.abs(sphere.position.x) + sphere_radius >= right_side.position.x) {
        sphere.vx*=-1;
    }
    if (Math.abs(sphere.position.y) + sphere_radius >= top_side.position.y) {
        sphere.vy*=-1;
    }
    if (sphere.position.z < (pong_box.depth/2)*-1) {
        sphere.vz*=-1;
    }
    //check for player collisions
    if (sphere.vz > 0 && numCloseTo(sphere.position.z, pong_box.depth/2, 40)) {
        //console.log(Math.abs(sphere.position.z-(pong_box.depth/2)))
        var x_hit = numCloseTo(sphere.position.x, player.position.x,player_size.width);
        var y_hit = numCloseTo(sphere.position.y, player.position.y,player_size.height);
            console.log(x_hit,sphere.position.x,player.position.x)
            console.log(y_hit,sphere.position.y,player.position.y)
        if (x_hit && y_hit) {
            sphere.vz*=-1;
        }
        
    }
}


function moveBall() {

    sphere.position.x+=sphere.vx;
    sphere.position.y+=sphere.vy;
    sphere.position.z+=sphere.vz;

    sphere_light.position.x = sphere.position.x;
    sphere_light.position.y = sphere.position.y;
    sphere_light.position.z = sphere.position.z;
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
var player_move_speed = 2;
function playerMovement() {
    if (keyboard.pressed("left")) {
        player.position.x-=player_move_speed;
    }
    if (keyboard.pressed("up")) {
        player.position.y+=player_move_speed;
    }
    if (keyboard.pressed("right")) {
        player.position.x+=player_move_speed;
    }
    if (keyboard.pressed("down")) {
        player.position.y-=player_move_speed;
    }
}
function onDocumentMouseMove(event) {
    event.preventDefault();

    mouse3D.x = mouse2D.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse3D.y = mouse2D.y = -(event.clientY / window.innerHeight) * 2 + 1;
    mouse3D.z = 0.5;
    var projector = new THREE.Projector();
    projector.unprojectVector(mouse3D, camera);

    var ray = new THREE.Ray(camera.position, mouse3D.subSelf(camera.position).normalize());

    var intersects = ray.intersectObject(player_plane);

    if (intersects.length > 0) {
        intersect = intersects[0];
        player.position.x = intersect.point.x
        player.position.y = intersect.point.y
    }
}


function numCloseTo(num,target,range) {
    return num >= target-(range/2) && num <= target + (range/2);
}


