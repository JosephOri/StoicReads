import isEmailValidCheck from "./isEmailValidCheck";
import ProfileFormData from "../interfaces/ProfileFormData";
import SignupFormData from "../interfaces/SignupFormData";
import { toast } from "react-toastify";

const isFormDataValidCheck = (data: ProfileFormData | SignupFormData): boolean => {

    const userName = data.userName;
    const email = data.email;
    const password = data.password;
    const confirmPassword = data.confirmPassword;
    const profileImage = data.profileImage;

    const isUsernameValid = !userName.includes(" ") && userName.length > 3;
    const isEmailValid = isEmailValidCheck(email);
    const isProfileImageValid = profileImage !== "";

    if (!isUsernameValid) {
        toast.error("Username must be at least 4 characters long and cannot contain spaces");
        return false;
    }
    if (!isEmailValid) {
        toast.error("Please enter a valid email address");
        return false;
    }
    if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return false;
    }
    if (password.length < 6) {
        toast.error("Password must be at least 6 characters long");
        return false;
    }
    if (!isProfileImageValid) {
        toast.error("Please upload a profile image");
        return false;
    }

    return true;
};

export default isFormDataValidCheck;