import { makeRequest } from "../../axios";
import Post from "../Post/Post";
import "./Posts.scss";
import Login from "../../pages/login/Login";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const Posts = ({ userId }) => {
  //Temporary data for viewing and styling
  const navigate = useNavigate();
  const query = userId ? `/posts?userId=${userId}` : "/posts";
  const { isPending, error, data } = useQuery({
    queryKey: ["posts", userId],
    queryFn: () =>
      makeRequest.get(query).then((res) => {
        return res.data;
      }),
  });
  if (isPending) return <div>Loading...</div>;
  if (error) {
    navigate("/login");
  }

  return (
    <div className="Posts">
      {data?.map((post) => (
        <Post post={post} key={post.id} />
      ))}
    </div>
  );
};
export default Posts;
