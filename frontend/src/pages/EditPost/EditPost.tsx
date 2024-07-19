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
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { POSTS_URL } from "../../utils/constants";

const EditPost = () => {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { postId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        console.log("postId "+ postId);
        const response = await axios.get(`${POSTS_URL}/${postId}`);
        setPost(response.data);
      } catch (error) {
        console.error("Failed to fetch post", error);
      }
    };

    fetchPost();
  }, [postId]);

  const handleUpdatePost = async () => {
    if (!post) return;
    setLoading(true);

    try {
      await axios.put(`${POSTS_URL}/${postId}`, post);
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
                  onChange={(e, newValue) => setPost({ ...post, review: { ...post.review, rating: newValue } })}
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
                  onChange={(e) => setPost({ ...post, review: { ...post.review, description: e.target.value } })}
                />
              </Box>
              <Box mt={2}>
                <LoadingButton
                  loading={loading}
                  color="primary"
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
