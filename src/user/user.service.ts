import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../models/user';
import { Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserUpdateRequest } from './dto/request/user.update.request';
import { Gender } from '../models/gender';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  private saltOrRounds = 10;

  findAll(): Promise<User[]>{
    return this.userRepository.find();
  }

  async register(login: string, password: string): Promise<User> {
    const users = await this.userRepository.find({
      where: {
        login: login
      }
    });
    if (users.length > 0) {
      throw new HttpException('Login already exists', HttpStatus.CONFLICT)
    }

    const user = new User(
      login,
      await bcrypt.hash(password, this.saltOrRounds)
    );

    return this.userRepository.save(user);
  }
  async login(login: string, password: string): Promise<User>{
    const res = await this.userRepository.findOne({
      where: {
        login: login
      }
    });
    if(res == null){
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if(!(await bcrypt.compare(password, res!.password))){
      throw new HttpException('Wrong password', HttpStatus.UNAUTHORIZED);
    }
    return res;
  }

  async getUserById(id: number): Promise<User>{
    const user = await this.userRepository.findOne({
        where: {
          id: id
        }
      });
    if(user == null){
      throw new HttpException('There is no user with such id', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async getUserByLogin(login: string): Promise<User>{
    const user = this.userRepository.findOne({
      where: {
        login: login,
      }
    });
    if(user == null){
      throw new HttpException('There is no user with such login', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async updateData(userData: UserUpdateRequest, id: number): Promise<User>{
    const res = await this.getUserById(id);

    if(userData.email != null && (await this.userRepository.find({ where: {id: Not(res.id), email: userData.email} })).length > 0){
      throw new HttpException('Such email already used', HttpStatus.CONFLICT);
    }
    if(userData.phone != null && (await this.userRepository.find({where: {id: Not(res.id), phone: userData.phone}})).length > 0){
      throw new HttpException('Such phone already used', HttpStatus.CONFLICT);
    }

    if(userData.email != null){res.email = userData.email}
    if(userData.phone != null){res.phone = userData.phone}
    if(userData.dob != null){res.dob = new Date(userData.dob)}
    if(userData.height != null){res.height = userData.height}
    if(userData.gender != null){res.gender = Gender[userData.gender]}

    await this.userRepository.save(res);
    return this.getUserById(id);
  }

  async save(user: User): Promise<User>{
    return this.userRepository.save(user)
  }
}
