/*
SCORING
player hit: 15-(player.size/10) 
eg
if player.size=90 
then player hit= 6pts
if player.size=50
then player hit=10pts

player hit curve: curve_factor = range[1,4] pts

side hit:1pt

beat opponent: 30pts

*/


var HQ = false;

var pong = {
    player: {
        width: 100,
        height: 100,
        thickness:2,
        history: {
            x: new Array(),
            y: new Array()
        }
    },
    opponent: {
        follow_factor: {
            x:0,
            y:0
        }
    },
    box: {
        width: 500,
        height: 400,
        depth: 1000,

        side:function(size) {
            var object = new THREE.Mesh( 
                                new THREE.CubeGeometry(size,1,pong.box.depth),
                                new THREE.MeshLambertMaterial({
                                    ambient:0xffffff,
                                    color: Math.random()*0xffffff,
                                    specular:Math.random()*0xffffff, 
                                    shininess:40,
                                    shading: THREE.SmoothShading 
                                })
                            );
            pong.scene.add(object)
            return object;
        }
    },
    ball: {
        radius: 16,
        speed: 15,
        segments: 16,
        curve_factor : -350,
        velocity:{x:0,y:0,z:0},
        curve: {
            x:0,
            y:0
        },
    },
    sounds: {
        left_right: new buzz.sound("ballbounce.wav"),
        top_bottom: new buzz.sound("ballbounce.wav"),
        player: new buzz.sound("ballbounce2.mp3"),
        opponent: new buzz.sound("ballbounce2.mp3")
    },
    score:  {
        _score: 0,
        dom_el:null,
        changeScore:function(score_change) {
            this._score+=score_change;
            this.updateScore()
        },
        updateScore:function() {
            this.dom_el.html(this._score)
        }
    },
    stop:false,
    mouse2D : new THREE.Vector2(0, 0),
    mouse3D : new THREE.Vector3(0, 0, 0),
    utils: {
        numCloseTo: function(num,target,range) {
            return num >= target-(range/2) && num <= target + (range/2);
        },
        half_PI:Math.PI/2
    }

}

window.onload=function() { 
    pong.initializePage();
 }

pong.initializePage = function() {
 
    stats = new Stats();
    document.body.appendChild( stats.domElement );

    pong.scene = new THREE.Scene();

    pong.renderer = new THREE.WebGLRenderer();
    pong.renderer.setSize( window.innerWidth-10, window.innerHeight-10 );
    if (HQ) {
        pong.scene.fog = new THREE.FogExp2( 0x000000, 0.0006 );
    }

    pong.lights();
    pong.camera();
    pong.action();
    

    document.body.appendChild( pong.renderer.domElement );
    pong.renderer.domElement.style.cursor = "none"

    pong.score.dom_el = $("<div id=score></div>");
    $("body").prepend(pong.score.dom_el);

    pong.startRound();

    
}
pong.startRound = function() {
    pong.stop=false;
    var ball = pong.ball;
    pong.opponent.mesh.position.x = 0;
    pong.opponent.mesh.position.y = 0;
    ball.mesh.position.x = ball.mesh.position.y = ball.mesh.position.z = 0;
    ball.velocity.x = (Math.random()-0.5) * (ball.speed/2);
    ball.velocity.y = (Math.random()-0.5) * (ball.speed/2);
    ball.velocity.z = ball.speed * -1;
   
    pong.animate();
}


pong.lights = function() {

    light = new THREE.DirectionalLight( 0xffffff,1,400);
    light.position = new THREE.Vector3(2,1,1)
    pong.scene.add( light );  
    light = new THREE.DirectionalLight( 0xffffff,1,400);
    light.position = new THREE.Vector3(-2,1,1)
    pong.scene.add( light );
    light = new THREE.DirectionalLight( 0xffffff,0.5,400);
    light.position = new THREE.Vector3(1,-1,1)
    pong.scene.add( light );  
    light = new THREE.DirectionalLight( 0xffffff,1);
    light.position = new THREE.Vector3(-1,-1,0)
    pong.scene.add( light ); 
}


pong.camera = function () {
    pong.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
    pong.camera.position.set( 0, 0, (pong.box.depth/2)+300 );
    pong.scene.add( pong.camera );
    pong.camera.lookAt( pong.scene.position );
}

