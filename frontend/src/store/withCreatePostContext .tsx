import { CreatePostProvider } from "../hooks/useCreatePost";

const withCreatePostContext = (Component: React.ComponentType) => {
  return (props: any) => (
    <CreatePostProvider>
      <Component {...props} />
    </CreatePostProvider>
  );
};

export default withCreatePostContext;
