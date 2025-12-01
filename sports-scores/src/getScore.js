export default async function getScore(game) {
  const response = await fetch("/score?game=" + game);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const score = await response.json();
  score.timestamp = Date.now();
  return score;
}
