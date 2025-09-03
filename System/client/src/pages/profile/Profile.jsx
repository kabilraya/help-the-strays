import "./Profile.scss";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import Posts from "../../components/Posts/Posts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/Update/update";
const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { userId } = useParams();

  const { isLoading, error, data } = useQuery({
    queryKey: ["user", userId],
    queryFn: () =>
      makeRequest.get("/users/find/" + userId).then((res) => {
        return res.data;
      }),
  });

  const { data: relationshipData } = useQuery({
    queryKey: ["relationship"],
    queryFn: () =>
      makeRequest.get("/relationships?followedUserId=" + userId).then((res) => {
        return res.data;
      }),
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (following) => {
      if (following)
        return makeRequest.delete("/relationships?userId=" + userId);
      return makeRequest.post("relationships", { userId });
    },
    onSuccess: queryClient.invalidateQueries(["relationship"]),
  });

  const handleFollow = () => {
    mutation.mutate(relationshipData.includes(currentUser.id));
  };

  return (
    <div className="profile">
      <div className="images">
        <img
          src={data && "/uploads/" + data.coverphoto}
          alt="cover"
          className="cover"
        />
        <img
          src={data && "/uploads/" + data.profilepic}
          alt="profile"
          className="profilepic"
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            {/* <a href="https://web.whatsapp.com/">
              <WhatsAppIcon fontSize="medium" />
            </a> */}
            {/* <a href="#">
              <PhoneAndroidOutlinedIcon fontSize="medium" />
            </a> */}
          </div>
          <div className="center">
            <span>
              <PhoneAndroidOutlinedIcon fontSize="medium" />
              {data && data.name}
            </span>
            {userId == currentUser.id && data ? (
              <button onClick={() => setOpenUpdate(true)}>Update</button>
            ) : (
              <button onClick={handleFollow}>
                {relationshipData && relationshipData.includes(currentUser.id)
                  ? "Following"
                  : "Follow"}
              </button>
            )}
          </div>
          <div className="right">
            {/* <a href="www.gmail.com">
              <EmailOutlinedIcon fontSize="medium" />
            </a> */}
          </div>
        </div>
        <Posts userId={userId} />
      </div>
      {openUpdate && data && (
        <Update setOpenUpdate={setOpenUpdate} user={data} />
      )}
    </div>
  );
};

export default Profile;
