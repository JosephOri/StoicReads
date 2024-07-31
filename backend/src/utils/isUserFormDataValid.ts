import User from '@interfaces/User';
import isEmailValidCheck from './isEmailValidCheck';
import { errorMessages } from './constants';

const isPostFormDataValid = (data: User): boolean => {

    const { userName, email, password, profileImage } = data;

    const isUsernameValid = !userName.includes(" ") && userName.length > 3;
    const isEmailValid = isEmailValidCheck(email);  
    const isPasswordValid = password.length > 5;  
    const isProfileImageValid = profileImage !== "";

    if (!isUsernameValid) {
        console.log("Username must be at least 4 characters long and cannot contain spaces");
        return false;
    }

    if (!isEmailValid) {
        console.log("Please enter a valid email address");
        return false;
    }

    if (!isPasswordValid) {
        console.log("Password must be at least 6 characters long");
        return false;
    }

    if (!isProfileImageValid) {
        console.log("Please upload a profile image");
        return false;
    }

    return true;

};

export default isPostFormDataValid;