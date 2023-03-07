var plyr;
let connected = false;
var enemy;
var enemies = []; // do not change this variable
var attacks = [];
var health_pickups = [];
var img=[];
var bullet_sound;
var walk_sound;
var title_sound;
var frameToShow=0; //do not attempt to change this variable
//frame to show variable will be channged in plyr.js to make the character when key is pressed
let no_of_enemies =50;
let no_of_health_pickups = 30;
let bgImage;//do not change this variaable
let crosshair_image;
let collect_colliders = [{x:0,y:0,w:0,h:0}];
let debug_colliders = false;  

let map_depth; 

let animate_enemy=[];
let animate_health_pickups=[];

let nativeWidth = 1536;//this is the width of the computer that this game was made on
let nativeHeight = 763;//this is the height of the computer that this game was made on
let adjustDeviceColliderX;
let adjustDeviceColliderY;

let is_phone = false;
let phone_movement ="";
let renderUI;
let renderMenu;
var titleFont;
var basicFont;
let onMainMenu = true;
let bloodSplash;
let animate_bloodSplash;
let time_ = 0;
let dead_enemy_pos = {x:0,y:0}
// let rain_timer = parseInt(Math.random()*2000);
function preload(){
    titleFont = loadFont('assets/font/Nos.ttf');
    basicFont = loadFont('assets/font/stat.ttf');
     plyr = new Character();
     plyr.init_images("assets/character/images/",4);
     img = plyr.images_right;//starting image direction
     plyr.direction = 'r'; //.direction is needed for projectile direction when pressing space
     plyr.x=windowWidth/2;
     plyr.y=windowHeight/2;
     console.log(windowWidth);
    //  walk_sound = loadSound('assets/sound/walk.mp3');
     title_sound = loadSound('assets/sound/titlescreen.mp3');
     bullet_sound = loadSound('assets/sound/gunshot.mp3');
     enemy = loadImage("assets/enemy/idle/enemy (1).png"); 
     bgImage = new Map("map_main.jpg",0,0);
     bgImage.init()
     crosshair_image = loadImage("assets/crosshair.png"); 
     renderUI = new RenderUI(plyr);
     renderUI.init_images('assets/ui/');
     renderMenu = new MenuScreen();
     generateEnemy(50);
     for (let i=0;i<no_of_health_pickups;i++){
        health_pickups[i] = new characterEssentials(Math.random()*4000, Math.random()*4000, "health_pack"); 
        // enemies[i].init_images();
        health_pickups[i].init_images();
        animate_health_pickups[i] = new Animate(health_pickups[i].images, 5);
     }
     bloodSplash = new bloodParticles(0,0);
     bloodSplash.init_images();
     animate_bloodSplash = new Animate(bloodSplash.images, 9, true);
     ;
    adjustDeviceColliderX = (windowWidth-nativeWidth)/2;
    adjustDeviceColliderY = (windowHeight-nativeHeight)/2;


    // map_depth = loadImage("assets/maps/map_main_depth.png"); 
    }

