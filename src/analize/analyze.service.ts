import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Record } from '../models/record';
import { Between, Repository } from 'typeorm';
import { GetMeasurementInfoQuery } from './dto/get-measurement-info.query';
import { AnalyzeResponse, Graph, Point, Straight } from './dto/analyze.response';
import { Gender } from '../models/gender';

@Injectable()
export class AnalyzeService{
  constructor(
    @InjectRepository(Record)
    private recordRepository: Repository<Record>
  ) {}

  async getInfo(query: GetMeasurementInfoQuery, user_id): Promise<AnalyzeResponse>{
    const records = await this.recordRepository.find({
      where: {
        user: {
          id: user_id
        },
        date: Between(query.lowerLimit != null ? new Date(query.lowerLimit) : new Date(2000, 0),
          query.upperLimit != null ? new Date(query.upperLimit) : new Date(3000, 0))
      },
      relations: ['user', 'measurements', 'measurements.measurementIndicators', 'measurements.measurementIndicators.indicator',
        'physicalActivities', 'physicalActivities.subcategory', 'physicalActivities.subcategory.category',
        'meals', 'meals.mealTime', 'meals.mealDishes', 'meals.mealDishes.serving', 'meals.mealDishes.serving.dish'
      ]
    })
    if(records.length == 0){
      throw new HttpException('There is no records in this period', HttpStatus.BAD_REQUEST)
    }
    console.log('Find records: ', records)
    let response = new AnalyzeResponse()
    response = await this.getPulse(response, records)
    response = await this.getWeight(response, records)
    response = await this.getPressure(response, records)
    response = await this.getTemperature(response, records)
    response = await this.getSugar(response, records)
    response = await this.getActivity(response, records)
    response = await this.getMeal(response, records)
    return response;
  }

  private getPulse(response: AnalyzeResponse, records: Record[]): AnalyzeResponse{
    const pulseGraph = new Graph()
    pulseGraph.type = 'pulse'
    pulseGraph.row1Name = 'pulse'
    for(const record of records){
      const point = new Point()
      point.x = record.date.toLocaleString()
      point.y1 = 0
      let n = 0
      for(const measurement of record.measurements){
        let value = measurement.measurementIndicators.find((e) => e.indicator.id == 1)
        if(value != null){
          point.y1 += value.value
          n++
        }
      }
      if(point.y1 == 0){
        continue
      }
      point.y1 /= n
      pulseGraph.points.push(point)
      console.log(`Added point in pulse graph `, point)
    }
    if(pulseGraph.points.length == 0){
      return response
    }
    response.graphs.push(pulseGraph)
    response.avgPulse = this.getAvg(pulseGraph.points, (point) => point.y1)
    response.stdPulse = this.getStd(pulseGraph.points, response.avgPulse, (point) => point.y1)
    response.dynPulse = this.getDyn(pulseGraph.points, response.avgPulse, (point) => point.y1)
    return response
  }

  private getWeight(response: AnalyzeResponse, records: Record[]): AnalyzeResponse{
    const weightGraph = new Graph()
    weightGraph.type = 'weight'
    weightGraph.row1Name = 'weight'
    if(records[0].user.height == null){
      return response
    }
    for(const record of records){
      const point = new Point()
      point.x = record.date.toLocaleString()
      point.y1 = 0
      let n = 0
      for(const measurement of record.measurements){
        let value = measurement.measurementIndicators.find((e) => e.indicator.id == 5)
        if(value != null){
          point.y1 += value.value
          n++
        }
      }
      if(point.y1 == 0){
        continue
      }
      point.y1 /= n * Math.pow(record.user.height * 0.01, 2)
      weightGraph.points.push(point)
      console.log(`Added point in BMI graph `, point)
    }
    if(weightGraph.points.length == 0){
      return response
    }
    response.graphs.push(weightGraph)
    response.avgBMI = this.getAvg(weightGraph.points, (point) => point.y1)
    response.stdBMI = this.getStd(weightGraph.points, response.avgBMI, (point) => point.y1)
    response.dynBMI = this.getDyn(weightGraph.points, response.avgBMI, (point) => point.y1)
    return response
  }

