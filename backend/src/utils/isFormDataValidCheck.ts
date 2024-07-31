import Post from '@interfaces/Post';
import { CreatePostParams } from '@services/post.service';

const isFormDataValidCheck = (data: CreatePostParams): boolean => {

    const { userName, book, title, rating, description, image: profileImage } = data;


    const isUsernameValid = !userName.includes(" ") && userName.length > 3;
    const isBookValid = book.title !== "" && book.authors !== "" && book.image !== "";
    const isTitleValid = title !== "";
    const isRatingValid = rating > 0;
    const isDescriptionValid = description !== "";
    const isProfileImageValid = profileImage !== undefined;

    if (!isUsernameValid) {
        console.log("Username must be at least 4 characters long and cannot contain spaces");
        return false;
    }

    if (!isProfileImageValid) {
        console.log("Profile image must not be empty");
        return false;
    }

    if (!isBookValid) {
        console.log("Book title, authors, and image must not be empty");
        return false;
    }

    if (!isTitleValid) {
        console.log("Title must not be empty");
        return false;
    }

    if (!isRatingValid) {
        console.log("Rating must be greater than 0");
        return false;
    }

    if (!isDescriptionValid) {
        console.log("Description must not be empty");
        return false;
    }
   
    return true;
};

export default isFormDataValidCheck;