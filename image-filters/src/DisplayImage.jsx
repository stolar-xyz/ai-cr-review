import img from "../images/luna.jpg";
import { useEffect, useState } from "react";

const JANK_DELAY = 100;

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
