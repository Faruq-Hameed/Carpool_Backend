interface IValue {
  email: string;
  username: string;
  password: string;
}

interface IPaginationOptions {
  limit: number;
  skip: number;
}

interface IUserIdWithPublic {
  userId: string;
  userPublicFields: string;
}
interface IByUserEmail {
  email: string;
  username: string;
}

interface IUpdateUser {
  id: string;
  userId: string;
  value: {
    firstname: string;
    lastname: string;
    email: string;
    username: string;
    password: string;
    isAdmin: any;
    referrer: string;
    channel: string;
  };
}

export type {
  IValue,
  IPaginationOptions,
  IUserIdWithPublic,
  IByUserEmail,
  IUpdateUser,
};
