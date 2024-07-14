import { useState, Suspense } from "react";
import {
  Grid,
  Typography,
  TextField,
  Card,
  CardContent,
  Container,
  Box,
  CircularProgress,
  Button,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useCreatePost } from "../../hooks/useCreatePost";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { selectedBook, setSelectedBook } = useCreatePost();
  const navigate = useNavigate();
  
  const handleSearch = async (event: any) => {
    event.preventDefault();
    setLoading(true);

    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}`
    );
    const data = await response.json();

    setBooks(data.items || []);
    setLoading(false);
    setSearchQuery("");
  };

  const handleBookClick = (book: any) => {
    setSelectedBook(book);
  };

  const BooksList = () => (
    <Grid container spacing={2}>
      {books.map((book, index) => (
        <Grid item xs={12} md={6} lg={4} key={index}>
          <Card
            onClick={() => handleBookClick(book)}
            sx={{
              cursor: "pointer",
              border:
                selectedBook && selectedBook.id === book.id
                  ? "2px solid blue"
                  : "none",
              ":hover": {
                backgroundColor: "#f0f0f0",
              },
            }}
          >
            <CardContent>
              <Box
                width="350px"
                height="300px"
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <img
                  src={
                    book.volumeInfo.imageLinks?.thumbnail ||
                    "https://via.placeholder.com/150"
                  }
                  alt={book.volumeInfo.title}
                  style={{ marginBottom: 16 }}
                />
                <Typography variant="h6">{book.volumeInfo.title}</Typography>
                <Typography variant="subtitle1">
                  {book.volumeInfo.authors?.join(", ")}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

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
                Search for Books
              </Typography>
              <form onSubmit={handleSearch}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Search for books"
                      variant="outlined"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <LoadingButton
                      loading={loading}
                      type="submit"
                      color="primary"
                      variant="contained"
                    >
                      Search
                    </LoadingButton>
                    {selectedBook && (
                      <Button
                        color="success"
                        sx={{ marginLeft: 2 }}
                        variant="contained"
                        onClick={() => {
                          navigate({ search: "?step=2" });
                        }}
                      >
                        Continue
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Suspense fallback={<CircularProgress />}>
            {loading ? null : <BooksList />}
          </Suspense>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreatePost;