pong.action = function() {

    pong.box.left = new pong.box.side(pong.box.height);
    pong.box.top = new pong.box.side(pong.box.width);
    pong.box.right = new pong.box.side(pong.box.height);
    pong.box.bottom = new pong.box.side(pong.box.width);


    pong.box.left.position.x = - (pong.box.width/2);
    pong.box.left.rotation.z = pong.utils.half_PI;
    pong.box.top.position.y = pong.box.height/2;
    
    pong.box.right.position.x = pong.box.width/2;
    pong.box.right.rotation.z = pong.utils.half_PI;
    pong.box.bottom.position.y = (pong.box.height/2)*-1;

    pong.player.mesh = new THREE.Mesh( 
                        new THREE.CubeGeometry(pong.player.width, pong.player.height, pong.player.thickness),
                        new THREE.MeshLambertMaterial({
                            color: 0xffffff,
                            shading: THREE.SmoothShading 
                        })
                );
    pong.player.mesh.material.opacity = 0.25;
    pong.player.mesh.material.transparent = true;

    pong.player.mesh.position.z = pong.box.depth/2;
    
    pong.scene.add(pong.player.mesh)

    pong.opponent.mesh = new THREE.Mesh( 
                     new THREE.CubeGeometry(pong.player.width,pong.player.height,pong.player.thickness),
                     
                     new THREE.MeshLambertMaterial({
                        color: 0xff5555,
                        shading: THREE.SmoothShading 
                    })
            );
    pong.opponent.mesh.material.opacity=0.8;
    pong.opponent.mesh.material.transparent=true;

    pong.opponent.mesh.position.x = 0;
    pong.opponent.mesh.position.y = 0;
    pong.opponent.mesh.position.z = ((pong.box.depth/2) * -1)-3;
    pong.scene.add(pong.opponent.mesh)


    pong.ball.mesh = new THREE.Mesh(new THREE.SphereGeometry(pong.ball.radius, pong.ball.segments, pong.ball.segments), 
         new THREE.MeshLambertMaterial({
                            ambient: 0xffffff,
                            color: 0xffffff,
                            specular:0xffffff, 
                            shininess: 10, 
                            shading: THREE.SmoothShading 
                        })
    );

    pong.ball.mesh.position.x = 0;
    pong.ball.mesh.position.y = 0;

    pong.scene.add(pong.ball.mesh);

    pong.player.plane = new THREE.Mesh(new THREE.PlaneGeometry(pong.box.width,pong.box.height),
                                        new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0, transparent: true })
                                    )
    pong.player.plane.rotation.x = pong.utils.half_PI;
    pong.player.plane.position.z = pong.box.depth/2;

    pong.scene.add(pong.player.plane)
    pong.keyboard = new THREEx.KeyboardState();
    pong.renderer.domElement.addEventListener( 'mousemove', pong.mouseMove, false );

}


// ***** per frame functions *****


pong.animate = function() {
    if (!pong.stop) {
        requestAnimationFrame( pong.animate );
    } else {
        setTimeout(function() {
            pong.startRound()
        },1000)
    }
    stats.begin();
    pong.playerMovement();

    checkCollisions();
    moveBall();
    pong.renderer.render( pong.scene, pong.camera );
    stats.end()
}
function checkCollisions() {
    var ball = pong.ball.mesh;
    var player = pong.player.mesh;
    var opp = pong.opponent.mesh;


    if (Math.abs(ball.position.x) + pong.ball.radius >= pong.box.right.position.x &&
        Math.abs(ball.position.x) + pong.ball.radius - Math.abs(pong.ball.velocity.x) <= pong.box.right.position.x
        ) {
        pong.sounds.top_bottom.setVolume( getWallBounceVolume(ball.position.z) )
        pong.sounds.top_bottom.play();
        pong.ball.velocity.x*=-1;
    }
    if (Math.abs(ball.position.y) + pong.ball.radius >= pong.box.top.position.y &&
        Math.abs(ball.position.y) + pong.ball.radius - Math.abs(pong.ball.velocity.y) <= pong.box.top.position.y
        ) {
        
        pong.ball.velocity.y*=-1;
        pong.sounds.left_right.setVolume( getWallBounceVolume(ball.position.z) )
        pong.sounds.left_right.play();
    }
    if (ball.position.z < (pong.box.depth/2)*-1) {

        var x_hit = pong.utils.numCloseTo(ball.position.x, opp.position.x,pong.player.width + pong.ball.radius);
        var y_hit = pong.utils.numCloseTo(ball.position.y, opp.position.y,pong.player.height + pong.ball.radius);

        if (x_hit && y_hit) {

            pong.ball.velocity.z*=-1;

            pong.sounds.player.setVolume(18);
            pong.sounds.player.play();
            pong.ball.curve.x = 0;
            pong.ball.curve.y = 0;
        } else {
            pong.stop=true;
        }
    }
    //check for player collisions if ball is near player's movement plane
    if (pong.ball.velocity.z > 0 && pong.utils.numCloseTo(ball.position.z, pong.box.depth/2, pong.ball.speed)) {
       
        var x_hit = pong.utils.numCloseTo(ball.position.x, pong.player.mesh.position.x,pong.player.width + pong.ball.radius);
        var y_hit = pong.utils.numCloseTo(ball.position.y, pong.player.mesh.position.y,pong.player.height + pong.ball.radius);
        
        //console.log(pong.ball.curve_x,pong.ball.curve_y);

        if (x_hit && y_hit) {
            pong.score.changeScore(15-(pong.player.width/10));

            //lower is more accurate/faster movement
            pong.opponent.follow_factor.x = Math.random()*0.3;
            pong.opponent.follow_factor.y = Math.random()*0.3;
            

            var x_slide = getTotalArrayDiff(pong.player.history.x);
            var y_slide = getTotalArrayDiff(pong.player.history.y);

            //lower is more curve
            
            //console.log(x_slide/curve_factor)
            pong.ball.curve.x = x_slide/pong.ball.curve_factor;
            pong.ball.curve.y = y_slide/pong.ball.curve_factor;
            pong.ball.velocity.z*=-1;
            pong.sounds.player.setVolume(90);
            pong.sounds.player.play();
        } else {
            pong.stop=true;
        }
        
    }
}

