import {AiOutlineComment, AiOutlineHeart, AiOutlineUser} from "react-icons/ai"
import {formatISO9075} from "date-fns";
import { Link } from "react-router-dom";

const Post = ({_id,title,summary,cover,createdAt,author,comments,likes}) => {
  return (
    <div className="shadow-md p-4 rounded flex flex-col justify-between">
      <div>
        <Link to={`/post/${_id}`}>
          <img 
            src={'http://localhost:5000/'+cover} 
            alt="" 
            className="rounded w-full h-[200px] object-cover"
          />
          <div className="mt-3 flex justify-between">
            <div className="flex items-center gap-x-1">
              <AiOutlineUser size={20}/>
              <p
                href="" 
                className="text-sm hover:text-amber-500 cursor-pointer"
              >{author.username}</p>
            </div>
            <span className="text-sm">{formatISO9075(new Date(createdAt))}</span>
          </div>
          <h2 className="text-lg font-semibold my-3">{title}</h2>
          <p className="text-sm text-zinc-500 break-words">{summary}</p>
        </Link>
      </div>
      <div className="flex justify-between border-t border-gray-300 mt-4 pt-2">
        <div className="flex gap-x-1 items-center">
          <AiOutlineHeart />
          <span className="text-sm text-zinc-500">:{likes.length}likes</span>
        </div>
        <div className="flex gap-x-1 items-center">
          <AiOutlineComment />
          <span className="text-sm text-zinc-500">: {comments.length} comments</span>
        </div>
      </div>
    </div>
  )
}
export default Post