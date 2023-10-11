import { useState, useEffect, useRef } from "react";
import "./App.css";
import image1 from "./images/dice-1.png";
import image2 from "./images/dice-2.png";
import image3 from "./images/dice-3.png";
import image4 from "./images/dice-4.png";
import image5 from "./images/dice-5.png";
import image6 from "./images/dice-6.png";
import sound from "./images/sound.wav";
import hold from "./images/hold.wav";

import Dropdown from "react-bootstrap/Dropdown";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import Swal from "sweetalert2";
import { toast } from "react-toastify";

function App() {
  const random = () => Math.trunc(Math.random() * 6 + 1);
  const [dice, setDice] = useState(0);
  const [playerOneScoreTotal, setPlayerOneScoreTotal] = useState(0);
  const [playerTwoScoreTotal, setPlayerTwoScoreTotal] = useState(0);
  const [currentOneScore, setCurrentOneScore] = useState(0);
  const [currentTwoScore, setCurrentTwoScore] = useState(0);
  const [rolls, setRolls] = useState(0);
  const [activePLayer, setActivePLayer] = useState(true);
  const [imageDice, setImageDice] = useState(0);
  const [winner, setWinner] = useState(0);
  const [btnHidden, setBtnHidden] = useState(false);
  const [wonMsg, setWonMsg] = useState("");
  const [showMsg, setShowMsg] = useState(0);
  const [level, setLevel] = useState(30);
  const [dropDisp, setDropDisp] = useState(false);
  const [levelTracker, setLevelTracker] = useState(0);

  const [showTip, setShowTip] = useState(false);
  const target = useRef(null);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const imageMapping = {
    1: image1,
    2: image2,
    3: image3,
    4: image4,
    5: image5,
    6: image6,
  };

  // ------------------------------------TOAST AND ALERTS---------------------------------
  const Toast = Swal.mixin({
    toast: true,
    padding: "3rem",
    position: "center-top",
    showConfirmButton: false,
    timer: 2000,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
    customClass: {
      popup: "sweety",
    },
  });

  const Fire = Swal.mixin({
    title: wonMsg,
    width: 600,
    confirmButtonColor: "#07422a",
    confirmButtonClass: "chunnikuttan",
    customClass: {
      popup: "bigWin",
    },
    padding: "3em",
    color: "#716add",
    backdrop: `
          rgba(0,0,123,0.4)
          url("https://i.pinimg.com/originals/e4/d2/c1/e4d2c1d0da356797359acd9270bcdd77.gif")
          center top
          no-repeat
        `,
  });

  // ---------------------------------------------------------------------------------------------------------
  function play() {
    new Audio(sound).play();
  }

  function playHold() {
    new Audio(hold).play();
  }

  // ----------------------------------------------------------
  function reset() {
    setDice(0);
    setRolls(0);
    setWinner(0);
    setShowMsg(0);
    setImageDice(0);
    setActivePLayer(0);
    setShowTip(false);
    setDropDisp(false);
    setBtnHidden(false);
    setCurrentOneScore(0);
    setCurrentTwoScore(0);
    setPlayerOneScoreTotal(0);
    setPlayerTwoScoreTotal(0);

    Toast.fire({
      icon: "success",
      title: "New Game Has Started 🎲",
    });
  }

  function randomGenerator() {
    setDropDisp(true);
    const randomDice = random();
    setImageDice(randomDice);
    setDice(randomDice);
    if (randomDice === 1) {
      if (activePLayer === true) {
        setCurrentOneScore(0);
      } else {
        setCurrentTwoScore(0);
      }

      setActivePLayer(!activePLayer);
      setDice(0);
    }
    setRolls((roll) => roll + 1);
  }

  useEffect(() => {
    if (activePLayer) {
      setCurrentOneScore((prevScore) => prevScore + dice);
    } else {
      setCurrentTwoScore((prevScore) => prevScore + dice);
    }
  }, [dice, rolls]);

  useEffect(() => {
    if (showMsg !== 0) {
      Fire.fire().then((result) => {
        if (result.isConfirmed) {
          setShowTip(true);
        }
      });
      play();
    }
  }, [showMsg]);

  useEffect(() => {
    if (playerOneScoreTotal >= level) {
      setWinner(1);
      setImageDice(0);
      setBtnHidden(true);
      setWonMsg("🎉 Player 1 WON the Game 🎉");
      setShowMsg(1);
    } else if (playerTwoScoreTotal >= level) {
      setWinner(2);
      setImageDice(0);
      setBtnHidden(true);
      setWonMsg("🎉 Player 2 WON the Game 🎉");
      setShowMsg(2);
    }
  }, [playerOneScoreTotal, playerTwoScoreTotal]);

  useEffect(() => {
    if (levelTracker !== 0) {
      Toast.fire({
        icon: "info",
        title: `Score ${level} or above to win !`,
      });
    }
  }, [levelTracker]);

  function onHold() {
    activePLayer === true
      ? setPlayerOneScoreTotal((prev) => prev + currentOneScore)
      : setPlayerTwoScoreTotal((prev) => prev + currentTwoScore);
    setCurrentOneScore(0);
    setCurrentTwoScore(0);
    setImageDice(0);

    setActivePLayer(!activePLayer);
    playHold();
  }

  return (
    <>
      <button onClick={handleShow} className="instruct ">
        ❗Instructions
      </button>

      <Dropdown id={dropDisp && "hiddenn"} className="d-inline trans mx-2 ">
        <Dropdown.Toggle id="dropdown-autoclose-true">
          Choose Level
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item
            onClick={() => {
              setLevel(30);
              setLevelTracker((s) => s + 1);
            }}
          >
            EASY
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              setLevel(50);
              setLevelTracker((s) => s + 1);
            }}
          >
            MEDIUM
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              setLevel(100);
              setLevelTracker((s) => s + 1);
            }}
          >
            HARD
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      {/* ---------------------MODAL--------------------- */}

      <Modal
        style={{ fontSize: "16px", maxHeight: "95vh", overflowY: "scroll" }}
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Please Read the Instructions carefully !!</Modal.Title>
        </Modal.Header>
        {/* -------------------------- */}
        <Modal.Body style={{ maxHeight: "80vh", overflowY: "scroll" }}>
          <div class="container">
            <div class="game-instructions">
              <b>
                <p style={{ fontSize: "24px" }}>Game Title : Dice Showdown</p>
              </b>
              <b>Dice Showdown Instructions</b>
              <p>
                The Objective of Dice Showdown is to be the first player to
                score 30 points or more. Players take turns rolling a dice,
                accumulating points, but risk losing all their current points if
                they roll a one. The game offers a balance of risk and strategy,
                allowing players to decide when to hold their points and when to
                take a chance by rolling the dice.
              </p>
              <b>Game Components:</b>
              <ul>
                <li>1 six-sided dice</li>
                <li>Scoreboard for each player</li>
                <li>Roll button</li>
                <li>Hold button</li>
              </ul>
              <b>Gameplay Rules:</b>
              <ol>
                <li>Two players take turns.</li>
                <li>The first player is determined randomly.</li>
                <li>On your turn, click the "Roll" button to roll the dice.</li>
                <li>
                  If the rolled number is anything except 1, the number is added
                  to your current turn score.
                </li>
                <li>
                  If you roll a 1, your turn ends, and you lose all the points
                  accumulated during that turn.
                </li>
                <li>
                  If you choose to "Hold" your points, the total points for that
                  turn are added to your total score, and it becomes the other
                  player's turn.
                </li>
                <li>
                  The game continues until one player's total score reaches 30
                  or more points.
                </li>
                <li>
                  The player who reaches or exceeds 30 points first wins the
                  game.
                </li>
              </ol>
              <p>Enjoy playing Dice Showdown, and may the best roller win!</p>
            </div>
          </div>
        </Modal.Body>
        {/* -------------------------- */}
        <Modal.Footer>
          <Button
            className="btn btn-dark"
            style={{ fontSize: "16px", padding: "5px 16px" }}
            onClick={handleClose}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ---------------------MODAL--------------------- */}
      <main>
        <section
          class={`player player--0 ${winner === 1 && "player--winner"} ${
            activePLayer && "player--active"
          }`}
        >
          <h2 class="name" id="name--0">
            Player 1
          </h2>
          <p class="score" id="score--0">
            {playerOneScoreTotal}
          </p>
          <div class="current">
            <p class="current-label">Current</p>
            <p class="current-score" id="current--0">
              {currentOneScore}
            </p>
          </div>
        </section>

        <section
          class={`player player--0 ${winner === 2 && "player--winner"} ${
            !activePLayer && "player--active"
          }`}
        >
          <h2 class="name" id="name--1">
            Player 2
          </h2>
          <p class="score" id="score--1">
            {playerTwoScoreTotal}
          </p>
          <div class="current">
            <p class="current-label">Current</p>
            <p class="current-score" id="current--1">
              {currentTwoScore}
            </p>
          </div>
        </section>

        <img id="filter" src={imageMapping[imageDice]} class="dice" alt="" />
        <button
          id={rolls === 0 ? "hiddenn" : ""}
          ref={target}
          onClick={reset}
          class="btnn btn--new"
        >
          🔄 New game
        </button>

        <Overlay
          style={{ width: "100px" }}
          target={target.current}
          show={showTip}
          placement="bottom"
        >
          {(props) => (
            <Tooltip id="overlay-example" {...props}>
              Click to start new Game
            </Tooltip>
          )}
        </Overlay>

        <button
          onClick={randomGenerator}
          class={`btnn btn--roll ${btnHidden && "hidden"}`}
        >
          🎲 Roll dice
        </button>
        <button
          id={rolls === 0 ? "hiddenn" : ""}
          onClick={onHold}
          class={`btnn btn--hold ${btnHidden && "hidden"}`}
        >
          📥 Hold
        </button>
      </main>
    </>
  );
}

export default App;
