

var camera, scene, renderer,
geometry, material, mesh;
sphere_speed=1;
speed_multiplier = 15;

var player_size = {
    width:100,
    height:100
}

var score = 0;

var radius = 400;
var theta = 0;

var pong_box = {
        width:500,
        height:400,
        depth:1200
}
var sphere_radius=20;

var ball_sound0 = new buzz.sound("ballbounce.wav");
var ball_sound1 = new buzz.sound("ballbounce.wav");
var ball_sound2 = new buzz.sound("ballbounce2.mp3");
ball_sound2.setVolume( 20 )
var player_ball_sound = new buzz.sound("ballbounce2.mp3");

window.onload=function() { init(); };

function init() {
    stats = new Stats();
    document.body.appendChild( stats.domElement );

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth-10, window.innerHeight-10 );
    
    scene.fog = new THREE.FogExp2( 0x000000, 0.0006 );

    lights();
    camera();
    action();
    

    document.body.appendChild( renderer.domElement );
    renderer.domElement.style.cursor = "none"

    score_el = $("<div id=score></div>");
    $("body").prepend(score_el);

    animate();
}

function lights() {

   
    lightbehind = new THREE.PointLight( 0xffffff,1,1900);
    lightbehind.position = {
        x : 0,
        y : 0,
        z : (pong_box.depth/2)+50,
    }
    //scene.add( lightbehind );

    sphere_light= new THREE.PointLight( 0xffffff,1,900);
    sphere_light.position = {
        x : 0,
        y : 0,
        z : 0,
    }
    scene.add( sphere_light );

    var amb_light = new THREE.AmbientLight(0xffffff);
    //scene.add(amb_light)  
     
    light = new THREE.DirectionalLight( 0xffffff,0.7,400);
    light.position = new THREE.Vector3(2,1,1)
    scene.add( light );  
    light = new THREE.DirectionalLight( 0xffffff,0.7,400);
    light.position = new THREE.Vector3(-2,1,1)
    scene.add( light );
    light = new THREE.DirectionalLight( 0xffffff,0.5,400);
    light.position = new THREE.Vector3(1,-1,1)
    //scene.add( light );  
    light = new THREE.DirectionalLight( 0xffffff,0.5,400);
    light.position = new THREE.Vector3(-1,-1,1)
    //scene.add( light ); 
}
function camera() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( 0, 0, (pong_box.depth/2)+300 );
    scene.add( camera );
    camera.lookAt( scene.position );
}

