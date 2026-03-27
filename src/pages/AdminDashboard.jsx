import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import { blogApi } from "../utils/api";
import { formatDate } from "../utils/format";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [tab, setTab] = useState("posts"); // "posts" | "users"

  const users = JSON.parse(localStorage.getItem("inkwell_users") || "[]");

  useEffect(() => {
    async function fetch() {
      try {
        const res = await blogApi.getAll();
        const sorted = [...res.data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setBlogs(sorted);
      } catch {
        toast.error("Failed to load posts.");
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this post permanently?")) return;
    setDeletingId(id);
    try {
      await blogApi.delete(id);
      setBlogs((prev) => prev.filter((b) => b.id !== id));
      toast.success("Post deleted.");
    } catch {
      toast.error("Delete failed.");
    } finally {
      setDeletingId(null);
    }
  }

  function handleDeleteUser(userId) {
    if (!window.confirm("Remove this user account?")) return;
    const updated = users.filter((u) => u.id !== userId);
    localStorage.setItem("inkwell_users", JSON.stringify(updated));
    toast.success("User removed.");
    window.location.reload();
  }

  const filtered = blogs.filter(
    (b) =>
      b.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.author?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: "Total posts", value: blogs.length, icon: "📄", color: "bg-indigo-50 text-indigo-600" },
    { label: "Registered users", value: users.length, icon: "👥", color: "bg-emerald-50 text-emerald-600" },
    { label: "Categories", value: [...new Set(blogs.map((b) => b.category).filter(Boolean))].length, icon: "🏷️", color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-500 text-sm mt-1">Full control over all content and users.</p>
            </div>
            <Link
              to="/create"
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
            >
              + New post
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
            {stats.map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className={`text-2xl mb-2 w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                  {s.icon}
                </div>
                <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
                <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-8">
            {["posts", "users"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors capitalize ${
                  tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Posts tab */}
          {tab === "posts" && (
            <>
              <div className="mb-5">
                <input
                  type="text"
                  placeholder="Search posts by title or author…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full sm:w-80 px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              {loading && <Spinner />}

              {!loading && filtered.length === 0 && (
                <div className="text-center py-16 text-gray-400">No posts found.</div>
              )}

              <div className="space-y-3">
                {filtered.map((blog) => (
                  <div
                    key={blog.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4 min-w-0">
                      {blog.image && (
                        <img
                          src={blog.image}
                          alt=""
                          className="w-14 h-14 rounded-xl object-cover flex-shrink-0 bg-gray-100"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{blog.title}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">{blog.author || "Anonymous"}</span>
                          {blog.category && (
                            <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
                              {blog.category}
                            </span>
                          )}
                          {blog.createdAt && (
                            <span className="text-xs text-gray-400">{formatDate(blog.createdAt)}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link
                        to={`/blog/${blog.id}`}
                        className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        View
                      </Link>
                      <Link
                        to={`/edit/${blog.id}`}
                        className="px-3 py-1.5 text-xs font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        disabled={deletingId === blog.id}
                        className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {deletingId === blog.id ? "…" : "Delete"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Users tab */}
          {tab === "users" && (
            <div className="space-y-3">
              {users.length === 0 && (
                <div className="text-center py-16 text-gray-400">No registered users yet.</div>
              )}
              {users.map((u) => (
                <div
                  key={u.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{u.name}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteUser(u.id)}
                    className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
