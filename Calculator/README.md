# Calculator | YS.Creates

A premium, modern, professional, and fully responsive calculator web application designed with a clean light theme, soft layered shadows, and glassmorphic card elements. Built with pure **HTML5**, **CSS3**, and **Vanilla JavaScript**.

## Brand Name
**YS.Creates**

---

## Features
- **Premium Light Design**: Features soft borders, layered drop shadows, and modern typography using the Google Font *Poppins*.
- **Tactile Transitions**: Features subtle scale transitions (`scale(0.94)`) and hover animations representing key press actions.
- **Dual-line Display**: Displays both active input values and historical operations history in right-aligned, overflow-protected display elements.
- **Dynamic Text Scaling**: Automatically adjusts input display text size as characters grow (e.g. from `2.25rem` down to `1.25rem`) to prevent wrapping or truncation.
- **Arithmetic Engine**: Safe math parser evaluates addition (+), subtraction (-), multiplication (×), and division (÷) with mathematical operator precedence.
- **Floating Point Correction**: Avoids common JavaScript float representation issues (e.g. `0.1 + 0.2` returns `0.3` instead of `0.30000000000000004`).
- **Additional Functionalities**:
  - `C` Clears the active input.
  - `AC` Performs a cold reset of all active registers.
  - `⌫` Backspace deletes the last entered character.
  - `%` Percentage key converts the current value to a fraction of 100 instantly.
  - `±` Sign-toggle switch flips values between positive and negative.
- **Keyboard Support**: Complete keyboard listener integration supports digits (`0`-`9`), operators (`+`, `-`, `*`, `/`), clear/backspace, percentage (`%`), and calculate (`Enter` or `=`).
- **Hidden Easter Egg Celebration**: Whenever a calculation results in exactly `0` (zero), a hidden celebration triggers: plays a Web Audio API-synthesized pop/cluck sound, displays a centered floating `🥚 EGG RAIN! ZERO ACHIEVED! 🥚` banner, and rains down 120 eggs from the top of the screen with simulated gravity physics (random delays, rotations, drift, sizing, and single bounce floors).

---

## Folder Structure
```
Calculator/
│
├── index.html
├── style.css
├── script.js
├── README.md
│
├── assets/
│   ├── icons/
│   ├── images/
│   └── fonts/
│
└── screenshots/
    └── calculator-preview.png (preview image of the application)
```

---

## Technologies Used
- **HTML5**: Semantic tags, ARIA alert status labels, accessible input structure.
- **CSS3**: CSS Custom Properties, layout resets, flex grids, responsive media queries, CSS hover & active states, and custom keyframes.
- **Vanilla JavaScript**: State machine variables, event listener delegation, custom token tokenizer, operator precedence evaluation, float scaling routines, and responsive event checks.

---

## How to Run the Project
1. Download or clone this repository.
2. Navigate to the `Calculator/` directory.
3. Open `index.html` in any modern web browser (Google Chrome, Safari, Mozilla Firefox, Brave, Microsoft Edge).
4. The calculator works completely offline; no database servers or active network connections are required.

---

## Future Improvements
- **Scientific Mode**: Expand operations to support trigonometric, logarithmic, and power functions.
- **History log panel**: Implement a toggleable sliding panel storing past calculations.
- **Multiple Theme toggle**: Add a dark mode or custom theme selection using CSS variable updates.
