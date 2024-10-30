import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John', description: 'first name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  firstName: string;

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
