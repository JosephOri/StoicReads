import { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Box,
  CircularProgress,
  TextField,
  Button,
  Rating,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useSWR from "swr";
import axios from "axios";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const ProfilePage = () => {


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

                <Grid item>
                    <Typography variant="h4">Profile</Typography>
                </Grid>
                {/* items for displaying: username, email, profileImage and createdAt */}
                <Grid item>
                    <Card>
                        <CardMedia
                            component="img"
                            height="140"
                            image="https://www.w3schools.com/howto/img_avatar.png"
                            alt="green iguana"
                        />
                        <CardContent>
                            <Typography variant="h5">Username: </Typography>
                            <Typography variant="h6">Email: </Typography>
                            <Typography variant="h6">Created At: </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
};

export default ProfilePage;