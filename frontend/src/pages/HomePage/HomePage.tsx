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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { ExpandMore, ExpandLess, FilterAlt } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { blue, purple, red } from "@mui/material/colors";
import useSWR, { mutate } from "swr";
import axios from "axios";
import { POSTS_URL, BACKEND_URL } from "../../utils/constants";
import useCurrentUser from "../../hooks/useCurrentUser";
import { useNavigate } from "react-router-dom";
import { Post } from "../../interfaces/Post";
import { toast, ToastContainer } from "react-toastify";

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
    if(!showMyPosts){
      const found = posts.find((post: Post) => post.userName === user?.userName);
      if (!found) {
        toast.error("You haven't posted anything yet!");
        return;
      }
    }
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
    const newCommentObj = {
      userName: user?.userName,
      content: newComment,
    };
    const response = await axios.patch(`${POSTS_URL}/${selectedPost?._id}`, newCommentObj);
    console.log(response.data);
    const updatedPost = response.data
    setSelectedPost(updatedPost as Post);
    setNewComment("");
  };

  const handleDeleteComment = async (index: number) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );
    if (!isConfirmed) return;
    const updatedPost = {
      ...selectedPost,
      comments: selectedPost?.comments.filter(
        (comment: any, i: number) => i !== index
      ),
    };
    await axios.put(`${POSTS_URL}/${selectedPost?._id}`, updatedPost);
    setSelectedPost(updatedPost as Post);
  };

  const handleDeletePost = async (id: unknown) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!isConfirmed) return;
    await axios.delete(`${POSTS_URL}/${id}`);
    handleClose();
    mutate(showMyPosts ? `${POSTS_URL}/user/${user?.userName}` : POSTS_URL);
  };

  const getAuthorLink = (authorName: string) => {
    const formattedName = authorName.replace(/ /g, "_");
    const wikiUrl = `https://en.wikipedia.org/wiki/${formattedName}`;

    return (
      <DialogContentText fontSize="1.25rem" mb={2} color={blue[500]}>
        <a
          href={wikiUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: blue[500], textDecoration: "underline" }}
        >
          {authorName}
        </a>
      </DialogContentText>
    );
  };

  if (error) return <div>Failed to load posts</div>;
  if (!posts) return <div>Loading ......</div>;

  return (
    <>
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
        <Accordion sx={{ width: "300px", margin: "0 auto" }}>
          <AccordionSummary
            expandIcon={<FilterAlt />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h6">Filter Items</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Button onClick={togglePosts} variant="contained" color="primary">
                {showMyPosts ? "Show All Posts" : "Show My Posts"}
              </Button>
            </Grid>
          </AccordionDetails>
        </Accordion>
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
        {posts.length === 0 ? (
          <Typography variant="h6">No posts available</Typography>
        ) : (
          posts.map((post: Post, index: number) => {
            const imageUrl = post?.image ? `${BACKEND_URL}${post.image}` : post?.book.image;
            return (
              <Grid item xs={12} sm={6} md={6} lg={4} key={index}>
                <Card
                  onClick={() => handleClickOpen(post)}
                  style={{ width: "75%", height: "75%", position: "relative" }}
                >
                  <CardMedia
                    component="img"
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
          })
        )}
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
              <strong>{selectedPost?.book.title}</strong> by{" "}
              {selectedPost?.book.authors}
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
                    src={
                      selectedPost?.image
                        ? `${BACKEND_URL}${selectedPost.image}`
                        : selectedPost?.book.image
                    }
                    alt={selectedPost?.book.title}
                    style={{
                      maxWidth: "200px",
                      marginRight: "20px",
                      borderRadius: "8px",
                    }}
                  />
                </Box>
                <Box flexGrow={1} ml={2}>
                  <Typography variant="h6" gutterBottom>
                    Posted by
                  </Typography>
                  <DialogContentText
                    fontSize="1.25rem"
                    mb={2}
                    color={blue[900]}
                  >
                    {selectedPost?.userName}
                  </DialogContentText>
                  <Typography variant="h6" gutterBottom>
                    Authors
                  </Typography>
                  <DialogContentText
                    fontSize="1.25rem"
                    mb={2}
                    color={blue[500]}
                  >
                    {selectedPost &&
                      selectedPost.book &&
                      selectedPost.book.authors &&
                      getAuthorLink(selectedPost.book.authors)}
                  </DialogContentText>
                  <Typography variant="h6" gutterBottom>
                    Review
                  </Typography>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Rating value={Number(selectedPost?.review.rating)} readOnly />
                    <DialogContentText fontSize="1.25rem" ml={1}>
                      {selectedPost?.review.rating}
                    </DialogContentText>
                  </Box>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box mb={2}>
                <DialogContentText
                  color="black"
                  fontSize="1.25rem"
                  sx={{ ml: 2 }}
                >
                  {selectedPost?.review.description}
                </DialogContentText>
                <Divider sx={{ my: 2 }} />
              </Box>
              <Typography variant="h5">Comments:</Typography>
              <Divider sx={{ my: 2 }} />
              {selectedPost?.comments.map((comment: any, index: number) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 1,
                  }}
                >
                  <DialogContentText>
                    <strong>{comment?.userName}:</strong> {comment?.content}
                  </DialogContentText>
                  {comment?.userName === user?.userName && (
                    <Button
                      onClick={() => handleDeleteComment(index)}
                      sx={{ marginLeft: 1 }}
                    >
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
      <ToastContainer />
    </>
  );
};

export default HomePage;