  private getPressure(response: AnalyzeResponse, records: Record[]): AnalyzeResponse{
    const pressureGraph = new Graph()
    pressureGraph.type = 'pressure'
    pressureGraph.row1Name = 'upper pressure'
    pressureGraph.row2Name = 'lower pressure'
    for(const record of records){
      const point = new Point()
      point.x = record.date.toLocaleString()
      point.y1 = 0
      point.y2 = 0
      let n1 = 0
      let n2 = 0
      for(const measurement of record.measurements){
        let upper = measurement.measurementIndicators.find((e) => e.indicator.id == 2)
        let lower = measurement.measurementIndicators.find((e) => e.indicator.id == 3)
        if(upper != null){
          point.y1 += upper.value
          n1++
        }
        if(lower != null){
          point.y2 += lower.value
          n2++
        }
      }
      if(point.y1 == 0 && point.y2 == 0){
        continue
      }
      point.y1 /= n1
      point.y2 /= n2
      pressureGraph.points.push(point)
      console.log(`Added point in pressure graph: `, point)
    }
    if(pressureGraph.points.length == 0){
      return response
    }
    response.graphs.push(pressureGraph)

    response.avgUpperPressure = this.getAvg(pressureGraph.points, (point) => point.y1, true)
    response.stdUpperPressure = this.getStd(pressureGraph.points, response.avgUpperPressure, (point) => point.y1, true)
    response.dynUpperPressure = this.getDyn(pressureGraph.points, response.avgUpperPressure, (point) => point.y1, true)

    response.avgLowerPressure = this.getAvg(pressureGraph.points, (point) => point.y2, true)
    response.stdLowerPressure = this.getStd(pressureGraph.points, response.avgLowerPressure, (point) => point.y2, true)
    response.dynLowerPressure = this.getDyn(pressureGraph.points, response.avgLowerPressure, (point) => point.y2, true)

    return response
  }

  private getTemperature(response: AnalyzeResponse, records: Record[]): AnalyzeResponse{
    const temperatureGraph = new Graph()
    temperatureGraph.type = 'temperature'
    temperatureGraph.row1Name = 'temperature'
    for(const record of records){
      const point = new Point()
      point.x = record.date.toLocaleString()
      point.y1 = 0
      let n = 0
      for(const measurement of record.measurements){
        let value = measurement.measurementIndicators.find((e) => e.indicator.id == 4)
        if(value != null){
          point.y1 += value.value
          n++
        }
      }
      if(point.y1 == 0){
        continue
      }
      point.y1 /= n
      temperatureGraph.points.push(point)
      console.log(`Added point in temperature graph: `, point)
    }
    if(temperatureGraph.points.length == 0){
      return response
    }
    response.graphs.push(temperatureGraph)
    response.avgTemperature = this.getAvg(temperatureGraph.points, (point) => point.y1)
    response.stdTemperature = this.getStd(temperatureGraph.points, response.avgTemperature, (point) => point.y1)
    response.dynTemperature = this.getDyn(temperatureGraph.points, response.avgTemperature, (point) => point.y1)
    return response
  }

  private getSugar(response: AnalyzeResponse, records: Record[]): AnalyzeResponse{
    const sugarGraph = new Graph()
    sugarGraph.type = 'sugar'
    sugarGraph.row1Name = 'sugar'
    for(const record of records){
      const point = new Point()
      point.x = record.date.toLocaleString()
      point.y1 = 0
      let n = 0
      for(const measurement of record.measurements){
        let value = measurement.measurementIndicators.find((e) => e.indicator.id == 6)
        if(value != null){
          point.y1 += value.value
          n++
        }
      }
      if(point.y1 == 0){
        continue
      }
      point.y1 /= n
      sugarGraph.points.push(point)
      console.log(`Added point in sugar graph `, point)
    }
    if(sugarGraph.points.length == 0){
      return response
    }
    response.graphs.push(sugarGraph)
    response.avgSugar = this.getAvg(sugarGraph.points, (point) => point.y1)
    response.stdSugar = this.getStd(sugarGraph.points, response.avgSugar, (point) => point.y1)
    response.dynSugar = this.getDyn(sugarGraph.points, response.avgSugar, (point) => point.y1)
    return response
  }

