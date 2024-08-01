import { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  TextField,
  Card,
  CardContent,
  Container,
  Box,
  CircularProgress,
  Rating,
  Button,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { POSTS_URL } from "../../utils/constants";

const EditPost = () => {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [localFile, setLocalFile] = useState<string | null>(null);
  const { postId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${POSTS_URL}/${postId}`);
        setPost(response.data);
        console.log("response.data "+ JSON.stringify(response.data));
      } catch (error) {
        console.error("Failed to fetch post", error);
      }
    };

    fetchPost();
  }, [postId]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setLocalFile(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleUpdatePost = async () => {
    if (!post) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", post.title);
      formData.append("rating", post.review.rating);
      formData.append("description", post.review.description);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      await axios.put(`${POSTS_URL}/${postId}`, formData);
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.error("Failed to update post", error);
      setLoading(false);
    }
  };

  if (!post) return <CircularProgress />;

  return (
    <Container>
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
        marginTop="10px"
      >
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Edit Post
              </Typography>
              <Box mt={2}>
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mt: 2,
                    mb: 2,
                  }}
                >
                  <Button component="label" variant="contained" color="success">
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleImageUpload}
                    />
                  </Button>
                  {localFile && (
                    <img
                      src={`${localFile}`}
                      alt="Profile Preview"
                      style={{
                        maxHeight: "200px",
                        maxWidth: "200px",
                        marginTop: "10px",
                      }}
                    />
                  )}
                </Grid>
              </Box>
              <TextField
                required
                fullWidth
                label="Post Title"
                variant="outlined"
                value={post.title}
                onChange={(e) => setPost({ ...post, title: e.target.value })}
                margin="normal"
              />
              <Box mt={2}>
                <Typography variant="h6">Review</Typography>
                <Rating
                  value={post.review.rating}
                  onChange={(e, newValue) =>
                    setPost({
                      ...post,
                      review: { ...post.review, rating: newValue },
                    })
                  }
                />
              </Box>
              <Box mt={2}>
                <TextField
                  label="Review Content"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  value={post.review.description}
                  onChange={(e) =>
                    setPost({
                      ...post,
                      review: { ...post.review, description: e.target.value },
                    })
                  }
                />
              </Box>
              <Box mt={2}>
                <LoadingButton
                  loading={loading}
                  color="success"
                  variant="contained"
                  onClick={handleUpdatePost}
                >
                  Update Post
                </LoadingButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EditPost;