function getTotalArrayDiff(arr) {
    var arr_len = arr.length;
    var total = 0;
    for (var i=1;i<arr_len;i++) {
       
        total += (arr[i]-arr[i-1]) / ((arr_len - i)/2);
    }
    //cap how much curve can be generated by player movement
    if (total>100) {
        total=100;
    }
    if (total < -100) {
        total=-100;
    }
    if (Math.abs(total)<20) {
        total=0;
    }
    return total;
}
function getWallBounceVolume(sphere_z) {
     return ( ( (sphere_z + (pong.box.depth/2) ) / pong.box.depth) * 45) + 15;
}


function moveBall() {
    
    pong.ball.velocity.x+=pong.ball.curve.x;
    pong.ball.velocity.y+=pong.ball.curve.y;
    pong.ball.mesh.position.x+=pong.ball.velocity.x;
    pong.ball.mesh.position.y+=pong.ball.velocity.y;
    pong.ball.mesh.position.z+=pong.ball.velocity.z;
    
    pong.opponent.mesh.position.x += pong.ball.velocity.x-(pong.opponent.follow_factor.x*pong.ball.velocity.x);
    pong.opponent.mesh.position.y += pong.ball.velocity.y-(pong.opponent.follow_factor.y*pong.ball.velocity.y);

    //pong.ball_light.position.x = pong.ball.mesh.position.x;
    //pong.ball_light.position.y = pong.ball.mesh.position.y;

    //pong.ball_light.position.z = pong.ball.mesh.position.z + pong.ball.radius+2;
    //console.log(pong.ball.mesh.position.x,pong.ball.mesh.position.y,pong.ball.mesh.position.z)
}

pong.playerMovement = function() {
    if (pong.player.history.x.length>10) {
        pong.player.history.x.shift();
    }    
    if (pong.player.history.y.length>10) {
        pong.player.history.y.shift();
    }    
    pong.player.history.x.push( pong.player.mesh.position.x )
    pong.player.history.y.push( pong.player.mesh.position.y )
}
pong.keyboardMovement = function() {
    var player_move_speed = 2;
    if (keyboard.pressed("left")) {
        pong.player.mesh.position.x-=player_move_speed;
    }
    if (keyboard.pressed("up")) {
        pong.player.mesh.position.y+=player_move_speed;
    }
    if (keyboard.pressed("right")) {
        pong.player.mesh.position.x+=player_move_speed;
    }
    if (keyboard.pressed("down")) {
        pong.player.mesh.position.y-=player_move_speed;
    }
}

pong.mouseMove = function(event) {
    event.preventDefault();

    pong.mouse3D.x = pong.mouse2D.x = (event.clientX / window.innerWidth) * 2 - 1;
    pong.mouse3D.y = pong.mouse2D.y = -(event.clientY / window.innerHeight) * 2 + 1;
    pong.mouse3D.z = 0.5;
    var projector = new THREE.Projector();
    projector.unprojectVector(pong.mouse3D, pong.camera);

    var ray = new THREE.Ray(pong.camera.position, pong.mouse3D.subSelf(pong.camera.position).normalize());

    var intersects = ray.intersectObject(pong.player.plane);

    if (intersects.length > 0) {
        var intersect = intersects[0];
        pong.player.mesh.position.x = intersect.point.x;
        pong.player.mesh.position.y = intersect.point.y;
    }
}



