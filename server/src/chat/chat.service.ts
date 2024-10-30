import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  Inject,
  forwardRef,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/entities/user.entity";
import { UserAuth } from "src/entities/user-auth.entity";
import { GeneralChat } from "src/entities/general-chat.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from "bcryptjs";
import { LoginUserDto } from "./dto/connect-user.dto";
import { GeneralSendDto } from "./dto/general-send.dto";
import { ChatsGateway } from "src/gateways/chats.gateway";

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(UserAuth)
    private userAuthRepository: Repository<UserAuth>,

    @InjectRepository(GeneralChat)
    private generalChatRepository: Repository<GeneralChat>,

    private jwtService: JwtService,

    @Inject(forwardRef(() => ChatsGateway))
    private chatsGateway: ChatsGateway
  ) {}

  async createUser(
    createUserDto: CreateUserDto
  ): Promise<{ accessToken: string }> {
    const { email, password, firstName } = createUserDto;

    const existingUserByEmail = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUserByEmail) {
      throw new ConflictException("Email is already in use");
    }

    const user = this.usersRepository.create({
      email,
      firstName,
    });
    await this.usersRepository.save(user);

    const hashedPassword = await bcrypt.hash(password, 10);
    const userAuth = this.userAuthRepository.create({
      password: hashedPassword,
      user,
    });
    await this.userAuthRepository.save(userAuth);

    const payload = { userId: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const existingUser = await this.usersRepository.findOne({
      where: { email },
      relations: ["auth"],
    });
    if (!existingUser) {
      throw new ConflictException("Email not found");
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.auth.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid password");
    }

    const payload = { userId: existingUser.id, email: existingUser.email };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async getUser(userId: number): Promise<User> {
    const user = await this.findUser(userId);

    return user;
  }

  async generalSend(userId: number, generalSendDto: GeneralSendDto) {
    const user = await this.findUser(userId);

    const newMessage = this.generalChatRepository.create({
      message: generalSendDto.message,
      messageType: generalSendDto.messageType,
      user,
    });

    const saveNewMessage = await this.generalChatRepository.save(newMessage);

    await this.chatsGateway.handleIncomingMessage(saveNewMessage);

    return saveNewMessage;
  }

  async uploadFile(file: Express.Multer.File) {
    return {
      filename: file.filename,
      path: `/uploads/${file.filename}`,
      mimetype: file.mimetype,
      size: file.size,
    };
  }

  async getGeneralMessages() {
    const messages = await this.generalChatRepository
      .createQueryBuilder("generalChat")
      .leftJoinAndSelect("generalChat.user", "user")
      .orderBy("generalChat.createdAt", "DESC")
      .limit(20)
      .select(["generalChat", "user.id", "user.firstName"])
      .getMany();

    return messages.reverse();
  }

  private async findUser(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    return user;
  }
}
