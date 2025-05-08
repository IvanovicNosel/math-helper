import { useState, useEffect, useRef } from 'react';
import PageLayout from "../layouts/PageLayout";

// Updated playSound function to ensure it runs only in the browser
const playSound = () => {
  if (typeof window !== 'undefined') { // Check if running in the browser
    const audio = new Audio('/ping.mp3');
    audio.currentTime = 0; // Reset the audio to the beginning
    audio.play();
  }
};

export default function DigitSpanTest() {
  // Configuration options
  const [config, setConfig] = useState({
    startLength: 3,
    displayTime: 1000,
    pauseTime: 500,
    characterSet: '0123456789',
    useCharacters: 'numbers' // 'numbers', 'letters', 'symbols', 'custom'
  });

  // Game state
  const [currentSequence, setCurrentSequence] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [gameState, setGameState] = useState('ready'); // 'ready', 'displaying', 'input', 'feedback', 'finished'
  const [maxCorrectLength, setMaxCorrectLength] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const inputRef = useRef(null);
  const [customCharSet, setCustomCharSet] = useState('');

  // Preload the audio file
  const audioRef = useRef(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/ping.mp3');
    }
  }, []);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Reset the audio to the beginning
      audioRef.current.play();
    }
  };

  // Character sets
  const characterSets = {
    numbers: '0123456789',
    letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  };

  // Update character set when selection changes
  useEffect(() => {
    if (config.useCharacters === 'custom') {
      if (customCharSet) {
        setConfig({ ...config, characterSet: customCharSet });
      }
    } else {
      setConfig({ ...config, characterSet: characterSets[config.useCharacters] });
    }
  }, [config.useCharacters, customCharSet]);

  // Generate a random sequence
  const generateSequence = (length) => {
    const chars = config.characterSet.split('');
    let sequence = [];
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      sequence.push(chars[randomIndex]);
    }
    return sequence;
  };

  // Start a new game
  const startGame = () => {
    setMaxCorrectLength(0);
    setCurrentRound(1);
    setGameState('ready');
    startNextRound();
  };

  // Start the next round
  const startNextRound = () => {
    const sequenceLength = config.startLength + currentRound - 1;
    const newSequence = generateSequence(sequenceLength);
    setCurrentSequence(newSequence);
    setUserInput('');
    displaySequence(newSequence);
  };

  // Display the sequence to the user
  const displaySequence = (sequence) => {
    setGameState('displaying');
    let currentIndex = 0;

    displayIntervalRef.current = setInterval(() => {
      if (currentIndex < sequence.length) {
        // Play sound for each digit
        playSound();

        // Display the current digit
        setFeedbackMessage(sequence[currentIndex]);
        currentIndex++;
      } else {
        // End of sequence
        clearInterval(displayIntervalRef.current);
        setTimeout(() => {
          setFeedbackMessage('');
          setGameState('input');
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, config.pauseTime);
      }
    }, config.displayTime);
  };

  const displayIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup interval when the component unmounts
      if (displayIntervalRef.current) {
        clearInterval(displayIntervalRef.current);
      }
    };
  }, []);

  // Handle user input submission
  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }

    const userSequence = userInput.toUpperCase().split('');
    const correctSequence = currentSequence;

    // Check if the input matches the sequence
    const isCorrect =
      userSequence.length === correctSequence.length &&
      userSequence.every((char, index) => char === correctSequence[index]);

    if (isCorrect) {
      // Success - update score and continue
      const newMaxLength = config.startLength + currentRound - 1;
      setMaxCorrectLength(newMaxLength);
      setFeedbackMessage('Correct! Get ready for the next sequence...');
      setGameState('feedback');

      // Start next round after delay
      setTimeout(() => {
        setCurrentRound(currentRound + 1);
        startNextRound();
      }, 2000);
    } else {
      // Game over - show final score
      setFeedbackMessage(`Incorrect. Your maximum digit span was ${maxCorrectLength}.`);
      setGameState('finished');
    }
  };

  // Reset game configuration
  const resetConfig = () => {
    setConfig({
      startLength: 3,
      displayTime: 1000,
      pauseTime: 500,
      characterSet: '0123456789',
      useCharacters: 'numbers'
    });
    setCustomCharSet('');
  };

  // Handle custom configuration updates
  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    if (name === 'startLength' || name === 'displayTime' || name === 'pauseTime') {
      setConfig({ ...config, [name]: parseInt(value) });
    } else {
      setConfig({ ...config, [name]: value });
    }
  };

  // Handle custom character set input
  const handleCustomCharSet = (e) => {
    setCustomCharSet(e.target.value);
  };

  // Handle key press for input submission
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center p-6 max-w-2xl mx-auto text-gray-200 bg-gray-900">
        <h1 className="text-3xl font-bold mb-6">Digit Span Test</h1>

        {/* Game Area */}
        <div className="w-full bg-gray-800 rounded-lg p-6 mb-6 shadow-md">
          {gameState === 'ready' && (
            <div className="text-center">
              <p className="mb-4">
                This test will display a sequence of characters that will get longer each round.
                Try to remember the sequence and input it exactly as shown.
              </p>
              <button
                onClick={startGame}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded"
              >
                Start Test
              </button>
            </div>
          )}

          {gameState === 'displaying' && (
            <div className="text-center">
              <div className="text-6xl font-bold h-32 flex items-center justify-center">
                {feedbackMessage}
              </div>
              <p>Watch carefully...</p>
            </div>
          )}

          {gameState === 'input' && (
            <div className="text-center">
              <div className="my-4">
                <p className="mb-4">Enter the sequence you saw:</p>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  ref={inputRef}
                  className="border-2 border-gray-700 bg-gray-700 text-gray-200 rounded px-4 py-2 w-full text-center text-xl mb-4"
                  autoFocus
                />
                <button
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded"
                >
                  Submit
                </button>
              </div>
            </div>
          )}

          {gameState === 'feedback' && (
            <div className="text-center">
              <p className="text-xl">{feedbackMessage}</p>
              <p className="mt-2">Current Level: {currentRound}</p>
              <p>Sequence Length: {config.startLength + currentRound - 1}</p>
            </div>
          )}

          {gameState === 'finished' && (
            <div className="text-center">
              <p className="text-xl mb-4">{feedbackMessage}</p>
              <button
                onClick={startGame}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Configuration Panel */}
        <div className="w-full bg-gray-800 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Test Configuration</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Starting Sequence Length
              </label>
              <input
                type="number"
                name="startLength"
                min="1"
                max="10"
                value={config.startLength}
                onChange={handleConfigChange}
                className="border border-gray-700 bg-gray-700 text-gray-200 rounded px-3 py-2 w-full"
                disabled={gameState !== 'ready' && gameState !== 'finished'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Display Time (ms)
              </label>
              <input
                type="number"
                name="displayTime"
                min="200"
                max="5000"
                step="100"
                value={config.displayTime}
                onChange={handleConfigChange}
                className="border border-gray-700 bg-gray-700 text-gray-200 rounded px-3 py-2 w-full"
                disabled={gameState !== 'ready' && gameState !== 'finished'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Pause Between Characters (ms)
              </label>
              <input
                type="number"
                name="pauseTime"
                min="0"
                max="3000"
                step="100"
                value={config.pauseTime}
                onChange={handleConfigChange}
                className="border border-gray-700 bg-gray-700 text-gray-200 rounded px-3 py-2 w-full"
                disabled={gameState !== 'ready' && gameState !== 'finished'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Character Type
              </label>
              <select
                name="useCharacters"
                value={config.useCharacters}
                onChange={handleConfigChange}
                className="border border-gray-700 bg-gray-700 text-gray-200 rounded px-3 py-2 w-full"
                disabled={gameState !== 'ready' && gameState !== 'finished'}
              >
                <option value="numbers">Numbers</option>
                <option value="letters">Letters</option>
                <option value="symbols">Symbols</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            {config.useCharacters === 'custom' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Custom Character Set
                </label>
                <input
                  type="text"
                  value={customCharSet}
                  onChange={handleCustomCharSet}
                  className="border border-gray-700 bg-gray-700 text-gray-200 rounded px-3 py-2 w-full"
                  disabled={gameState !== 'ready' && gameState !== 'finished'}
                  placeholder="Enter characters to use (no spaces)"
                />
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={resetConfig}
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded mr-2"
              disabled={gameState !== 'ready' && gameState !== 'finished'}
            >
              Reset Defaults
            </button>

            <button
              onClick={startGame}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
              disabled={gameState !== 'ready' && gameState !== 'finished'}
            >
              Start New Test
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}