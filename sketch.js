var dog , sadDog , happyDog,database,foodS,foodStockRef,database;
var frameCountNow = 0;
var fedTime, lastFed, foodObj,currentTime, createName;
var milk, input, name;
var gameState="hungry";
var gameStateRef;
var bedroomImg, gardenImg, washroomImg,lazyImg,runImg;
var feed, addFood;
var input, button;

function preload(){
	sadDog = loadImage("Dog.png");
  happyDog = loadImage("happy dog.png");
  backgroundImg = loadImage("background.jpg");
  bedroomImg=loadImage("Bed Room.png");
  gardenImg=loadImage("Garden.png");
  washroomImg=loadImage("Wash Room.png");
  lazyImg=loadImage("Lazy.png");
  runImg=loadImage("running.png");

}

function setup() {
	 database = firebase.database();
   createCanvas(1000,400);

   foodObj = new Food();

   foodStock = database.ref('Food');
   foodStock.on("value" , readStock);

   dog = createSprite (800,200,150,150);
   dog.addAnimation("hungry",sadDog);
   dog.addAnimation("happy",happyDog);
   dog.addAnimation("sleepingImg".lazyImg);
   dog.addAnimation("run",runImg);
   dog.scale=0.15;

   foodObj.getFoodStock(foodS);

   feed=createButton("Feed the dog");
   feed.position(700,95);
   feed.mousePressed(feedDog);

   addFood=createButton("Add Food")
   addFood.position(800,95);
   addFood.mousePressed(addFoods);
   
   input = createInput("Pet name")
   input.position(950,120);

   button = createButton("Confirm");
   button.position(700,145);
   button.mousePressed(createName);

   




}


function draw() {  
  background(backgroundImg);
  currentTime = hour();
  foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function (data) {
  lastFed = data.val(); 

   })

  fill(255,255,254);
  textSize(15);
   
  if(currentTime === lastFed + 1 ){
    gameState = "playing";
    updateFoodStock();
    foodObj.garden();
   }
  else if(currentTime === lastFed + 2){
    gameState ="sleeping";
    updateFoodStock();
    foodObj.bedroom();  
 
 }
  else if(currentTime > lastFed +2 && currentTime <=lastFed + 4){
    gameState = "bathing";
    updateFoodStock();
    foodObj.display();
  }
  else {
    gameState="hungry";
    foodObj.updateFoodStock();
    foodObj.display();
  }

  foodObj.getFoodStock();

  foodObj.getFoodStock();

  fedTime = database.ref('feedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  })
   
if (gameState === "hungry"){
  feed.show();
  addFood.show();
  dog.addAnimation("hungry",sadDog);

}
else{
  feed.hide();
  addFood.hide();
  dog.remove();
}


  drawSprites();
  //add styles here

 textSize(32);
 fill("red");
 textSize(20);
 text(" Last Fed: "+lastFed+":00",300,95);

 text(" Time since last fed:  "+(currentTime - lastFed),300,125 );

}


function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);

   database.ref('/').update({

   Food: foodObj.getFoodStock(),
   FeedTime : hour()

  })
}

function addFoods(){
   foodS++;
   database.ref('/').update({
    Food : foodS
  })
}









