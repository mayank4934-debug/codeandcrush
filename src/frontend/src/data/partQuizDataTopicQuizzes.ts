// Topic-based Part Quiz Data — Frontend, Python, Backend domains
// Keys match topic names used in course module parts
import type {
  PartMCQ,
  PartProgrammingQuestion,
  PartQuizData,
} from "./partQuizData";

function mcq(
  id: string,
  question: string,
  options: [string, string, string, string],
  correct: 0 | 1 | 2 | 3,
  explanation: string,
): PartMCQ {
  return { id, question, options, correct, explanation, xp: 5 };
}

function pq(
  id: string,
  title: string,
  description: string,
  examples: { input: string; output: string }[],
  starterCode: string,
  languageId: number,
  languageLabel: string,
  hints: [string, string, string],
  solutionKeywords: string[],
): PartProgrammingQuestion {
  return {
    id,
    title,
    description,
    examples,
    starterCode,
    languageId,
    languageLabel,
    hints,
    solutionKeywords,
    xp: 20,
  };
}

// ─── FRONTEND: HTML Basics ────────────────────────────────────────────────────
const FE_HTML_BASICS: PartQuizData = {
  mcqs: [
    mcq(
      "fe-html-1",
      "What does HTML stand for?",
      [
        "Hyper Text Markup Language",
        "High Text Machine Language",
        "Hyper Transfer Markup Language",
        "HyperText Making Language",
      ],
      0,
      "HTML = HyperText Markup Language — the backbone of all web pages.",
    ),
    mcq(
      "fe-html-2",
      "Which tag defines the document type in HTML5?",
      ["<html>", "<!DOCTYPE html>", "<head>", "<meta>"],
      1,
      "<!DOCTYPE html> tells the browser to use HTML5 standards mode.",
    ),
    mcq(
      "fe-html-3",
      "Which tag is the root of an HTML document?",
      ["<body>", "<head>", "<html>", "<root>"],
      2,
      "<html> is the root element wrapping all other HTML elements.",
    ),
    mcq(
      "fe-html-4",
      "Which tag contains metadata like title and CSS links?",
      ["<meta>", "<header>", "<head>", "<info>"],
      2,
      "<head> contains metadata, <title>, and linked resources.",
    ),
    mcq(
      "fe-html-5",
      "Which tag creates an ordered list?",
      ["<ul>", "<ol>", "<li>", "<list>"],
      1,
      "<ol> creates a numbered ordered list; <ul> creates a bulleted unordered list.",
    ),
    mcq(
      "fe-html-6",
      "Which tag creates a hyperlink?",
      ["<link>", "<url>", "<href>", "<a>"],
      3,
      "<a href='...'>text</a> defines a hyperlink in HTML.",
    ),
    mcq(
      "fe-html-7",
      "Which attribute specifies the link destination?",
      ["src", "link", "href", "url"],
      2,
      "href (HyperText Reference) sets the destination URL of a link.",
    ),
    mcq(
      "fe-html-8",
      "Which tag embeds an image?",
      ["<picture>", "<image>", "<photo>", "<img>"],
      3,
      "<img src='...' alt='...'> embeds an image; it is a void (self-closing) element.",
    ),
    mcq(
      "fe-html-9",
      "Which tag creates a text input field in a form?",
      ["<field>", "<textbox>", "<input type='text'>", "<text>"],
      2,
      "<input type='text'> renders a single-line text entry field.",
    ),
    mcq(
      "fe-html-10",
      "What does the alt attribute on <img> do?",
      [
        "Sets image size",
        "Provides fallback text for accessibility",
        "Loads alternative image",
        "Sets image color",
      ],
      1,
      "alt provides descriptive text for screen readers and when the image fails to load.",
    ),
    mcq(
      "fe-html-11",
      "Which tag defines a table data cell?",
      ["<th>", "<tr>", "<cell>", "<td>"],
      3,
      "<td> defines a standard data cell inside a <tr> row.",
    ),
    mcq(
      "fe-html-12",
      "Which HTML5 tag represents the main page content?",
      ["<body>", "<content>", "<main>", "<section>"],
      2,
      "<main> marks the dominant, primary content of the document.",
    ),
    mcq(
      "fe-html-13",
      "Which tag is used for multi-line text input?",
      ["<input type='multiline'>", "<textfield>", "<textarea>", "<bigtext>"],
      2,
      "<textarea> creates a multi-line text input control.",
    ),
    mcq(
      "fe-html-14",
      "Block-level elements start on:",
      [
        "Same line as previous",
        "A new line",
        "Inside inline elements only",
        "Only inside <div>",
      ],
      1,
      "Block-level elements (div, p, h1) always start on a new line and take full width.",
    ),
    mcq(
      "fe-html-15",
      "Which attribute uniquely identifies an element?",
      ["class", "name", "id", "key"],
      2,
      "id must be unique per page; it's used for CSS targeting and JS selection.",
    ),
  ],
  programmingQuestions: [
    pq(
      "fe-html-pq1",
      "Contact Form",
      "Write an HTML form with fields for name (text), email (email, required), and a submit button. Use proper labels with for/id linkage.",
      [{ input: "No input", output: "Valid accessible HTML form" }],
      `<!DOCTYPE html>
<html lang="en">
<head><title>Contact</title></head>
<body>
  <form action="/submit" method="post">
    <!-- Add name field with label -->
    <!-- Add email field (required) with label -->
    <!-- Add submit button -->
  </form>
</body>
</html>`,
      63,
      "HTML",
      [
        "Use <label for='name'> linked to <input id='name'>",
        "Add required attribute on email input: <input type='email' required>",
        `<label for="name">Name:</label>\n<input type="text" id="name" name="name">\n<label for="email">Email:</label>\n<input type="email" id="email" name="email" required>\n<input type="submit" value="Send">`,
      ],
      ["label", "input", "required", 'type="email"', 'type="submit"'],
    ),
    pq(
      "fe-html-pq2",
      "Semantic Navigation Bar",
      "Write a semantic HTML5 navigation bar using <nav> with an unordered list of three links: Home, About, Contact.",
      [{ input: "No input", output: "Semantic nav with 3 anchor links" }],
      `<!DOCTYPE html>
<html lang="en">
<body>
  <!-- Add a <nav> with <ul> containing 3 <li><a href="#">...</a></li> -->
</body>
</html>`,
      63,
      "HTML",
      [
        "Wrap everything in <nav>",
        "Use <ul> and <li> for list structure",
        `<nav>\n  <ul>\n    <li><a href="#">Home</a></li>\n    <li><a href="#">About</a></li>\n    <li><a href="#">Contact</a></li>\n  </ul>\n</nav>`,
      ],
      ["nav", "ul", "li", "a", "href"],
    ),
  ],
};

// ─── FRONTEND: CSS Fundamentals ───────────────────────────────────────────────
const FE_CSS_FUNDAMENTALS: PartQuizData = {
  mcqs: [
    mcq(
      "fe-css-1",
      "What does CSS stand for?",
      [
        "Creative Style Sheets",
        "Computer Style Sheets",
        "Cascading Style Sheets",
        "Colorful Style Sheets",
      ],
      2,
      "CSS = Cascading Style Sheets — controls the visual presentation of HTML.",
    ),
    mcq(
      "fe-css-2",
      "Which property sets the text color?",
      ["font-color", "text-color", "color", "foreground"],
      2,
      "The color property sets the foreground (text) color.",
    ),
    mcq(
      "fe-css-3",
      "The box model includes (from inside out):",
      [
        "content → border → padding → margin",
        "margin → border → padding → content",
        "content → padding → border → margin",
        "padding → content → margin → border",
      ],
      2,
      "Box model order: content → padding → border → margin.",
    ),
    mcq(
      "fe-css-4",
      "Which CSS value makes an element invisible but still takes space?",
      ["display: none", "opacity: 0", "visibility: hidden", "Both B and C"],
      2,
      "visibility: hidden hides the element but preserves its space; opacity:0 also keeps space.",
    ),
    mcq(
      "fe-css-5",
      "Flexbox direction is set with:",
      ["flex-align", "flex-flow", "flex-direction", "flex-axis"],
      2,
      "flex-direction sets the main axis (row or column) for flex items.",
    ),
    mcq(
      "fe-css-6",
      "To center a flex child horizontally and vertically, use:",
      [
        "align-items: center; justify-content: center",
        "text-align: center; margin: auto",
        "position: center; display: flex",
        "float: center; clear: both",
      ],
      0,
      "On the flex container: justify-content: center (main axis) + align-items: center (cross axis).",
    ),
    mcq(
      "fe-css-7",
      "CSS Grid creates layout with:",
      [
        "Rows only",
        "Columns only",
        "Both rows and columns simultaneously",
        "Float-based layout",
      ],
      2,
      "CSS Grid is a 2D layout system controlling both rows and columns.",
    ),
    mcq(
      "fe-css-8",
      "Which selector targets elements with class 'btn'?",
      ["#btn", ".btn", "btn", "*btn"],
      1,
      ".btn is the class selector — targets all elements with class='btn'.",
    ),
    mcq(
      "fe-css-9",
      "media queries are used for:",
      [
        "Querying a database",
        "Applying styles based on screen size/device",
        "Loading media files",
        "Creating animations",
      ],
      1,
      "@media queries allow conditional CSS rules based on viewport width, orientation, etc.",
    ),
    mcq(
      "fe-css-10",
      "Which property controls space INSIDE the border?",
      ["margin", "spacing", "padding", "gap"],
      2,
      "padding is the space between the content and the border.",
    ),
    mcq(
      "fe-css-11",
      "CSS specificity: which has highest weight?",
      [
        "Class selector",
        "Element selector",
        "ID selector",
        "Universal selector (*)",
      ],
      2,
      "ID selectors (#id) have the highest specificity (100 points) among regular selectors.",
    ),
    mcq(
      "fe-css-12",
      "What does position: absolute do?",
      [
        "Positions relative to viewport",
        "Removes from normal flow, positioned relative to nearest positioned ancestor",
        "Same as position: fixed",
        "Floats the element left",
      ],
      1,
      "absolute removes the element from flow and positions it relative to its nearest positioned ancestor.",
    ),
    mcq(
      "fe-css-13",
      "grid-template-columns: repeat(3, 1fr) creates:",
      [
        "3 rows of equal height",
        "3 equal-width columns",
        "3 items with fixed px width",
        "A 3x3 grid",
      ],
      1,
      "repeat(3, 1fr) creates 3 columns each taking 1 fraction of available space.",
    ),
    mcq(
      "fe-css-14",
      "The CSS 'inherit' keyword means:",
      [
        "Copy value from parent element",
        "Use the initial default value",
        "Set to zero",
        "Remove the property",
      ],
      0,
      "inherit makes the element take its computed value from its parent.",
    ),
    mcq(
      "fe-css-15",
      "Which CSS property creates a responsive font size relative to viewport?",
      ["px", "em", "vw / vh", "rem"],
      2,
      "vw (viewport width) and vh (viewport height) are relative to the browser window size.",
    ),
  ],
  programmingQuestions: [
    pq(
      "fe-css-pq1",
      "Center a Div",
      "Write CSS to center a 200×200px div both horizontally and vertically on the full viewport using Flexbox on the body.",
      [{ input: "No input", output: "Div centered in viewport" }],
      `body {
  /* Make body a flex container */
}

.box {
  width: 200px;
  height: 200px;
  background: coral;
  /* Already sized, just needs centering */
}`,
      63,
      "CSS",
      [
        "Set body to display: flex",
        "Add justify-content: center and align-items: center",
        "Also set body height to 100vh",
      ],
      [
        "display: flex",
        "justify-content: center",
        "align-items: center",
        "height: 100vh",
      ],
    ),
    pq(
      "fe-css-pq2",
      "Responsive 3-Column Grid",
      "Write CSS using Grid to create a layout that shows 3 columns on screens ≥768px and 1 column on smaller screens.",
      [{ input: "No input", output: "3-col grid desktop, 1-col mobile" }],
      `.grid {
  display: grid;
  /* Default: 1 column */
}

/* Add media query for 3 columns on ≥768px */`,
      63,
      "CSS",
      [
        "Start with grid-template-columns: 1fr for mobile",
        "Use @media (min-width: 768px) { .grid { ... } }",
        "@media (min-width: 768px) {\n  .grid {\n    grid-template-columns: repeat(3, 1fr);\n  }\n}",
      ],
      [
        "display: grid",
        "grid-template-columns",
        "@media",
        "min-width: 768px",
        "repeat(3, 1fr)",
      ],
    ),
  ],
};

