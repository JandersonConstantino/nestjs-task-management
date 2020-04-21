import { Controller, Post, Body, Res, ValidationPipe, UseGuards } from '@nestjs/common'
import { Response } from 'express'

import { AuthService } from './auth.service'
import { AuthCredentialsDto } from './dto'
import { AuthGuard } from '@nestjs/passport'
import { GetUser } from './get-user.decorator'
import { User } from './user.entity'

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) { }

  @Post('signup')
  async signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
    @Res() response: Response
  ): Promise<Response> {
    await this.authService.signUp(authCredentialsDto)
    return response.status(201).send()
  }

  @Post('signin')
  async signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto
  ): Promise<{ accessToken: string }> {
    return await this.authService.signIn(authCredentialsDto)
  }

  @Post('test')
  @UseGuards(AuthGuard())
  async test(
    @Res() response: Response,
    @GetUser() user: User
  ) {
    return response.json({ authenticated: true, user })
  }
}