function setup(){
    
    // console.log(windowWidth, windowHeight);
    
    // not connecting to firebase at the moment
    // connectPlayer();
    // livePlayersInfo();
    // livePlayersConnection();

    noCursor();
    createCanvas(windowWidth, windowHeight);
    
    let attack_width_pos=width/2+30;
    let attack_height_pos = height;
    if (plyr.direction=='u'){
        attack_height_pos = height+20;
    }
    attack = new Attack(width/2+30,attack_height_pos);
    
    // ellipse(mouseX, mouseY, 10, 10);
}
function sortEnemy()
{
    enemies = enemies.sort(
        (e1, e2) => (e1.y >e2.y) ? 1 : (e1.y < e2.y) ? -1 : 0);
    
}
function generateEnemy(number)
{
    for (let i=0;i<number;i++){
        let enemy = new Enemy(Math.random()*4000,Math.random()*4000); 
        // enemies[i].init_images();
        enemy.init_goblin_images("/assets/enemy/goblin",6);
        anim_enemy = new Animate(enemy.images_front, 2);
        enemies.push(enemy);
        animate_enemy.push(anim_enemy);
     }
}
function draw(){
    // console.log("chill");
    
    connected = true;//not connecting to firebase at the moment
    // $(window).blur(function() {
    //     console.log("inactive Window")
    //     // connected = false;
    //     background(51);
    // });
    var playerId = false;
    let playerObj = {};
    let c = color('green');
  
    // Use fill() function to fill color
    fill(c);
    
    // Draw a rectangle
    
    
    if (getPlayerId()!="")
    {
         playerId=getPlayerId();
         connected = true;
         playerObj =onlinePlayer.info;
    }
    
    // background(bgImage.img);
    background(24,20,37);
    if (connected)
    {
    bgImage.show();
    bgImage.activate_colliders(bgImage.x,bgImage.y);
    bgImage.activate_events(bgImage.x,bgImage.y);
    
    let playerRendered = false;
    sortEnemy();
    
    
    var edge = false;
    
    
    if (bgImage.saved_settings[bgImage.name].enemiesCount>0)
    
    
    {   

     
        for (let i=0;i<health_pickups.length;i++){
        
            health_pickups[i].show(health_pickups[i].images[animate_health_pickups[i].frame()], animate_health_pickups[i].frame());
            animate_health_pickups[i].change_frames();
            health_pickups[i].activate();
            if (health_pickups[i].used){
                health_pickups.splice(i,1);
            }
        }

        
        for (let i=0;i<enemies.length;i++){
        
        if(plyr.y < enemies[i].y +20 && !playerRendered)
        {
            playerRendered = true;
            plyr.show(img[frameToShow],plyr.x,plyr.y);
        }  
        
        enemies[i].show(enemies[i].images_front[animate_enemy[i].frame()]);
        // animate_enemy[i].display();
        animate_enemy[i].change_frames();
        if(!onMainMenu)
        {
        enemies[i].move();

        }
        
    }

}
    
    if(!playerRendered)
    {
        
        plyr.show(img[frameToShow],plyr.x,plyr.y);  
    }
    if (bgImage.saved_settings[bgImage.name].depth.path!=""){
        bgImage.show_depth(bgImage.x,bgImage.y);
    }
    if (time_==0 && dead_enemy_pos.x!=0 && dead_enemy_pos.y!=0){
        console.log("okay");
        bloodSplash.show(bloodSplash.images[animate_bloodSplash.frame()],bgImage.x+dead_enemy_pos.x,bgImage.y+dead_enemy_pos.y);
    }
    animate_bloodSplash.change_frames();
    

   for (let i=0;i<attacks.length;i++){
            attacks[i].show();
            attacks[i].move();
            for (let j=0;j<enemies.length;j++){
                if (attacks[i].hits(enemies[j])){
                    enemies[j].health-=1;
                    if (enemies[j].health<1){
                        dead_enemy_pos.x = enemies[j].x;
                        dead_enemy_pos.y = enemies[j].y;
                        enemies.splice(j,1);
                        generateEnemy(1);
                        time_ = 0;
                    } 
                    attacks[i].evaporate();
                }
            }
    }
    time_++
   for (let i=(attacks.length-1);i>=0;i--){
        if (attacks[i].toDelete){
            attacks.splice(i,1);
        }
    }
    
        if (keyIsDown(RIGHT_ARROW) || keyIsDown(68) || phone_movement=="r"){ //68 is d in wasd
            //Pass enemies array to function to modify it's x and y value
            plyr.moveRight(enemies);
            img = plyr.images_right;
            
            onlinePlayer.info.x = plyr.x;
            onlinePlayer.info.y = plyr.y;
            // updatePlayer(playerObj);           
        } else  if (keyIsDown(LEFT_ARROW)|| keyIsDown(65)){
            plyr.moveLeft(enemies);
            img = plyr.images_left;
            onlinePlayer.info.x = plyr.x;
            onlinePlayer.info.y = plyr.y;
            // updatePlayer(playerObj);
        } else  if (keyIsDown(UP_ARROW) || keyIsDown(87)){
            plyr.moveUp(enemies);
            img = plyr.images_back;
            onlinePlayer.info.x = plyr.x;
            onlinePlayer.info.y = plyr.y;
            // updatePlayer(playerObj);
        } else  if (keyIsDown(DOWN_ARROW)|| keyIsDown(83) || phone_movement=="l"){
            img = plyr.images_front;
            plyr.moveDown(enemies);
            onlinePlayer.info.x = plyr.x;
            onlinePlayer.info.y = plyr.y;
            // updatePlayer(playerObj);
        }
        if (keyIsDown(SHIFT)){
                plyr.movement_speed = 10;    
        }
        if (keyIsDown(76)){
            debug_colliders = true;
        }
            // console.log(bgImage.x, bgImage.y);

            
    }
    // console.log(winMouseX, winMouseY);
    // ellipse(mouseX,mouseY, 50,50);
    
    
    if (bgImage.saved_settings[bgImage.name].weather){
        renderUI.renderRainParticles();
        
    } 
   
    renderUI.renderHealth();
    if(onMainMenu)
    {   
        if (!(title_sound.isPlaying())){
            title_sound.loop();
        }
        renderMenu.show();
    } else {
        if ((title_sound.isPlaying())){
            title_sound.stop();
        }
    }
    image(crosshair_image, mouseX-25,mouseY-25, 50,50);

    

}

