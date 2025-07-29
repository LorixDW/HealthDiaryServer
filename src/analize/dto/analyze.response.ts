export class AnalyzeResponse{
  avgCalories: number | null
  stdCalories: number | null
  dynCalories: Straight | null

  avgProteins: number | null
  stdProteins: number | null
  dynProteins: Straight | null

  avgCarbohydrates: number | null
  stdCarbohydrates: number | null
  dynCarbohydrates: Straight | null

  avgFats: number | null
  stdFats: number | null
  dynFats: Straight | null

  breakfastDist: number | null
  lunchDist: number | null
  dinnerDist: number | null
  afternoonDist: number | null
  snackDist: number | null

  normalCalories: number | null

  avgBMI: number | null
  avgLowerPressure: number | null
  avgUpperPressure: number | null
  avgPulse: number | null
  avgTemperature: number | null
  avgSugar: number | null

  stdBMI: number | null
  stdLowerPressure: number | null
  stdUpperPressure: number | null
  stdPulse: number | null
  stdTemperature: number | null
  stdSugar: number | null

  dynBMI: Straight | null
  dynLowerPressure: Straight | null
  dynUpperPressure: Straight | null
  dynPulse: Straight | null
  dynTemperature: Straight | null
  dynSugar: Straight | null

  avgActivity: number | null
  stdActivity: number | null
  dynActivity: Straight | null

  graphs: Graph[] = []
}

export class Graph{
  type: string
  points: Point[] = []
  row1Name: string
  row2Name: string | null
  row3Name: string | null
  row4Name: string | null
  row5Name: string | null
  row6Name: string | null
  row7Name: string | null
  row8Name: string | null
}

export class Point{
  x: string
  y1: number
  y2: number | null
  y3: number | null
  y4: number | null
  y5: number | null
  y6: number | null
  y7: number | null
  y8: number | null
}

export class Straight{
  k: number
  b: number
}