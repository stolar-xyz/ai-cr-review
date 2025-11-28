import DOMPurify from "dompurify";

export default function MarkdownPreview({ render, options }) {
  const renderMetadata = {
    timestamp: Date.now(),
    theme: options.theme
  };

  // Sanitize the HTML output to prevent XSS attacks
  const sanitizedHtml = DOMPurify.sanitize(render(options.text));

  return (
    <div>
      <h1>Last Render: {renderMetadata.timestamp}</h1>
      <div
        className="markdown-preview"
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        style={{ color: renderMetadata.theme }}
      ></div>
    </div>
  );
}
