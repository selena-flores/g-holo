let video, poseNet, pose, skeleton;
let x, y = 100, z = 100, size, rThresh;
let cZ = 0, cX = 0, cY = 0;
let obj;

function preload() {
  obj = loadModel('cage.obj', true);
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  camera = createCamera();
  camera.lookAt(0, 0, 0);
  camera.setPosition(cX, cY, cZ);

  video = createCapture(VIDEO)
  video.hide();
  poseNet = ml5.poseNet(video);
  poseNet.on('pose', gotPoses);
  push();
}

function gotPoses(poses){
  if(poses.length>0){
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function draw() {
  pop();
  translate(video.width,0);
  scale(-1,1);
  background(100, 0, 0, 0);
  camera.setPosition(0, cY, cZ);

  strokeWeight(1);
  stroke(0);
  fill('rgba(100, 100, 100,.5)');

  if(pose){

    size = abs(pose.leftWrist.x-pose.rightWrist.x);
    rThresh = abs(pose.leftWrist.y-pose.rightWrist.y);

    if(size > 400){
      cZ -= 10;
    }
    if(size < 175){
      cZ += 10;
    }

    if(rThresh < 100){//is there a gradient
      if(pose.rightWrist.y < 200){
        cY += 10;
      }else if(pose.rightWrist.y > 400){
        cY -= 10;
      }
    }else{
      if(pose.rightWrist.y < 200){
        if(pose.leftWrist.y > 400){
          rotateY(millis() / 1000);
        }
        // rotateZ(-millis() / 1000);
      }else if(pose.rightWrist.y > 400){
        if(pose.leftWrist.y < 200){
          rotateY(-millis() / 1000);
        }
        rotateZ(millis() / 1000);
      }
    }
  }
  model(obj);
  push();
}
