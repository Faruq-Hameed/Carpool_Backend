import { Manager } from '@/database/models';
import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@/exceptions';
import type {
  IManagerLogin,
  IManagerChangePass,
} from '@/interfaces/backoffice/authInterface';
import { comparePassword, generateManagerToken } from '@/utils/auth';

class AuthService {
  // manager login
  async login(data: IManagerLogin): Promise<any> {
    const manager = await Manager.findOne({
      $or: [{ email: data.userinfo }, { username: data.userinfo }],
    });
    if (!manager) {
      throw new NotFoundException('Manager does not exist');
    }

    if (!manager.is_active) {
      throw new ForbiddenException(
        'Account has been disabled, Please reach out to Administrator',
      );
    }
    const validatedPassword = await comparePassword(
      manager.password,
      data.password,
    );
    if (!validatedPassword) {
      throw new BadRequestException('Invalid login credentials');
    }
    // remove the password from the data to be sent to the client
    manager.password = '';
    const token = generateManagerToken(manager);
    return { token, manager };
  }

  async changePassword(data: IManagerChangePass, manager: any): Promise<any> {
    const managerUser = await Manager.findById(manager._id);
    if (!managerUser) {
      throw new NotFoundException('Manager does not exist');
    }
    // check if the new password is the same as the old password
    const validatedPassword = await comparePassword(
      managerUser.password,
      data.newPassword,
    );
    if (validatedPassword) {
      throw new BadRequestException(
        'New password cannot be the same as the old password',
      );
    }
    manager.password = data.newPassword;
    await manager.save();
    return 'Password changed successfully';
  }

  // reset other managers account
  async resetPassword(managerId: string): Promise<any> {
    const manager = await Manager.findById(managerId);
    if (!manager) {
      throw new NotFoundException('Manager does not exist');
    }
    const newPassword = await this.generateSecurePassword();
    manager.password = newPassword;
    await manager.save();
    // notify manager of change
    return newPassword;
  }

  async generateSecurePassword(): Promise<string> {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 10;
    // Shuffle the characters
    const shuffledCharacters = characters
      .split('')
      .sort(() => 0.5 - Math.random());
    // Take the first 'length' characters from the shuffled array
    return shuffledCharacters.slice(0, length).join('');
  }
}
export default new AuthService();
