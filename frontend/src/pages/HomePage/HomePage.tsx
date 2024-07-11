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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useSWR from "swr";
import axios from "axios";

type Post = Record<string, any>;

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const HomePage = () => {
  const { data: posts, error } = useSWR("http://localhost:3000/post", fetcher);
  const [open, setOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const handleClickOpen = (post: Post) => {
    setSelectedPost(post);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPost(null);
  };

  if (error) return <div>Failed to load posts</div>;
  if (!posts) return <CircularProgress />;

  return (
    <>
      <Grid
        container
        spacing={4}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ marginTop: 20 }}
      >
        {posts.map((post: Post, index: number) => (
          <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
            <Card onClick={() => handleClickOpen(post)}>
              <CardMedia
                component="img"
                height="140"
                image={post?.book.image}
                alt={post?.book.title}
              />
              <CardContent>
                <Typography variant="h5" component="div">
                  {post?.title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {post?.book.authors}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {post?.content}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
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
              <Box display="flex" flexDirection="row">
                <Box>
                  <img
                    src={selectedPost?.book.image}
                    alt={selectedPost?.book.title}
                    style={{ maxWidth: "200px", marginRight: "20px" }}
                  />
                </Box>
                <Box flexGrow={1}>
                  <Typography variant="h6">Authors</Typography>
                  <DialogContentText>
                    {selectedPost?.book.authors}
                  </DialogContentText>
                  <Typography variant="h6">Review</Typography>
                  <DialogContentText>
                    Rating: {selectedPost?.review.rating}
                  </DialogContentText>
                  <DialogContentText>
                    {selectedPost?.review.description}
                  </DialogContentText>
                  <Typography variant="h6">Comments</Typography>
                  {selectedPost?.comments.map((comment: any, index: number) => (
                    <DialogContentText key={index}>
                      <strong>{comment?.username}:</strong> {comment?.content}
                    </DialogContentText>
                  ))}
                </Box>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
};

export default HomePage;
