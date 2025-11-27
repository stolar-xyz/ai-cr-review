import { useEffect } from "react";
import { marked } from "marked";
import { useState } from "react";

import MarkdownPreview from "./MarkdownPreview";
import markdownContent from "./markdownContent";

export default function App() {
  const [text, setText] = useState(markdownContent);
  const [time, setTime] = useState(Date.now());
  const [theme, setTheme] = useState("green");
  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now());
    }, 10);
  }, []);

  useEffect(() => {
    setRenderCount(renderCount + 1);
  });

  const render = (text) => marked.parse(text);
  const options = { text, theme };

  return (
    <div className="app">
      <h1>Markdown Editor</h1>
      <h2>Current Time: {time}</h2>
      <h3>Render count: {renderCount}</h3>
      <label htmlFor={"theme"}>
        Choose a theme:
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="green">Green</option>
          <option value="blue">Blue</option>
          <option value="red">Red</option>
          <option value="yellow">Yellow</option>
        </select>
      </label>
      <div className="markdown">
        <textarea
          className="markdown-editor"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        <MarkdownPreview options={options} render={render} />
      </div>
    </div>
  );
}
