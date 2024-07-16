import { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Container,
  CircularProgress,
  FormControl,
  FormLabel,
  Rating,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCreatePost } from "../../hooks/useCreatePost";
import { POSTS_URL } from "../../utils/constants";
import useCurrentUser from "../../hooks/useCurrentUser";

const SubmitPost = () => {
  const navigate = useNavigate();
  const [review, setReview] = useState("");
  const [rating, setRating] = useState<number | null>(3);
  const [submitting, setSubmitting] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const { selectedBook } = useCreatePost();
  const { user } =useCurrentUser();

  const handleCreatePost = async () => {
    setSubmitting(true);

    const postData  = {
      userName: user?.userName,
      book: {
        title: selectedBook?.volumeInfo.title || "Sample Book Title",
        authors:
          selectedBook?.volumeInfo.authors?.join(", ") || "Sample Author",
        image:
          selectedBook?.volumeInfo.imageLinks.thumbnail ||
          "https://example.com/sample-image.jpg",
      },
      title: postTitle || "Sample Post Title",
      content: "This is a sample post content.",
      comments: [],
      review: {
        rating: rating || 3,
        description: review || "This is a sample review.",
      },
    };

    try {
      const response = await fetch(POSTS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        console.log("Post created successfully!");
        navigate("/");
      } else {
        console.error("Failed to create post:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setTimeout(() => {
        setSubmitting(false);
        navigate("/");
      }, 1500);
    }
  };

  useEffect(() => {
    if (!selectedBook && !submitting) {
      console.log("No book selected");

      navigate("/");
    }
  }, [selectedBook]);

  return (
    <Container>
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
        marginTop="10px"
        marginBottom="10px"
      >
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Submit a Post
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6">
                    {selectedBook?.volumeInfo.title}
                  </Typography>
                </Grid>
                <Grid item xs={12} style={{ textAlign: "center" }}>
                  <img
                    src={selectedBook?.volumeInfo.imageLinks.thumbnail}
                    alt={selectedBook?.volumeInfo.title}
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Post Title"
                    variant="outlined"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Rating</FormLabel>
                    <Rating
                      name="rating"
                      value={rating}
                      onChange={(event, newValue) => {
                        setRating(newValue);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    multiline
                    rows={4}
                    label="Write your review"
                    variant="outlined"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    onClick={handleCreatePost}
                    variant="contained"
                    color="primary"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <CircularProgress size={24} />
                    ) : (
                      "Create Post"
                    )}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SubmitPost;
