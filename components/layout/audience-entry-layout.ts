/** Keep 40% of the original mobile header-to-headline gap, including on remeasure. */
export function mobileIntroReduction(currentGap: number, appliedReduction: number) {
  return Math.max(0, currentGap + appliedReduction) * 0.6
}

/** Area centroid of the visible upper wedge, not of the oversized offscreen stage. */
export function visibleAthleteCenter(width: number, junction: number) {
  const diagonalDepth = width / (2 * Math.sqrt(3))
  if (junction <= diagonalDepth) return junction / 3

  const rectangleHeight = junction - diagonalDepth
  const rectangleArea = width * rectangleHeight
  const triangleArea = width * diagonalDepth / 2
  return (
    rectangleArea * rectangleHeight / 2 +
    triangleArea * (rectangleHeight + diagonalDepth / 3)
  ) / (rectangleArea + triangleArea)
}