// ─── FRONTEND: JavaScript Basics ─────────────────────────────────────────────
const FE_JS_BASICS: PartQuizData = {
  mcqs: [
    mcq(
      "fe-js-1",
      "Which keyword declares a block-scoped variable in modern JS?",
      ["var", "let", "dim", "variable"],
      1,
      "let declares a block-scoped variable; const is for constants. var is function-scoped.",
    ),
    mcq(
      "fe-js-2",
      "What does === check compared to ==?",
      [
        "No difference",
        "=== is slower",
        "=== checks value AND type (strict equality)",
        "=== only checks type",
      ],
      2,
      "=== is strict equality — it checks both value and type without coercion.",
    ),
    mcq(
      "fe-js-3",
      "What does typeof [] return in JavaScript?",
      ['"array"', '"list"', '"object"', '"undefined"'],
      2,
      "Arrays are objects in JS; typeof [] returns 'object'. Use Array.isArray() to check arrays.",
    ),
    mcq(
      "fe-js-4",
      "Arrow function syntax for (x) => x * 2 is equivalent to:",
      [
        "function(x) { return x * 2; }",
        "const f = function(x) { x * 2; }",
        "x.map(2)",
        "function x(2)",
      ],
      0,
      "Arrow functions provide concise syntax; the implicit return works for single-expression bodies.",
    ),
    mcq(
      "fe-js-5",
      "What does Array.prototype.map() do?",
      [
        "Filters elements",
        "Transforms each element and returns new array",
        "Reduces to a single value",
        "Sorts the array",
      ],
      1,
      "map() applies a callback to each element and returns a new array of results.",
    ),
    mcq(
      "fe-js-6",
      "What is a closure in JavaScript?",
      [
        "A loop construct",
        "A function that retains access to its outer scope after that scope has returned",
        "A private class",
        "An ES6 module",
      ],
      1,
      "A closure is a function that captures and remembers variables from its enclosing lexical scope.",
    ),
    mcq(
      "fe-js-7",
      "document.getElementById('id') returns:",
      [
        "A string",
        "The first matching DOM element",
        "All matching elements",
        "A CSS selector",
      ],
      1,
      "getElementById returns the single Element with the matching id, or null if not found.",
    ),
    mcq(
      "fe-js-8",
      "Which event fires when a button is clicked?",
      ["onhover", "onpress", "onclick / click", "ontouch"],
      2,
      "The click event fires on mouse click and touch tap; add via addEventListener('click', fn).",
    ),
    mcq(
      "fe-js-9",
      "What does event.preventDefault() do?",
      [
        "Stops event bubbling",
        "Prevents the browser's default action for the event",
        "Removes the event listener",
        "Logs the event",
      ],
      1,
      "preventDefault() stops the browser's built-in behavior (e.g., form submission, link navigation).",
    ),
    mcq(
      "fe-js-10",
      "What does async/await do?",
      [
        "Creates a loop",
        "Allows writing asynchronous code in synchronous style using Promises",
        "Creates a new thread",
        "Pauses the event loop",
      ],
      1,
      "async/await is syntactic sugar over Promises for cleaner asynchronous code.",
    ),
    mcq(
      "fe-js-11",
      "Promise.all([p1, p2]) resolves when:",
      [
        "p1 resolves",
        "Either resolves first",
        "All promises resolve",
        "Any rejects",
      ],
      2,
      "Promise.all waits for all promises to resolve, or rejects if any one rejects.",
    ),
    mcq(
      "fe-js-12",
      "What does JSON.stringify() do?",
      [
        "Parses a JSON string",
        "Converts a JS object to a JSON string",
        "Logs an object",
        "Clones an object",
      ],
      1,
      "JSON.stringify() serializes a JavaScript value to a JSON-formatted string.",
    ),
    mcq(
      "fe-js-13",
      "Which array method removes and returns the last element?",
      ["shift()", "unshift()", "splice()", "pop()"],
      3,
      "pop() removes and returns the last element of an array (mutating).",
    ),
    mcq(
      "fe-js-14",
      "Spread operator ... on an array does:",
      [
        "Creates a reference",
        "Merges two objects",
        "Expands the array into individual elements",
        "Sorts the array",
      ],
      2,
      "Spread (...arr) expands an iterable into individual elements, useful for copying or merging.",
    ),
    mcq(
      "fe-js-15",
      "The fetch() API returns:",
      [
        "Raw response text",
        "A Promise that resolves to a Response object",
        "JSON directly",
        "An XMLHttpRequest",
      ],
      1,
      "fetch() returns a Promise resolving to a Response; call .json() on it to parse.",
    ),
  ],
  programmingQuestions: [
    pq(
      "fe-js-pq1",
      "Array Manipulation",
      "Write a JavaScript function filterAndDouble(arr) that filters out odd numbers from an array and doubles the remaining even numbers. Return the new array.",
      [{ input: "[1, 2, 3, 4, 5, 6]", output: "[4, 8, 12]" }],
      `function filterAndDouble(arr) {
  // Filter even numbers, then double each
}

// Test
console.log(filterAndDouble([1, 2, 3, 4, 5, 6])); // [4, 8, 12]`,
      63,
      "JavaScript",
      [
        "Use .filter(n => n % 2 === 0) to keep even numbers",
        "Chain .map(n => n * 2) to double them",
        "return arr.filter(n => n % 2 === 0).map(n => n * 2);",
      ],
      ["filter", "map", "% 2", "return"],
    ),
    pq(
      "fe-js-pq2",
      "Async Fetch Data",
      "Write an async function fetchUser(url) that fetches JSON from a URL using fetch(), handles errors with try/catch, and returns the parsed data. On error, return null.",
      [
        {
          input: "https://api.example.com/user/1",
          output: "Parsed JSON object or null on error",
        },
      ],
      `async function fetchUser(url) {
  // Use try/catch with await fetch()
}`,
      63,
      "JavaScript",
      [
        "Use async function with try/catch",
        "const res = await fetch(url); const data = await res.json();",
        "async function fetchUser(url) {\n  try {\n    const res = await fetch(url);\n    return await res.json();\n  } catch { return null; }\n}",
      ],
      ["async", "await", "fetch", "try", "catch", "json()"],
    ),
  ],
};

// ─── FRONTEND: React Basics ───────────────────────────────────────────────────
const FE_REACT_BASICS: PartQuizData = {
  mcqs: [
    mcq(
      "fe-react-1",
      "React components must return:",
      ["A string", "An array only", "JSX (or null)", "An HTML document"],
      2,
      "React components return JSX (transpiled to React.createElement calls) or null.",
    ),
    mcq(
      "fe-react-2",
      "Props in React are:",
      [
        "Mutable internal state",
        "Read-only inputs passed from parent to child",
        "Global variables",
        "CSS class names",
      ],
      1,
      "Props (properties) are immutable data passed down from parent components.",
    ),
    mcq(
      "fe-react-3",
      "useState hook returns:",
      [
        "Only the state value",
        "Only the setter function",
        "[state, setState] tuple",
        "A Promise",
      ],
      2,
      "useState returns [currentValue, setterFunction] — destructure to use both.",
    ),
    mcq(
      "fe-react-4",
      "When does a component re-render?",
      [
        "Never automatically",
        "Only on page reload",
        "When state or props change",
        "Every second",
      ],
      2,
      "React re-renders a component when its state changes (setState) or new props are received.",
    ),
    mcq(
      "fe-react-5",
      "useEffect(() => { ... }, []) runs:",
      [
        "On every render",
        "Never",
        "Only once after the first render (mount)",
        "Only on unmount",
      ],
      2,
      "An empty dependency array [] makes useEffect run only once after the initial mount.",
    ),
    mcq(
      "fe-react-6",
      "What is JSX?",
      [
        "A JavaScript library",
        "A syntax extension that looks like HTML inside JavaScript",
        "A CSS preprocessor",
        "A build tool",
      ],
      1,
      "JSX is syntactic sugar for React.createElement() calls — it looks like HTML in JS files.",
    ),
    mcq(
      "fe-react-7",
      "Keys in React lists are used to:",
      [
        "Style list items",
        "Help React identify which items changed, were added, or removed",
        "Sort the list",
        "Bind event handlers",
      ],
      1,
      "Unique keys let React efficiently reconcile DOM changes in dynamic lists.",
    ),
    mcq(
      "fe-react-8",
      "To handle a button click in React:",
      [
        "<button onclick='fn()'>",
        "<button onClick={fn}>",
        "<button on-click={fn}>",
        "<button handle={fn}>",
      ],
      1,
      "React uses camelCase event names: onClick, onChange, onSubmit.",
    ),
    mcq(
      "fe-react-9",
      "What is the virtual DOM?",
      [
        "A real separate browser DOM",
        "A lightweight in-memory representation React uses before updating the real DOM",
        "A database of DOM nodes",
        "CSS variables",
      ],
      1,
      "React's virtual DOM is an in-memory object tree. React diffs it with the real DOM for minimal updates.",
    ),
    mcq(
      "fe-react-10",
      "Lifting state up means:",
      [
        "Storing state in localStorage",
        "Moving shared state to the closest common ancestor",
        "Using Redux",
        "Creating global variables",
      ],
      1,
      "When sibling components need shared state, lift it to their common parent and pass as props.",
    ),
    mcq(
      "fe-react-11",
      "React fragments (<></>) are used to:",
      [
        "Add extra styling",
        "Return multiple elements without a wrapper DOM node",
        "Create portals",
        "Handle errors",
      ],
      1,
      "Fragments let components return multiple JSX children without adding an extra HTML wrapper.",
    ),
    mcq(
      "fe-react-12",
      "Controlled components in forms mean:",
      [
        "The browser manages input state",
        "React state controls the input value via value and onChange",
        "Using uncontrolled refs only",
        "Disabling the input",
      ],
      1,
      "A controlled input has its value driven by React state — every keystroke updates state.",
    ),
    mcq(
      "fe-react-13",
      "What does React.memo() do?",
      [
        "Adds a memo feature to the app",
        "Memoizes a component to prevent re-renders when props haven't changed",
        "Creates a note-taking component",
        "Manages memory allocation",
      ],
      1,
      "React.memo() is a HOC that skips re-rendering if the component's props haven't changed.",
    ),
    mcq(
      "fe-react-14",
      "Context API is used to:",
      [
        "Make HTTP requests",
        "Share state across many components without prop drilling",
        "Create class components",
        "Style components",
      ],
      1,
      "Context provides a way to pass data through the component tree without manual prop drilling.",
    ),
    mcq(
      "fe-react-15",
      "Which hook replaces componentDidMount, componentDidUpdate, and componentWillUnmount?",
      ["useState", "useCallback", "useRef", "useEffect"],
      3,
      "useEffect covers all three lifecycle phases based on the dependency array and return value.",
    ),
  ],
  programmingQuestions: [
    pq(
      "fe-react-pq1",
      "Counter Component",
      "Build a React functional component Counter that shows a count starting at 0. Clicking '+' increments it, '-' decrements it, and 'Reset' sets it back to 0.",
      [{ input: "Click +, +, -, Reset", output: "Shows 2, then 1, then 0" }],
      `import { useState } from 'react';

function Counter() {
  // Declare state for count
  
  return (
    <div>
      {/* Display count and add buttons */}
    </div>
  );
}

export default Counter;`,
      63,
      "JavaScript",
      [
        "const [count, setCount] = useState(0);",
        "Use onClick={() => setCount(count + 1)} on the + button",
        "const [count, setCount] = useState(0);\nreturn (\n  <div>\n    <p>{count}</p>\n    <button onClick={() => setCount(c => c + 1)}>+</button>\n    <button onClick={() => setCount(c => c - 1)}>-</button>\n    <button onClick={() => setCount(0)}>Reset</button>\n  </div>\n);",
      ],
      ["useState", "setCount", "onClick", "count"],
    ),
    pq(
      "fe-react-pq2",
      "Dynamic List Component",
      "Build a React component ItemList that accepts an array of strings as a prop items and renders them as a <ul> with <li> elements. Each item must have a unique key.",
      [
        {
          input: 'items={["Apple", "Banana", "Cherry"]}',
          output: "Rendered ul with 3 li elements",
        },
      ],
      `function ItemList({ items }) {
  return (
    <ul>
      {/* Map items to <li> elements with keys */}
    </ul>
  );
}

export default ItemList;`,
      63,
      "JavaScript",
      [
        "Use items.map((item, index) => <li key={index}>{item}</li>)",
        "Prefer unique string keys over index when available",
        "return (\n  <ul>\n    {items.map((item, i) => (\n      <li key={i}>{item}</li>\n    ))}\n  </ul>\n);",
      ],
      ["map", "key", "li", "ul", "items"],
    ),
  ],
};

