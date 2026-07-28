/**
 * YS.Creates Calculator Web Application JavaScript File
 * Safe evaluation, event bindings, precise float math, and responsiveness.
 */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const displayHistory = document.getElementById('display-history');
  const displayInput = document.getElementById('display-input');
  const calculator = document.getElementById('calculator');

  // Calculator State Machine
  let currentInput = '0';          // Active value shown on display
  let historyExpression = '';     // Expression built so far (e.g., "12 + 5 -")
  let resetOnNextInput = false;    // Reset input on next digit press (after equals)
  let hasError = false;            // Error flag state

  /**
   * Adjusts the font size of the display input based on character length.
   * Prevents numbers from overflowing or wrapping awkwardly.
   */
  function adjustFontSize() {
    const length = currentInput.length;
    
    // Default font sizes
    let desktopSize = '2.25rem';
    let mobileSize = '2rem';
    
    if (length > 16) {
      desktopSize = '1.25rem';
      mobileSize = '1.1rem';
    } else if (length > 10) {
      desktopSize = '1.75rem';
      mobileSize = '1.5rem';
    }
    
    // Set custom property to override in responsive screens
    displayInput.style.fontSize = window.innerWidth <= 480 ? mobileSize : desktopSize;
  }

  /**
   * Updates the UI displays.
   */
  function updateUI() {
    displayInput.textContent = currentInput;
    displayHistory.textContent = historyExpression;
    adjustFontSize();
  }

  /**
   * Clears the current active input.
   */
  function clearCurrentInput() {
    if (hasError) {
      allClear();
      return;
    }
    currentInput = '0';
    updateUI();
  }

  /**
   * Resets the entire calculator state.
   */
  function allClear() {
    currentInput = '0';
    historyExpression = '';
    resetOnNextInput = false;
    hasError = false;
    updateUI();
  }

  /**
   * Deletes the last character of the active input.
   */
  function handleBackspace() {
    if (hasError) {
      allClear();
      return;
    }
    
    // If output is reset state, do nothing
    if (currentInput === '0' || resetOnNextInput) {
      return;
    }
    
    // Remove last char
    if (currentInput.length > 1) {
      currentInput = currentInput.slice(0, -1);
    } else {
      currentInput = '0';
    }
    updateUI();
  }

  /**
   * Appends a digit or decimal point to the active input.
   * @param {string} val Digit or '.'
   */
  function handleDigit(val) {
    if (hasError) {
      allClear();
    }

    // Reset input if digit is pressed directly after a calculation (=)
    if (resetOnNextInput) {
      currentInput = val === '.' ? '0.' : val;
      resetOnNextInput = false;
      updateUI();
      return;
    }

    // Handle Decimal Point
    if (val === '.') {
      if (currentInput.includes('.')) {
        return; // Prevent multiple decimal points
      }
      currentInput += '.';
      updateUI();
      return;
    }

    // Handle Zero entry on starting state
    if (currentInput === '0') {
      currentInput = val;
    } else {
      currentInput += val;
    }
    updateUI();
  }

  /**
   * Toggles positive / negative signs on the active input.
   */
  function handleToggleSign() {
    if (hasError || currentInput === '0') return;

    if (currentInput.startsWith('-')) {
      currentInput = currentInput.substring(1);
    } else {
      currentInput = '-' + currentInput;
    }
    updateUI();
  }

  /**
   * Divides the active input by 100 to yield percentage.
   */
  function handlePercent() {
    if (hasError || currentInput === '0') return;

    const val = parseFloat(currentInput);
    currentInput = formatResult(val / 100);
    resetOnNextInput = true; // Overwrite this value on next digit press
    updateUI();
  }

  /**
   * Formats a floating-point number to prevent precision problems
   * e.g., 0.1 + 0.2 => 0.3. Limit output digits.
   * @param {number} value The arithmetic result
   * @returns {string} Formatted string
   */
  function formatResult(value) {
    if (isNaN(value)) return 'Error';
    if (!isFinite(value)) return 'Cannot divide by zero';
    
    // Check if number is an integer
    if (Number.isInteger(value)) {
      return value.toString();
    }
    
    // Float: Round to maximum 10 decimal digits to eliminate float inaccuracies,
    // then parse it back to remove unnecessary trailing zeros.
    const roundedValue = Number(Math.round(value + 'e10') + 'e-10');
    return roundedValue.toString();
  }

  /**
   * Parses and calculates a simple expression list tokens
   * respecting multiplication/division precedence first, then addition/subtraction.
   * @param {Array<string>} tokens E.g. ["12", "+", "5", "×", "3"]
   * @returns {number} The evaluated result
   */
  function evaluateTokens(tokens) {
    // Phase 1: Evaluate Multiplication and Division
    const firstPass = [];
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token === '×' || token === '÷') {
        const left = parseFloat(firstPass.pop());
        const right = parseFloat(tokens[++i]);
        
        if (token === '÷' && right === 0) {
          throw new Error('DivByZero');
        }
        
        const result = token === '×' ? left * right : left / right;
        firstPass.push(result.toString());
      } else {
        firstPass.push(token);
      }
    }

    // Phase 2: Evaluate Addition and Subtraction
    let accumulator = parseFloat(firstPass[0]);
    for (let i = 1; i < firstPass.length; i += 2) {
      const operator = firstPass[i];
      const rightVal = parseFloat(firstPass[i + 1]);
      if (operator === '+') {
        accumulator += rightVal;
      } else if (operator === '-') {
        accumulator -= rightVal;
      }
    }

    return accumulator;
  }

  /**
   * Processes operators (+, -, ×, ÷).
   * @param {string} op Unicode operator text (+, -, ×, ÷)
   */
  function handleOperator(op) {
    if (hasError) return;

    // Map computer action keys to standard unicode operators for display
    let displayOp = op;
    if (op === 'divide') displayOp = '÷';
    else if (op === 'multiply') displayOp = '×';
    else if (op === 'subtract') displayOp = '-';
    else if (op === 'add') displayOp = '+';

    // If result was just calculated, we can chain operations on it
    if (resetOnNextInput) {
      resetOnNextInput = false;
    }

    // Remove any trailing decimal point in the input
    if (currentInput.endsWith('.')) {
      currentInput = currentInput.slice(0, -1);
    }

    // If history has a calculation, check if active input is empty or defaults.
    // Standard chaining: if user clicks an operator when active input is empty,
    // we swap the operator in the history expression.
    if (historyExpression && currentInput === '0' && !resetOnNextInput) {
      const trimmed = historyExpression.trim();
      const lastChar = trimmed.slice(-1);
      
      if (['+', '-', '×', '÷'].includes(lastChar)) {
        // Swap last operator
        historyExpression = trimmed.slice(0, -1).trim() + ' ' + displayOp + ' ';
        updateUI();
        return;
      }
    }

    // Standard operator append
    historyExpression += currentInput + ' ' + displayOp + ' ';
    currentInput = '0';
    updateUI();
  }

  /**
   * Triggers the evaluation of the expression built in historyExpression + currentInput.
   */
  function handleCalculate() {
    if (hasError || !historyExpression) return;

    // Remove trailing decimal point from input
    if (currentInput.endsWith('.')) {
      currentInput = currentInput.slice(0, -1);
    }

    const fullExpr = historyExpression + currentInput;
    // Tokenize full expression by splitting spaces
    const tokens = fullExpr.trim().split(/\s+/);

    try {
      const resultValue = evaluateTokens(tokens);
      currentInput = formatResult(resultValue);
      historyExpression = ''; // Clear history display on successful calculation
      
      if (currentInput === 'Cannot divide by zero') {
        hasError = true;
      } else {
        resetOnNextInput = true; // Next digit input clears calculation output
        if (currentInput === '0') {
          triggerEggRain();
        }
      }
    } catch (err) {
      if (err.message === 'DivByZero') {
        currentInput = 'Cannot divide by zero';
        hasError = true;
      } else {
        currentInput = 'Error';
        hasError = true;
      }
      historyExpression = '';
    }

    updateUI();
  }

  // --------------------------------------------------------------------------
  // Grid Clicks Event Bindings
  // --------------------------------------------------------------------------
  calculator.addEventListener('click', (e) => {
    const target = e.target;
    
    // Check if element is a button
    if (!target.matches('button')) return;

    const action = target.dataset.action;
    const value = target.dataset.value;

    // Handle number clicks
    if (value !== undefined) {
      handleDigit(value);
      return;
    }

    // Handle actions
    switch (action) {
      case 'all-clear':
        allClear();
        break;
      case 'clear':
        clearCurrentInput();
        break;
      case 'backspace':
        handleBackspace();
        break;
      case 'percent':
        handlePercent();
        break;
      case 'toggle-sign':
        handleToggleSign();
        break;
      case 'add':
      case 'subtract':
      case 'multiply':
      case 'divide':
        handleOperator(action);
        break;
      case 'calculate':
        handleCalculate();
        break;
    }
  });

  // --------------------------------------------------------------------------
  // Keyboard Integration (tactile experience)
  // --------------------------------------------------------------------------
  document.addEventListener('keydown', (e) => {
    // Prevent default keyboard action for spaces or '/' to avoid scrolling or search triggers
    if (e.key === ' ' || e.key === '/') {
      e.preventDefault();
    }

    const key = e.key;

    // Digits
    if (/[0-9.]/.test(key)) {
      handleDigit(key);
      return;
    }

    // Operators
    switch (key) {
      case '+':
        handleOperator('add');
        break;
      case '-':
        handleOperator('subtract');
        break;
      case '*':
      case 'x':
      case 'X':
        handleOperator('multiply');
        break;
      case '/':
        handleOperator('divide');
        break;
      case '%':
        handlePercent();
        break;
      case 'Enter':
      case '=':
        handleCalculate();
        break;
      case 'Backspace':
        handleBackspace();
        break;
      case 'Escape':
        allClear();
        break;
      case 'c':
      case 'C':
        clearCurrentInput();
        break;
    }
  });

  /**
   * Synthesizes a funny chicken pop/cluck sound using Web Audio API.
   */
  function playCluckSound() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      
      function playTone(time, freq, duration) {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.4, time + duration);
        
        gainNode.gain.setValueAtTime(0.12, time);
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + duration);
      }
      
      // Play 3 rapid bursts representing a chicken cluck
      playTone(now, 750, 0.08);
      playTone(now + 0.07, 800, 0.08);
      playTone(now + 0.14, 600, 0.09);
    } catch (e) {
      console.warn('Audio synthesis failed or blocked by browser policies:', e);
    }
  }

  /**
   * Triggers the hidden Easter Egg celebration animation (Egg Rain + Bouncing).
   */
  function triggerEggRain() {
    // 1. Play POP / CLUCK sound
    playCluckSound();

    // 2. Display centered floating message
    const msg = document.createElement('div');
    msg.className = 'egg-rain-message';
    msg.textContent = '🥚 EGG RAIN! ZERO ACHIEVED! 🥚';
    document.body.appendChild(msg);

    // Remove message after animation finishes (4.5 seconds)
    setTimeout(() => {
      msg.remove();
    }, 4500);

    // 3. Rain down ~120 eggs
    const totalEggs = 120;
    const body = document.body;

    for (let i = 0; i < totalEggs; i++) {
      const egg = document.createElement('div');
      egg.className = 'raining-egg';
      egg.textContent = '🥚';

      // Random properties for physics simulation
      const size = Math.floor(Math.random() * 22) + 16; // 16px to 37px
      const left = Math.random() * 100; // 0% to 100% of viewport width
      const delay = Math.random() * 1.5; // Stagger animation start up to 1.5s
      const duration = Math.random() * 1.8 + 2.2; // Fall duration between 2.2s and 4s
      const drift = Math.floor(Math.random() * 240) - 120; // Drift sideways by -120px to 120px
      const spin = Math.floor(Math.random() * 720) + 360; // Spin between 360deg and 1080deg
      
      // Decide if this egg bounces (approx 40% bounce rate)
      const isBounce = Math.random() < 0.4;
      const animationType = isBounce ? 'egg-fall-bounce' : 'egg-fall-drift';
      const bounceFloor = Math.floor(Math.random() * 12) + 84; // Floor height between 84vh and 96vh

      // Set inline custom properties for CSS variables
      egg.style.left = `${left}%`;
      egg.style.setProperty('--egg-size', `${size}px`);
      egg.style.setProperty('--egg-anim', animationType);
      egg.style.setProperty('--egg-duration', `${duration}s`);
      egg.style.setProperty('--egg-delay', `${delay}s`);
      egg.style.setProperty('--egg-drift', `${drift}px`);
      egg.style.setProperty('--egg-rot', `${spin}deg`);
      
      if (isBounce) {
        egg.style.setProperty('--bounce-floor', `${bounceFloor}vh`);
      }

      body.appendChild(egg);

      // Clean up each egg node after its animation cycle concludes to prevent memory leaks
      const totalLifetimeMs = (delay + duration) * 1000 + 100;
      setTimeout(() => {
        egg.remove();
      }, totalLifetimeMs);
    }
  }

  // Watch for window resize to fix active mobile vs desktop sizing instantly
  window.addEventListener('resize', adjustFontSize);

  // Initialize display state
  updateUI();
});
