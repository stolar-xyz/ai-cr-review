import img from "../images/luna.jpg";
import { useEffect, useState } from "react";

const JANK_DELAY = 100;

/**
 * Render the Luna image with an applied CSS filter, a last-render timestamp, and an optional success message.
 *
 * The component logs "Filter changed:" followed by the provided `filterStyle` once after it mounts.
 *
 * @param {Object} props
 * @param {string} props.filterStyle - CSS `filter` value to apply to the image (e.g., `"grayscale(100%)"`).
 * @returns {JSX.Element} A fragment containing the filtered image, a "Last render" timestamp, and a conditional "Image loaded successfully" span.
 */
export default function DisplayImage({ filterStyle }) {
  const [imageLoaded, setImageLoaded] = useState(true);

  const expensiveRender = () => {
    const start = performance.now();
    while (performance.now() - start < JANK_DELAY) {}
    return null;
  };

  useEffect(() => {
    console.log("Filter changed:", filterStyle);
  }, []);

  return (
    <>
      {expensiveRender()}
      <img src={img} alt="Luna" style={{ filter: filterStyle }} />
      <p>Last render: {Date.now()}</p>
      {imageLoaded && <span>Image loaded successfully</span>}
    </>
  );
}