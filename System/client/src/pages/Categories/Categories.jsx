import "./Categories.scss";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { makeRequest } from "../../axios";
import Post from "../../components/Post/Post";

const Categories = () => {
  const { category } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await makeRequest.get("/posts?category=" + category);
        setPosts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [category]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="categories">
      {posts.length > 0 ? (
        posts.map((post) => <Post key={post.id} post={post} />)
      ) : (
        <div>No posts in this category.</div>
      )}
    </div>
  );
};

export default Categories;
