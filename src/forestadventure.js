//Get a reference to the stage 
var game = document.querySelector("#game");
var stage = document.querySelector("#stage");
var output = document.querySelector("#output");
var startmsg = document.querySelector("#startmsg");

//Add a keyboard listener
window.addEventListener("keydown", keydownHandler, false);


//The game map
var map =
[
  [0, 2, 0, 0, 0, 0, 0, 3],
  [0, 0, 0, 1, 0, 0, 0, 0],
  [0, 1, 0, 0, 1, 0, 0, 0],
  [0, 1, 0, 0, 2, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1],
  [0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 2, 0, 0, 0]
];

//The game objects map
var gameObjects =
[
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 5, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [4, 0, 0, 0, 0, 0, 0, 0]
];

//Map code
const LAND = 0;
const TREE = 1;
const MONSTER = 2;
const HOME = 3;
const PLAYER = 4;
const LION = 5;

//The size of each cell
const SIZE = 64;

//The number of rows and columns
var ROWS = map.length;
var COLUMNS = map[0].length;

//Find the player's and lion's start positions
var playerRow;
var playerColumn;
var lionRow;
var lionColumn;

for(let row = 0; row < ROWS; row++) 
{	
  for(let column = 0; column < COLUMNS; column++) 
  {
    if(gameObjects[row][column] === PLAYER)
    { 
      playerRow = row;
      playerColumn = column;
    }
    if(gameObjects[row][column] === LION)
    { 
      lionRow = row;
      lionColumn = column;
    }
  }
}

//Arrow key codes
var UP = 38;
var DOWN = 40;
var RIGHT = 39;
var LEFT = 37;

//The game variables
var food = 10;
var coins = 10;
var experience = 0;
var gameMessage = "Use the arrow keys to find your way home.";

function keydownHandler(event)
{ 
  switch(event.keyCode)
  {
    case UP:
	    if(playerRow > 0)
	    {
	      //Clear the player's current cell
	      gameObjects[playerRow][playerColumn] = 0;
	      
	      //Subract 1 from the player's row
	      playerRow--;
	      
	      //Apply the player's new updated position to the array
	      gameObjects[playerRow][playerColumn] = PLAYER;
	    }
	    break;
	  
	  case DOWN:
	    if(playerRow < ROWS - 1)
	    {
	      gameObjects[playerRow][playerColumn] = 0;
	      playerRow++;
	      gameObjects[playerRow][playerColumn] = PLAYER;
	    }
	    break;
	    
	  case LEFT:
	    if(playerColumn > 0)
	    {
	      gameObjects[playerRow][playerColumn] = 0;
	      playerColumn--;
	      gameObjects[playerRow][playerColumn] = PLAYER;
	    }
	    break;  
	    
	  case RIGHT:
	    if(playerColumn < COLUMNS - 1)
	    {
	      gameObjects[playerRow][playerColumn] = 0;
	      playerColumn++;
	      gameObjects[playerRow][playerColumn] = PLAYER;
	    }
	    break; 
  }
  
  //find out what kind of cell the player is on
  switch(map[playerRow][playerColumn])
  {
    case LAND:
      gameMessage = "You walk the open spaces."
      break;
    
    case MONSTER:
      fight();
      break; 
    
    case TREE:
      trade();
      break; 
      
    case HOME:
      endGame();
      break;      
  }
  
  //Move the lion
  moveLion(); 
  
  //Find out if the player is touching the lion
  if(gameObjects[playerRow][playerColumn] === LION)
  {
    endGame();
  } 
 
    
  //Subtract some food each turn
  food--;
  
  //Find out if the player has run out of food or coins
  if(food <= 0 || coins <= 0)
  {
    endGame();
  }
  
  //Render the game
  render();
}

function moveLion()
{
  //The 4 possible directions that the lion can move
  var UP = 1;
  var DOWN = 2;
  var LEFT = 3;
  var RIGHT = 4;
  
  //An array to store the valid direction that
  //the lion is allowed to move in
  var validDirections = [];
  
  //The final direction that the lion will move in
  var direction = undefined;
  
  //Find out what kinds of things are in the cells 
  //that surround the lion. If the cells contain land,
  //push the corresponding direction into the validDirections array
  if(lionRow > 0)
  {
    var thingAbove = map[lionRow - 1][lionColumn];
    if(thingAbove === LAND)
	  {
	    validDirections.push(UP);
	  }
  }
  if(lionRow < ROWS - 1)
  { 
    var thingBelow = map[lionRow + 1][lionColumn];
    if(thingBelow === LAND)
	  {
	    validDirections.push(DOWN);
	  }
  }
  if(lionColumn > 0)
  {
    var thingToTheLeft = map[lionRow][lionColumn - 1];
    if(thingToTheLeft === LAND)
	  {
	    validDirections.push(LEFT);
	  }
  } 
  if(lionColumn < COLUMNS - 1)
  {
    var thingToTheRight = map[lionRow][lionColumn + 1];
    if(thingToTheRight === LAND)
	  {
	    validDirections.push(RIGHT);
	  }
  } 
  
  //The validDirections array now contains 0 to 4 directions that the 
  //contain land cells. Which of those directions will the lion
  //choose to move in?
  
  //If a valid direction was found, Randomly choose one of the 
  //possible directions and assign it to the direction variable
  if(validDirections.length !== 0)
  {
    var randomNumber = Math.floor(Math.random() * validDirections.length);
    direction = validDirections[randomNumber];
  }
  
      //Find out if the player is touching the lion
  if(gameObjects[lionRow][lionColumn] === PLAYER)
  {
    gameObjects[lionRow][lionColumn] = LION;
    endGame();
  } 
    
  //Move the lion in the chosen direction
  switch(direction)
  {
    case UP:
      //Clear the lion's current cell
		  gameObjects[lionRow][lionColumn] = 0;
		  //Subtract 1 from the lion's row
		  lionRow--; 
		  //Apply the lion's new updated position to the array
		  gameObjects[lionRow][lionColumn] = LION;
		  break;
	  
	  case DOWN:
	    gameObjects[lionRow][lionColumn] = 0;
		  lionRow++;
		  gameObjects[lionRow][lionColumn] = LION;
	    break;
	  
	  case LEFT:
	    gameObjects[lionRow][lionColumn] = 0;
		  lionColumn--;
		  gameObjects[lionRow][lionColumn] = LION;
	    break;
	 
	 case RIGHT:
	    gameObjects[lionRow][lionColumn] = 0;
		  lionColumn++;
		  gameObjects[lionRow][lionColumn] = LION;
  }
}

