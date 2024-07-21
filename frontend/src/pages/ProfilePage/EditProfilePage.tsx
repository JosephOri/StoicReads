import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios, { AxiosError, HttpStatusCode } from "axios";
import { ToastContainer, toast } from "react-toastify";

import {Card, CardContent, CardMedia,TextField, Grid, 
  Typography, Box, Button }  from "@mui/material";
import useCurrentUser from "../../hooks/useCurrentUser";
import EditProfileFormData from "../../interfaces/EditProfileFormData";
import isFormDataValidCheck from "../../utils/isFormDataValidCheck";
import { UPDATE_URL } from "../../utils/constants";
import { User } from "../../interfaces/User";


const EditProfilePage = () => {
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(true)
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user, setUser } = useCurrentUser();

  const [editProfileFormData, setEditProfileFormData] = useState<EditProfileFormData>({
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      profileImage: "",
  });

  useEffect(() => {
    if (user) {
      setEditProfileFormData({
        userName: user?.userName || "",
        email: user?.email || "",
        password: "",
        confirmPassword: "",
        profileImage: user?.profileImage || "",
      });
      setUserLoading(false); 
    }
  }, [user]);

  const handleInputChange = (fieldName: string, value: string) => {
    setEditProfileFormData({ ...editProfileFormData, [fieldName]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isFormDataValid = isFormDataValidCheck(editProfileFormData);
    if (!isFormDataValid) return;
    setLoading(true);

    try{      
      const updatedUser: User = await axios.put(`${UPDATE_URL}/${userId}`, editProfileFormData);
      setUser(updatedUser);
      setLoading(false);
      toast.success("User updated successfully");
      navigate("/profile");
      window.location.reload();
    } catch (err: unknown) {
      const error = err as AxiosError;
      setLoading(false);
      if (error.response?.status === HttpStatusCode.BadRequest) {
        toast.error("Please provide all required fields");
      } else if (error.response?.status === HttpStatusCode.Conflict) {
        toast.error("User cannot be updated");
      } else {
        toast.error("Something went wrong. Please try again later");
      }
    };
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditProfileFormData({ ...editProfileFormData, profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
    toast.success("Image uploaded successfully");
  };


  return (
    <>
      <ToastContainer />
      <Button component="label" variant="contained" color="success" sx={{ mt: 2, mb: 2 }}>
        Upload Image
        <input 
        type="file" 
        accept="image/*" 
        hidden 
        onChange={handleImageUpload} />
      </Button>
      {editProfileFormData.profileImage && (
            <img src={editProfileFormData.profileImage} 
            alt="Profile Preview" 
            style={{ maxHeight: '150px', maxWidth: '150px' }}
             />
          )}

      <Grid item xs={12}>
              <Typography variant="h4">Edit Profile</Typography>
      </Grid>

      <Box
        component="form"
        noValidate onSubmit={handleSubmit} sx={{ mt: 3 }} >
        
        <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="userName"
            label="Username"
            name="userName"
            value={editProfileFormData.userName}
            onChange={(e) =>handleInputChange("userName", e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            value={editProfileFormData.email} 
            onChange={(e) => handleInputChange("email", e.target.value)}/>
        </Grid>

        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={editProfileFormData.password} 
            onChange={(e) => handleInputChange("password", e.target.value) }
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="password"
            label="confirm password"
            type="password"
            id="confirmPassword"
            value={editProfileFormData.confirmPassword}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value) }
          />
        </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }} >
          Save
        </Button>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }} >
          Cancel
        </Button>
      
      </Box>
    </>
  );
};

export default EditProfilePage;