import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileDto } from '../dto/profile.dto';
import { Profile } from '../entity/profile.entity';
import { Auth } from '../../auth/entity/auth.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private membersRepository: Profile,
  ) {}

  /**
   * this function is used to create a new profile (registration)
   * @param profileDto is the data required to make a registration
   * @param userId is the id of the user when she/he log into the platform
   */
  async createNewMember(
    profileDto: ProfileDto,
    userId: string,
  ): Promise<Profile> {
    const user = await Auth.findOne({ where: { id: userId } }); // search for the user using his/her id
    const newMember: Profile = new Profile(); // create a new instance of the profile entity
    newMember.firstName = profileDto.firstName;
    newMember.lastName = profileDto.lastName;
    newMember.phone = profileDto.phone;
    newMember.interests = profileDto.interests;
    newMember.location = profileDto.location;
    newMember.user = user;
    return await Profile.save(newMember); // save the data into the database
  }

  /**
   * this function is used to retrieve a single member from the database
   * @param id is the profile/registration id
   */
  async getMembersById(id: string): Promise<Profile> {
    const candidate = await Profile.findOne({ id }); // search for the user using his/her id
    if (!candidate)
      throw new NotFoundException(`Member with ID: ${id} not found`); // if no user is found, throw an error
    return candidate; // return the found user
  }

  /**
   * this function is used to retrieve all the data in the profile table
   */
  async getAllMembers(): Promise<Array<Profile>> {
    const query = Profile.createQueryBuilder('allMembers'); // activate a query on the profile table
    return await query.getMany(); // return all the data in the profile table
  }

  /**
   * this function is used to update a user's profile
   * @param data is the profile data that needs to be updated
   * @param userId is the user id (the id of the user that's returned when logged in)
   */
  async updateMember(data: ProfileDto, userId: string): Promise<Profile> {
    const user = await Auth.findOne({ where: { id: userId } });
    const profile = await this.getMembersById(data.id);
    profile.firstName = data.firstName;
    profile.lastName = data.lastName;
    profile.phone = data.phone;
    profile.interests = data.interests;
    profile.location = data.location;
    profile.user = user;
    return await Profile.save(profile);
  }

  /**
   * this function is used to delete a profile/registration from the user table
   * @param id is the id of the profile that needs to be deleted
   */
  async deleteMember(id: string): Promise<any> {
    const result = await Profile.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`Candidate with ID "${id}" not found`);
    }
    return { id, message: 'Deleted' };
  }
}
