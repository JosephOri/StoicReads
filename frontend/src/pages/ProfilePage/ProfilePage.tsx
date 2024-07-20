import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError, HttpStatusCode } from "axios";
import { ToastContainer, toast } from "react-toastify";
import ProfileFormData from "../../interfaces/ProfileFormData";
import isFormDataValidCheck from "../../utils/isFormDataValidCheck";
import { applicationRoutes } from "../../utils/constants"
import { useGlobal } from "../../hooks/useGlobal";
import { useCurrentUser } from "../../hooks/useCurrentUser";

import {Card, CardContent, CardMedia, Grid, Typography, Box, Button }  from "@mui/material";
import defaultImage from '../../assets/image.jpg';


const ProfilePage = () => {
    const [profileData, setProfileData] = useState<ProfileFormData>({
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
        profileImage: defaultImage,
        createdAt: ""
    });
    const navigate = useNavigate();
    const { user } = useCurrentUser();

    const handleInputChange = (fieldName: string, value: string) => {
        setProfileData({ ...profileData, [fieldName]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (user) {
            const formattedDate = user.createdAt
            ? new Date(user.createdAt).toLocaleDateString('en-GB')
            : new Date().toLocaleDateString('en-GB');

            setProfileData({
                userName: user.userName || "",
                email: user.email || "",
                password: user.password || "",
                confirmPassword: user.password || "",
                profileImage: user.profileImage || defaultImage,
                createdAt: formattedDate,
            });
        }
    };
    useEffect(() => {
        console.log("Profile Data after update: ", profileData);
    }, [profileData]);


    const renderUserDetails = () => {
        return (
            <>
                <Typography variant="h5">Username: {profileData.userName}</Typography>
                <Typography variant="h6">Email: {profileData.email}</Typography>
                <Typography variant="h6">Created At: {profileData.createdAt}</Typography>
            </>
        );
    };
    
    
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
                            {renderUserDetails()}
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