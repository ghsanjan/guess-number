import "./index.css";
import { useState, useEffect, useRef } from "react";

export default function App() {
  const [num, setNum] = useState(["", "", "", ""]);
  const [guesses, setGuesses] = useState([]);
  const [message, setMessage] = useState("");
  const [won, setWon] = useState(false);
  //const [error, setError] = useState(false);
  const ref = useRef([]);
  const numRef = useRef([]);

  useEffect(() => {
    generateRandom4Digit(ref);
  }, []);

  function generateRandom4Digit(ref) {
    while (ref.current.length < 4) {
      let digit = Math.floor(Math.random() * 10);
      // Avoid duplicates
      if (!ref.current.includes(digit)) {
        // First digit should not be 0
        if (ref.current.length === 0 && digit === 0) continue;
        ref.current.push(digit);
      }
    }
    console.log(ref.current);
  }

  function handleChange(e, position) {
    if (e.target.value === "") {
      const updatedNum = [...num];
      updatedNum[position] = "";
      setNum(updatedNum);
      return;
    }
    const value = Number(e.target.value);
    if (Number.isNaN(value)) {
      return;
    }
    if (!num.includes(value)) {
      const updatedNum = [...num];
      updatedNum[position] = value;
      setNum(updatedNum);
      setMessage("");
      if (position < numRef.current.length - 1) {
        numRef.current[position + 1].focus();
      }
    } else {
      setMessage("repeated value not allowed");
    }
  }

  // function handleChange(e, position) {
  //   setMessage("");

  //   if (e.target.value === "") {
  //     setNum((prevNum) => {
  //       const updatedNum = [...prevNum];
  //       updatedNum[position] = "";
  //       return updatedNum;
  //     });
  //   }

  //   const value = Number(e.target.value);
  //   if (Number.isNaN(value)) {
  //     setMessage("Enter a number between 0 and 9");
  //   }
  //   if (!num.includes(value)) {
  //     let updatedArr = [...num];
  //     updatedArr[position] = value;
  //     setNum(updatedArr);
  //   } else {
  //     if (value === "") {
  //       setMessage("");
  //     }
  //     setMessage("repeated value not allowed");
  //   }
  // }

  function handleSubmit(e) {
    e.preventDefault();

    if (num.includes("")) {
      setMessage("Enter 4 digits");
      return;
    }

    let rightPlaceCount = 0;
    let wrongPlaceCount = 0;

    num.forEach((element, index) => {
      if (ref.current.includes(element) && element === ref.current[index]) {
        //right number right place
        rightPlaceCount++;
      } else if (ref.current.includes(element)) {
        //right number wrong place
        wrongPlaceCount++;
      }
    });
    if (rightPlaceCount === 4) {
      setWon(true);
      return;
    }

    let msg = rightPlaceCount ? `${rightPlaceCount} RP` : "";
    msg = msg + (wrongPlaceCount ? ` ${wrongPlaceCount} RWP` : "");

    if (msg) {
      msg = msg + ` (${rightPlaceCount + wrongPlaceCount} right)`;
    } else {
      msg = "All Wrong";
    }

    setGuesses((prevGuesses) => [
      ...prevGuesses,
      { guess: [...num], msg: msg },
    ]);
    setNum(["", "", "", ""]);
  }

  function handlePlayAgain() {
    ref.current = [];
    generateRandom4Digit(ref);
    setGuesses([]);
    setNum(["", "", "", ""]);
    setMessage("");
    setWon(false);
  }

  if (won) {
    return (
      <div>
        <h1>You Won!</h1>
        <h2>{ref.current}</h2>
        <h3>
          won at{" "}
          {guesses.length + 1 === 1
            ? `${guesses.length + 1} chance`
            : `${guesses.length + 1} chances`}
        </h3>
        <button onClick={handlePlayAgain}>Play Again</button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="guesses-container">
        {guesses &&
          guesses.map((gs) => (
            <div className="guesses">
              <div className="guess-container">
                {gs.guess.map((g) => (
                  <div className="guess">
                    <p>{g}</p>
                  </div>
                ))}
                {/* <p className="guess">{gs.guess}</p> */}
              </div>
              <div className="msg-container">
                <p className="msg">{gs.msg}</p>
              </div>
            </div>
          ))}
      </div>
      <div className="input-container">
        {num.map((n, index) => (
          <input
            className="input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]"
            maxLength={1}
            value={n}
            ref={(el) => (numRef.current[index] = el)}
            onChange={(e) => handleChange(e, index)}
          />
        ))}
        <button
          onClick={(e) => handleSubmit(e)}
          disabled={num.includes("") ? true : false}
        >
          Submit
        </button>
      </div>
      <p>{message}</p>
    </div>
  );
}
