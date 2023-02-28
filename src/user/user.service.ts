import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '@app/user/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@app/user/user.entity';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import * as process from 'process';
import { UserResponseInterface } from '@app/user/types/user-response.interface';
import { LoginUserDto } from '@app/user/dto/login-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async registerUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      email: createUserDto.email,
    });
    const userByUsername = await this.userRepository.findOne({
      email: createUserDto.email,
    });

    if (userByEmail || userByUsername) {
      throw new HttpException(
        'Email or username are taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const newUser = new UserEntity();

    Object.assign(newUser, createUserDto);

    return await this.userRepository.save(newUser);
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const foundUser = await this.userRepository.findOne({
      where: [
        { email: loginUserDto.email },
        { username: loginUserDto.username },
      ],
    });

    if (!loginUserDto.email && !loginUserDto.username) {
      throw new HttpException(
        'You should login with username or email',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!foundUser) {
      throw new HttpException('The user was not found', HttpStatus.NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(
      loginUserDto.password,
      foundUser.password,
    );

    if (!isMatch) {
      throw new HttpException('Wrong password', HttpStatus.UNAUTHORIZED);
    }

    return foundUser;
  }

  generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
    );
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateJwt(user),
      },
    };
  }
}
