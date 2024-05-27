export interface User {
    email: string;
    password: string;
    imgUrl?: string;
    _id?: string;
    accessToken?: string;
    refreshToken?: string;
}