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
            </Grid>
        </>
    );
};

export default ProfilePage;