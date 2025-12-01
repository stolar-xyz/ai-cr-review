const loadingUrl = "/images/loading.webp";
export default function Score({
  isPending,
  home,
  away,
  awayName,
  homeName,
  awayImage,
  homeImage,
}) {
  return (
    <div className="score">
      <div>
        <h2>{homeName.toUpperCase()}</h2>
        <h3>{home}</h3>
        <img src={homeImage} alt="home team logo" />
      </div>
      <div>
        <h2>{awayName.toUpperCase()}</h2>
        <h3>{away}</h3>
        <img src={awayImage} alt="away team logo" />
      </div>
    </div>
  );
}
