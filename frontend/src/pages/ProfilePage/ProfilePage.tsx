import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError, HttpStatusCode } from "axios";
import { ToastContainer, toast } from "react-toastify";
import SignupFormData from "../../interfaces/SignupFormData";
import isFormDataValidCheck from "../../utils/isFormDataValidCheck";
import { applicationRoutes } from "../../utils/constants"
import { useGlobal } from "../../hooks/useGlobal";
import { useCurrentUser } from "../../hooks/useCurrentUser";

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
    const { user } = useCurrentUser();

    const handleInputChange = (fieldName: string, value: string) => {
        setProfileData({ ...profileData, [fieldName]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Profile Data before update: ", profileData);
        if (user) {
            setProfileData({
                userName: user.userName || "",
                email: user.email || "",
                password: user.password || "",
                confirmPassword: user.password || "",
                profileImage: user.profileImage || defaultImage,
            });
        }
    };
    useEffect(() => {
        console.log("Profile Data after update: ", profileData);
    }, [profileData]);

    
    
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
                    onSubmit={handleSubmit}
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