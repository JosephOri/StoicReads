import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios, { AxiosError, HttpStatusCode } from "axios";
import { ToastContainer, toast } from "react-toastify";

import {TextField, Grid, Typography, Box, Button }  from "@mui/material";
import useCurrentUser from "../../hooks/useCurrentUser";
import EditProfileFormData from "../../interfaces/EditProfileFormData";
import isFormDataValidCheck from "../../utils/isFormDataValidCheck";
import { UPDATE_URL } from "../../utils/constants";
import { User } from "../../interfaces/User";


const EditProfilePage = () => {
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [localFile, setLocalFile] = useState('');
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user, setUser } = useCurrentUser();

  const [editProfileFormData, setEditProfileFormData] = useState<EditProfileFormData>({
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      profileImage: "",
      profileImageFile: null,
  });

  useEffect(() => {
    if (user) {
      setEditProfileFormData({
        userName: user?.userName || "",
        email: user?.email || "",
        password: "",
        confirmPassword: "",
        profileImage: user?.profileImage || "",
        profileImageFile: null,
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
      const formData = new FormData();
      formData.append("userName", editProfileFormData.userName);
      formData.append("email", editProfileFormData.email);
      formData.append("password", editProfileFormData.password);
      formData.append("confirmPassword", editProfileFormData.confirmPassword);
      formData.append("profileImage", editProfileFormData.profileImage);
      if (editProfileFormData.profileImageFile) {
        formData.append("profileImage", editProfileFormData.profileImageFile);
      }
      console.log("formData JSON", JSON.stringify(formData));
      console.log("formData", formData);
      const updatedUser: User = await axios.put(`${UPDATE_URL}/${userId}`, formData);
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
    if (e.target.files && e.target.files[0]) {
      setEditProfileFormData({ ...editProfileFormData, profileImageFile: e.target.files[0] });
      setLocalFile(URL.createObjectURL(e.target.files[0]));
    }
  };


  return (
    <>
      <ToastContainer />
      <Typography variant="h3">Edit Profile</Typography> 
      <Grid item xs={12} sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          mt: 2, 
          mb: 2 
        }}>

        <Button component="label" variant="contained" color="success">
          Upload Image
          <input 
            type="file" 
            accept="image/*" 
            hidden 
            onChange={handleImageUpload} />
        </Button>
          {localFile && (
              <img src={`${localFile}`} 
                alt="Profile Preview" 
                style={{ maxHeight: '200px', maxWidth: '200px', marginTop: '10px' }}
              />
          )}
      </Grid>

      <Box
        component="form"
        noValidate onSubmit={handleSubmit} sx={{ mt: 3 }} >
        
        <Grid container spacing={2}>
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