import { useCallback, useEffect, useRef, useState } from "react";

export default function App() {
  const [thoughts, setThoughts] = useState([]);
  const [thought, setThought] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState(null);
  const nextIdRef = useRef(0);

  const createThoughtWithId = useCallback((text) => {
    return {
      id: nextIdRef.current++,
      text,
    };
  }, []);

  const postDeepThought = useCallback(async () => {
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
      setThoughts(newThoughts.map(createThoughtWithId));
    } catch (err) {
      setError("Network error. Please try again.");
      setThought(currentThought);
      console.error(err);
    } finally {
      setIsPosting(false);
    }
  }, [thought, createThoughtWithId]);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/thoughts", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load thoughts");
        }
        return res.json();
      })
      .then((data) => {
        setThoughts(data.map(createThoughtWithId));
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Failed to load thoughts:", err);
          setError("Failed to load thoughts. Please refresh the page.");
        }
      });

    return () => controller.abort();
  }, [createThoughtWithId]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      postDeepThought();
    },
    [postDeepThought]
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
          thoughts.map((t) => <li key={t.id}>{t.text}</li>)
        ) : (
          <li>No thoughts yet. Share your first deep thought!</li>
        )}
      </ul>
    </div>
  );
}
