import {
  Injectable,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { UserDto } from "./dto/user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: UserDto): Promise<User> {
    const existingUser: User | null = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (existingUser) {
      throw new ConflictException("Username already exists");
    }

    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async updateRefreshToken(refreshToken: string, userId: string) {
    return await this.userRepository.update(
      { id: userId },
      { hashedRefreshToken: refreshToken },
    );
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.find({ where: { username } });

    if (user.length === 0) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    return user[0]!;
  }

  async remove(username: string): Promise<void> {
    const user = await this.findByUsername(username);
    await this.userRepository.remove(user);
  }
}
