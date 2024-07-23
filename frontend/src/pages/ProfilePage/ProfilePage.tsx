import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import ProfileFormData from "../../interfaces/ProfileFormData";
import { useCurrentUser } from "../../hooks/useCurrentUser";

import {Card, CardContent, CardMedia, Grid, Typography, Box, Button }  from "@mui/material";
import { BACKEND_URL, DEFAULT_IMAGE } from "../../utils/constants";

const ProfilePage = () => {
    const [profileData, setProfileData] = useState<ProfileFormData>({
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
        profileImage: DEFAULT_IMAGE,
        createdAt: ""
    });
    const navigate = useNavigate();
    const { user } = useCurrentUser();

    useEffect (() => {
        if (user) {
            const formattedDate = user.createdAt
            ? new Date(user.createdAt).toLocaleDateString('en-GB')
            : new Date().toLocaleDateString('en-GB');

            setProfileData({
                userName: user.userName || "",
                email: user.email || "",
                password: user.password || "",
                confirmPassword: user.password || "",
                profileImage: user.profileImage || DEFAULT_IMAGE,
                createdAt: formattedDate,
            });
        }
    }, [user]);

    useEffect(() => {}, [profileData]);


    const renderUserDetails = () => {
        return (
            <>
                <Typography variant="h5">Username: {profileData.userName}</Typography>
                <Typography variant="h6">Email: {profileData.email}</Typography>
                <Typography variant="h6">Created At: {profileData.createdAt}</Typography>
            </>
        );
    };


    const editProfile = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Edit Profile of User: " + user?._id);
        navigate(`/edit-profile/${user?._id}`);
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
                            height="300"
                            width="300"
                            image= {profileData.profileImage.includes("googleusercontent")? profileData.profileImage: `${BACKEND_URL}${profileData.profileImage}`}
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
                    onSubmit={editProfile}
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