export interface IUser {
  name: string;
  email: string;
  id: string;
}

export interface GenericResponse {
  status: string;
  message: string;
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface IUserResponse {
  status: string;
  data: {
    user: IUser;
  };
}
