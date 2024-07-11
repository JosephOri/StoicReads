import {
  Avatar,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useGlobal } from "../../hooks/useGlobal";

type User = any;

const User = () => {
  const { user } = useGlobal();

  if (!user) return <CircularProgress />;

  return (
    <Container maxWidth="md" style={{ marginTop: 20 }}>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4} style={{ textAlign: "center" }}>
              <Avatar
                alt={user?.userName}
                src={user?.profilePicture}
                style={{ width: 100, height: 100, margin: "auto" }}
              />
              <Typography
                variant="h5"
                component="div"
                style={{ marginTop: 10 }}
              >
                {user?.userName}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="h6">Email</Typography>
              <Typography variant="body1" color="text.secondary">
                {user?.email}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default User;