  private getActivity(response: AnalyzeResponse, records: Record[]): AnalyzeResponse{
    const activityGraph = new Graph()
    activityGraph.type = 'activity'
    activityGraph.row1Name = 'activity'
    for(const record of records){
      const point = new Point()
      point.x = record.date.toLocaleString()
      point.y1 = 0
      for(const activity of record.physicalActivities){
        point.y1 += activity.time * activity.subcategory.met
      }
      if(point.y1 == 0){
        continue
      }
      activityGraph.points.push(point)
      console.log(`Added point in activity graph `, point)
    }
    if(activityGraph.points.length == 0){
      return response
    }
    response.graphs.push(activityGraph)
    response.avgActivity = this.getAvg(activityGraph.points, (point) => point.y1)
    response.stdActivity = this.getStd(activityGraph.points, response.avgActivity, (point) => point.y1)
    response.dynActivity = this.getDyn(activityGraph.points, response.avgActivity, (point) => point.y1)
    return response
  }

  private getMeal(response: AnalyzeResponse, records: Record[]): AnalyzeResponse{
    const mealGraph = new Graph()
    mealGraph.type = 'meal'
    mealGraph.row1Name = 'calories'
    mealGraph.row2Name = 'proteins'
    mealGraph.row3Name = 'carbohydrates'
    mealGraph.row4Name = 'fats'
    const bmi = response.avgBMI
    let base_calories = 0
    const activityGraph = response.graphs.find((e) => e.type === 'activity')
    const key = bmi != null && records[0].user.getAge()
    if(key){
      mealGraph.row5Name = 'goal calories'
      mealGraph.row6Name = 'goal proteins'
      mealGraph.row7Name = 'goal carbohydrates'
      mealGraph.row8Name = 'goal fats'
      console.log('BMI: ', `(${10} * ${bmi} * ${Math.pow(records[0].user.height * 0.01, 2)}) + (${6.25} * ${records[0].user.height}) - (${4.43} * ${records[0].user.getAge()})`)
      base_calories = (10 * bmi * Math.pow(records[0].user.height * 0.01, 2))
      base_calories += (6.25 * records[0].user.height)
      base_calories -= (4.33 * records[0].user.getAge())
      base_calories += records[0].user.gender == Gender.FEMALE ? -161 : 5
      console.log((10 * bmi * Math.pow(records[0].user.height * 0.01, 2)), (6.25 * records[0].user.height), (4.33 * records[0].user.getAge()), base_calories)
    }
    const mealtimeDist: number[][] = []
    for(const record of records){
      const point = new Point()
      point.x = record.date.toLocaleString();
      point.y1 = 0
      point.y2 = 0
      point.y3 = 0
      point.y4 = 0

      mealtimeDist.push([0, 0, 0, 0, 0])
      for(const meal of record.meals){
        for(const dish of meal.mealDishes){
          point.y1 += dish.serving.calories
          point.y2 += dish.serving.protein
          point.y3 += dish.serving.carbohydrate
          point.y4 += dish.serving.fat
          mealtimeDist[mealtimeDist.length - 1][meal.mealTime.id - 1] += dish.serving.calories
        }
      }

      if(point.y1 == 0){
        mealtimeDist.pop()
        continue
      }

      for(let i = 0; i < 5; i++){
        mealtimeDist[mealtimeDist.length - 1][i] /= point.y1
      }
      if(key){
        let activity = activityGraph.points.find((e) => e.x == record.date.toLocaleString())
        point.y5 = base_calories + (activity != null ? (activity.y1 / 60) * bmi * Math.pow(records[0].user.height * 0.01, 2) : 0)
        point.y6 = ( point.y5 * 0.3 )/ 4
        point.y7 = ( point.y5 * 0.5 )/ 4
        point.y8 = ( point.y5 * 0.2 )/ 9
      }
      mealGraph.points.push(point)
      console.log(`Added point in meal graph `, point)
    }
    if(mealGraph.points.length == 0){
      return response
    }
    response.graphs.push(mealGraph);

    response.avgCalories = this.getAvg(mealGraph.points, (point) => point.y1)
    response.stdCalories = this.getStd(mealGraph.points, response.avgCalories, (point) => point.y1)
    response.dynCalories = this.getDyn(mealGraph.points, response.avgCalories, (point) => point.y1)

    response.avgProteins = this.getAvg(mealGraph.points, (point) => point.y2)
    response.stdProteins = this.getStd(mealGraph.points, response.avgProteins, (point) => point.y2)
    response.dynProteins = this.getDyn(mealGraph.points, response.avgProteins, (point) => point.y2)

    response.avgCarbohydrates = this.getAvg(mealGraph.points, (point) => point.y3)
    response.stdCarbohydrates = this.getStd(mealGraph.points, response.avgCarbohydrates, (point) => point.y3)
    response.dynCarbohydrates = this.getDyn(mealGraph.points, response.avgCarbohydrates, (point) => point.y3)

    response.avgFats = this.getAvg(mealGraph.points, (point) => point.y4)
    response.stdFats = this.getStd(mealGraph.points, response.avgFats, (point) => point.y4)
    response.dynFats = this.getDyn(mealGraph.points, response.avgFats, (point) => point.y4)

    console.log(mealtimeDist)
    const getAvgDist = (matrix: number[][], index: number) => {
      let res = 0
      for(let i = 0; i < matrix.length; i++){
        res += matrix[i][index - 1]
      }
      console.log('Get dist ', index, res)
      return res / matrix.length
    }

    response.breakfastDist = getAvgDist(mealtimeDist, 1)
    response.lunchDist = getAvgDist(mealtimeDist, 2)
    response.dinnerDist = getAvgDist(mealtimeDist, 3)
    response.afternoonDist = getAvgDist(mealtimeDist, 4)
    response.snackDist = getAvgDist(mealtimeDist, 5)

    response.normalCalories = key ? base_calories * 1.3 : null
    return response
  }

