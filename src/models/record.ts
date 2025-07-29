import { User } from './user';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Measurement, MeasurementResponse } from './measurement';
import { ActivityResponse, RecordPhysicalActivity } from './record-physical-activity';
import { Meal, MealFullResponse, MealResponse } from './meal';

@Entity()
export class Record {
  @PrimaryGeneratedColumn({type: 'bigint'})
  id: number;

  @Column({type: 'date'})
  date: Date;

  @Column({type: 'text', nullable: true})
  note: string | null;

  @Column({type: 'bool'})
  isDeleted: boolean;

  @ManyToOne(
    () => User,
    (user) => user.records
  )
  user: User;

  @OneToMany(
    () => Measurement,
    (measurement) => measurement.record
  )
  measurements: Measurement[]

  @OneToMany(
    () => RecordPhysicalActivity,
    (physicalActivity) => physicalActivity.record
  )
  physicalActivities: RecordPhysicalActivity[];

  @OneToMany(
    () => Meal,
    (meal) => meal.record
  )
  meals: Meal[];

  constructor(
    date: Date,
    note: string | null,
    user: User
  ) {
    this.date = date;
    this.note = note;
    this.user = user;
    this.isDeleted = false;
  }

  public toShortResponse(){
    const response = new RecordShortResponse();
    response.id = Number(this.id);
    response.date = this.date.toLocaleString();
    response.note = this.note;
    response.isDeleted = this.isDeleted;
    return response;
  }

  public toFullResponse(){
    const response = new RecordFullResponse();
    response.id = Number(this.id);
    response.date = this.date.toLocaleString();
    response.note = this.note;
    response.isDeleted = this.isDeleted;
    response.meals = this.meals.map((e) => e.toFullResponse())
    response.activities  = this.physicalActivities.map((e) => e.toResponse())
    response.measurements = this.measurements.map((e) => e.toResponse())

    if(this.user.height != null && this.user.weight != null && this.user.dob != null){
      let normalCalories = 10 * this.user.weight
      normalCalories += 6.25 * this.user.height
      normalCalories -= 4.33 * this.user.getAge()
      for(const activity of this.physicalActivities){
        normalCalories  += (activity.time / 60) * activity.subcategory.met * this.user.weight
      }
      response.normalCalories = normalCalories
    }
    return response;
  }
}

export class RecordShortResponse{
  id: number;
  date: string;
  note: string | null;
  isDeleted: boolean;
}

export class RecordFullResponse{
  id: number
  date: string
  note: string | null
  isDeleted: boolean
  normalCalories: number | null
  meals: MealFullResponse[]
  activities: ActivityResponse[]
  measurements: MeasurementResponse[]
}