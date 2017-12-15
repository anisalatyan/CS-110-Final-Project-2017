let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

let backgroundImage3 = new Image();
backgroundImage3.src = "bg3.png";

let catImage = new Image();
catImage.src = "cat.png";

let catmImage = new Image();
catmImage.src = "catmirrored.png";

let heartImage1 = new Image();
heartImage1.src = "heartIcon1.ico";

let mouseImage = new Image();
mouseImage.src = "mouse.png";

let bad3Image = new Image();
bad3Image.src = "pluto.png";

let winImage = new Image();
winImage.src = "win.png";

let gameOverImage = new Image();
gameOverImage.src = "game over.png";


let rand = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

let hero = {
    x: 150,
    y: 275,
    width: 90,
    height: 145,
    xDelta: 7,
    yDelta: 7,
    image: catImage,
    isRigth: false,
    lives: 3,
    inv: false,
    invC: 0,
    gameOver: false
}

let food = {
    x: 670,
    y: 340,
    width1: 65,
    height1: 75,
    image: mouseImage,
    number: 6
};

let arr = [];
let createMonsters = function(count, canvasWidth, canvasHeight) {
    if (count === 0) {
        return arr;
    };
    let monster = {
        x: rand(250, canvas.width - 125),
        y: 325,
        width: 110,
        height: 135,
        xDelta: rand(2.5, 3),
        yDelta: rand(2.5, 3),
        image: bad3Image
    };
    arr.push(monster);
    createMonsters(count - 1, canvasWidth, canvasHeight);
    return arr;
}
let monsters = createMonsters(4, canvas.width, canvas.height);

let draw1 = function() {

    let spacing = 0;
    let counter = 1;
    context.drawImage(backgroundImage3, 0, 0, canvas.width, canvas.height);
    while (counter < hero.lives) {
        counter++;
        context.drawImage(heartImage1, spacing, 0, 50, 50);
        spacing += 60;
    }
    counter = 0;
    while(counter < food.number) {
    	counter++;
    	context.drawImage(food.image, canvas.width - counter * 60, 0, 50, 50)
    }

    context.drawImage(hero.image, hero.x, hero.y, hero.width, hero.height);
    context.drawImage(food.image, food.x, food.y, food.width1, food.height1);
    let looper = function(arr, i) {
        if (i === arr.length) {
            return;

        }

        context.drawImage(bad3Image, monsters[i].x, monsters[i].y, monsters[i].width, monsters[i].height);
        looper(arr, i + 1);
    };
    looper(monsters, 0);
}

const RectsIntersection = function(rect1X, rect1Y, rect1W, rect1H, rect2X, rect2Y, rect2W, rect2H) {
    return rect1X < rect2X + rect2W && rect1X + rect1W > rect2X && rect1Y < rect2Y + rect2H && rect1H + rect1Y > rect2Y;
};

let hitTest = function() {

    if (RectsIntersection(hero.x, hero.y, hero.width, hero.height, food.x, food.y, food.width1, food.height1)) {
        context.clearRect(food.x, food.y, food.width1, food.height1);
        food.number--;
        food = {
            x: rand(0, canvas.width-40),
            y: rand(0, canvas.height-50),
            width1: 65,
            height1: 75,
            image: mouseImage,
            number: food.number
        };
    };
};

let GameOver=function(){
	context.drawImage(gameOverImage, 100,100, 550, 350);
	};	

let win=function(){
	
        if ( RectsIntersection(hero.x, hero.y, hero.width, hero.height, food.x, food.y, food.width1, food.height1) && food.number !== 0) {
			food.number--;
		}
        
            if (food.number === 0) {
      	      context.drawImage(winImage,100,100,750,350)
      	      hero.gameOver=true;
              setTimeout(function(){ window.location.href = "index.html"; }, 2000);
            }
            //break;
       
};

let update = function() {
    let Each = function(i) {
        if (i === arr.length) {
            return;
        };
        if (monsters[i].x >= canvas.width - monsters[i].width) {
            monsters[i].xDelta *= -1;
        }
        if (monsters[i].x <= 0) {
            monsters[i].xDelta *= -1;

        }
        if (monsters[i].y >= canvas.height - monsters[i].height) {
            monsters[i].yDelta *= -1;
        }
        if (monsters[i].y <= 0) {
            monsters[i].yDelta *= -1;
        }
        hitTest();
        monsters[i].x += monsters[i].xDelta;
        monsters[i].y += monsters[i].yDelta;
        Each(i + 1);
    };
    Each(0);
    for (let i = 0; i < monsters.length; i++) {
        if (!hero.inv && RectsIntersection(hero.x, hero.y, hero.width, hero.height, monsters[i].x, monsters[i].y, monsters[i].width, monsters[i].height) && hero.lives !== 0) {

            hero.lives--;
            hero.inv = true;
            hero.invC = 120;
            if (hero.lives === 0) {
                //alert('game over');
                GameOver();
            	hero.gameOver = true;
            	
            }
            break;
        }

    }
    if (hero.invC !== 0) {
        hero.invC--;
    } else {
        hero.inv = false;
    }
    win()
};

const loop = function() {
    draw1();
    update();
    if(!hero.gameOver) {
		requestAnimationFrame(loop);
    }
};
loop();

const leftKey = 37;
const upKey = 38;
const rightKey = 39;
const downKey = 40;

document.addEventListener('keydown', function(event) {
    if (event.keyCode === rightKey) {
        hero.x = hero.x + hero.xDelta;
        hero.image = catmImage;
    }

    if (hero.x >= canvas.width - hero.width) {
        hero.x = canvas.width - hero.width;
        hero.x = hero.x - hero.xDelta;

    } else if (event.keyCode === leftKey) {
        hero.x = hero.x - hero.xDelta;
        hero.image = catImage;

    }
    if (hero.x <= 0) {
        hero.x = 0;
    } else if (event.keyCode === downKey) {
        hero.y = hero.y + hero.yDelta;
        if (hero.y >= canvas.height - hero.height)
            hero.y = canvas.height - hero.height;
    } else if (event.keyCode === upKey) {
        hero.y = hero.y - hero.yDelta;
        if (hero.y <= 0) {
            hero.y = 0;
        }
    }
    hitTest();
}, false); 

let newGame = function(event){
    for(let obj of arr){
        obj.x = rand(250, canvas.width - 125);
        obj.y = 300;
    }
    hero.gameOver = false;
    hero.lives = 3;
    hero.x = 150;
    hero.y = 275;
    food.number = 4;
    loop();
}