import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';

const API_BASE = "https://blog-app-tm56.onrender.com";  // your Render backend URL

function App() {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({ title: '', content: '', author: '' });
    const [loading, setLoading] = useState(false);

    // Fetch all posts when component loads
    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE}/posts`);
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newPost.title || !newPost.content) {
            alert('Please fill in title and content');
            return;
        }

        try {
            await axios.post(`${API_BASE}/posts`, newPost);
            setNewPost({ title: '', content: '', author: '' });
            fetchPosts(); // Refresh the list
            alert('Post created successfully!');
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Error creating post');
        }
    };

    const deletePost = async (id) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await axios.delete(`${API_BASE}/posts/${id}`);
                fetchPosts(); // Refresh the list
                alert('Post deleted successfully!');
            } catch (error) {
                console.error('Error deleting post:', error);
                alert('Error deleting post');
            }
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>My Simple Blog</h1>
            </header>

            <div className="container">
                {/* Form to create new post */}
                <div className="create-post">
                    <h2>Write New Post</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Post title"
                            value={newPost.title}
                            onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                        />
                        <textarea
                            placeholder="Write your post content here..."
                            value={newPost.content}
                            onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                        />
                        <input
                            type="text"
                            placeholder="Your name"
                            value={newPost.author}
                            onChange={(e) => setNewPost({...newPost, author: e.target.value})}
                        />
                        <button type="submit">Create Post</button>
                    </form>
                </div>

                {/* Display all posts */}
                <div className="posts-section">
                    <h2>All Posts</h2>
                    {loading ? (
                        <p>Loading posts...</p>
                    ) : posts.length === 0 ? (
                        <p>No posts yet. Create your first post!</p>
                    ) : (
                        posts.map((post) => (
                            <div key={post._id} className="post">
                                <h3>{post.title}</h3>
                                <p className="post-meta">
                                    By {post.author} on {new Date(post.createdAt).toLocaleDateString()}
                                </p>
                                <p className="post-content">{post.content}</p>
                                <button 
                                    className="delete-btn"
                                    onClick={() => deletePost(post._id)}
                                >
                                    Delete Post
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
