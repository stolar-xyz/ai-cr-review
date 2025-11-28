export default function Slider({ value, deferred, onChange, name, max }) {
  const sliderConfig = { min: 0, max: max };

  return (
    <li className="slider1">
      <label htmlFor={name}>
        {name}
        {value !== deferred ? " (Updating)" : ""}
      </label>
      <input
        type="range"
        id={name}
        name={name}
        min={sliderConfig.min}
        max={sliderConfig.max}
        value={value}
        onChange={onChange}
      />
      <output htmlFor={name}>
        Current: {value} | Applied: {deferred}
      </output>
    </li>
  );
}