function action() {
    //To use enter the axis length
    //debugaxis(1000);

    left_side = createSide(pong_box.height);
    top_side = createSide(pong_box.width);
    right_side = createSide(pong_box.height);
    bottom_side = createSide(pong_box.width);

    left_side.position.x=-(pong_box.width/2);
    left_side.rotation.z=Math.PI/2;
    top_side.position.y=pong_box.height/2;
    
    right_side.position.x=pong_box.width/2;
    right_side.rotation.z=Math.PI/2;
    bottom_side.position.y=(pong_box.height/2)*-1;

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

    player.x_history = new Array();
    player.y_history = new Array();




    opponent = new THREE.Mesh( 
                     new THREE.CubeGeometry(player_size.width,player_size.height,3),
                    new THREE.MeshLambertMaterial({
                        color: 0xff5555,
                        shading: THREE.SmoothShading 
                    })
            );
    opponent.material.opacity=0.8;
    opponent.material.transparent=true;
    
    opponent.position.z = ((pong_box.depth/2) * -1)-3
    scene.add(opponent)


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
    //sphere.vx=0;
    //sphere.vy=0;

    sphere.vz=(sphere_speed*-1)*speed_multiplier;
   // sphere.vz=-1;
    sphere.curve_x = 0;
    sphere.curve_y = 0;

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

function createSide(size) {
    var side_geo = new THREE.CubeGeometry(size,1,pong_box.depth)
    var side_params = {
                        ambient:0xffffff,
                        color: Math.random()*0xffffff,
                        specular:Math.random()*0xffffff, 
                        shininess:40,
                        shading: THREE.SmoothShading 
                    }

    object = new THREE.Mesh( 
                        side_geo,
                        new THREE.MeshPhongMaterial(side_params)
                );
     scene.add(object)
    return object;
}


// ***** per frame functions *****


function animate() {
    if (sphere.position.z < (pong_box.depth/2)+100) {
        requestAnimationFrame( animate );
    }
    //setTimeout(animate,500);
    stats.begin();
   // console.log()
    playerMovement();

    checkCollisions();
    moveBall();
    render();
    stats.end()
}
function checkCollisions() {
    if (Math.abs(sphere.position.x) + sphere_radius >= right_side.position.x &&
        Math.abs(sphere.position.x) + sphere_radius - Math.abs(sphere.vx) <= right_side.position.x
        ) {
        ball_sound0.setVolume( getWallBounceVolume(sphere.position.z) )
        ball_sound0.play();
        sphere.vx*=-1;
    }
    if (Math.abs(sphere.position.y) + sphere_radius >= top_side.position.y &&
        Math.abs(sphere.position.y) + sphere_radius - Math.abs(sphere.vy) <= top_side.position.y
        ) {
        
        sphere.vy*=-1;
        ball_sound1.setVolume( getWallBounceVolume(sphere.position.z) )
        ball_sound1.play();
    }
    if (sphere.position.z < (pong_box.depth/2)*-1) {
        sphere.vz*=-1;
        ball_sound2.play();
        sphere.curve_x = 0;
        sphere.curve_y = 0;
    }
    //check for player collisions if ball is near player's movement plane
    if (sphere.vz > 0 && numCloseTo(sphere.position.z, pong_box.depth/2, speed_multiplier)) {
       
        var x_hit = numCloseTo(sphere.position.x, player.position.x,player_size.width + sphere_radius);
        var y_hit = numCloseTo(sphere.position.y, player.position.y,player_size.height + sphere_radius);
        
        //console.log(sphere.curve_x,sphere.curve_y);

        if (x_hit && y_hit) {
            score++;
            score_el.html(score);

            var x_slide = getTotalArrayDiff(player.x_history);
            var y_slide = getTotalArrayDiff(player.y_history);

            //lower is more curve
            var curve_factor = 400*-1;
            //console.log(x_slide/curve_factor)
            sphere.curve_x = x_slide/curve_factor;
            sphere.curve_y = y_slide/curve_factor;
            console.log(sphere.curve_x,sphere.curve_y);

            sphere.vz*=-1;
            player_ball_sound.play();
        }
        
    }
}

function getTotalArrayDiff(arr) {

    var arr_len = arr.length;
    var total = 0;
    for (var i=1;i<arr_len;i++) {
       
        total += (arr[i]-arr[i-1]) / ((arr_len - i)/3);
    }
    //cap how much curve can be generated by player movement
    if (total>100) {
        //total=100;
    }
    if (total < -100) {
        //total=-100;
    }
    if (Math.abs(total)<20) {
        total=0;
    }
    return total;
}
function getWallBounceVolume(sphere_z) {
     return ( ( (sphere_z + (pong_box.depth/2) ) / pong_box.depth) * 45) + 15;
}


function moveBall() {
    sphere.vx+=sphere.curve_x;
    sphere.vy+=sphere.curve_y;
    sphere.position.x+=sphere.vx;
    sphere.position.y+=sphere.vy;
    sphere.position.z+=sphere.vz;


    opponent.position.x = sphere.position.x;
    opponent.position.y = sphere.position.y;

    sphere_light.position.x = sphere.position.x;
    sphere_light.position.y = sphere.position.y;

    sphere_light.position.z = sphere.position.z + sphere_radius+2;
    //console.log(sphere.position.x,sphere.position.y,sphere.position.z)
}

radius=50;

function render() {
    theta += 3;
   
    renderer.render( scene, camera );

}

var player_move_speed = 2;

function playerMovement() {

    if (player.x_history.length>10) {
        player.x_history.shift();
    }    
    if (player.y_history.length>10) {
        player.y_history.shift();
    }    
    player.x_history.push(player.position.x)
    player.y_history.push(player.position.y)


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
        //console.log(player.position.x,intersect.point.x)
        

        player.position.x = intersect.point.x;
        player.position.y = intersect.point.y;
    }



}


function numCloseTo(num,target,range) {
    return num >= target-(range/2) && num <= target + (range/2);
}