function keyReleased(){
    // walk_sound.stop();
    frameToShow = 0;
    plyr.movement_speed = plyr.default_speed;
    debug_colliders = false;
}

function mousePressed(){
    
    if (!is_phone && bgImage.saved_settings[bgImage.name].type=="hostile"){
        if (plyr.health>0){
            bullet_sound.play();
    if (!onMainMenu){
        bullet_sound.play();
        cameraShake(10,30);
        var attack = new Attack(plyr.x+60,plyr.y+20, plyr.direction, mouseX, mouseY, true);
        attacks.push(attack);
        plyr.change_frames(true);}
    }        
    
    }
    if(onMainMenu)
    {
        renderMenu.handleSelect();
    }
        // console.log("attack start",plyr.x,plyr.y);
}

function mouseDragged(){
    //for machine gun
    // var audio = new Audio('/assets/sound/gunshot.mp3');
    // audio.play();
    if (plyr.health>0 && bgImage.saved_settings[bgImage.name].type=="hostile" && !onMainMenu){
    // cameraShake(10,30);
    // var attack = new Attack(plyr.x+60,plyr.y+20, plyr.direction, mouseX, mouseY, true);
    //     attacks.push(attack);
    //     plyr.change_frames(true);
    //     console.log("attack start",plyr.x,plyr.y);
}}

function mouseReleased(){
    
    frameToShow = 0;
    // if (bullet_sound.isPlaying()) {
    //     // .isPlaying() returns a boolean
        
        
    //   }
    is_phone = false;
}


function keyPressed(){
    // walk_sound.play();
    
    // if (key===" "){
    //     var attack = new Attack(plyr.x+60,plyr.y+20, plyr.direction);
    //     attacks.push(attack);
    //     plyr.change_frames(true);
    // }

    if (key=="q"){
        if (collect_colliders.at(-1).x==0 && collect_colliders.at(-1).y==0){
            collect_colliders.at(-1).x = bgImage.x - adjustDeviceColliderX;
            collect_colliders.at(-1).y = bgImage.y - adjustDeviceColliderY; 
            console.log(collect_colliders.at(-1));
        } else {
            collect_colliders.at(-1).w = bgImage.x - adjustDeviceColliderX;
            collect_colliders.at(-1).h = bgImage.y - adjustDeviceColliderY;
            console.log(collect_colliders.at(-1));
            let colors =["red","blue","green","pink","yellow"]
            // if (debug_colliders){
                collect_colliders.at(-1)["color"]=color(colors[Math.floor(Math.random() * colors.length)]);
        // }
            bgImage.saved_settings[bgImage.name].colliders.push(collect_colliders.at(-1));
            
            collect_colliders.push({x:0,y:0,w:0,h:0})
            
        }
    }
    if (key=="e" && collect_colliders.length>=2){
        collect_colliders.pop()
        if (!(collect_colliders.at(-1).w==0 && collect_colliders.at(-1).h==0)){
        bgImage.saved_settings[bgImage.name].colliders.pop();}
        console.log(collect_colliders.at(-1));
        collect_colliders.push({x:0,y:0,w:0,h:0})
    }

    if (key=="z"){
        console.log(bgImage.x,bgImage.y);
        
    }
    
}