function trade()
{
  //Figure out how much food the tree has
  //and how much it should cost
  var treesFood = experience + coins;
  var cost = Math.ceil(Math.random() * treesFood);
  
  //Let the player buy food if there's enough coins
  //to afford it
  if(coins > cost)
  {
    food += treesFood;
    coins -= cost;
    experience += 2;
    
    gameMessage 
      = "You buy " + treesFood + " coconuts"
      + " for " + cost + " coins."
  }
  else
  {
    //Tell the player if they don't have enough coins
    experience += 1;
    gameMessage = "You don't have enough coins to buy food."
  }
}

function fight()
{
  
  //The players strength
  var playerStrength = Math.ceil((food + coins) / 2);
  
  //A random number between 1 and the player's strength
  var monsterStrength = Math.ceil(Math.random() * playerStrength * 2);
  
  if(monsterStrength > playerStrength)
  {
    //The monsters ransack the player
    var stolenCoins = Math.round(monsterStrength / 2);
    coins -= stolenCoins;
    
    //Give the player some experience for trying  
    experience += 1;
    
    //Update the game message
    gameMessage 
      = "You fight and LOSE " + stolenCoins + " coins."
      + " player's strength: " + playerStrength 
      + " monster's strength: " + monsterStrength;
  }
  else
  {
    //You win the monsters' coins
    var monsterCoins = Math.round(monsterStrength / 2);
    coins += monsterCoins;
    
    //Add some experience  
    experience += 2;
    
    //Update the game message
    gameMessage 
      = "You fight and WIN " + monsterCoins + " coins."
      + " player's strength: " + playerStrength 
      + " monster's strength: " + monsterStrength;
  } 
}

function endGame()
{
  if(map[playerRow][playerColumn] === HOME)
  {
    //Calculate the score
    var score = food + coins + experience;
    
    //Display the game message
    gameMessage 
      = "You made it home ALIVE! " + "Final Score: " + score; 
  }
  else if(gameObjects[playerRow][playerColumn] === LION)
  {
    gameMessage 
      = "Your player has been killed by a LION!";
  }
  else
  {
    //Display the game message
    if(coins <= 0)
    {
      gameMessage += " You've run out of coins!"; 
    }
    else
    {
      gameMessage += " You've run out of food!"; 
    }
    
    gameMessage 
      += " Be ready to be a dinner for the forest beasts!"; 
  }
  
  //Remove the keyboard listener to end the game
  window.removeEventListener("keydown", keydownHandler, false);
}

function render()
{
    // hide and show sections
    $(game).show(); 
    $(startmsg).hide();
  //Clear the stage of img cells
  //from the previous turn
  
  if(stage.hasChildNodes())
  {
    for(var i = 0; i < ROWS * COLUMNS; i++) 
    {	 
      stage.removeChild(stage.firstChild);
    }
  }
  
  //Render the game by looping through the map arrays
  for(let row = 0; row < ROWS; row++) 
  {	
    for(let column = 0; column < COLUMNS; column++) 
    { 
      //Create a img tag called cell
      let cell = document.createElement("img");

      //Set it's CSS class to "cell"
      cell.setAttribute("class", "cell");

      //Add the img tag to the <div id="stage"> tag
      stage.appendChild(cell);

      //Find the correct image for this map cell
      switch(map[row][column])
      {
        case LAND:
          cell.src = "../images/land.png";
          break;

        case TREE:
          cell.src = "../images/tree.png";
          break; 

        case MONSTER:
          cell.src = "../images/monster.png";
          break; 

        case HOME:
          cell.src = "../images/home.png";
          break;   
      }  
      
      //Add the player and lion from the gameObjects array
	    switch(gameObjects[row][column])
	    {
	      case PLAYER:
	        cell.src = "../images/player.png";
	        break;   
	        
	      case LION:
	        cell.src = "../images/lion.png";
	        break;  
	    } 
  
      //Position the cell 
      cell.style.top = row * SIZE + "px";
      cell.style.left = column * SIZE + "px";
    }
  }
      //Display the game message
	output.innerHTML = gameMessage;
	
	//Display the player's food, coins, and experience
	output.innerHTML 
	  += "<br>Coins: " + coins + ", Food: " 
	  + food + ", Experience: " + experience;
  
}
