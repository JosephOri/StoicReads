import { useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Container,
} from "@mui/material";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = (event: any) => {
    event.preventDefault();
    console.log("Submitted:", { title, authors, image });
    setTitle("");
    setAuthors("");
    setImage("");
  };

  return (
    <Container>
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Create New Book Post
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Title"
                      variant="outlined"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Authors"
                      variant="outlined"
                      value={authors}
                      onChange={(e) => setAuthors(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Image URL"
                      variant="outlined"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary">
                      Publish
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreatePost;
