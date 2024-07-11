import { AppRoutes } from "./routes/AppRoutes";
import withGlobalContext from "./store/withGlobalContext";

const App = () => {
  return <AppRoutes />;
};

export default withGlobalContext(App);