// ─── FRONTEND: TypeScript ─────────────────────────────────────────────────────
const FE_TYPESCRIPT: PartQuizData = {
  mcqs: [
    mcq(
      "fe-ts-1",
      "TypeScript is:",
      [
        "A new programming language unrelated to JS",
        "A JavaScript superset that adds static typing",
        "A CSS preprocessor",
        "A Python framework",
      ],
      1,
      "TypeScript is a strict superset of JavaScript that adds optional static typing.",
    ),
    mcq(
      "fe-ts-2",
      "How do you declare a string variable in TypeScript?",
      [
        "var x = string",
        "let x: string = 'hello'",
        "string x = 'hello'",
        "declare x as string",
      ],
      1,
      "TypeScript uses type annotations after a colon: let name: string = 'hello'.",
    ),
    mcq(
      "fe-ts-3",
      "What is an interface in TypeScript?",
      [
        "A class with no methods",
        "A contract defining the shape of an object",
        "A built-in utility type",
        "A generic type parameter",
      ],
      1,
      "An interface defines a type contract for object shape, usable for type-checking without runtime overhead.",
    ),
    mcq(
      "fe-ts-4",
      "What does the ? after a property name mean in TypeScript?",
      [
        "It's a private property",
        "The property is optional",
        "It returns a Promise",
        "It's a nullable type",
      ],
      1,
      "propertyName?: type marks the property as optional — it may or may not be present.",
    ),
    mcq(
      "fe-ts-5",
      "What are generics in TypeScript?",
      [
        "Arrays of any type",
        "Type variables that allow components to work with multiple types while remaining type-safe",
        "Union types",
        "Runtime type checks",
      ],
      1,
      "Generics (<T>) allow writing reusable code that works with any type while maintaining type safety.",
    ),
    mcq(
      "fe-ts-6",
      "Union type string | number means:",
      [
        "A value that is both string and number",
        "A value that can be either string or number",
        "A concatenation",
        "An intersection",
      ],
      1,
      "Union types (A | B) allow a variable to hold values of either type.",
    ),
    mcq(
      "fe-ts-7",
      "The type 'never' represents:",
      [
        "An undefined value",
        "A value that never occurs (e.g., a function that always throws)",
        "The same as null",
        "An empty object",
      ],
      1,
      "never is used for functions that never return (always throw or loop forever) and exhaustive checks.",
    ),
    mcq(
      "fe-ts-8",
      "TypeScript enum creates:",
      [
        "A runtime object with named numeric/string constants",
        "Only a type, no runtime code",
        "A class",
        "A module",
      ],
      0,
      "Enums in TypeScript compile to JavaScript objects with bidirectional name/value mappings.",
    ),
    mcq(
      "fe-ts-9",
      "type vs interface: key difference?",
      [
        "Interfaces can be merged (declaration merging); types cannot",
        "Types are runtime; interfaces compile-time only",
        "Types are slower",
        "No difference",
      ],
      0,
      "Interfaces support declaration merging (multiple declarations combine). type aliases cannot be reopened.",
    ),
    mcq(
      "fe-ts-10",
      "What does as keyword do in TypeScript?",
      [
        "Type assertion — tells the compiler to treat a value as a specific type",
        "Imports a module",
        "Creates an alias",
        "Casts to runtime type",
      ],
      0,
      "Type assertions (value as Type) tell the TS compiler you know the type better than it does.",
    ),
    mcq(
      "fe-ts-11",
      "Readonly<T> utility type:",
      [
        "Makes all properties required",
        "Makes all properties readonly",
        "Makes all properties optional",
        "Makes all types strings",
      ],
      1,
      "Readonly<T> creates a type where all properties are read-only (cannot be mutated).",
    ),
    mcq(
      "fe-ts-12",
      "What is a type guard?",
      [
        "A decorator",
        "A runtime check that narrows a type within a conditional block",
        "A generic constraint",
        "An enum",
      ],
      1,
      "Type guards (typeof, instanceof, custom is checks) narrow types in conditional branches.",
    ),
    mcq(
      "fe-ts-13",
      "Array<T> is equivalent to:",
      ["Record<T>", "T[]", "ReadonlyArray<T>", "Tuple<T>"],
      1,
      "Array<T> and T[] are equivalent; both declare an array of type T.",
    ),
    mcq(
      "fe-ts-14",
      "Intersection type A & B means:",
      [
        "Either A or B",
        "A value that has all properties of both A and B",
        "A minus B",
        "A or B but not both",
      ],
      1,
      "Intersection types (A & B) combine multiple types into one with all their members.",
    ),
    mcq(
      "fe-ts-15",
      "TypeScript .ts files are compiled to:",
      [".html files", ".css files", ".js files", ".json files"],
      2,
      "TypeScript compiler (tsc) outputs .js files that run in any JavaScript environment.",
    ),
  ],
  programmingQuestions: [
    pq(
      "fe-ts-pq1",
      "Type a Function",
      "Write a TypeScript function add(a: number, b: number): number that returns the sum. Also write a generic function identity<T>(value: T): T that returns its argument unchanged.",
      [{ input: "add(3, 4) / identity('hello')", output: "7 / 'hello'" }],
      `// Typed addition function
function add(a: number, b: number): number {
  // return sum
}

// Generic identity function
function identity<T>(value: T): T {
  // return value unchanged
}`,
      63,
      "TypeScript",
      [
        "Return a + b for the add function",
        "Return value directly for identity<T>",
        "function add(a: number, b: number): number { return a + b; }\nfunction identity<T>(value: T): T { return value; }",
      ],
      ["number", "return", "generic", "<T>", "identity"],
    ),
    pq(
      "fe-ts-pq2",
      "Define an Interface",
      "Define a TypeScript interface User with required fields id (number), name (string), email (string), and optional field age (number). Then write a function greetUser(user: User): string that returns 'Hello, {name}!'.",
      [
        {
          input: 'greetUser({id:1, name:"Alice", email:"a@b.com"})',
          output: '"Hello, Alice!"',
        },
      ],
      `// Define User interface
interface User {
  // Add fields here
}

// Function using the interface
function greetUser(user: User): string {
  // return greeting
}`,
      63,
      "TypeScript",
      [
        "interface User { id: number; name: string; email: string; age?: number; }",
        "The ? makes age optional",
        "interface User { id: number; name: string; email: string; age?: number; }\nfunction greetUser(u: User): string { return `Hello, ${u.name}!`; }",
      ],
      ["interface", "User", "number", "string", "optional", "age?"],
    ),
  ],
};

// ─── PYTHON: Python Basics ────────────────────────────────────────────────────
const PY_BASICS: PartQuizData = {
  mcqs: [
    mcq(
      "py-basics-1",
      "Which function prints output in Python?",
      ["echo()", "console.log()", "print()", "write()"],
      2,
      "print() is Python's built-in function for outputting text to the console.",
    ),
    mcq(
      "py-basics-2",
      "How do you read user input in Python?",
      ["read()", "input()", "scanf()", "cin >>"],
      1,
      "input() reads a line from stdin as a string.",
    ),
    mcq(
      "py-basics-3",
      "Python uses ___ to define code blocks instead of {}.",
      ["Semicolons", "Parentheses", "Indentation", "BEGIN/END keywords"],
      2,
      "Python mandates consistent indentation (spaces or tabs) to define block structure.",
    ),
    mcq(
      "py-basics-4",
      "What is the data type of 3.14 in Python?",
      ["int", "double", "float", "decimal"],
      2,
      "3.14 is a float (IEEE 754 double-precision floating-point) in Python.",
    ),
    mcq(
      "py-basics-5",
      "How do you convert the string '42' to an integer?",
      ["convert('42')", "int('42')", "Integer('42')", "num('42')"],
      1,
      "int() casts a string to an integer; raises ValueError if the string is not a valid integer.",
    ),
    mcq(
      "py-basics-6",
      "What does # do in Python?",
      [
        "Starts a block comment",
        "Starts a single-line comment",
        "Creates a heading",
        "Imports a module",
      ],
      1,
      "# starts a single-line comment — Python ignores everything after it on that line.",
    ),
    mcq(
      "py-basics-7",
      "Which is a valid Python variable name?",
      ["2score", "my-var", "_total", "for"],
      2,
      "_total is valid; names can't start with a digit, contain hyphens, or be a reserved keyword.",
    ),
    mcq(
      "py-basics-8",
      "Python is ___ typed.",
      ["Statically", "Dynamically", "Weakly", "Strictly statically"],
      1,
      "Python uses dynamic typing — variable types are resolved at runtime, not compile time.",
    ),
    mcq(
      "py-basics-9",
      "What does type(42) return?",
      ["'int'", "<class 'int'>", "Integer", "42"],
      1,
      "type() returns the class object; printing it shows <class 'int'>.",
    ),
    mcq(
      "py-basics-10",
      "Which of these is NOT a Python built-in data type?",
      ["list", "dict", "array", "tuple"],
      2,
      "array is not built-in; use the array module or numpy. list, dict, tuple are all built-in.",
    ),
    mcq(
      "py-basics-11",
      "f-string syntax in Python is:",
      [
        'format("text {var}")',
        "f'text {var}'",
        "'text'.format(var)",
        "%(var)s",
      ],
      1,
      "f-strings prefix the string literal with f and embed expressions inside {}.",
    ),
    mcq(
      "py-basics-12",
      "None in Python represents:",
      [
        "Zero",
        "False",
        "The absence of a value (null equivalent)",
        "An empty string",
      ],
      2,
      "None is Python's null value — it represents 'no value' or missing data.",
    ),
    mcq(
      "py-basics-13",
      "Multiple assignment a, b = 1, 2 sets:",
      ["a=1,b=2", "a=2,b=1", "a=b=1", "Error"],
      0,
      "Python unpacks the right-side tuple: a=1, b=2.",
    ),
    mcq(
      "py-basics-14",
      "What does len('hello') return?",
      ["4", "5", "6", "'hello'"],
      1,
      "len() returns the number of characters in the string; 'hello' has 5 characters.",
    ),
    mcq(
      "py-basics-15",
      "Python's integer division operator is:",
      ["/", "//", "%", "div"],
      1,
      "// performs floor (integer) division, discarding the fractional part.",
    ),
  ],
  programmingQuestions: [
    pq(
      "py-basics-pq1",
      "Hello World Variations",
      "Write a Python program that: (1) prints 'Hello, World!', (2) reads a name from input and prints 'Hello, {name}!', (3) prints the type of the number 42.",
      [
        {
          input: "Alice",
          output: "Hello, World!\nHello, Alice!\n<class 'int'>",
        },
      ],
      `# 1. Print Hello, World!

# 2. Read name and greet

# 3. Print type of 42
`,
      71,
      "Python",
      [
        "print('Hello, World!')",
        "name = input(); print(f'Hello, {name}!')",
        "print('Hello, World!')\nname = input()\nprint(f'Hello, {name}!')\nprint(type(42))",
      ],
      ["print", "input", "f-string", "type"],
    ),
    pq(
      "py-basics-pq2",
      "Simple Calculator",
      "Write a Python program that reads two integers from input (one per line) and prints their sum, difference, product, and integer quotient.",
      [
        {
          input: "10\n3",
          output: "Sum: 13\nDiff: 7\nProduct: 30\nQuotient: 3",
        },
      ],
      `a = int(input())
b = int(input())
# Print sum, difference, product, and integer quotient
`,
      71,
      "Python",
      [
        "Use +, -, *, and // operators",
        "Use f-strings: print(f'Sum: {a + b}')",
        "print(f'Sum: {a+b}')\nprint(f'Diff: {a-b}')\nprint(f'Product: {a*b}')\nprint(f'Quotient: {a//b}')",
      ],
      ["int", "input", "print", "+", "-", "*", "//"],
    ),
  ],
};

