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
            x:1,
            y:1
        }
    },
    box: {
        width: 550,
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
        _top_score:  0 ,
        _lives:3,
        reduceLives: function() {
            
            if (this._lives==0) {
                setTimeout(function() {
                    window.location.reload()
                },2000);
                this.lives_el.html("Game Over. Score: "+this._score).show()
            } else {
                this._lives--;
            }
            this.displayLives();
        },
        displayLives:function() {
            this.lives_el.html("Lives: "+this._lives)
        },
        total_el:null,
        top_el:null,
        ticker_el:null,
        init: function() {
            
            this._top_score = localStorage.getItem("pong-top-score") || 0;

            pong.score.dom_el = $("#score");
            pong.score.total_el = pong.score.dom_el.find("#score-total");
            pong.score.top_el = pong.score.dom_el.find("#score-top");
            pong.score.ticker_el = pong.score.dom_el.find("#score-ticker");
            pong.score.lives_el = pong.score.dom_el.find("#score-lives");

            pong.score.top_el.html("top score: "+ this._top_score )
            this.displayLives()
        },
        changeScore:function(score_change,text) {
            //console.log(score_change)
            this._score+=score_change;
            
            if (this._score>this._top_score) {
                localStorage["pong-top-score"] = this._score;
                this._top_score = this._score;
            }
            this.displayScore(score_change,text)
            if (typeof text !== "undefined") {
                this.addtoScoreTicker(score_change,text)
            }
            
        },
        displayScore:function() {
            this.total_el.html(this._score);

            if (this._score>=this._top_score) {
                //alert(1)
                this.top_el.html("top score:"+this._score)
            }
            

        },
        addtoScoreTicker: function(score_change,text) {
            
            var score_msg = $("<div class='score-ticker-msg'><span class='score-ticker-desc'>"+ text +"</span> <span class='score-ticker-pts'>"+score_change+"</span></div>")
            this.ticker_el.prepend(score_msg);
            setTimeout(function() {
               score_msg.addClass("fade")
            },2000)
            setTimeout(function() {
                 score_msg.remove();
            },4000);
        }
    },
    someone_scored:false,
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
    //pong.renderer.setSize( window.innerHeight-10, window.innerHeight-10 );
    pong.renderer.setSize( window.innerWidth, window.innerHeight );
    if (HQ) {
        pong.scene.fog = new THREE.FogExp2( 0x000000, 0.0006 );
    }

    pong.lights();
    pong.camera();
    pong.action();
    
    document.body.appendChild( pong.renderer.domElement );
    pong.renderer.domElement.style.cursor = "none"

    pong.score.init()

    $("body").prepend(pong.score.dom_el);
    pong.score.dom_el.css("left",(window.innerWidth/2) + 200)

    pong.state_el = $("#state");


    setTimeout(function() {
        pong.startRound();

        
    },1000);
    
}
pong.startRound = function() {
    console.log("start")
    pong.reset_pending = false;
    pong.stop_animation = false;
    var ball = pong.ball;
    pong.opponent.mesh.position.x = 0;
    pong.opponent.mesh.position.y = 0;
    ball.mesh.position.x = 0;
    ball.mesh.position.y = 0;
    ball.mesh.position.z = 0;
    ball.velocity.x = (Math.random()-0.5) * (ball.speed/2);
    ball.velocity.y = (Math.random()-0.5) * (ball.speed/2);
    ball.velocity.z = ball.speed * -1;

    ball.curve.x = 0;
    ball.curve.y = 0;

   $("#state").html("Go!");
   $("#state").fadeOut()
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
    //console.log(1)
    if (pong.score._lives>=0) {
    if (pong.someone_scored) {
        setTimeout(function() {
            pong.startRound();

        },2000);
        setTimeout(function() {
            pong.stop_animation = true;
            $("#state").html("Ready").show(0);
            pong.ball.mesh.position.x=0;
            pong.ball.mesh.position.y=0;
            pong.ball.mesh.position.z=0;
        },1000);
        pong.someone_scored = false;
        pong.reset_pending = true;
    }
    if (!pong.stop_animation) {
        requestAnimationFrame( pong.animate );
    }
    
    
    stats.begin();
       
        if (!pong.reset_pending) {
            pong.playerMovement();
            checkCollisions();
        }
        moveBall();
        pong.renderer.render( pong.scene, pong.camera );
    
    stats.end()
    }

    
}
function checkCollisions() {
    var ball = pong.ball.mesh;
    var player = pong.player.mesh;
    var opp = pong.opponent.mesh;

    var left_right_wall_hit = Math.abs(ball.position.x) + pong.ball.radius >= pong.box.right.position.x &&
                              Math.abs(ball.position.x) + pong.ball.radius - Math.abs(pong.ball.velocity.x) <= pong.box.right.position.x;

    var top_bottom_wall_hit = Math.abs(ball.position.y) + pong.ball.radius >= pong.box.top.position.y &&
                              Math.abs(ball.position.y) + pong.ball.radius - Math.abs(pong.ball.velocity.y) <= pong.box.top.position.y;

    //var ball_near_opponent = ball.position.z < (pong.box.depth/2)*-1;

    var ball_near_opponent = pong.ball.velocity.z < 0 && pong.utils.numCloseTo(ball.position.z, (pong.box.depth/2)*-1, pong.ball.speed);
    var ball_near_player = pong.ball.velocity.z > 0 && pong.utils.numCloseTo(ball.position.z, pong.box.depth/2, pong.ball.speed);

    if ( left_right_wall_hit ) {
        pong.sounds.top_bottom.setVolume( getWallBounceVolume(ball.position.z) )
        pong.sounds.top_bottom.play();
        pong.ball.velocity.x*=-1;
        pong.score.changeScore(1)
    }
    if ( top_bottom_wall_hit ) {
        pong.ball.velocity.y*=-1;
        pong.sounds.left_right.setVolume( getWallBounceVolume(ball.position.z) )
        pong.sounds.left_right.play();
        pong.score.changeScore(1)
    }
    if (ball_near_opponent) {

        var x_hit = pong.utils.numCloseTo(ball.position.x, opp.position.x,pong.player.width + (pong.ball.radius*1.5));
        var y_hit = pong.utils.numCloseTo(ball.position.y, opp.position.y,pong.player.height + (pong.ball.radius*1.5));

        if (x_hit && y_hit) {

            pong.ball.velocity.z*=-1;

            pong.sounds.player.setVolume(18);
            pong.sounds.player.play();
            pong.ball.curve.x = 0;
            pong.ball.curve.y = 0;
        } else {
            pong.someone_scored = true;

            pong.score.changeScore(30-(pong.player.width/10));
        }
    }

    //check for player collisions if ball is near player's movement plane
    if (ball_near_player) {
        var x_hit = pong.utils.numCloseTo(ball.position.x, player.position.x,pong.player.width + (pong.ball.radius*1.5));
        var y_hit = pong.utils.numCloseTo(ball.position.y, player.position.y,pong.player.height + (pong.ball.radius*1.5));

        if (x_hit && y_hit) {
            
            var x_slide = getTotalArrayDiff(pong.player.history.x);
            var y_slide = getTotalArrayDiff(pong.player.history.y);
 
            pong.ball.curve.x = x_slide/pong.ball.curve_factor;
            pong.ball.curve.y = y_slide/pong.ball.curve_factor;
            
            //pong.opponent.follow_factor.x = (Math.random() * 0.25) + Math.abs( pong.ball.curve.x );
            //pong.opponent.follow_factor.y = (Math.random() * 0.25) + Math.abs( pong.ball.curve.y );
            
            pong.opponent.follow_factor.x = THREE.Math.randFloat(0.85 -  Math.abs( pong.ball.curve.x ), 1.25 + Math.abs( pong.ball.curve.x ));
            pong.opponent.follow_factor.y = THREE.Math.randFloat(0.85 - Math.abs( pong.ball.curve.y ),1.25 + Math.abs( pong.ball.curve.y ));

            var points = (15-(pong.player.width/10));
            var curve_points = Math.floor( Math.abs(pong.ball.curve.x + pong.ball.curve.y) *20 ) ;
            var points_text = curve_points>0 ? "Curveball" : "Hit";
            pong.score.changeScore( points+curve_points , points_text );

            pong.ball.velocity.z*=-1;
            pong.sounds.player.setVolume(90);
            pong.sounds.player.play();
        } else {
            pong.someone_scored=true;
            pong.score.reduceLives();
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
    if (!pong.reset_pending) {
        pong.opponent.mesh.position.x += pong.opponent.follow_factor.x * pong.ball.velocity.x;
        pong.opponent.mesh.position.y += pong.opponent.follow_factor.y * pong.ball.velocity.y;
    } else {
       // pong.opponent.mesh.position.x = 2 
        //pong.opponent.mesh.position.y = 2
    }

    pong.ball.velocity.x+=pong.ball.curve.x;
    pong.ball.velocity.y+=pong.ball.curve.y;

    pong.ball.mesh.position.x+=pong.ball.velocity.x;
    pong.ball.mesh.position.y+=pong.ball.velocity.y;
    pong.ball.mesh.position.z+=pong.ball.velocity.z;
    
    


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



