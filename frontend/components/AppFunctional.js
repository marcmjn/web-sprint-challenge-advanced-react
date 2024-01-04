import React, { useState, useEffect } from 'react';

const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4;

export default function AppFunctional(props) {
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [index, setIndex] = useState(initialIndex);
  const [grid, setGrid] = useState(Array.from({ length: 9 }, (_, idx) => (idx === initialIndex ? 'B' : '')));

  const getXY = () => {
    const x = (index % 3) + 1;
    const y = Math.floor(index / 3) + 1;
    return { x, y };
  };

  const getXYMessage = () => {
    const { x, y } = getXY();
    return `Coordinates (${x}, ${y})`;
  };

  const reset = () => {
    setMessage('');
    setEmail('');
    setSteps(0);
    setIndex(4);
  };

  const getNextIndex = (direction) => {
    const currentX = getXY().x;
    const currentY = getXY().y;

    switch (direction) {
      case 'left':
        return currentX > 1 ? index - 1 : index;
      case 'up':
        return currentY > 1 ? index - 3 : index;
      case 'right':
        return currentX < 3 ? index + 1 : index;
      case 'down':
        return currentY < 3 ? index + 3 : index;
      default:
        return index;
    }
  };

  const move = (direction) => {
    const nextIndex = getNextIndex(direction);

    if(nextIndex !== index) {
      setIndex(nextIndex)
      setSteps(steps + 1)
      setMessage('')
    } else {
      setMessage(`You can't go ${direction}`)
    }
  };

  useEffect(() => {
    // No need to manually update the DOM here
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((content, idx) => (idx === index ? 'B' : '' ))
      return newGrid
    })
  }, [index]);
  
  function onChange(evt) {
    setEmail(evt.target.value);
  }

  async function onSubmit(evt) {
    evt.preventDefault();

    // Use a POST request to send a payload to the server.
    try {
      const { x, y} =getXY()
      const response = await fetch('http://localhost:9000/api/result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          x,
          y,
          steps,
          email,
        }),
      });

      const data = await response.json();
      setMessage(data.message)
      setEmail('')
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }
  
  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} {steps === 1 ? 'time' : 'times'}</h3>
      </div>
      <div id="grid">
        {grid.map((content, idx) => (
          <div key={idx} className={`square${idx === index ? ' active' : ''}`} data-testid="square">
            {content}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={() => move("left")}>
          LEFT
        </button>
        <button id="up" onClick={() => move("up")}>
          UP
        </button>
        <button id="right" onClick={() => move("right")}>
          RIGHT
        </button>
        <button id="down" onClick={() => move("down")}>
          DOWN
        </button>
        <button id="reset" onClick={reset}>
          reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          id="email"
          type="email"
          placeholder="type email"
          value={email}
          onChange={onChange}
        />
        <input id="submit" type="submit" />
      </form>
    </div>
  );
}
