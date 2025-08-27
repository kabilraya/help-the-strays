import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";

const Comments = ({ postId }) => {
  const [comment, setComment] = useState("");

  const { currentUser } = useContext(AuthContext);

  const { isLoading, err, data } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () =>
      makeRequest.get("/comments?postId=" + postId).then((res) => {
        return res.data;
      }),
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (newcomments) => {
      return makeRequest.post("/comments", newcomments);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();

    mutation.mutate({ comment, postId });
    setComment("");
  };

  return (
    <div className="comments">
      <div className="writecomment">
        <img src={"/uploads/" + currentUser.profilepic} alt="prof" />
        <input
          type="text"
          placeholder="Comment on this post"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></input>
        <button onClick={handleClick}>Send</button>
      </div>
      {isLoading
        ? "Loading"
        : data.map((comment) => (
            <div className="comment">
              <div className="userinfo">
                <img src={"/uploads/" + comment.profilepic}></img>
              </div>

              <div className="desc">
                <div className="user-details">
                  <span>{comment.name}</span>
                  <p>{moment(comment.createdAt).fromNow()}</p>
                </div>
                {comment.comment}
              </div>
            </div>
          ))}
    </div>
  );
};

export default Comments;
