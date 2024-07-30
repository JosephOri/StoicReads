import { useEffect, useState } from "react";
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
import { blue, purple, red } from "@mui/material/colors";
import useSWR from "swr";
import axios from "axios";
import { POSTS_URL, BACKEND_URL } from "../../utils/constants";
import useCurrentUser from "../../hooks/useCurrentUser";
import { useNavigate } from "react-router-dom";
import { Post } from "../../interfaces/Post";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const HomePage = () => {
  const { user } = useCurrentUser();
  const [showMyPosts, setShowMyPosts] = useState(false);
  const { data: posts, error } = useSWR(
    showMyPosts ? `${POSTS_URL}/user/${user?.userName}` : POSTS_URL, 
    fetcher
  );

  const [open, setOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();

  const togglePosts = () => {
    setShowMyPosts(!showMyPosts);
  };

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
        ...(selectedPost?.comments || []),
        { username: user?.userName, content: newComment },
      ],
    };
    console.log("Updated Post:", updatedPost);
    await axios.put(`${POSTS_URL}/${selectedPost?._id}`, updatedPost);
    setSelectedPost(updatedPost as Post);
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
    setSelectedPost(updatedPost as Post);
  };

  const handleDeletePost = async (id: unknown) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this post?");
    if (!isConfirmed) return;
    await axios.delete(`${POSTS_URL}/${id}`);
    handleClose();
  };

  const getAuthorLink = (authorName: string) => {
    const formattedName = authorName.replace(/ /g, '_');
    const wikiUrl = `https://en.wikipedia.org/wiki/${formattedName}`;

    return (
      <DialogContentText fontSize="1.25rem" mb={2} color={blue[500]}>
        <a href={wikiUrl} target="_blank" rel="noopener noreferrer" style={{ color: blue[500], textDecoration: 'underline' }}>
          {authorName}
        </a>
      </DialogContentText>
    );
  }

  if (error) return <div>Failed to load posts</div>;
  if (!posts) return <div>Loading ......</div>;

  return (
    <>
      <h1 style={{ textAlign: "center" }}>{`Welcome Back ${user?.userName}`}</h1>

      <Grid item xs={12} sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          mt: 2, 
          mb: 2 
        }}>
        <Button onClick={togglePosts} variant="contained" color="primary">
          {showMyPosts ? "Show All Posts" : "Show My Posts"}
        </Button>
      </Grid>

      {(!Array.isArray(posts) || posts.length === 0) ? (
        <Typography variant="h4" align="center" color="textSecondary" style={{ textAlign: "center" }}>
          You haven't posted anything yet!
        </Typography>
      ) : (
        <Grid 
        container 
        spacing={4} 
        direction="row" 
        alignItems="center" 
        justifyContent="center" 
        style={{ marginTop: 20 }}>
        {posts.map((post: Post, index: number) => {
          const imageUrl = post?.image ? `${BACKEND_URL}${post.image}` : post?.book.image;

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
                    Posted by <strong>{post?.userName}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {post?.comments?.length} Comments
                  </Typography>
                  <Rating value={Number(post?.review.rating)} readOnly />
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      )}
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
            <DialogTitle color={purple[500]}>
              <strong>
                {selectedPost?.book.title}  
              </strong> by  {selectedPost?.book.authors}
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
                    style={{ maxWidth: "200px", marginRight: "20px", borderRadius: "8px" }}
                  />
                </Box>
                <Box flexGrow={1} ml={2}>
                  <Typography variant="h6" gutterBottom>
                    Posted by
                  </Typography>
                  <DialogContentText fontSize="1.25rem" mb={2} color={blue[900]}>
                      {selectedPost?.userName}
                  </DialogContentText>
                  <Typography variant="h6" gutterBottom>
                    Authors
                  </Typography>
                  <DialogContentText fontSize="1.25rem" mb={2} color={blue[500]}>
                      {
                        selectedPost && 
                        selectedPost.book && 
                        selectedPost.book.authors && 
                        getAuthorLink(selectedPost.book.authors)
                      }
                  </DialogContentText>
                  <Typography variant="h6" gutterBottom>
                    Review
                  </Typography>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Rating value={selectedPost?.review.rating} readOnly />
                    <DialogContentText fontSize="1.25rem" ml={1}>
                      {selectedPost?.review.rating}
                    </DialogContentText>
                  </Box>
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
