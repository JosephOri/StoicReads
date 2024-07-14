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
import { useGlobal } from "../../hooks/useGlobal";
import { text } from "stream/consumers";
import { POSTS_URL } from "../../utils/constants";
type Post = Record<string, any>;

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const HomePage = () => {
  const { data: posts, error } = useSWR(POSTS_URL, fetcher);
  const [open, setOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState("");
  const { user } = useGlobal();

  const handleClickOpen = (post: Post) => {
    setSelectedPost(post);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPost(null);
    setNewComment("");
  };

  const handleAddComment = () => {
    if (newComment.trim() === "") return;
    const updatedPost = {
      ...selectedPost,
      comments: [
        ...selectedPost?.comments,
        { username:user?.userName , content: newComment },
      ],
    };
    axios.put(`${POSTS_URL}/${selectedPost?._id}`, updatedPost);
    
    setSelectedPost(updatedPost);
    setNewComment("");
  };

  const handleDeleteComment = (index:number) => {
    const updatedPost = {
      ...selectedPost,
      comments: selectedPost?.comments.filter((comment:any,i:number)=>i!==index),
    };
    axios.put(`${POSTS_URL}/${selectedPost?._id}`, updatedPost);
    setSelectedPost(updatedPost);
  }

  if (error) return <div>Failed to load posts</div>;
  if (!posts) return <CircularProgress />;

  return (
    <>
<h1 style={{ textAlign: "center" }}>{`Welcome Back ${user?.userName}`}</h1>
<Grid
        container
        spacing={4}
        direction="row"
        alignItems="center"
        justifyContent="center"
        style={{ marginTop: 20 }}
      >
        
        {posts.map((post: Post, index: number) => (
          <Grid item xs={12} sm={6} md={6} lg={4} key={index}>
            <Card
              onClick={() => handleClickOpen(post)}
              style={{ width: "100%", height: "100%" }}
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
                  Posted by {post?.username}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {post?.content}
                </Typography>
                <Rating value={post?.review.rating} readOnly />
              </CardContent>
            </Card>
          </Grid>
        ))}
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
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Box display="flex" flexDirection="row" mb={2}>
                <Box>
                  <img
                    src={selectedPost?.book.image}
                    alt={selectedPost?.book.title}
                    style={{ maxWidth: "200px", marginRight: "20px" }}
                  />
                </Box>
                <Box flexGrow={1}>
                  <Typography variant="h6">Posted by</Typography>
                  <DialogContentText>
                    {selectedPost?.username}
                  </DialogContentText>
                  <Typography variant="h6">Authors</Typography>
                  <DialogContentText>
                    {selectedPost?.book.authors}
                  </DialogContentText>
                  <Typography variant="h6">Review</Typography>
                  <DialogContentText>
                    <Rating value={selectedPost?.review.rating} readOnly />
                  </DialogContentText>
                  <DialogContentText>
                    {selectedPost?.review.description}
                  </DialogContentText>
                </Box>
              </Box>
              <Typography variant="h6">Comments</Typography>
              {selectedPost?.comments.map((comment: any, index: number) => (
                <DialogContentText key={index} sx={{ marginBottom: 1 }}>
                  <strong>{comment?.username}:</strong> {comment?.content}
                  {comment?.username===user?.userName && <button onClick={()=>handleDeleteComment(index)}>delete</button>}
                  
                </DialogContentText>
              ))}
              <Box mt={2}>
                <TextField
                  label="Add a comment"
                  variant="outlined"
                  fullWidth
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddComment}
                  sx={{ marginTop: 1 }}
                >
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
