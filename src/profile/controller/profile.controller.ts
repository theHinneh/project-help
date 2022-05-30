import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProfileService } from '../service/profile.service';
import { ProfileDto } from '../dto/profile.dto';
import { Profile } from '../entity/profile.entity';
import { JwtGuard } from '../../jwt/jwt.guard';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  /**
   * This function is used to create a new profile/registration. It does that by receiving the http request (POST)
   * and sending it to the profile service
   * @param profileDto id the profile/registration data needed to create a profile
   * @param userId is the id of the logged-in user
   */
  @Post(':userId')
  @UseGuards(JwtGuard)
  async createMember(
    @Body() profileDto: ProfileDto,
    @Param('userId') userId: string,
  ): Promise<Profile> {
    return this.profileService.createNewMember(profileDto, userId);
  }

  /**
   * This function returns all profiles/registrations. It does that by receiving the http request (GET)
   * and sending it to the profile service
   */
  @Get()
  @UseGuards(JwtGuard)
  async getAllMembers(): Promise<Array<Profile>> {
    return this.profileService.getAllMembers();
  }

  /**
   * This function helps to retrieve a single profile. It does that by receiving the http request (GET) with the
   * profile ID as an url parameter and sending it to the profile service.
   * @param id is the profile ID
   */
  @Get(':id')
  @UseGuards(JwtGuard)
  async getMemberById(@Param('id') id: string): Promise<Profile> {
    return this.profileService.getMembersById(id);
  }

  /**
   * This function is used to update a profile/registration. It does that by receiving the http request (PATCH) which
   * has the profile ID as an url parameter
   * @param profileDto
   * @param userId
   */
  @Patch(':userId')
  @UseGuards(JwtGuard)
  async updateMember(
    @Body() profileDto: ProfileDto,
    @Param('userId') userId: string,
  ): Promise<Profile> {
    return this.profileService.updateMember(profileDto, userId);
  }

  /**
   * This function is used to delete a profile using the profile ID as an url parameter. It's a DELETE http request
   * @param id
   */
  @Delete(':id')
  @UseGuards(JwtGuard)
  async deleteMember(@Param('id') id: string): Promise<Profile> {
    return this.profileService.deleteMember(id);
  }
}
