import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import { logout } from "../../utils/logout";
import { useNavigate } from "react-router-dom";

const books = [
  {
    title: "Book 1",
    description: "Description for book 1",
    image: "https://via.placeholder.com/150",
  },
  {
    title: "Book 2",
    description: "Description for book 2",
    image: "https://via.placeholder.com/150",
  },
  {
    title: "Book 3",
    description: "Description for book 3",
    image: "https://via.placeholder.com/150",
  },
  // Add more books as needed
];

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <Button onClick={handleLogout}>Logout</Button>
      <Grid container spacing={4} style={{ marginTop: 20 }}>
        {books.map((book, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card>
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
                <Typography variant="body2" color="text.secondary">
                  {book.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default HomePage;
