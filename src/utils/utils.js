import uniqid from "uniqid";
import gsap from "gsap";
import useStore from "./store";

const flashbangAudio = new Audio("/audio/csgo-flashbang.mp3");
const confettiAudio = new Audio("/audio/confetti_sound.mp3");


let flashTween = null;

// window.location.href = "https://google.com";
export const netherPortal = () => {
  const video = document.getElementById("nether-video");
  video.style.display = "block";

  setTimeout(() => {
    video.style.display = "none";
  }, 3000);
};

export const flashUser = () => {
  if (flashTween) flashTween.kill();

  flashbangAudio.currentTime = 0;
  flashbangAudio.play();
  document.querySelector(".flashbang").style.opacity = "1";

  flashTween = gsap.to(".flashbang", {
    opacity: 0,
    duration: 2,
    delay: 0.25,
  });
};

let confettiTween = null;
const confettiDuration = 2000

export const triggerConfetti = (setShowConfetti) => {
  if (confettiTween) confettiTween.kill();

  confettiAudio.currentTime = 0;
  confettiAudio.play();
  setShowConfetti(true); // Afficher les confettis

  // Cacher les confettis après 3 secondes (durée de l'animation)
  setTimeout(() => {
    setShowConfetti(false); // Cacher les confettis
  }, confettiDuration);
};


export const triggerMode = () => {
  const modes = ["impossible", "corner", "reversed", "invisible"];
  const selectedMode = modes[Math.floor(Math.random() * modes.length)];

  // déclenche le mode sélectionné aléatoirement
  useStore.getState().addMode(selectedMode);

  setTimeout(() => {
    useStore.getState().removeMode(selectedMode);
  }, 2000);
};

export const wizz = () => {
  gsap.to("#board", {
    duration: 0.05,
    x: "+=30%",
    yoyo: true,
    repeat: 9,
  });
};

export const reversedControls = (e, direction) => {
  switch (e.keyCode) {
     // Going up
    case 38:
      if (direction.current !== "UP") {
        direction.current = "DOWN";
      }
      break;

     // Going down
    case 40:
      if (direction.current !== "DOWN") {
        direction.current = "UP";
      }
      break;

    // Going left
    case 37:
      if (direction.current !== "LEFT") {
        direction.current = "RIGHT";
      }
      break;

    // Going right
    case 39:
      if (direction.current !== "RIGHT") {
        direction.current = "LEFT";
      }
      break;

    default:
      break;
  }
};

export const defaultControls = (e, direction) => {
  switch (e.keyCode) {
    case 38:
     // Going up
      if (direction.current !== "DOWN") {
        direction.current = "UP";
      }
      break;

    // Going down
    case 40:
      if (direction.current !== "UP") {
        direction.current = "DOWN";
      }
      break;

     // Going left
    case 37:
      if (direction.current !== "RIGHT") {
        direction.current = "LEFT";
      }
      break;

    // Going right
    case 39:
      if (direction.current !== "LEFT") {
        direction.current = "RIGHT";
      }
      break;

    default:
      break;
  }
};

export const generateRandomCoordinates = (mode, boardSize, itemSize) => {
  const id = uniqid();
  const gridSize = 10; // Taille de la grille (chaque case fait 10x10)
  let min = 0;
  let max = Math.floor((boardSize - itemSize) / gridSize); // Ajuste pour éviter les débordements
  let x, y;

  if (mode.includes("corner")) {
    // logique pour générer des coordonnées uniquement sur les côtés
    const side = Math.random();

    if (side <= 0.25) {
      // Générer à gauche
      x = min * gridSize;
      y = Math.floor(Math.random() * (max + 1)) * gridSize;

    } else if (side > 0.25 && side <= 0.5) {
      // Générer à droite
      x = max * gridSize;
      y = Math.floor(Math.random() * (max + 1)) * gridSize;

    } else if (side > 0.5 && side <= 0.75) {
      // Générer en bas
      x = Math.floor(Math.random() * (max + 1)) * gridSize;
      y = max * gridSize;

    } else if (side > 0.75) {
      // Générer en haut
      x = Math.floor(Math.random() * (max + 1)) * gridSize;
      y = min * gridSize;
    }
  } else {
    // logique classique
    x = Math.floor(Math.random() * (max + 1)) * gridSize;
    y = Math.floor(Math.random() * (max + 1)) * gridSize;
  }

  return { x, y, id };
};
