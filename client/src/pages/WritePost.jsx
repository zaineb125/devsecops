import { useState } from "react"
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"
import {Navigate} from "react-router-dom"
import Editor from "../components/Editor"


const WritePost = () => {
  const [title,setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files,setFiles] = useState('');
  const [redirect, setRedirect] = useState(false)

  async function writePost(e){
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('file',files[0]);

    e.preventDefault()
    const result = await fetch('http://localhost:5000/post',{
      method:'POST',
      body: data,
      credentials: 'include',
    });
    if(result.ok){
      setRedirect(true)
    }
  }

  if(redirect){
    return <Navigate to={'/'}/>
  }

  return (
    <form className="w-full flex flex-col gap-y-4" onSubmit={writePost}>
      <input 
        type="title" 
        placeholder="title" 
        className="p-2 border"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <input 
        type="summary" 
        placeholder="summary" 
        className="p-2 border"
        value={summary}
        onChange={e => setSummary(e.target.value)}
      />
      <input 
        type="file" 
        className="p-2 border"
        onChange={e => setFiles(e.target.files)}
      />
      <Editor value={content} onChange={setContent} />
      <button
        className="mt-5 bg-amber-500 hover:bg-amber-600 py-4 text-white rounded text-md font-semibold"
      >
        Post
      </button>
    </form>
  )
}
export default WritePost