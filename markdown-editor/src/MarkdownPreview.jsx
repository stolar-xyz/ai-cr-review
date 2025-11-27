const JANK_DELAY = 150;

export default function MarkdownPreview({ render, options }) {
  const expensiveRender = () => {
    const start = performance.now();
    while (performance.now() - start < JANK_DELAY) {}
    return null;
  };

  const renderMetadata = {
    timestamp: Date.now(),
    theme: options.theme
  };

  return (
    <div>
      <h1>Last Render: {renderMetadata.timestamp}</h1>
      <div
        className="markdown-preview"
        dangerouslySetInnerHTML={{ __html: render(options.text) }}
        style={{ color: renderMetadata.theme }}
      ></div>
      {expensiveRender()}
    </div>
  );
}
