import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ example: 'example@gmail.com', description: 'email' })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  email: string;

  @ApiProperty({ example: 'pasSword14', description: 'password' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  password: string;
}
