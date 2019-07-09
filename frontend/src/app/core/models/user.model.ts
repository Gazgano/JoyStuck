export interface User {
  id: number;
  username: string;
  token: string;
  profileImageSrcUrl: string;
}

export interface Credentials {
  username: string;
  password: string;
}
