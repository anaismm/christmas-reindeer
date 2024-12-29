import Board from "./components/Board/Board";
import Toggle from "./components/Toggle/Toggle";
import { useDropzone } from "react-dropzone";
import useStore from "./utils/store";
import Confetti from 'react-confetti';

function App() {

  return (
    <div>
      <video src="/snowfall.mp4" id="snowfall" className="snowfall" loop></video>

      <video
        src="/nether.mp4"
        id="nether-video"
        className="nether-video"
        autoPlay
        loop
        muted
      ></video>

      <div className="flashbang"></div>
  
        <Board />

        <div className="toggle-container">
          <img className="renne" src="/renne.svg" alt="" />
          <div className="toggle-wrapper">
            <h2>Game mode</h2>
            <div className="toggle">
              <div className="toggle2">
                <Toggle mode={"corner"} />
                <Toggle mode={"impossible"} />
              </div>
              <div className="toggle2">
                <Toggle mode={"reversed"} />
                <Toggle mode={"invisible"} />
              </div>
            
            </div>
          </div>
        </div>
       

      
    </div>
  );
}

export default App;
