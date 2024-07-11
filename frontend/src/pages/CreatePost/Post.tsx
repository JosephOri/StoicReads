import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CreatePost from "./CreatePost";
import SubmitPost from "./SubmitPost";
import withCreatePostContext from "../../store/withCreatePostContext ";

const Post = () => {
  const location = useLocation();
  const [confirmPost, setConfirmPost] = useState<boolean>(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    if (queryParams.get("step") === "2") {
      setConfirmPost(true);
    } else {
      setConfirmPost(false);
    }
  }, [location.search]);

  return confirmPost ? <SubmitPost /> : <CreatePost />;
};

export default withCreatePostContext(Post);
