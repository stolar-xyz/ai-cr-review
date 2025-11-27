/**
 * Render a slider control showing current and applied values with an updating indicator.
 *
 * @param {Object} props
 * @param {number} props.value - The slider's current (live) value.
 * @param {number} props.deferred - The applied/committed value to compare against `value`.
 * @param {function} props.onChange - Change handler invoked when the slider value changes.
 * @param {string} props.name - Identifier used for the label, input id/name, and output association.
 * @param {number} props.max - Maximum value for the slider.
 * @returns {JSX.Element} The list item containing the labeled range input and output showing current and applied values.
 */
export default function Slider({ value, deferred, onChange, name, max }) {
  const sliderConfig = { min: 0, max: max };

  return (
    <li className="slider">
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