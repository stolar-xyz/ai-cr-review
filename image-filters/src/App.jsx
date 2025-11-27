import { useState, useEffect } from "react";
import Slider from "./Slider";
import DisplayImage from "./DisplayImage";

export default function App() {
  const [filters, setFilters] = useState({
    blur: 0,
    brightness: 100,
    contrast: 100,
    saturate: 100,
    sepia: 0
  });

  const updateFilter = (name, value) => {
    filters[name] = value;
    setFilters(filters);
  };

  const filterStyle = `
  blur(${filters.blur}px)
  brightness(${filters.brightness}%)
  contrast(${filters.contrast}%)
  saturate(${filters.saturate}%)
  sepia(${filters.sepia}%)`;

  return (
    <div className="app">
      <h1>Image Filters</h1>
      <DisplayImage filterStyle={filterStyle} />
      <ul>
        <Slider
          value={filters.blur}
          deferred={filters.blur}
          onChange={(e) => updateFilter('blur', e.target.value)}
          name="Blur"
          max="20"
        />
        <Slider
          value={filters.brightness}
          deferred={filters.brightness}
          onChange={(e) => updateFilter('brightness', e.target.value)}
          name="Brightness"
          max="200"
        />
        <Slider
          value={filters.contrast}
          deferred={filters.contrast}
          onChange={(e) => updateFilter('contrast', e.target.value)}
          name="Contrast"
          max="200"
        />
        <Slider
          value={filters.saturate}
          deferred={filters.saturate}
          onChange={(e) => updateFilter('saturate', e.target.value)}
          name="Saturate"
          max="200"
        />
        <Slider
          value={filters.sepia}
          deferred={filters.sepia}
          onChange={(e) => updateFilter('sepia', e.target.value)}
          name="Sepia"
          max="100"
        />
      </ul>
    </div>
  );
}
