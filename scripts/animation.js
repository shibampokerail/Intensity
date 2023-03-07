//this takes an object, and direction
//this changes the frames of the passed object
//array of images, animation speed

function Animate(frames_array,animation_speed = 5, once =  false){
    let has_more_than_one_state = false;
    
        if (typeof frames_array=="object"){
            has_more_than_one_state = true;
        }
    
    let no_of_frames = frames_array.length;
    let frameIndex = 0;
    let time=0;    
    this.once = once;
    this.over = false;
    this.reset =  function(){
        this.over =  false;
        frameIndex = 0;
    }
    
    
    this.change_frames=function(hit=false){
        //for this function to work create a frameToShow variable that changes the image in draw function
        //need to pass the frame to show variable by reference
        if (!this.over){let frameSpeed = animation_speed;
    
        if (time > frameSpeed) {
            
            // move to the next index in the array
            if (this.over==false){
                frameIndex += 1;
            }
        
            // keep the frame index within the range 0 to 
            if (frameIndex == frames_array.length) {
                if (!this.once){
                      frameIndex = 0;
                } else {
                    console.log("once");
                    this.over= true;
                }
            }
            // reset frame timer
            time = 0;
            // console.log(frameToShow);
            // this.img=image(direction[frameToShow], this.x,this.y);
            
        // console.log(frameIndex); // here we can see that the frameIndex are being changed 
          }
          time++;
        }//--------

    };
    this.frame= function(){
        if (this.over){
            return frames_array.length-1;
        } else {
        return frameIndex;
        }
    }
    


}
