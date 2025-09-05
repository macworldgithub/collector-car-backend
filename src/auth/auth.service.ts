import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User,UserDocument } from 'src/schemas/user.schema';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { email, password, name } = signUpDto;

    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      email,
      password: hashedPassword,
      name,
    });

    const payload = { sub: user._id, email: user.email };
    const token = this.jwtService.sign(payload);

    return { token };
  }

  async signIn(signInDto: SignInDto): Promise<{ token: string }> {
    const { email, password } = signInDto;

    const user = await this.userModel.findOne({ email }).exec();
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user._id, email: user.email };
    const token = this.jwtService.sign(payload);

    return { token };
  }
}