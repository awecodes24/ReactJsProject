import { useEffect, useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import BlogCard from "../components/BlogCard";
import Spinner from "../components/Spinner";
import { blogApi } from "../utils/api";

const CATEGORIES = ["All", "Technology", "Science", "Culture", "Travel", "Health", "Finance", "Other"];

export default function Explore() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    async function fetch() {
      try {
        const res = await blogApi.getAll();
        setBlogs(res.data);
      } catch {
        // fail silently — empty state handles it
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  const filtered = useMemo(() => {
    let result = [...blogs];

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.description?.toLowerCase().includes(q) ||
          b.author?.toLowerCase().includes(q)
      );
    }

    if (category !== "All") {
      result = result.filter((b) => b.category === category);
    }

    result.sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      return 0;
    });

    return result;
  }, [blogs, query, category, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Explore</h1>
            <p className="text-gray-500">Browse all posts from our community of writers.</p>
          </div>

          {/* Search + filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search posts, authors…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  category === cat
                    ? "bg-indigo-600 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results count */}
          {!loading && (
            <p className="text-sm text-gray-400 mb-6">
              {filtered.length} {filtered.length === 1 ? "post" : "posts"} found
            </p>
          )}

          {loading && <Spinner />}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-24">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-gray-500 text-lg font-medium">No posts match your search.</p>
              <button
                onClick={() => { setQuery(""); setCategory("All"); }}
                className="mt-4 text-sm text-indigo-600 hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
