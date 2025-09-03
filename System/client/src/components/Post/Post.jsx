import "./Post.scss";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Link } from "react-router-dom";
import Comments from "../Comments/comments";
import { useContext, useState } from "react";
import moment from "moment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";

const Post = ({ post }) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { isLoading, error, data } = useQuery({
    queryKey: ["likes", post.id],
    queryFn: () =>
      makeRequest.get("/likes?postId=" + post.id).then((res) => {
        return res.data;
      }),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (liked) => {
      if (liked) return makeRequest.delete("/likes?postId=" + post.id);
      return makeRequest.post("/likes?postId=" + post.id);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes"] });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (postId) => {
      return makeRequest.delete("/posts/" + postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleLike = () => {
    mutation.mutate(data.includes(currentUser.id));
  };

  const deletePost = () => {
    deleteMutation.mutate(post.id);
  };

  const [commentOpen, openComment] = useState(false);
  return (
    <div className="Post">
      <div className="container">
        <div className="user">
          <div className="user-data">
            <img src={"/uploads/" + post.profilepic} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userid}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span>{post.name}</span>
              </Link>

              <span className="date">{moment(post.createddate).fromNow()}</span>
            </div>
          </div>

          <MoreVertOutlinedIcon
            onClick={() => setOpenDropdown(!openDropdown)}
          />
          {openDropdown && (
            <div className="drop">
              <span onClick={deletePost}>Delete</span>
            </div>
          )}
        </div>
        <div className="content">
          <p>{post.captions}</p>
          {post.image && <img src={"/uploads/" + post.image}></img>}
        </div>
        <div className="info">
          <div className="info-part">
            {isLoading ? (
              "Lodaing"
            ) : data && data.includes(currentUser.id) ? (
              <FavoriteIcon style={{ color: "red" }} onClick={handleLike} />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            {data && data.length} likes
          </div>
          <div className="info-part" onClick={() => openComment(!commentOpen)}>
            <ChatBubbleOutlineOutlinedIcon />
            <span>{post.comments}</span>
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;
