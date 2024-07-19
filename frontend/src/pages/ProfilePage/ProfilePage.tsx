import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError, HttpStatusCode } from "axios";
import { ToastContainer, toast } from "react-toastify";
import SignupFormData from "../../interfaces/SignupFormData";
import isFormDataValidCheck from "../../utils/isFormDataValidCheck";
import { applicationRoutes } from "../../utils/constants"
import { useGlobal } from "../../hooks/useGlobal";

import {Card, CardContent, CardMedia, Grid, Typography, Box, Button }  from "@mui/material";
  import defaultImage from '../../assets/image.jpg';


const ProfilePage = () => {
    const [profileData, setProfileData] = useState<SignupFormData>({
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
        profileImage: defaultImage,
    });
    const navigate = useNavigate();

    const handleInputChange = (fieldName: string, value: string) => {
        setProfileData({ ...profileData, [fieldName]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // const isFormDataValid = isFormDataValidCheck(profileData);
        // if (isFormDataValid){
        //     toast.success("Form data is valid " + isFormDataValid);
        // } else {
        //     toast.error("Form data is invalid " + isFormDataValid);
        //     return;
        // }

        // const {userName, email, password, profileImage} = profileData;
        try{
            // const response = await axios.post(applicationRoutes.USER, {
            //     userName,
            //     email,
            //     password,
            //     profileImage,
            // });
            // console.log(response);
            const {user} = useGlobal();
            console.log(user);
            toast.success("User fetched successfully");

        } catch (err: unknown) {
            const error = err as AxiosError;
            if (error.response?.status === HttpStatusCode.BadRequest) {
                toast.error("Please fill in all fields");
            } else if (error.response?.status === HttpStatusCode.Conflict) {
                toast.error("User already exists");
            } else {
                toast.error("An error occurred. Please try again later");
            }
        }

    };

    const fetchUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.get(applicationRoutes.USER);
            console.log(response);
        } catch (err: unknown) {
            const error = err as AxiosError;
            if (error.response?.status === HttpStatusCode.BadRequest) {
                toast.error("Please fill in all fields");
            } else if (error.response?.status === HttpStatusCode.Conflict) {
                toast.error("User already exists");
            } else {
                toast.error("An error occurred. Please try again later");
            }
        }
    }



    return (
        <>
            <Grid
                container
                spacing={4}
                direction={"column"}
                alignItems={"center"}
                justifyContent={"center"}
                style={{ marginTop: "20px" }}
            >

                <Grid item xs={12}>
                    <Typography variant="h4">Profile</Typography>
                </Grid>

                <Grid item xs={12}>
                    <Card>
                        <CardMedia
                            component="img"
                            height="140"
                            image= {profileData.profileImage}
                            alt="green iguana"
                        />
                        <CardContent>
                            <Typography variant="h5">Username: </Typography>
                            <Typography variant="h6">Email: </Typography>
                            <Typography variant="h6">Created At: </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Box
                    component="form"
                    noValidate
                    onSubmit={fetchUser}
                    sx={{ mt: 3 }} 
                    >
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2 }} >
                                Edit Profile
                        </Button>
                </Box>
            </Grid>
            <ToastContainer />
        </>
    );
};

export default ProfilePage;