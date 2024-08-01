interface IManagerLogin {
  userinfo: string;
  password: string;
}
interface IManagerChangePass {
  oldPassword: string;
  newPassword: string;
}

export type { IManagerLogin, IManagerChangePass };
