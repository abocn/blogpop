'use client';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Tag } from 'lucide-react';

export default function PostPage() {
  const [markdown, setMarkdown] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [postTitle, setPostTitle] = useState('');
  const [postDate, setPostDate] = useState('');
  const [postCategory, setPostCategory] = useState('');
  const { slug } = useParams();

  useEffect(() => {
    interface PostData {
      title?: string;
      date?: string;
      category?: string;
      message?: string;
    }

    function setPostData(postData: PostData) {
      setPostTitle(postData.title || 'Untitled Post');
      
      if (postData.date) {
        console.log("[i] Date:", postData.date);
        const date = new Date(Number(postData.date) * 1000)
        console.log("[i] Date object:", date);
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        console.log("[i] Date options:", options);
        console.log("[i] Formatted date:", date.toLocaleDateString(undefined, options));
        setPostDate(date.toLocaleDateString(undefined, options));
      } else {
        setPostDate('an unknown date');
      }

      if (postData.category) {
        setPostCategory(postData.category);
      } else if (postData.message) {
        setPostCategory(postData.message);
      } else {
        setPostCategory("Error");
      }
    }

    console.log("[i] Navigated to slug: ", slug);
    (async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/posts/get/${slug}`, {
          cache: 'no-store',
        });

        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json();
          if (data.success === false) {
            if (data.message) {
              setLoading(false);
              setError(data.message);
              throw new Error(data.message);
            } else {
              setLoading(false);
              setError('Unknown error occurred');
              throw new Error('Unknown error occurred');
            }
          }
        } else {
          const text = await res.text();
          const catRes = await fetch(`http://localhost:3001/api/posts/getPostDetails/${slug}`, {
            cache: 'no-store',
          });
          const postData = await catRes.json();

          if (postData.success) {
            setPostData(postData);
          } else {
            if (postData.message) {
              setPostData(postData);
            } else {
              setPostCategory("Error");
            }
          }

          setMarkdown(text);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Could not load the post.');
        setMarkdown('# Error\n\nCould not load the post.');
      }
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-slate-800 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">{error}</div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold my-4">{postTitle}</h1>
      <p className="italic text-muted-foreground">Published on {postDate}</p>
      <div className="flex flex-wrap gap-2 my-4">
        <span className="border border-white text-bold px-3 py-1 rounded-md">
          <Tag className="w-4 h-4 inline-block mr-1" /> {postCategory}
        </span>
      </div>
      <hr className="my-4 border-white" />
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
        h1: ({...props}) => <h1 className='text-4xl font-bold my-4' {...props}/>,
        h2: ({...props}) => <h2 className='text-2xl font-semibold my-4' {...props}/>,
        h3: ({...props}) => <h3 className='text-xl my-4' {...props}/>,
        h4: ({...props}) => <h4 className='text-md my-4' {...props}/>,
        h5: ({...props}) => <h5 className='text-sm my-4' {...props}/>,
        em: ({...props}) => <em className='mt-30' {...props}/>,
        hr: ({...props}) => <hr className='border-white solid my-5' {...props}/>,
        p: ({...props}) => <p className='my-3' {...props}/>,
        a: ({...props}) => <a className='text-white underline' {...props}/>,
        img: ({src, alt, width, height, ...props}) => <Image className='my-4 rounded-md' src={src || ''} alt={alt || ''} width={width ? parseInt(width.toString()) : 800} height={height ? parseInt(height.toString()) : 400} {...props}/>,
        blockquote: ({...props}) => <blockquote className="border-l-4 border-white pl-4 my-4 italic" {...props}/>,
        code: ({...props}) => <code className="bg-gray-800 rounded px-1 font-mono text-sm" {...props}/>,
        pre: ({...props}) => <pre className="bg-gray-800 rounded p-4 my-4 overflow-x-auto font-mono text-sm" {...props}/>,
        table: ({...props}) => <table className="border-collapse table-auto w-full my-4" {...props}/>,
        thead: ({...props}) => <thead className="bg-gray-800" {...props}/>,
        th: ({...props}) => <th className="border border-gray-600 px-4 py-2" {...props}/>,
        td: ({...props}) => <td className="border border-gray-600 px-4 py-2" {...props}/>,
        ul: ({...props}) => <ul className="list-disc ml-6 my-2" {...props}/>,
        ol: ({...props}) => <ol className="list-decimal ml-6 my-2" {...props}/>,
        li: ({...props}) => <li className="pl-2" {...props}/>,
        input: ({type, ...props}) => type === 'checkbox' ? 
          <input type="checkbox" className="ml-[0.4rem] mr-2" {...props}/> : 
          <input type={type} {...props}/>
      }}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}