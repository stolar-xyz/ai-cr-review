import { useCallback, useEffect, useState } from "react";

export default function App() {
  const [thoughts, setThoughts] = useState([]);
  const [thought, setThought] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState(null);

  async function postDeepThought() {
    const currentThought = thought;
    setThought("");
    setError(null);
    setIsPosting(true);

    try {
      const response = await fetch("/thoughts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ thought: currentThought }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Failed to post thought");
        setThought(currentThought);
        return;
      }

      const { thoughts: newThoughts } = await response.json();
      setThoughts(newThoughts);
    } catch (err) {
      setError("Network error. Please try again.");
      setThought(currentThought);
      console.error(err);
    } finally {
      setIsPosting(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    fetch("/thoughts", { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        setThoughts(data);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Failed to load thoughts:", err);
          setError("Failed to load thoughts. Please refresh the page.");
        }
      });

    return () => controller.abort();
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      postDeepThought();
    },
    [thought]
  );

  return (
    <div className="app">
      <h1>Deep Thoughts</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="thought">What's on your mind?</label>
        <textarea
          id="thought"
          name="thought"
          rows="5"
          cols="33"
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          disabled={isPosting}
        />
        <button type="submit" disabled={isPosting}>
          {isPosting ? "Posting..." : "Submit"}
        </button>
      </form>
      <ul>
        {thoughts.length > 0 ? (
          thoughts.map((t) => <li key={t}>{t}</li>)
        ) : (
          <li>No thoughts yet. Share your first deep thought!</li>
        )}
      </ul>
    </div>
  );
}
