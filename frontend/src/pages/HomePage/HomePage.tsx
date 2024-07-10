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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface Book {
  title: string;
  authors: string;
  image: string;
}

const dummyBooks: Book[] = [
  {
    title: "Book 1",
    authors: "Author 1",
    image: "https://via.placeholder.com/150",
  },
  {
    title: "Book 2",
    authors: "Author 2",
    image: "https://via.placeholder.com/150",
  },
  {
    title: "Book 3",
    authors: "Author 3",
    image: "https://via.placeholder.com/150",
  },
  {
    title: "Book 4",
    authors: "Author 4",
    image: "https://via.placeholder.com/150",
  },
  {
    title: "Book 5",
    authors: "Author 5",
    image: "https://via.placeholder.com/150",
  },
];

const HomePage = () => {
  const [books] = useState<Book[]>(dummyBooks);
  const [open, setOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const handleClickOpen = (book: Book) => {
    setSelectedBook(book);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBook(null);
  };

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
        {books.map((book, index) => (
          <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
            <Card onClick={() => handleClickOpen(book)}>
              <CardMedia
                component="img"
                height="140"
                image={book.image}
                alt={book.title}
              />
              <CardContent>
                <Typography variant="h5" component="div">
                  {book.title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {book.authors}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
        {open && (
          <>
            <DialogTitle>
              {selectedBook?.title}
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
                    src={selectedBook?.image}
                    alt={selectedBook?.title}
                    style={{ maxWidth: "200px", marginRight: "20px" }}
                  />
                </Box>
                <Box flexGrow={1}>
                  <Typography variant="h6">Authors</Typography>
                  <DialogContentText>{selectedBook?.authors}</DialogContentText>
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
