import { GlobalProvider } from "../hooks/useGlobal";

const withGlobalContext = <P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> => {
  const ComponentWithGlobalContext = (props: P) => (
    <GlobalProvider>
      <WrappedComponent {...props} />
    </GlobalProvider>
  );

  return ComponentWithGlobalContext;
};

export default withGlobalContext;
  