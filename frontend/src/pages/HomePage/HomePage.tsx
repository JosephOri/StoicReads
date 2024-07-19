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
  Box,
  CircularProgress,
  TextField,
  Button,
  Rating,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useSWR from "swr";
import axios from "axios";
import { POSTS_URL, BACKEND_URL } from "../../utils/constants";
import useCurrentUser from "../../hooks/useCurrentUser";
import { useNavigate } from "react-router-dom";

type Post = Record<string, unknown>;

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const HomePage = () => {
  const { data: posts, error } = useSWR(POSTS_URL, fetcher);
  const [open, setOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState("");
  const { user } = useCurrentUser();
  const navigate = useNavigate();

  const handleClickOpen = (post: Post) => {
    setSelectedPost(post);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPost(null);
    setNewComment("");
  };

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;
    const updatedPost = {
      ...selectedPost,
      comments: [
        ...selectedPost?.comments,
        { username: user?.userName, content: newComment },
      ],
    };
    await axios.put(`${POSTS_URL}/${selectedPost?._id}`, updatedPost);
    setSelectedPost(updatedPost);
    setNewComment("");
  };

  const handleDeleteComment = async (index: number) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this comment?");
    if (!isConfirmed) return;
    const updatedPost = {
      ...selectedPost,
      comments: selectedPost?.comments.filter((comment: any, i: number) => i !== index),
    };
    await axios.put(`${POSTS_URL}/${selectedPost?._id}`, updatedPost);
    setSelectedPost(updatedPost);
  };

  const handleDeletePost = async (id: unknown) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this post?");
    if (!isConfirmed) return;
    await axios.delete(`${POSTS_URL}/${id}`);
    handleClose();
  };

  if (error) return <div>Failed to load posts</div>;
  if (!posts) return <CircularProgress />;

  return (
    <>
      <h1 style={{ textAlign: "center" }}>{`Welcome Back ${user?.userName}`}</h1>
      <Grid container spacing={4} direction="row" alignItems="center" justifyContent="center" style={{ marginTop: 20 }}>
        {posts.map((post: Post, index: number) => {
          const imageUrl = post?.image ? `${BACKEND_URL}${post.image}` : post?.book.image;
          console.log('Image URL:', imageUrl);

          return (
            <Grid item xs={12} sm={6} md={6} lg={4} key={index}>
              <Card
                onClick={() => handleClickOpen(post)}
                style={{ width: "100%", height: "100%", position: "relative" }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={post?.book.image}
                  alt={post?.book.title}
                />
                <CardContent>
                  <Typography variant="h5" component="div">
                    {post?.title}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Posted by {post?.userName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {post?.comments?.length} Comments
                  </Typography>
                  <Rating value={post?.review.rating} readOnly />
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        {open && selectedPost && (
          <>
            <DialogTitle>
              {selectedPost?.book.title}
              {user?.userName === selectedPost?.userName && (
                <Box
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    display: "flex",
                    gap: 1,
                  }}
                >
                  <Button
                    onClick={() => navigate(`/edit-post/${selectedPost._id}`)}
                    sx={{
                      color: (theme) => theme.palette.grey[500],
                    }}
                    variant="outlined"
                    color="primary"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePost(selectedPost?._id);
                    }}
                    sx={{
                      color: (theme) => theme.palette.grey[500],
                    }}
                    variant="outlined"
                    color="error"
                  >
                    Delete
                  </Button>
                </Box>
              )}
            </DialogTitle>
            <DialogContent dividers>
              <Box display="flex" flexDirection="row" mb={2}>
                <Box>
                  <img
                    src={selectedPost?.image ? `${BACKEND_URL}${selectedPost.image}` : selectedPost?.book.image}
                    alt={selectedPost?.book.title}
                    style={{ maxWidth: "200px", marginRight: "20px" }}
                  />
                </Box>
                <Box flexGrow={1}>
                  <Typography variant="h6">Posted by</Typography>
                  <DialogContentText>{selectedPost?.username}</DialogContentText>
                  <Typography variant="h6">Authors</Typography>
                  <DialogContentText>{selectedPost?.book.authors}</DialogContentText>
                  <Typography variant="h6">Review</Typography>
                  <DialogContentText>
                    <Rating value={selectedPost?.review.rating} readOnly />
                  </DialogContentText>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box mb={2}>
                <DialogContentText color="black" fontSize="1.25rem" sx={{ ml: 2 }}>
                  {selectedPost?.review.description}
                </DialogContentText>
                <Divider sx={{ my: 2 }} />
              </Box>
              <Typography variant="h5">Comments:</Typography>
              <Divider sx={{ my: 2 }} />
              {selectedPost?.comments.map((comment: any, index: number) => (
                <Box key={index} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 1 }}>
                  <DialogContentText>
                    <strong>{comment?.username}:</strong> {comment?.content}
                  </DialogContentText>
                  {comment?.username === user?.userName && (
                    <Button onClick={() => handleDeleteComment(index)} sx={{ marginLeft: 1 }}>
                      <CloseIcon style={{ color: "red", fontSize: 24 }} />
                    </Button>
                  )}
                </Box>
              ))}
              <Box mt={2}>
                <TextField
                  label="Add a comment"
                  variant="outlined"
                  fullWidth
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleAddComment} sx={{ marginTop: 1 }}>
                  Submit
                </Button>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
};

export default HomePage;
