import { useEffect, useState, useRef } from "react";
import Snake from "../Snake/Snake";
import gsap from "gsap";
import s from "./Board.module.scss";
import Item from "../Item/Item";
import {
  defaultControls,
  flashUser,
  triggerConfetti,
  generateRandomCoordinates,
  triggerMode,
  reversedControls,
  wizz,
  netherPortal,
} from "../../utils/utils";
import GameOver from "../GameOver/GameOver";
import useStore from "../../utils/store";
import Submit from "../Submit/Submit";
import Scoreboard from "../Scoreboard/Scoreboard";
import Confetti from 'react-confetti';


const Board = () => {
  const { mode, removeMode } = useStore();
  const [snakeData, setSnakeData] = useState([
    [0, 0],
    [10, 0],
  ]);

  const [trapArray, setTrapArray] = useState([]);
  const [foodArray, setFoodArray] = useState([]);

  const [hasEnteredResults, setHasEnteredResults] = useState(false);

  const [gameOver, setGameOver] = useState(false);
  const [speed, setSpeed] = useState(0.2);
  const [score, setScore] = useState(0);
  const [death, setDeath] = useState(0);

  const [windowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [showConfetti, setShowConfetti] = useState(false);

  const timer = useRef(0);
  const foodTimer = useRef(0);
  const trapTimer = useRef(0);
  const direction = useRef("RIGHT");
  const canChangeDirection = useRef(true);

  // Voix du pere noel 
  const [pereNoelAudio, setpereNoelAudio] = useState( new Audio("/audio/pere-noel.mp3") );

  // Musique de fond de noel
  const [christmasAudio, setChristmasAudio] = useState(() => {
    const audio = new Audio("/audio/christmas-spirit.mp3");
    audio.loop = true; 
    return audio;
  });

  const [christmasAudioEnabled, setChristmasAudioEnabled] = useState(false);
  const [imageSrc, setImageSrc] = useState("/haut_parleur_coupe.png");
  

  // La musique de fond de noel peut etre couper ou jouer en cliquant sur le haut parleur
  const handleImageClick = () => {
    if (christmasAudioEnabled) {
      pauseAudio(); 
      setImageSrc("/haut_parleur_coupe.png"); 
    } else {
      christmasAudio.volume = 0.1; 
      christmasAudio.play();
      setImageSrc("/haut_parleur_son.png"); 
    }
    setChristmasAudioEnabled(!christmasAudioEnabled); 
  }


  const gameIsOver = () => {
    gsap.ticker.remove(gameLoop);

    const video = document.getElementById("snowfall");
    video.style.display = "block";
    video.currentTime = 0;
    video.play();

    pauseAudio();
    
    pereNoelAudio.volume = 0.4; 
    pereNoelAudio.play();

    pereNoelAudio.onended = () => {
      if (christmasAudioEnabled) {
        christmasAudio.volume = 0.1;
        christmasAudio.play();
      }
    };

    setGameOver(true);
  };

  const isOutOfBorder = (head) => {
    if (head[0] >= 500 || head[1] >= 500 || head[0] < 0 || head[1] < 0) {
      return true;
    } else {
      return false;
    }
  };

  const hasEatenItem = ({ getter, setter }) => {
    const head = snakeData[snakeData.length - 1]; 
    const snakeSize = 10; 
    const itemSize = 30; 
  
    const item = getter.find((_item) => {
      return (
        head[0] < _item.x + itemSize && 
        head[0] + snakeSize > _item.x && 
        head[1] < _item.y + itemSize && 
        head[1] + snakeSize > _item.y 
      );
    });
  
    if (item) {
      // Supprime l'item mangé
      const newItemArray = getter.filter((_item) => _item !== item);
      setter(newItemArray);
  
      return true;
    } else {
      return false;
    }
  };
  

  const moveSnake = () => {
    let newSnakeData = [...snakeData];
    let head = newSnakeData[newSnakeData.length - 1];

    switch (direction.current) {
      case "RIGHT":
        head = [head[0] + 10, head[1]];

        break;
      case "LEFT":
        head = [head[0] - 10, head[1]];

        break;
      case "DOWN":
        head = [head[0], head[1] + 10];

        break;
      case "UP":
        head = [head[0], head[1] - 10];

      default:
        break;
    }

    newSnakeData.push(head);
    newSnakeData.shift();

    const snakeCollapsed = hasCollapsed(head);
    const outOfBorder = isOutOfBorder(head);
    const snakeAteFood = hasEatenItem({
      getter: foodArray,
      setter: setFoodArray,
    });
    const snakeAteTrap = hasEatenItem({
      getter: trapArray,
      setter: setTrapArray,
    });

    if (outOfBorder || snakeCollapsed) {
      gameIsOver();
    } else {
      if (snakeAteTrap === true) {
      
        const effects = [flashUser, triggerMode, wizz, netherPortal];

        const selectedEffect =
          effects[Math.floor(Math.random() * effects.length)];

        selectedEffect();

        setDeath(death + 1);
      }
      if (snakeAteFood === true) {
        // agrandir le serpent
        newSnakeData.unshift([]);

        setScore(score + 10);

        if (speed > 0.05) {
          setSpeed(speed - 0.02);
        }

        // Afficher les confettis
        triggerConfetti(setShowConfetti);

      }
      setSnakeData(newSnakeData);
    }
  };

  const hasCollapsed = (head) => {
    let snake = [...snakeData];

    // retire la dernière case du tableau
    snake.pop();

    // comparer les coordonnées de head (tête du snake) avec les autres points du snake
    for (let i = 0; i < snake.length; i++) {
      if (head[0] === snake[i][0] && head[1] === snake[i][1]) {
        // si match renvoie true
        return true;
      }
    }

    // sinon renvoie false
    return false;
  };

  const onKeyDown = (e) => {
    if (canChangeDirection.current === false) return;
    canChangeDirection.current = false;

    mode.includes("reversed")
      ? reversedControls(e, direction)
      : defaultControls(e, direction);
  };

  const addItem = ({ getter, setter }) => {
    // génération de coordonnées
    const coordinates = generateRandomCoordinates(mode, 500, 30);

    //fusion des deux tableaux
    const array = [...foodArray, ...trapArray];

    //test pour savoir si un item est déjà existant à cet endroit
    const itemAlreadyExistsHere = array.some(
      (item) => item.x === coordinates.x && coordinates.y === item.y
    );

    // si ça existe déjà, rappeler la fonction
    if (itemAlreadyExistsHere) {
      addItem({ getter, setter });
      return;
    }

    setter((oldArray) => [...oldArray, coordinates]);
  };

  const gameLoop = (time, deltaTime, frame) => {
    timer.current += deltaTime * 0.001;
    foodTimer.current += deltaTime * 0.001;
    trapTimer.current += deltaTime * 0.001;

    // ici, gestion de l'apparition de la nourriture
    if (foodTimer.current > 2 && foodArray.length < 20) {
      foodTimer.current = 0;
      addItem({
        getter: foodArray,
        setter: setFoodArray,
      });
    }

    // ici, gestion des pièges
    if (trapTimer.current > 3 && trapArray.length < 10) {
      trapTimer.current = 0;
      addItem({
        getter: trapArray,
        setter: setTrapArray,
      });
    }

    // ici, gestion du mode impossible
    if (timer.current > (mode.includes("impossible") ? 0.02 : speed)) {
      timer.current = 0;
      moveSnake();
      canChangeDirection.current = true;
    }
  };


const pauseAudio = () => {
  if (christmasAudio) {
      christmasAudio.pause();
      christmasAudio.currentTime = 0; 
  }
  if (pereNoelAudio) {
      pereNoelAudio.pause();
      pereNoelAudio.currentTime = 0; 
  }
};

  const replay = () => {
    removeMode("corner");
    removeMode("impossible");
    removeMode("reversed");

    const video = document.getElementById("snowfall");
    video.style.display = "none";
    video.pause();

    pauseAudio();

    //reset game over
    setGameOver(false);
    setHasEnteredResults(false);
    setSpeed(0.2); // reset speed
    setScore(0); // reset score
    setDeath(0); //reset death

    //reset data snake
    setSnakeData([
      [0, 0],
      [10, 0],
    ]);

    //reset food
    setFoodArray([]);
    setTrapArray([]);

    //reset direction
    direction.current = "RIGHT";

    //reset timer
    timer.current = 0;

    //reset food timer
    foodTimer.current = 0;
  };

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    gsap.ticker.add(gameLoop);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      gsap.ticker.remove(gameLoop);
    };
  }, [snakeData]);


  return (
    <>
      {gameOver && <GameOver replay={replay} />}
      {gameOver && !hasEnteredResults && (
        <Submit
          score={score}
          death={death}
          setHasEnteredResults={setHasEnteredResults}
        />
      )}
      {gameOver && <Scoreboard />}

      {/* Afficher les confettis */}
      {showConfetti && (
      <Confetti 
        width={windowSize.width} 
        height={windowSize.height} 
        verticalPosition={windowSize.height * 0.7}  
        numberOfPieces={200}  
        gravity={0.3}        
      />)}

      <h1 className={s.title}>Christmas <span class="special-letter">&#xE018;</span>eindeer</h1>

      {/* Jouer ou arrêter la musique de fond */}
      <img 
        className={s.son} 
        src={imageSrc} 
        alt="Toggle audio" 
        onClick={handleImageClick} 
      />

      <div id="board" className={s.board}>
      <Snake data={snakeData} isInvisible={mode.includes("invisible")} />

        <span className={s.score}><img src="/cadeau.svg" alt="" width="30px" height="30px" />Score: {score}</span>

        <span className={s.death}>
          <span className={s.death_item}></span>
          <span>Death: {death}</span>
         </span>

        {foodArray.map((coordinates) => (
          <Item key={coordinates.id} coordinates={coordinates} type="food" />
        ))}

        {trapArray.map((coordinates) => (
          <Item key={coordinates.id} coordinates={coordinates} type="trap" />
        ))}
      </div>
    </>
  );
};

export default Board;
