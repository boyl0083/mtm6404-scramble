/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */

function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/

const { useState, useEffect } = React;

const wordsList = ["banana", "cherry", "grape", "lemon", "mango", "orange", "peach", "plum", "strawberry", "watermelon"];
const maxStrikes = 3;
const maxPasses = 2;

function ScrambleGame() {
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState("");
  const [scrambledWord, setScrambledWord] = useState("");
  const [guess, setGuess] = useState("");
  const [points, setPoints] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [passes, setPasses] = useState(maxPasses);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const savedGame = JSON.parse(localStorage.getItem("scrambleGame"));
    if (savedGame) {
      setWords(savedGame.words);
      setCurrentWord(savedGame.currentWord);
      setScrambledWord(savedGame.scrambledWord);
      setPoints(savedGame.points);
      setStrikes(savedGame.strikes);
      setPasses(savedGame.passes);
      setGameOver(savedGame.gameOver);
    } else {
      startNewGame();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "scrambleGame",
      JSON.stringify({ words, currentWord, scrambledWord, points, strikes, passes, gameOver })
    );
  }, [words, currentWord, scrambledWord, points, strikes, passes, gameOver]);

  function startNewGame() {
    const shuffledWords = shuffle(wordsList);
    setWords(shuffledWords);
    loadNextWord(shuffledWords);
    setPoints(0);
    setStrikes(0);
    setPasses(maxPasses);
    setGameOver(false);
  }

  function loadNextWord(updatedWords = words) {
    if (updatedWords.length === 0 || strikes >= maxStrikes) {
      setGameOver(true);
      return;
    }
    const nextWord = updatedWords[0];
    setCurrentWord(nextWord);
    setScrambledWord(shuffle(nextWord));
    setWords(updatedWords.slice(1));
  }

  function handleGuess() {
    if (guess.toLowerCase() === currentWord.toLowerCase()) {
      setPoints(points + 1);
      loadNextWord();
    } else {
      setStrikes(strikes + 1);
      if (strikes + 1 >= maxStrikes) setGameOver(true);
    }
    setGuess("");
  }

  function handlePass() {
    if (passes > 0) {
      setPasses(passes - 1);
      loadNextWord();
    }
  }

  return (
    <div>
      <h1>Scramble Game</h1>
      {gameOver ? (
        <div>
          <h2>Game Over!</h2>
          <p>Final Score: {points}</p>
          <button onClick={startNewGame}>Play Again</button>
        </div>
      ) : (
        <div>
          <p>Scrambled Word: <strong>{scrambledWord}</strong></p>
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleGuess()}
          />
          <button onClick={handleGuess}>Submit Guess</button>
          <button onClick={handlePass} disabled={passes <= 0}>Pass ({passes} left)</button>
          <p>Points: {points} | Strikes: {strikes}/{maxStrikes}</p>
        </div>
      )}
    </div>
  );
}

ReactDOM.render(<ScrambleGame />, document.body);