// ─── PYTHON: Control Flow ─────────────────────────────────────────────────────
const PY_CONTROL_FLOW: PartQuizData = {
  mcqs: [
    mcq(
      "py-cf-1",
      "Which keyword handles else-if chains in Python?",
      ["else if", "elseif", "elif", "orif"],
      2,
      "Python uses elif (short for 'else if') for multi-branch conditionals.",
    ),
    mcq(
      "py-cf-2",
      "range(1, 6) generates:",
      ["1 to 6 inclusive", "1 to 5 inclusive", "0 to 6", "0 to 5"],
      1,
      "range(start, stop) generates stop-start integers starting at start, stop is excluded.",
    ),
    mcq(
      "py-cf-3",
      "What does break do in a loop?",
      [
        "Skips current iteration",
        "Exits the loop immediately",
        "Continues to the next loop",
        "Raises an exception",
      ],
      1,
      "break exits the enclosing loop immediately, skipping any remaining iterations.",
    ),
    mcq(
      "py-cf-4",
      "What does continue do?",
      [
        "Exits the loop",
        "Skips the rest of the current iteration and goes to the next",
        "Pauses execution",
        "Ends the program",
      ],
      1,
      "continue skips the remaining body of the current iteration and moves to the next.",
    ),
    mcq(
      "py-cf-5",
      "A while loop condition is checked:",
      [
        "Once at start",
        "After each iteration",
        "Before each iteration",
        "Never",
      ],
      2,
      "while evaluates the condition BEFORE each iteration; if False initially, body never runs.",
    ),
    mcq(
      "py-cf-6",
      "for i in range(0, 10, 2) produces:",
      ["0,2,4,6,8,10", "0,2,4,6,8", "1,3,5,7,9", "0,1,2"],
      1,
      "range(0,10,2) starts at 0, steps by 2, stops before 10: 0,2,4,6,8.",
    ),
    mcq(
      "py-cf-7",
      "for..else runs the else block when:",
      [
        "The loop body executes at least once",
        "The loop finishes without a break",
        "The loop condition is False initially",
        "break executes",
      ],
      1,
      "The else block of a for loop runs only if no break was encountered.",
    ),
    mcq(
      "py-cf-8",
      "Python's equivalent to do-while is:",
      [
        "do: ... while cond",
        "while True with break at end",
        "repeat-until",
        "loop-while",
      ],
      1,
      "Python has no do-while; simulate it with while True: ... if condition: break.",
    ),
    mcq(
      "py-cf-9",
      "Ternary expression syntax in Python:",
      [
        "x if cond else y",
        "cond ? x : y",
        "if cond then x else y",
        "x when cond",
      ],
      0,
      "Python ternary: value_if_true if condition else value_if_false.",
    ),
    mcq(
      "py-cf-10",
      "pass statement does:",
      [
        "Breaks the loop",
        "Skips iteration",
        "Acts as a placeholder (no operation)",
        "Ends the function",
      ],
      2,
      "pass is a no-op placeholder — used where syntax requires a statement but no action is needed.",
    ),
    mcq(
      "py-cf-11",
      "enumerate(['a','b','c']) yields:",
      [
        "Indices only",
        "Values only",
        "(index, value) tuples",
        "Reversed pairs",
      ],
      2,
      "enumerate returns (index, value) pairs for each element of an iterable.",
    ),
    mcq(
      "py-cf-12",
      "What does while 0: print('hi') do?",
      [
        "Prints hi once",
        "Prints hi infinitely",
        "Never prints hi",
        "Raises an error",
      ],
      2,
      "0 is falsy; while 0 condition is immediately False, so the body never executes.",
    ),
    mcq(
      "py-cf-13",
      "Nested loops: outer runs n times, inner m times. Total iterations?",
      ["n+m", "n*m", "n^m", "max(n,m)"],
      1,
      "Each outer iteration runs the inner loop m times, resulting in n*m total iterations.",
    ),
    mcq(
      "py-cf-14",
      "zip([1,2],[3,4]) produces:",
      ["[(1,3),(2,4)]", "[[1,2],[3,4]]", "[1,2,3,4]", "(1,2,3,4)"],
      0,
      "zip pairs elements from iterables: zip([1,2],[3,4]) → (1,3), (2,4).",
    ),
    mcq(
      "py-cf-15",
      "range(5,0,-1) produces:",
      ["5,4,3,2,1", "5,4,3,2,1,0", "1,2,3,4,5", "0,1,2,3,4"],
      0,
      "range(5,0,-1) counts down from 5 stopping before 0: 5,4,3,2,1.",
    ),
  ],
  programmingQuestions: [
    pq(
      "py-cf-pq1",
      "FizzBuzz",
      "Print numbers 1 to 30. For multiples of 3 print 'Fizz', for multiples of 5 print 'Buzz', for multiples of both print 'FizzBuzz', otherwise print the number.",
      [{ input: "(none)", output: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n..." }],
      `for i in range(1, 31):
    # FizzBuzz logic
    pass
`,
      71,
      "Python",
      [
        "Check divisibility by 15 first (both), then 3, then 5",
        "if i%15==0: print('FizzBuzz') elif i%3==0: print('Fizz') elif i%5==0: print('Buzz') else: print(i)",
        "for i in range(1,31):\n  if i%15==0:print('FizzBuzz')\n  elif i%3==0:print('Fizz')\n  elif i%5==0:print('Buzz')\n  else:print(i)",
      ],
      ["for", "if", "elif", "%", "FizzBuzz", "Fizz", "Buzz"],
    ),
    pq(
      "py-cf-pq2",
      "Pattern Printing",
      "Read an integer n and print a right-angled triangle pattern of stars. Row 1 has 1 star, row 2 has 2 stars, ..., row n has n stars.",
      [{ input: "4", output: "*\n**\n***\n****" }],
      `n = int(input())
# Print triangle pattern
`,
      71,
      "Python",
      [
        "Use nested loops: outer from 1 to n, inner prints stars",
        "print('*' * i) for each row i",
        "n=int(input())\nfor i in range(1, n+1):\n    print('*' * i)",
      ],
      ["for", "range", "print", "*", "n"],
    ),
  ],
};

// ─── PYTHON: Functions ────────────────────────────────────────────────────────
const PY_FUNCTIONS: PartQuizData = {
  mcqs: [
    mcq(
      "py-fn-1",
      "Which keyword defines a function in Python?",
      ["function", "define", "def", "fn"],
      2,
      "def keyword followed by a name and parentheses defines a function.",
    ),
    mcq(
      "py-fn-2",
      "What does a function return if no return statement is used?",
      ["0", "False", "None", "Error"],
      2,
      "A function with no return (or bare return) implicitly returns None.",
    ),
    mcq(
      "py-fn-3",
      "Default argument: def greet(name='World'): — calling greet() uses:",
      ["Error", "name='World'", "name=None", "name=''"],
      1,
      "Default arguments are used when the caller doesn't provide that argument.",
    ),
    mcq(
      "py-fn-4",
      "*args collects extra positional arguments as a:",
      ["Dictionary", "Tuple", "List", "Set"],
      1,
      "*args packs extra positional arguments into a tuple inside the function.",
    ),
    mcq(
      "py-fn-5",
      "**kwargs collects extra keyword arguments as a:",
      ["Tuple", "List", "Dictionary", "Set"],
      2,
      "**kwargs packs extra keyword arguments (name=value) into a dict.",
    ),
    mcq(
      "py-fn-6",
      "lambda x, y: x + y is:",
      [
        "A class definition",
        "An anonymous single-expression function",
        "A decorator",
        "A generator",
      ],
      1,
      "lambda creates a small anonymous function: lambda params: expression.",
    ),
    mcq(
      "py-fn-7",
      "A recursive function must have a:",
      ["Loop", "Base case", "Global variable", "Return type hint"],
      1,
      "A base case stops the recursion; without it the function calls itself infinitely.",
    ),
    mcq(
      "py-fn-8",
      "Higher-order functions:",
      [
        "Run faster than regular functions",
        "Accept or return other functions",
        "Only use *args",
        "Are defined in classes",
      ],
      1,
      "Higher-order functions take functions as arguments or return them (e.g., map, filter, sorted).",
    ),
    mcq(
      "py-fn-9",
      "What is a closure?",
      [
        "A class with no __init__",
        "A nested function that captures variables from its enclosing scope",
        "A lambda function",
        "A generator function",
      ],
      1,
      "A closure is an inner function that 'closes over' variables from its outer function's scope.",
    ),
    mcq(
      "py-fn-10",
      "map(lambda x: x*2, [1,2,3]) produces:",
      ["[1,2,3]", "[2,4,6]", "[1,4,9]", "[0,2,4]"],
      1,
      "map applies the function to each element: [1*2, 2*2, 3*2] = [2,4,6].",
    ),
    mcq(
      "py-fn-11",
      "filter(lambda x: x>2, [1,2,3,4]) produces:",
      ["[1,2]", "[3,4]", "[2,3,4]", "[1,2,3,4]"],
      1,
      "filter keeps elements where the function returns True; 3 and 4 are >2.",
    ),
    mcq(
      "py-fn-12",
      "A docstring is placed:",
      [
        "After return",
        "As first statement inside def (triple-quoted string)",
        "Before def",
        "After the last line",
      ],
      1,
      "Docstrings (triple-quoted) go immediately after the def line and describe the function.",
    ),
    mcq(
      "py-fn-13",
      "Returning multiple values from a function uses:",
      [
        "Multiple return statements",
        "A tuple — return a, b",
        "A list only",
        "A dictionary only",
      ],
      1,
      "return a, b returns a tuple (a, b) — Python automatically packs multiple return values.",
    ),
    mcq(
      "py-fn-14",
      "What does the global keyword do inside a function?",
      [
        "Creates a local variable",
        "Declares that the variable refers to the global scope",
        "Imports a global module",
        "Deletes a variable",
      ],
      1,
      "global x inside a function makes x refer to the module-level variable, not a local one.",
    ),
    mcq(
      "py-fn-15",
      "sorted([3,1,2], key=lambda x: -x) produces:",
      ["[1,2,3]", "[3,2,1]", "[3,1,2]", "Error"],
      1,
      "Negating x as the key reverses sort order: highest first → [3,2,1].",
    ),
  ],
  programmingQuestions: [
    pq(
      "py-fn-pq1",
      "Recursive Fibonacci",
      "Write a Python recursive function fibonacci(n) that returns the nth Fibonacci number (0-indexed: fib(0)=0, fib(1)=1, fib(2)=1, fib(3)=2...).",
      [{ input: "7", output: "13" }],
      `def fibonacci(n):
    # Base cases and recursive case
    pass

n = int(input())
print(fibonacci(n))
`,
      71,
      "Python",
      [
        "Base cases: if n==0 return 0; if n==1 return 1",
        "Recursive case: return fibonacci(n-1) + fibonacci(n-2)",
        "def fibonacci(n):\n    if n==0: return 0\n    if n==1: return 1\n    return fibonacci(n-1)+fibonacci(n-2)",
      ],
      ["def", "fibonacci", "return", "if", "n-1", "n-2"],
    ),
    pq(
      "py-fn-pq2",
      "Higher-Order Functions",
      "Write a Python function apply_twice(f, x) that applies function f to x twice (f(f(x))). Test it with a lambda that triples a number.",
      [{ input: "(none)", output: "81" }],
      `def apply_twice(f, x):
    # Apply f to x, then apply f to the result
    pass

# Test: apply_twice with triple function on 9
triple = lambda x: x * 3
print(apply_twice(triple, 9))  # Expected: 81
`,
      71,
      "Python",
      [
        "return f(f(x))",
        "triple = lambda x: x * 3",
        "def apply_twice(f, x):\n    return f(f(x))\ntriple = lambda x: x * 3\nprint(apply_twice(triple, 9))",
      ],
      ["def", "apply_twice", "return", "lambda", "f(f(x))"],
    ),
  ],
};

// ─── PYTHON: Data Structures ──────────────────────────────────────────────────
const PY_DATA_STRUCTURES: PartQuizData = {
  mcqs: [
    mcq(
      "py-ds-1",
      "Python lists are:",
      [
        "Immutable ordered collections",
        "Mutable ordered collections allowing duplicates",
        "Unordered unique collections",
        "Fixed-size arrays",
      ],
      1,
      "Lists are mutable, ordered, and allow duplicate elements.",
    ),
    mcq(
      "py-ds-2",
      "Which is immutable: list or tuple?",
      ["list", "tuple", "Both are immutable", "Neither"],
      1,
      "Tuples are immutable — their elements cannot be changed after creation.",
    ),
    mcq(
      "py-ds-3",
      "Python dictionaries store:",
      [
        "Ordered unique values",
        "Unordered unique values",
        "Key-value pairs",
        "Only strings",
      ],
      2,
      "Dictionaries map unique keys to values (key-value pairs). Python 3.7+ maintains insertion order.",
    ),
    mcq(
      "py-ds-4",
      "Python sets store:",
      [
        "Ordered duplicates",
        "Unordered unique elements",
        "Key-value pairs",
        "Indexed elements",
      ],
      1,
      "Sets are unordered collections of unique elements — duplicates are automatically removed.",
    ),
    mcq(
      "py-ds-5",
      "List comprehension [x**2 for x in range(4)] produces:",
      ["[1,4,9,16]", "[0,1,4,9]", "[0,1,2,3]", "[1,2,3,4]"],
      1,
      "range(4) gives 0,1,2,3; squaring gives [0,1,4,9].",
    ),
    mcq(
      "py-ds-6",
      "dict.get('key', default) does what when key is missing?",
      [
        "Raises KeyError",
        "Returns None",
        "Returns default value",
        "Creates the key",
      ],
      2,
      "get() safely returns the default (or None if unspecified) when the key is absent.",
    ),
    mcq(
      "py-ds-7",
      "list.append(x) vs list.extend([x,y]):",
      [
        "Both add one element",
        "append adds one item; extend adds all items from iterable",
        "extend adds one item; append adds many",
        "No difference",
      ],
      1,
      "append(x) adds x as a single item; extend([x,y]) adds each item from the iterable.",
    ),
    mcq(
      "py-ds-8",
      "Accessing list[-1] returns:",
      ["First element", "Last element", "Middle element", "Raises IndexError"],
      1,
      "Negative indexing counts from the end; -1 is the last element.",
    ),
    mcq(
      "py-ds-9",
      "How to remove an item from a set?",
      [
        "del set[item]",
        "set.pop(item)",
        "set.remove(item)",
        "set.delete(item)",
      ],
      2,
      "remove(item) removes a specific element; raises KeyError if not found. discard() ignores missing.",
    ),
    mcq(
      "py-ds-10",
      "list slicing [1:4] on [0,1,2,3,4,5]:",
      ["[1,2,3,4]", "[1,2,3]", "[0,1,2,3]", "[2,3,4]"],
      1,
      "Slicing [1:4] extracts indices 1,2,3 — stop index 4 is excluded.",
    ),
    mcq(
      "py-ds-11",
      "To sort a list in-place:",
      ["sorted(lst)", "lst.sort()", "lst.sorted()", "list.sort(lst)"],
      1,
      "lst.sort() sorts in-place and returns None; sorted(lst) returns a new sorted list.",
    ),
    mcq(
      "py-ds-12",
      "Dictionary comprehension creating {0:0, 1:1, 4:4} for x in range(3):",
      [
        "{x:x**2 for x in range(3)}",
        "{x:x for x in range(3)}",
        "{x**2 for x in range(3)}",
        "[x:x**2 for x in range(3)]",
      ],
      0,
      "{x:x**2 for x in range(3)} → {0:0, 1:1, 2:4}.",
    ),
    mcq(
      "py-ds-13",
      "Merge two dicts d1 and d2 in Python 3.9+:",
      ["d1 + d2", "d1 | d2", "dict(d1, d2)", "d1.merge(d2)"],
      1,
      "The | operator (Python 3.9+) merges dicts. For earlier versions use {**d1, **d2}.",
    ),
    mcq(
      "py-ds-14",
      "Which data structure is best for checking membership O(1)?",
      ["list", "tuple", "set or dict", "string"],
      2,
      "Sets and dicts use hash tables; 'x in set' is O(1) average vs O(n) for lists.",
    ),
    mcq(
      "py-ds-15",
      "tuple unpacking a, b, *rest = [1,2,3,4,5]:",
      [
        "a=1, b=2, rest=[3,4,5]",
        "a=1, b=2, rest=(3,4,5)",
        "Error",
        "a=[1], b=[2], rest=[3,4,5]",
      ],
      0,
      "*rest captures the remaining elements as a list: rest=[3,4,5].",
    ),
  ],
  programmingQuestions: [
    pq(
      "py-ds-pq1",
      "List Comprehension Pipeline",
      "Given a list of integers, use list comprehension to create a new list containing only the squares of even numbers. Print the result.",
      [{ input: "[1, 2, 3, 4, 5, 6, 7, 8]", output: "[4, 16, 36, 64]" }],
      `nums = [1, 2, 3, 4, 5, 6, 7, 8]
# One-line list comprehension: squares of even numbers
result = []
print(result)
`,
      71,
      "Python",
      [
        "Filter even: n % 2 == 0, then square: n**2",
        "[n**2 for n in nums if n%2==0]",
        "result = [n**2 for n in nums if n%2==0]\nprint(result)",
      ],
      ["for", "if", "**2", "%2", "print"],
    ),
    pq(
      "py-ds-pq2",
      "Dictionary Manipulation",
      "Read a sentence from input. Count the frequency of each word and store in a dictionary. Print each word with its count, sorted alphabetically.",
      [
        {
          input: "hello world hello python world hello",
          output: "hello: 3\npython: 1\nworld: 2",
        },
      ],
      `sentence = input().split()
freq = {}
# Count word frequencies
# Print sorted alphabetically
`,
      71,
      "Python",
      [
        "Loop words and use freq[w] = freq.get(w, 0) + 1",
        "sorted(freq.items()) for alphabetical order",
        "for w in sentence:\n    freq[w]=freq.get(w,0)+1\nfor k,v in sorted(freq.items()):\n    print(f'{k}: {v}')",
      ],
      ["dict", "get", "sorted", "items", "print"],
    ),
  ],
};

// ─── PYTHON: OOP ─────────────────────────────────────────────────────────────
const PY_OOP: PartQuizData = {
  mcqs: [
    mcq(
      "py-oop-1",
      "Which keyword defines a class in Python?",
      ["struct", "object", "class", "type"],
      2,
      "class keyword defines a new class in Python.",
    ),
    mcq(
      "py-oop-2",
      "What is __init__ in Python?",
      [
        "A private variable",
        "The constructor method called when an object is created",
        "A destructor",
        "A class method",
      ],
      1,
      "__init__ is the constructor — Python calls it automatically when you do ClassName().",
    ),
    mcq(
      "py-oop-3",
      "The first parameter of an instance method is conventionally:",
      ["this", "cls", "self", "me"],
      2,
      "self refers to the instance itself; Python passes it automatically but you must declare it.",
    ),
    mcq(
      "py-oop-4",
      "Inheritance syntax in Python:",
      [
        "class Child < Parent:",
        "class Child(Parent):",
        "class Child extends Parent:",
        "class Child inherits Parent:",
      ],
      1,
      "class Child(Parent): inherits from Parent. Use super() to call parent methods.",
    ),
    mcq(
      "py-oop-5",
      "Which OOP principle hides implementation details?",
      ["Inheritance", "Polymorphism", "Abstraction", "Encapsulation"],
      3,
      "Encapsulation bundles data and methods together, hiding internal details using private attributes.",
    ),
    mcq(
      "py-oop-6",
      "A @classmethod's first parameter is:",
      ["self", "cls", "obj", "class"],
      1,
      "cls refers to the class itself — class methods receive the class as the first argument.",
    ),
    mcq(
      "py-oop-7",
      "@staticmethod:",
      [
        "Has access to instance via self",
        "Has access to class via cls",
        "Has no access to instance or class",
        "Is always private",
      ],
      2,
      "Static methods are regular functions in a class namespace — no self or cls.",
    ),
    mcq(
      "py-oop-8",
      "Polymorphism means:",
      [
        "One class, no inheritance",
        "Objects of different classes respond to the same interface differently",
        "All methods are static",
        "A single global object",
      ],
      1,
      "Polymorphism: different classes implement the same method name, behaving differently.",
    ),
    mcq(
      "py-oop-9",
      "Name mangling with __name (double underscore) in Python:",
      [
        "Makes attribute public",
        "Makes attribute private (name becomes _ClassName__name)",
        "Deletes the attribute",
        "Creates a property",
      ],
      1,
      "Double underscore prefix causes name mangling: __x becomes _ClassName__x, preventing easy subclass access.",
    ),
    mcq(
      "py-oop-10",
      "super() is used to:",
      [
        "Access a sibling class",
        "Call a method from the parent class",
        "Create a new instance",
        "Define a metaclass",
      ],
      1,
      "super() gives access to parent class methods and constructors without naming the parent explicitly.",
    ),
    mcq(
      "py-oop-11",
      "__str__ is called by:",
      ["repr(obj)", "str(obj) and print(obj)", "type(obj)", "id(obj)"],
      1,
      "__str__ defines the human-readable string representation used by str() and print().",
    ),
    mcq(
      "py-oop-12",
      "Multiple inheritance in Python:",
      [
        "Is not supported",
        "Allowed: class C(A, B):",
        "Only through mixins",
        "Only with super()",
      ],
      1,
      "Python supports multiple inheritance: class C(A, B) inherits from both A and B.",
    ),
    mcq(
      "py-oop-13",
      "@property decorator creates:",
      [
        "A class method",
        "A static method",
        "A getter that can be accessed like an attribute",
        "An abstract method",
      ],
      2,
      "@property allows defining a method that is accessed like an attribute: obj.area instead of obj.area().",
    ),
    mcq(
      "py-oop-14",
      "Abstract base class (ABC) is used to:",
      [
        "Create singleton classes",
        "Define a common interface that subclasses must implement",
        "Make all methods static",
        "Prevent inheritance",
      ],
      1,
      "ABCs define required methods via @abstractmethod — subclasses must implement them.",
    ),
    mcq(
      "py-oop-15",
      "Duck typing in Python means:",
      [
        "Checking types with isinstance()",
        "If an object has the right methods, it can be used regardless of its class",
        "Using type hints strictly",
        "Enforcing type contracts at runtime",
      ],
      1,
      "Duck typing: 'If it walks like a duck and quacks like a duck, it is a duck' — class doesn't matter, interface does.",
    ),
  ],
  programmingQuestions: [
    pq(
      "py-oop-pq1",
      "Define a Class",
      "Define a Python class BankAccount with: __init__(owner, balance=0), deposit(amount), withdraw(amount) (check sufficient funds), and __str__ returning 'owner: $balance'.",
      [{ input: "(none)", output: "Alice: $150\nInsufficient funds" }],
      `class BankAccount:
    def __init__(self, owner, balance=0):
        # Initialize owner and balance

    def deposit(self, amount):
        # Add amount to balance

    def withdraw(self, amount):
        # Subtract if sufficient funds

    def __str__(self):
        # Return formatted string

acc = BankAccount("Alice", 100)
acc.deposit(50)
print(acc)
acc.withdraw(200)
`,
      71,
      "Python",
      [
        "self.balance += amount in deposit",
        "if amount <= self.balance: self.balance -= amount else: print('Insufficient funds')",
        "class BankAccount:\n    def __init__(self,owner,balance=0):\n        self.owner=owner; self.balance=balance\n    def deposit(self,a): self.balance+=a\n    def withdraw(self,a):\n        if a<=self.balance: self.balance-=a\n        else: print('Insufficient funds')\n    def __str__(self): return f'{self.owner}: ${self.balance}'",
      ],
      ["class", "def", "__init__", "self", "deposit", "withdraw", "__str__"],
    ),
    pq(
      "py-oop-pq2",
      "Polymorphism Example",
      "Create a base class Shape with a method area() returning 0. Create subclasses Circle(radius) and Rectangle(w, h) that override area(). Print the area of each.",
      [{ input: "(none)", output: "Circle area: 78.54\nRectangle area: 24" }],
      `import math

class Shape:
    def area(self):
        return 0

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius
    # Override area()

class Rectangle(Shape):
    def __init__(self, w, h):
        self.w = w
        self.h = h
    # Override area()

shapes = [Circle(5), Rectangle(4, 6)]
for s in shapes:
    print(f"{type(s).__name__} area: {s.area():.2f}")
`,
      71,
      "Python",
      [
        "Circle area: math.pi * self.radius ** 2",
        "Rectangle area: self.w * self.h",
        "class Circle(Shape):\n    def area(self): return math.pi*self.radius**2\nclass Rectangle(Shape):\n    def area(self): return self.w*self.h",
      ],
      ["class", "def", "area", "math.pi", "self.radius", "self.w", "self.h"],
    ),
  ],
};

// ─── BACKEND: HTTP/REST ───────────────────────────────────────────────────────
const BE_HTTP_REST: PartQuizData = {
  mcqs: [
    mcq(
      "be-http-1",
      "HTTP stands for:",
      [
        "HyperText Transfer Protocol",
        "High Transfer Text Protocol",
        "Hyper Terminal Transfer Protocol",
        "HyperText Transaction Protocol",
      ],
      0,
      "HTTP (HyperText Transfer Protocol) is the foundation of data communication on the web.",
    ),
    mcq(
      "be-http-2",
      "Which HTTP method retrieves data without side effects?",
      ["POST", "PUT", "DELETE", "GET"],
      3,
      "GET is idempotent and safe — it retrieves data without modifying server state.",
    ),
    mcq(
      "be-http-3",
      "HTTP status code 201 means:",
      ["OK", "Created", "Accepted", "No Content"],
      1,
      "201 Created indicates a resource was successfully created, often returned after POST requests.",
    ),
    mcq(
      "be-http-4",
      "HTTP 404 status means:",
      ["Server error", "Unauthorized", "Resource not found", "Bad request"],
      2,
      "404 Not Found means the requested resource could not be found on the server.",
    ),
    mcq(
      "be-http-5",
      "REST stands for:",
      [
        "Remote Execution State Transfer",
        "Representational State Transfer",
        "Resource Endpoint State Technology",
        "Relational Service Transfer",
      ],
      1,
      "REST (Representational State Transfer) is an architectural style for distributed hypermedia systems.",
    ),
    mcq(
      "be-http-6",
      "REST is stateless meaning:",
      [
        "No data is stored anywhere",
        "Each request contains all information needed; no session on server",
        "The server stores all state",
        "Only GET is allowed",
      ],
      1,
      "Stateless means each HTTP request is independent — the server doesn't store client session state.",
    ),
    mcq(
      "be-http-7",
      "Which HTTP method fully replaces a resource?",
      ["PATCH", "POST", "PUT", "UPDATE"],
      2,
      "PUT replaces the entire resource. PATCH only updates specific fields.",
    ),
    mcq(
      "be-http-8",
      "JSON content type header is:",
      [
        "Content-Type: text/plain",
        "Content-Type: application/json",
        "Accept: json",
        "Data-Type: json",
      ],
      1,
      "application/json is the MIME type for JSON payloads in HTTP headers.",
    ),
    mcq(
      "be-http-9",
      "HTTP 500 status code means:",
      ["Client error", "Not found", "Internal server error", "Unauthorized"],
      2,
      "500 Internal Server Error indicates an unexpected condition on the server side.",
    ),
    mcq(
      "be-http-10",
      "CORS stands for:",
      [
        "Cross-Origin Resource Sharing",
        "Content-Origin Response System",
        "Client-Origin Request Service",
        "Cross-Object Resource Scheme",
      ],
      0,
      "CORS (Cross-Origin Resource Sharing) controls which domains can make requests to a server.",
    ),
    mcq(
      "be-http-11",
      "Which HTTP method is idempotent?",
      ["POST", "GET and PUT", "DELETE only", "PATCH only"],
      1,
      "GET and PUT are idempotent — calling them multiple times has the same effect as calling once.",
    ),
    mcq(
      "be-http-12",
      "RESTful URL /users/42 represents:",
      [
        "All users",
        "User with ID 42",
        "Create a user with 42 fields",
        "Delete 42 users",
      ],
      1,
      "RESTful URLs use path parameters: /users/{id} targets the specific user resource.",
    ),
    mcq(
      "be-http-13",
      "HTTP 401 vs 403:",
      [
        "Both mean not found",
        "401 = unauthenticated (not logged in); 403 = unauthorized (logged in but no permission)",
        "401 = forbidden; 403 = unauthenticated",
        "No difference",
      ],
      1,
      "401 Unauthorized means credentials missing/invalid; 403 Forbidden means authenticated but lacks permission.",
    ),
    mcq(
      "be-http-14",
      "API versioning in URL looks like:",
      ["/api/users", "/v1/users", "/users?v=1", "All are valid approaches"],
      3,
      "API versioning can be done via URL path (/v1), query params (?v=1), or headers — all are valid.",
    ),
    mcq(
      "be-http-15",
      "HTTP PATCH method:",
      [
        "Deletes a resource",
        "Creates a new resource",
        "Partially updates a resource",
        "Fully replaces a resource",
      ],
      2,
      "PATCH applies partial modifications to a resource (unlike PUT which replaces entirely).",
    ),
  ],
  programmingQuestions: [
    pq(
      "be-http-pq1",
      "Design a REST API",
      "Describe the REST API endpoints for a Task management system. Define at least 4 endpoints with HTTP method, URL, description, and expected status code. Write as JavaScript comments.",
      [{ input: "No code input", output: "Documented API endpoints" }],
      `// REST API Design: Task Management System
// Format: METHOD /path -> description (status code)

// GET    /tasks           -> List all tasks (200)
// Add more endpoints below:

// POST   ...
// GET    ...
// PUT or PATCH  ...
// DELETE ...`,
      63,
      "JavaScript",
      [
        "POST /tasks -> Create a task (201)",
        "GET /tasks/:id -> Get a task (200 or 404)",
        "POST /tasks (201)\nGET /tasks/:id (200 or 404)\nPATCH /tasks/:id (200)\nDELETE /tasks/:id (204)",
      ],
      ["GET", "POST", "PUT", "PATCH", "DELETE", "200", "201", "404"],
    ),
    pq(
      "be-http-pq2",
      "HTTP Status Code Handler",
      "Write a JavaScript function getStatusMessage(code) that returns a message for HTTP status codes 200, 201, 400, 401, 403, 404, and 500. For unknown codes, return 'Unknown Status'.",
      [{ input: "getStatusMessage(404)", output: '"Not Found"' }],
      `function getStatusMessage(code) {
  // Return descriptive message for each status code
}

console.log(getStatusMessage(200)); // "OK"
console.log(getStatusMessage(404)); // "Not Found"
console.log(getStatusMessage(500)); // "Internal Server Error"`,
      63,
      "JavaScript",
      [
        "Use a switch statement or object lookup",
        "{ 200: 'OK', 201: 'Created', 400: 'Bad Request', ... }",
        "const messages = {200:'OK',201:'Created',400:'Bad Request',401:'Unauthorized',403:'Forbidden',404:'Not Found',500:'Internal Server Error'};\nreturn messages[code] ?? 'Unknown Status';",
      ],
      ["switch", "return", "200", "404", "500", "Unknown Status"],
    ),
  ],
};

// ─── BACKEND: Node.js ─────────────────────────────────────────────────────────
const BE_NODEJS: PartQuizData = {
  mcqs: [
    mcq(
      "be-node-1",
      "Node.js is:",
      [
        "A browser JavaScript engine",
        "A server-side JavaScript runtime built on V8",
        "A Python framework",
        "A database",
      ],
      1,
      "Node.js is a runtime environment that executes JavaScript outside the browser using the V8 engine.",
    ),
    mcq(
      "be-node-2",
      "Node.js I/O is:",
      [
        "Synchronous and blocking",
        "Non-blocking and asynchronous by default",
        "Multi-threaded",
        "Synchronous only",
      ],
      1,
      "Node.js uses an event-driven, non-blocking I/O model for handling concurrent requests efficiently.",
    ),
    mcq(
      "be-node-3",
      "require() in Node.js is used to:",
      [
        "Declare variables",
        "Import modules",
        "Create HTTP servers",
        "Handle errors",
      ],
      1,
      "require() loads a module (built-in, npm package, or local file) in CommonJS modules.",
    ),
    mcq(
      "be-node-4",
      "The Node.js event loop:",
      [
        "Blocks while processing each request",
        "Delegates I/O to OS callbacks, processes callbacks between tasks",
        "Creates a new thread per request",
        "Runs only once",
      ],
      1,
      "The event loop processes async callbacks from the queue between I/O operations — the heart of Node.js concurrency.",
    ),
    mcq(
      "be-node-5",
      "npm stands for:",
      [
        "Node Package Manager",
        "New Package Module",
        "Node Program Management",
        "Network Package Module",
      ],
      0,
      "npm (Node Package Manager) is the default package manager for Node.js.",
    ),
    mcq(
      "be-node-6",
      "Which built-in module reads files in Node.js?",
      ["http", "path", "fs (File System)", "os"],
      2,
      "The fs module provides file system operations: readFile, writeFile, readdir, etc.",
    ),
    mcq(
      "be-node-7",
      "EventEmitter in Node.js allows:",
      [
        "HTTP requests",
        "Custom event-driven architecture (emit and listen to events)",
        "Database queries",
        "File reading only",
      ],
      1,
      "EventEmitter is the base of Node.js's event system — emit events and register listeners with on().",
    ),
    mcq(
      "be-node-8",
      "Streams in Node.js are used for:",
      [
        "Synchronous array operations",
        "Processing data piece-by-piece without loading all into memory",
        "Defining classes",
        "Routing requests",
      ],
      1,
      "Streams (Readable, Writable, Transform) handle large data efficiently by processing chunks.",
    ),
    mcq(
      "be-node-9",
      "process.env is used to:",
      [
        "Handle processes",
        "Access environment variables (config, secrets)",
        "Create child processes",
        "Manage memory",
      ],
      1,
      "process.env provides access to environment variables — keep secrets like DB passwords here, not in code.",
    ),
    mcq(
      "be-node-10",
      "package.json main field specifies:",
      [
        "The Node.js version",
        "The entry point file of a package",
        "The author name",
        "The test command",
      ],
      1,
      "The main field tells Node.js (and bundlers) which file is the entry point of the module.",
    ),
    mcq(
      "be-node-11",
      "module.exports is used to:",
      [
        "Import a module",
        "Export values from a CommonJS module",
        "Create a server",
        "Define routes",
      ],
      1,
      "module.exports (or exports.x) exposes values from a CommonJS module for require().",
    ),
    mcq(
      "be-node-12",
      "Which module creates HTTP servers in Node.js?",
      ["net", "url", "http", "request"],
      2,
      "The built-in http module provides createServer() for creating HTTP/HTTPS servers.",
    ),
    mcq(
      "be-node-13",
      "Callback hell is solved by:",
      [
        "Adding more callbacks",
        "Promises and async/await",
        "Synchronous code only",
        "Using var",
      ],
      1,
      "Promises and async/await flatten deeply nested callbacks into readable sequential code.",
    ),
    mcq(
      "be-node-14",
      "npm scripts in package.json allow:",
      [
        "Installing packages",
        "Running custom shell commands via npm run <name>",
        "Defining routes",
        "Creating databases",
      ],
      1,
      "npm scripts define reusable commands: npm run test, npm run build, etc.",
    ),
    mcq(
      "be-node-15",
      "What does fs.readFileSync() do vs fs.readFile()?",
      [
        "Same behavior",
        "readFileSync blocks execution; readFile uses a callback (async)",
        "readFile is synchronous",
        "readFileSync uses a callback",
      ],
      1,
      "Sync variants block the event loop; async (callback/Promise) variants don't block.",
    ),
  ],
  programmingQuestions: [
    pq(
      "be-node-pq1",
      "Read a File Async",
      "Write a Node.js script that reads a file named 'data.txt' asynchronously using fs.readFile(). Print the content or the error message if the file doesn't exist.",
      [{ input: "data.txt contains 'Hello Node!'", output: "Hello Node!" }],
      `const fs = require('fs');

// Read 'data.txt' asynchronously
// Print file content or error message
`,
      63,
      "JavaScript",
      [
        "Use fs.readFile('data.txt', 'utf8', callback)",
        "Callback signature: (err, data) => { ... }",
        "fs.readFile('data.txt','utf8',(err,data)=>{\n  if(err) console.error(err.message);\n  else console.log(data);\n});",
      ],
      ["require", "fs", "readFile", "utf8", "err", "data"],
    ),
    pq(
      "be-node-pq2",
      "Simple HTTP Server",
      "Create a Node.js HTTP server that listens on port 3000. For any request respond with status 200, Content-Type: text/plain, and body 'Hello from Node!'.",
      [{ input: "GET http://localhost:3000/", output: "Hello from Node!" }],
      `const http = require('http');

const server = http.createServer((req, res) => {
  // Set status, headers, and send response body
});

server.listen(3000, () => console.log('Server running on port 3000'));`,
      63,
      "JavaScript",
      [
        "res.writeHead(200, {'Content-Type': 'text/plain'})",
        "res.end('Hello from Node!')",
        "const http=require('http');\nhttp.createServer((req,res)=>{\n  res.writeHead(200,{'Content-Type':'text/plain'});\n  res.end('Hello from Node!');\n}).listen(3000);",
      ],
      ["require", "http", "createServer", "writeHead", "end", "listen"],
    ),
  ],
};

// ─── BACKEND: Express.js ──────────────────────────────────────────────────────
const BE_EXPRESS: PartQuizData = {
  mcqs: [
    mcq(
      "be-express-1",
      "Express.js is:",
      [
        "A database ORM",
        "A minimal, unopinionated web framework for Node.js",
        "A frontend framework",
        "A testing library",
      ],
      1,
      "Express is a fast, minimalist web framework for Node.js that simplifies routing and middleware.",
    ),
    mcq(
      "be-express-2",
      "Middleware in Express is a function that:",
      [
        "Handles database queries",
        "Has access to req, res, and next — it can transform request/response or end the cycle",
        "Creates routes",
        "Compiles TypeScript",
      ],
      1,
      "Middleware functions execute in sequence; call next() to pass control to the next middleware.",
    ),
    mcq(
      "be-express-3",
      "To define a GET route in Express:",
      [
        "app.route('/path', fn)",
        "app.get('/path', (req, res) => {})",
        "app.handle('GET', '/path', fn)",
        "express.get('/path', fn)",
      ],
      1,
      "app.get(path, handler) defines a route for GET requests.",
    ),
    mcq(
      "be-express-4",
      "Route parameters like /users/:id are accessed via:",
      ["req.query.id", "req.params.id", "req.body.id", "res.params.id"],
      1,
      "req.params contains route parameters extracted from the URL path.",
    ),
    mcq(
      "be-express-5",
      "Query strings like /search?q=node are accessed via:",
      ["req.params.q", "req.body.q", "req.query.q", "req.path.q"],
      2,
      "req.query contains parsed query string parameters.",
    ),
    mcq(
      "be-express-6",
      "To parse JSON request bodies in Express 4.16+:",
      [
        "bodyParser.json()",
        "app.use(express.json())",
        "app.json()",
        "require('json')",
      ],
      1,
      "express.json() is built-in middleware that parses JSON request bodies into req.body.",
    ),
    mcq(
      "be-express-7",
      "Express Router is used to:",
      [
        "Speed up requests",
        "Modularize route definitions into separate files",
        "Handle databases",
        "Serve static files",
      ],
      1,
      "express.Router() creates mini-applications with their own route handlers for better organization.",
    ),
    mcq(
      "be-express-8",
      "Error-handling middleware signature is:",
      [
        "(req, res, next)",
        "(err, req, res, next)",
        "(error, callback)",
        "(req, res)",
      ],
      1,
      "Error handlers take 4 arguments: (err, req, res, next) — Express identifies them by arity.",
    ),
    mcq(
      "be-express-9",
      "res.json(data) does:",
      [
        "Logs data",
        "Sends a JSON response with Content-Type: application/json",
        "Parses JSON body",
        "Stores data",
      ],
      1,
      "res.json() serializes the object to JSON and sets the appropriate Content-Type header.",
    ),
    mcq(
      "be-express-10",
      "app.use('/api', router) means:",
      [
        "Only GET requests to /api use the router",
        "All routes in the router are prefixed with /api",
        "The router handles /api only",
        "Creates a new server",
      ],
      1,
      "Mounting a router with app.use('/prefix', router) namespaces all its routes under /prefix.",
    ),
    mcq(
      "be-express-11",
      "Which method sends an HTTP response and ends the request cycle?",
      ["res.write()", "res.end() or res.send()", "res.close()", "res.finish()"],
      1,
      "res.send() / res.json() / res.end() complete the response cycle. Not calling them results in hanging requests.",
    ),
    mcq(
      "be-express-12",
      "express.static('public') serves:",
      [
        "Only HTML files",
        "Static files from the 'public' directory (CSS, JS, images)",
        "Only images",
        "Database files",
      ],
      1,
      "express.static() serves static assets from a folder directly without defining routes for each file.",
    ),
    mcq(
      "be-express-13",
      "req.body is populated when using:",
      [
        "No middleware needed",
        "express.json() or express.urlencoded() middleware",
        "res.json()",
        "app.use(router)",
      ],
      1,
      "req.body is undefined by default — body-parsing middleware is required to populate it.",
    ),
    mcq(
      "be-express-14",
      "async route handlers should be wrapped to catch errors:",
      [
        "No wrapping needed",
        "With try/catch or an async wrapper that calls next(err)",
        "With process.on('error')",
        "With a Promise chain",
      ],
      1,
      "Without error handling, async errors won't reach Express error handlers — use try/catch + next(err).",
    ),
    mcq(
      "be-express-15",
      "Rate limiting middleware protects against:",
      [
        "SQL injection",
        "XSS attacks",
        "Brute force and DoS by limiting requests per time window",
        "CORS issues",
      ],
      2,
      "Rate limiting (e.g., express-rate-limit) restricts how many requests a client can make in a time window.",
    ),
  ],
  programmingQuestions: [
    pq(
      "be-express-pq1",
      "GET Route with Params",
      "Write an Express route GET /users/:id that responds with JSON {id, message: 'User {id} found'}. If id is not numeric, respond 400 {error: 'Invalid ID'}.",
      [
        {
          input: "GET /users/42",
          output: '{"id":42,"message":"User 42 found"}',
        },
      ],
      `const express = require('express');
const app = express();

app.get('/users/:id', (req, res) => {
  // Extract id from params
  // Validate: must be numeric
  // Return JSON response
});

app.listen(3000);`,
      63,
      "JavaScript",
      [
        "const id = parseInt(req.params.id, 10);",
        "if (isNaN(id)) return res.status(400).json({error: 'Invalid ID'});",
        "app.get('/users/:id',(req,res)=>{\n  const id=parseInt(req.params.id,10);\n  if(isNaN(id)) return res.status(400).json({error:'Invalid ID'});\n  res.json({id,message:`User ${id} found`});\n});",
      ],
      ["req.params.id", "parseInt", "isNaN", "res.status", "res.json"],
    ),
    pq(
      "be-express-pq2",
      "POST Route with Validation",
      "Write an Express POST /tasks route. Parse JSON body with express.json(). Require 'title' (non-empty string) in the body. If missing, return 400 {error: 'Title is required'}. On success return 201 {id:1, title}.",
      [
        {
          input: '{"title":"Buy milk"}',
          output: '{"id":1,"title":"Buy milk"}',
        },
      ],
      `const express = require('express');
const app = express();
app.use(express.json());

app.post('/tasks', (req, res) => {
  // Validate title in req.body
  // Return 400 if missing or empty
  // Return 201 with new task on success
});

app.listen(3000);`,
      63,
      "JavaScript",
      [
        "const { title } = req.body;",
        "if (!title || !title.trim()) return res.status(400).json({error:'Title is required'});",
        "app.post('/tasks',(req,res)=>{\n  const {title}=req.body;\n  if(!title||!title.trim()) return res.status(400).json({error:'Title is required'});\n  res.status(201).json({id:1,title});\n});",
      ],
      [
        "req.body",
        "title",
        "res.status(400)",
        "res.status(201)",
        "json",
        "trim",
      ],
    ),
  ],
};

// ─── BACKEND: Database / SQL ──────────────────────────────────────────────────
const BE_DATABASE: PartQuizData = {
  mcqs: [
    mcq(
      "be-db-1",
      "SQL stands for:",
      [
        "Structured Query Language",
        "Simple Question Language",
        "System Query Logic",
        "Sequential Query Layer",
      ],
      0,
      "SQL (Structured Query Language) is the standard language for relational database management.",
    ),
    mcq(
      "be-db-2",
      "Which SQL statement retrieves data?",
      ["INSERT", "UPDATE", "SELECT", "CREATE"],
      2,
      "SELECT fetches rows from one or more tables.",
    ),
    mcq(
      "be-db-3",
      "PRIMARY KEY constraint ensures:",
      [
        "Column can be NULL",
        "Column values are unique and not NULL",
        "Column references another table",
        "Column has a default value",
      ],
      1,
      "A PRIMARY KEY uniquely identifies each row in a table and cannot be NULL.",
    ),
    mcq(
      "be-db-4",
      "FOREIGN KEY creates a relationship:",
      [
        "Within the same column",
        "Between two tables by referencing the parent table's primary key",
        "Between two databases",
        "Between two columns in the same table",
      ],
      1,
      "A FOREIGN KEY in a child table references the PRIMARY KEY of a parent table, enforcing referential integrity.",
    ),
    mcq(
      "be-db-5",
      "Which JOIN returns all rows from both tables with NULL for non-matching rows?",
      ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"],
      3,
      "FULL OUTER JOIN returns all rows from both tables, with NULLs where there is no match on either side.",
    ),
    mcq(
      "be-db-6",
      "INNER JOIN returns:",
      [
        "All rows from left table",
        "All rows from right table",
        "Only matching rows from both tables",
        "All rows from both tables",
      ],
      2,
      "INNER JOIN returns only rows that have matching values in both tables.",
    ),
    mcq(
      "be-db-7",
      "Transactions in SQL ensure ACID properties. ACID stands for:",
      [
        "Atomicity, Consistency, Isolation, Durability",
        "Access, Control, Integration, Distribution",
        "Automated, Concurrent, Indexed, Durable",
        "Array, Class, Interface, Data",
      ],
      0,
      "ACID: Atomicity (all or nothing), Consistency (valid state), Isolation (concurrent transactions independent), Durability (committed data persists).",
    ),
    mcq(
      "be-db-8",
      "GROUP BY clause is used with:",
      [
        "WHERE clause only",
        "Aggregate functions (COUNT, SUM, AVG, MAX, MIN)",
        "INSERT statements",
        "JOIN operations only",
      ],
      1,
      "GROUP BY groups rows with the same values so aggregate functions can be applied per group.",
    ),
    mcq(
      "be-db-9",
      "INDEX in a database:",
      [
        "Stores data permanently",
        "Speeds up data retrieval at the cost of extra write overhead",
        "Enforces uniqueness",
        "Creates a backup",
      ],
      1,
      "Indexes are data structures that improve query performance — they trade storage/write overhead for faster reads.",
    ),
    mcq(
      "be-db-10",
      "SQL HAVING clause filters:",
      [
        "Individual rows before grouping",
        "Aggregate groups after GROUP BY",
        "NULL values only",
        "Column names",
      ],
      1,
      "HAVING filters groups after aggregation (WHERE filters rows before aggregation).",
    ),
    mcq(
      "be-db-11",
      "What does SELECT DISTINCT do?",
      [
        "Sorts results",
        "Removes duplicate rows from results",
        "Filters NULL values",
        "Selects random rows",
      ],
      1,
      "DISTINCT eliminates duplicate rows from the result set.",
    ),
    mcq(
      "be-db-12",
      "NoSQL databases are best for:",
      [
        "Only relational data with strict schema",
        "Flexible schema, horizontal scaling, unstructured data",
        "Only key-value storage",
        "Only graph data",
      ],
      1,
      "NoSQL databases (MongoDB, Redis, Cassandra) handle flexible schemas, unstructured data, and horizontal scaling.",
    ),
    mcq(
      "be-db-13",
      "SQL LIKE operator is used for:",
      [
        "Exact string matching",
        "Pattern matching with % and _ wildcards",
        "Numeric comparisons",
        "Join operations",
      ],
      1,
      "LIKE performs pattern matching: % matches any sequence, _ matches one character.",
    ),
    mcq(
      "be-db-14",
      "Normalization in databases aims to:",
      [
        "Add more tables",
        "Remove data redundancy and ensure data integrity",
        "Combine all data into one table",
        "Create indexes",
      ],
      1,
      "Normalization (1NF, 2NF, 3NF) eliminates redundancy and inconsistency by organizing data into related tables.",
    ),
    mcq(
      "be-db-15",
      "An ORM (Object-Relational Mapper) does:",
      [
        "Optimizes SQL queries",
        "Maps database tables to programming language objects, abstracting SQL",
        "Creates database backups",
        "Handles authentication",
      ],
      1,
      "ORMs (Prisma, Sequelize, TypeORM) let you interact with databases using objects instead of raw SQL.",
    ),
  ],
  programmingQuestions: [
    pq(
      "be-db-pq1",
      "Write a SELECT Query",
      "Write SQL queries to: (1) Get all users older than 25, sorted by age descending. (2) Count users per city, only show cities with more than 5 users.",
      [
        {
          input: "users table: id, name, age, city",
          output: "Valid SQL queries",
        },
      ],
      `-- Table: users(id INT, name VARCHAR, age INT, city VARCHAR)

-- 1. Get all users older than 25, sorted by age DESC
SELECT ...

-- 2. Count users per city, only cities with more than 5 users
SELECT ...`,
      63,
      "SQL",
      [
        "Query 1: SELECT * FROM users WHERE age > 25 ORDER BY age DESC",
        "Query 2: Use GROUP BY city and HAVING COUNT(*) > 5",
        "SELECT * FROM users WHERE age>25 ORDER BY age DESC;\nSELECT city, COUNT(*) as count FROM users GROUP BY city HAVING COUNT(*) > 5;",
      ],
      ["SELECT", "WHERE", "ORDER BY", "GROUP BY", "HAVING", "COUNT"],
    ),
    pq(
      "be-db-pq2",
      "Design a Database Schema",
      "Write SQL CREATE TABLE statements for a blogging system with users and posts. Users have: id, username (unique, not null), email. Posts have: id, title, body, created_at, user_id (foreign key to users).",
      [{ input: "No input", output: "Valid CREATE TABLE SQL statements" }],
      `-- Create users table

-- Create posts table (with foreign key to users)
`,
      63,
      "SQL",
      [
        "users: id INT PRIMARY KEY, username VARCHAR UNIQUE NOT NULL, email VARCHAR",
        "posts: FOREIGN KEY (user_id) REFERENCES users(id)",
        "CREATE TABLE users(id INT PRIMARY KEY AUTO_INCREMENT, username VARCHAR(50) UNIQUE NOT NULL, email VARCHAR(100));\nCREATE TABLE posts(id INT PRIMARY KEY AUTO_INCREMENT, title VARCHAR(200), body TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, user_id INT, FOREIGN KEY(user_id) REFERENCES users(id));",
      ],
      [
        "CREATE TABLE",
        "PRIMARY KEY",
        "UNIQUE",
        "NOT NULL",
        "FOREIGN KEY",
        "REFERENCES",
      ],
    ),
  ],
};

// ─── BACKEND: Auth / JWT ──────────────────────────────────────────────────────
const BE_AUTH_JWT: PartQuizData = {
  mcqs: [
    mcq(
      "be-auth-1",
      "JWT stands for:",
      [
        "JavaScript Web Token",
        "JSON Web Token",
        "Java Web Transfer",
        "JSON Web Transfer",
      ],
      1,
      "JWT (JSON Web Token) is a compact, URL-safe token format for transmitting claims between parties.",
    ),
    mcq(
      "be-auth-2",
      "A JWT consists of:",
      [
        "Only a payload",
        "Header and payload only",
        "Header, payload, and signature (separated by dots)",
        "Username and password",
      ],
      2,
      "JWT = base64url(header).base64url(payload).signature — three parts separated by periods.",
    ),
    mcq(
      "be-auth-3",
      "The JWT signature is used to:",
      [
        "Encrypt the payload",
        "Verify the token hasn't been tampered with",
        "Store user passwords",
        "Define token expiry",
      ],
      1,
      "The signature (HMAC or RSA) verifies integrity — any modification to header or payload invalidates it.",
    ),
    mcq(
      "be-auth-4",
      "JWT payloads are:",
      [
        "Encrypted",
        "Base64 encoded (not encrypted — anyone can decode them)",
        "Compressed with gzip",
        "AES encrypted",
      ],
      1,
      "JWTs are encoded (not encrypted) by default — never store sensitive data like passwords in the payload.",
    ),
    mcq(
      "be-auth-5",
      "Authentication vs Authorization:",
      [
        "Same concept",
        "Authentication = who are you; Authorization = what can you do",
        "Authorization happens before authentication",
        "Authentication uses JWT; authorization uses sessions",
      ],
      1,
      "Authentication verifies identity (login); Authorization checks permissions (access rights).",
    ),
    mcq(
      "be-auth-6",
      "Password hashing with bcrypt is preferred because:",
      [
        "It's reversible",
        "It's fast",
        "It's a one-way function with a salt, making rainbow table attacks impractical",
        "It stores plain text",
      ],
      2,
      "bcrypt adds salt and is intentionally slow — making brute-force attacks computationally expensive.",
    ),
    mcq(
      "be-auth-7",
      "Where should JWTs be stored in a browser?",
      [
        "In the URL",
        "In localStorage (convenient but XSS risk) or HttpOnly cookies (recommended)",
        "In sessionStorage always",
        "In a JavaScript variable only",
      ],
      1,
      "HttpOnly cookies protect against XSS (JS can't access them); localStorage is vulnerable to XSS attacks.",
    ),
    mcq(
      "be-auth-8",
      "OAuth 2.0 is used for:",
      [
        "Password hashing",
        "Delegated authorization (allowing third-party apps access without sharing credentials)",
        "Creating JWTs",
        "Session management",
      ],
      1,
      "OAuth 2.0 is an authorization framework — 'Login with Google' uses OAuth to grant limited access.",
    ),
    mcq(
      "be-auth-9",
      "Token refresh flow is needed because:",
      [
        "JWTs are insecure",
        "Access tokens should have short expiry; refresh tokens extend sessions without re-login",
        "Sessions are stateful",
        "All tokens expire after exactly 1 hour",
      ],
      1,
      "Short-lived access tokens limit damage if stolen; refresh tokens allow seamless renewal.",
    ),
    mcq(
      "be-auth-10",
      "HTTPS is essential for authentication because:",
      [
        "It makes requests faster",
        "It encrypts data in transit, preventing credential interception",
        "It validates JWTs",
        "It stores sessions securely",
      ],
      1,
      "Without HTTPS, tokens and credentials can be intercepted in transit (man-in-the-middle attacks).",
    ),
    mcq(
      "be-auth-11",
      "Session-based auth vs JWT: key difference?",
      [
        "No difference",
        "Sessions store state on the server; JWTs are stateless (client stores token)",
        "JWTs require databases; sessions don't",
        "Sessions are more secure always",
      ],
      1,
      "Sessions: server stores session data; JWTs: stateless — all info in the token, no server storage needed.",
    ),
    mcq(
      "be-auth-12",
      "CSRF (Cross-Site Request Forgery) attacks are mitigated by:",
      [
        "Using JWTs",
        "CSRF tokens, SameSite cookies, or checking the Origin header",
        "Longer passwords",
        "Using HTTPS only",
      ],
      1,
      "CSRF tokens (or SameSite=Strict cookies) prevent unauthorized cross-site requests on behalf of a user.",
    ),
    mcq(
      "be-auth-13",
      "The exp claim in a JWT payload:",
      [
        "Expands the payload",
        "Sets the expiration time (Unix timestamp) of the token",
        "Contains the user ID",
        "Encodes the signature",
      ],
      1,
      "The exp (expiration) claim is a timestamp; servers reject tokens past this time.",
    ),
    mcq(
      "be-auth-14",
      "Rate limiting on auth endpoints prevents:",
      [
        "SQL injection",
        "Brute force attacks (trying many password combinations)",
        "CORS errors",
        "JWT forgery",
      ],
      1,
      "Rate limiting login endpoints stops attackers from rapidly trying username/password combinations.",
    ),
    mcq(
      "be-auth-15",
      "Role-Based Access Control (RBAC) assigns:",
      [
        "Tokens to users",
        "Permissions to roles, and roles to users",
        "Passwords to databases",
        "Encryption keys to endpoints",
      ],
      1,
      "RBAC: define roles (admin, user, moderator), assign permissions to roles, then assign roles to users.",
    ),
  ],
  programmingQuestions: [
    pq(
      "be-auth-pq1",
      "JWT Verification Flow",
      "Write a JavaScript function verifyToken(token, secret) that uses the concept of JWT verification: split the token, verify the signature matches, check expiry. Return {valid: true, payload} or {valid: false, error}. (Simulate without a real JWT library.)",
      [
        {
          input: 'verifyToken(token, "secret")',
          output:
            '{ valid: true, payload: {...} } or { valid: false, error: "..." }',
        },
      ],
      `// Simulated JWT verification (conceptual, not using real crypto)
function verifyToken(token, secret) {
  // 1. Split token by '.'
  // 2. Check it has 3 parts (header, payload, signature)
  // 3. Decode payload (base64)
  // 4. Check exp field if present
  // 5. Return result
}`,
      63,
      "JavaScript",
      [
        "const [header, payload, sig] = token.split('.')",
        "const decoded = JSON.parse(atob(payload))",
        "const parts=token.split('.');\nif(parts.length!==3) return {valid:false,error:'Malformed'};\nconst decoded=JSON.parse(atob(parts[1]));\nif(decoded.exp && Date.now()/1000 > decoded.exp) return {valid:false,error:'Expired'};\nreturn {valid:true,payload:decoded};",
      ],
      ["split", "atob", "JSON.parse", "exp", "Date.now", "valid"],
    ),
    pq(
      "be-auth-pq2",
      "Password Hashing Concept",
      "Write a JavaScript function that demonstrates password security concepts: show why plain text is bad, describe what salting does, and write pseudocode for a secure registration/login flow using hashing.",
      [
        {
          input: "password: 'mySecret123'",
          output: "Hashed password stored; login verifies hash",
        },
      ],
      `// Password Security Demonstration

// BAD: Never do this
function badStore(password) {
  return password; // storing plain text!
}

// GOOD: Pseudocode for hashing (using bcrypt concept)
async function secureRegister(password) {
  // 1. Generate a salt
  // 2. Hash the password with the salt
  // 3. Store only the hash
}

async function secureLogin(inputPassword, storedHash) {
  // Compare input with stored hash (not plain comparison)
}`,
      63,
      "JavaScript",
      [
        "const salt = generateSalt(10); // salt adds randomness",
        "const hash = bcrypt.hash(password, salt); // one-way function",
        "// bcrypt.compare(input, storedHash) returns true if match\nasync function secureRegister(pw){\n  const salt=await bcrypt.genSalt(10);\n  return await bcrypt.hash(pw,salt);\n}\nasync function secureLogin(pw,hash){\n  return await bcrypt.compare(pw,hash);\n}",
      ],
      ["salt", "hash", "bcrypt", "compare", "one-way", "async"],
    ),
  ],
};

// ─── Export Map ───────────────────────────────────────────────────────────────
export const TOPIC_QUIZZES: Record<string, PartQuizData> = {
  // Frontend topic-based keys
  "frontend-html-basics": FE_HTML_BASICS,
  "frontend-css-fundamentals": FE_CSS_FUNDAMENTALS,
  "frontend-javascript-basics": FE_JS_BASICS,
  "frontend-react-basics": FE_REACT_BASICS,
  "frontend-typescript": FE_TYPESCRIPT,

  // Python topic-based keys
  "python-basics": PY_BASICS,
  "python-control-flow": PY_CONTROL_FLOW,
  "python-functions": PY_FUNCTIONS,
  "python-data-structures": PY_DATA_STRUCTURES,
  "python-oop": PY_OOP,

  // Backend topic-based keys
  "backend-http-rest": BE_HTTP_REST,
  "backend-nodejs": BE_NODEJS,
  "backend-express": BE_EXPRESS,
  "backend-database": BE_DATABASE,
  "backend-auth-jwt": BE_AUTH_JWT,
};

export default TOPIC_QUIZZES;
