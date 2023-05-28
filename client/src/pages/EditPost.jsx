import {useEffect, useState} from "react";
import {Navigate, useParams} from "react-router-dom";
import Editor from "../components/Editor";

export default function EditPost() {
  const {id} = useParams();
  const [title,setTitle] = useState('');
  const [summary,setSummary] = useState('');
  const [content,setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect,setRedirect] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/post/'+id)
      .then(result => {
        result.json().then(postInfo => {
          setTitle(postInfo.title);
          setContent(postInfo.content);
          setSummary(postInfo.summary);
        });
      });
  }, []);

  async function updatePost(e) {
    e.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('id', id);
    if(files?.[0]){
      data.set('file', files?.[0]);
    }
    const result = await fetch('http://localhost:5000/post', {
      method: 'PUT',
      body: data,
      credentials: 'include',
    });
    if (result.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={'/post/'+id} />
  }

  return (
    <form className="w-full flex flex-col gap-y-4" onSubmit={updatePost}>
      <input 
        type="title"
        placeholder={'Title'}
        className="p-2 border"
        value={title}
        onChange={e => setTitle(e.target.value)} 
      />
      <input 
        type="summary"
        placeholder={'Summary'}
        className="p-2 border"
        value={summary}
        onChange={e => setSummary(e.target.value)} 
      />
      <input 
        type="file"
        className="p-2 border"
        onChange={e => setFiles(e.target.files)} 
      />
      <Editor onChange={setContent} value={content} />
      <button
        className="mt-5 bg-amber-500 hover:bg-amber-600 py-4 text-white rounded text-md font-semibold"
      >
        Update Post
      </button>
    </form>
  );
}