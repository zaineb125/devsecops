import { useEffect, useState } from "react";
import Post from "../components/Post";
import Cookies from 'js-cookie';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const token =Cookies.get('token');

  useEffect(() => {
    fetch('http://localhost:5000/post',{ headers:{'authorization': token}})
      .then(res => res.json())
      .then(posts => {
        setPosts(posts);
      });
  }, []);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 justify-center gap-6 mt-8">
      {posts.length > 0 ? (
        posts.map(post => (
          <Post key={post.id} {...post} />
        ))
      ) : (
        <div className="">There is no post yet...😫</div>
      )}
    </div>
  );
};

export default PostList;

