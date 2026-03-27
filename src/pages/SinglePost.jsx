import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import { blogApi } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { formatDate, readingTime } from "../utils/format";
import toast from "react-hot-toast";

const FALLBACK = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop";

export default function SinglePost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetch() {
      try {
        const res = await blogApi.getOne(id);
        setBlog(res.data);
      } catch {
        toast.error("Post not found.");
        navigate("/explore");
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [id, navigate]);

  const canEdit = isAdmin || (user && blog && blog.authorId === user.id);

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this post? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await blogApi.delete(id);
      toast.success("Post deleted.");
      navigate("/");
    } catch {
      toast.error("Failed to delete. Try again.");
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-16"><Spinner size="lg" /></div>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-400 mb-8 flex items-center gap-2">
            <Link to="/" className="hover:text-indigo-600">Home</Link>
            <span>/</span>
            <Link to="/explore" className="hover:text-indigo-600">Explore</Link>
            <span>/</span>
            <span className="text-gray-600 truncate max-w-xs">{blog.title}</span>
          </nav>

          {/* Category */}
          {blog.category && (
            <span className="inline-block text-xs font-semibold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full mb-4">
              {blog.category}
            </span>
          )}

          {/* Title */}
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-3">
            {blog.title}
          </h1>
          {blog.subtitle && (
            <p className="text-xl text-gray-500 mb-6">{blog.subtitle}</p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                {(blog.author || "A").charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{blog.author || "Anonymous"}</p>
                {blog.createdAt && (
                  <p className="text-xs text-gray-400">{formatDate(blog.createdAt)}</p>
                )}
              </div>
            </div>
            <span className="text-gray-300">·</span>
            <span className="text-sm text-gray-400">{readingTime(blog.description)}</span>
          </div>

          {/* Hero image */}
          <div className="rounded-2xl overflow-hidden mb-10 bg-gray-100 shadow-sm">
            <img
              src={blog.image?.startsWith("http") || blog.image?.startsWith("data:") ? blog.image : FALLBACK}
              alt={blog.title}
              className="w-full h-auto object-cover"
              onError={(e) => { e.target.src = FALLBACK; }}
            />
          </div>

          {/* Body */}
          <div className="prose-content text-gray-700 text-base leading-relaxed">
            {blog.description?.split("\n").map((para, i) =>
              para.trim() ? (
                <p key={i} className="mb-5">{para}</p>
              ) : (
                <br key={i} />
              )
            )}
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-gray-100">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Edit / Delete controls */}
          {canEdit && (
            <div className="flex gap-3 mt-10 pt-6 border-t border-gray-100">
              <Link
                to={`/edit/${id}`}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
              >
                Edit post
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-5 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete post"}
              </button>
            </div>
          )}
        </article>

        {/* Footer */}
        <footer className="border-t border-gray-100 bg-white mt-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
            <p className="text-sm text-gray-400">© {new Date().getFullYear()} InkWell</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
