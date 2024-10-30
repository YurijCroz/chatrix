import { Body, Controller, Get, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ChatsService } from "./chat.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "src/entities/user.entity";
import { JwtAuthGuard } from "./jwt-auth.guard";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { LoginUserDto } from "./dto/connect-user.dto";
import { GeneralSendDto } from "./dto/general-send.dto";
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { FileInterceptor } from "@nestjs/platform-express";

@ApiTags("chat")
@Controller("chat")
export class ChatsController {
  constructor(private usersService: ChatsService) {}

  @ApiOperation({ summary: "Create user and start game" })
  @ApiResponse({ status: 201 })
  @Post("registration")
  async register(
    @Body() createUserDto: CreateUserDto
  ): Promise<{ accessToken: string }> {
    return this.usersService.createUser(createUserDto);
  }

  @ApiOperation({ summary: "Login user and get accessToken" })
  @ApiResponse({ status: 201 })
  @Post("login")
  async connect(
    @Body() loginUserDto: LoginUserDto
  ): Promise<{ accessToken: string }> {
    return this.usersService.loginUser(loginUserDto);
  }

  @ApiOperation({ summary: "Get user data" })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: User })
  @UseGuards(JwtAuthGuard)
  @Get("user")
  async getUser(@Req() req): Promise<User> {
    return this.usersService.getUser(req.user.userId);
  }

  @ApiOperation({ summary: "send message" })
  @ApiBearerAuth()
  @ApiResponse({ status: 201 })
  @UseGuards(JwtAuthGuard)
  @Post("general-send")
  async generalSend(@Req() req, @Body() generalSendDto: GeneralSendDto) {
    return this.usersService.generalSend(req.user.userId, generalSendDto);
  }

  @ApiOperation({ summary: 'Send file' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        cb(null, true);
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('Uploaded file:', file);
    return this.usersService.uploadFile(file);
  }

  @Get("all")
  async getGeneralMessage() {
    return this.usersService.getGeneralMessages();
  }
}