  private getAvg(points: Point[], get: (point: Point) => number, skipZero: boolean = false): number{
    let avg = 0
    let skipped = 0
    for(const point of points){
      if(get(point) == 0 && skipZero){
        skipped++
        continue
      }
      avg += get(point)
    }
    console.log(`Avg find:`, avg / (points.length - skipped))
    return avg / (points.length - skipped)
  }

  private getStd(points: Point[], avg: number, get: (point: Point) => number, skipZero: boolean = false){
    let std = 0
    let skipped = 0
    for(const point of points){
      if(get(point) == 0 && skipZero){
        skipped++
        continue
      }
      std += Math.pow(get(point) - avg, 2)
    }
    console.log(`Find std:`, Math.sqrt(std / (points.length - skipped)))
    return Math.sqrt(std / (points.length - skipped))
  }

  private getDyn(points: Point[], avgY: number,  get: (point: Point) => number, skipZero: boolean = false): Straight | null{
    const avgX = (points.length - 1) / 2
    if(points.length < 2){
      return null
    }
    let numerator = 0
    let denominator = 0
    console.log(points, avgX, avgY)
    for(let i = 0; i < points.length; i++){
      if(get(points[i]) == 0 && skipZero){
        continue
      }
      numerator += (i - avgX) * (get(points[i]) - avgY)
      denominator += Math.pow(i - avgX, 2)
    }
    const straight = new Straight()
    straight.k = numerator / denominator
    straight.b = avgY - straight.k * avgX

    console.log(`Find str8`, straight)
    return straight
  }
}