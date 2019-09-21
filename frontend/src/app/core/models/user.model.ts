export interface User {
  id: string;
  username: string;
  profileImageSrcUrl: string;
  email?: string;
  emailVerified?: boolean;
}
