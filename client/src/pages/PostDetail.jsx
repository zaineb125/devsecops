import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../context/UserContext";
import { AiOutlineHeart, AiOutlineSend , AiFillHeart, AiOutlineArrowLeft} from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const PostDetail = () => {
  const [postInfo, setPostInfo] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:5000/post/${id}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Failed to retrieve post");
        }
      })
      .then((postInfo) => {
        setPostInfo(postInfo);
        setLikes(postInfo.likes.length);
      })
      .catch((error) => {
        console.error("Error retrieving post:", error);
      });

    fetch(`http://localhost:5000/post/${id}/comments`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else if (res.status === 404) {
          return []; 
        } else {
          throw new Error("Failed to retrieve comments");
        }
      })
      .then((data) => {
        setComments(data);
      })
      .catch((error) => {
        console.error("Error retrieving comments:", error);
      });
  }, [id]);

  const handleDelete = () => {
    fetch(`http://localhost:5000/post/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.message); 
        setPostInfo(null); 
        navigate("/"); 
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
      });
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();

    fetch(`http://localhost:5000/post/${id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ content: commentContent }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Comment created:", data);
        setCommentContent(""); 

      
        fetch(`http://localhost:5000/post/${id}/comments`)
          .then((res) => {
            if (res.ok) {
              return res.json();
            } else {
              throw new Error("Failed to retrieve comments");
            }
          })
          .then((data) => {
            setComments(data);
          })
          .catch((error) => {
            console.error("Error retrieving comments:", error);
          });
      })
      .catch((error) => {
        console.error("Error creating comment:", error);
      });
  };



  const handleLike = () => {
    fetch(`http://localhost:5000/post/${id}/like`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Failed to like post");
        }
      })
      .then((data) => {
        setPostInfo((prevPostInfo) => ({
          ...prevPostInfo,
          likes: data.likes,
        }));
        setLikes(data.likes.length);
      })
      .catch((error) => {
        console.error("Error liking post:", error);
      });
  };


  if (!postInfo) {
    return (
      <div className="flex justify-center items-center h-screen text-3xl">
        Loading...
      </div>
    );
  }

  const email = userInfo?.email;

  return (
    <div className="w-full md:flex mt-8 gap-5 mb-10">
      <div className="md:w-3/4">
        <img
          src={`https://mern-blog-backend-nu.vercel.app/${postInfo.cover}`}
          alt=""
          className="w-full h-[300px] object-cover mb-3"
        />
        <div className="md:flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <span className="text-sm">
              {formatISO9075(new Date(postInfo.createdAt))}
            </span>
            <p className="text-sm">
              by{" "}
              <span className="font-semibold">
                {postInfo.author.username}
              </span>
            </p>
            {email && (
              <div className="flex gap-x-1 items-center ml-5">
                {postInfo.likes.includes(userInfo.id) ? (
                  <AiFillHeart onClick={handleLike} />
                ) : (
                  <AiOutlineHeart onClick={handleLike} />
                )}
              </div>
            )}
            <p>{likes} likes</p>
          </div>
          {userInfo && userInfo.id === postInfo.author._id && (
            <div>
              <Link to={`/edit/${postInfo._id}`}>
                <button className="border px-4 py-1 rounded bg-amber-500 text-white hover:bg-amber-600 cursor-pointer">
                  Edit
                </button>
              </Link>
              <button
                className="border px-4 py-1 rounded bg-red-500 text-white hover:bg-red-600 cursor-pointer ml-2"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          )}
        </div>
        <h1 className="my-5 font-extrabold text-2xl">{postInfo.title}</h1>
        <div
          className="break-words"
          dangerouslySetInnerHTML={{ __html: postInfo.content }}
        />
        <Link to={"/"}>
          <div className="flex items-center gap-x-1 mt-8 hover:text-amber-500">
            <AiOutlineArrowLeft />
            <p className="font-md">Back to HOME</p>
          </div>
        </Link>
      </div>
      <div className="md:w-1/4 p-2 border rounded">
        <p className="font-bold">
          Comments{" "}
          <span className="font-normal text-sm text-gray-500 ml-1">
            {comments.length}
          </span>
        </p>

        {email && (
          <form
            className="flex items-center mt-3 border rounded "
            onSubmit={handleCommentSubmit} 
          >
            <input
              type="text"
              className="border w-full"
              name="content"
              required
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
            />
            <button type="submit">
              <AiOutlineSend
                size={25}
                className="ml-2 hover:text-amber-500"
              />
            </button>
          </form>
        )}
        {!email && (
          <div className="mt-3 text-sm text-gray-500">
            <p>Please login to post a comment.</p>
          </div>
        )}

        {comments.map((comment) => (
          <div key={comment._id} className="mt-3 border rounded p-2">
            <p>{comment.content}</p>
            {comment.author && (
              <p className="text-sm text-zinc-500">{comment.author.username}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostDetail;

