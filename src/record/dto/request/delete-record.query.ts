import { IsBooleanString} from 'class-validator';

export class DeleteRecordQuery {
  @IsBooleanString()
  action: boolean
}