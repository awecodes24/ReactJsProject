import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import BlogCard from "../components/BlogCard";
import Spinner from "../components/Spinner";
import { blogApi } from "../utils/api";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await blogApi.getAll();
        // Show newest first
        const sorted = [...res.data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setBlogs(sorted);
      } catch {
        setError("Failed to load blogs. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  const featured = blogs[0];
  const rest = blogs.slice(1, 7);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="pt-16 hero-gradient">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-4">
            Welcome to InkWell
          </span>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight mb-5">
            Ideas Worth
            <span className="text-indigo-600"> Reading</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8">
            Discover stories, insights, and perspectives from writers around the world.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/explore"
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-md"
            >
              Explore posts
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-sm"
            >
              Start writing
            </Link>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading && <Spinner />}
        {error && (
          <div className="text-center py-20 text-red-500 font-medium">{error}</div>
        )}

        {!loading && !error && blogs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No posts yet. Be the first to write!</p>
            <Link
              to="/create"
              className="mt-4 inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700"
            >
              Write a post
            </Link>
          </div>
        )}

        {/* Featured post */}
        {featured && (
          <div className="mb-14">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-5">
              Featured
            </h2>
            <Link
              to={`/blog/${featured.id}`}
              className="group grid md:grid-cols-2 gap-8 bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm card-hover"
            >
              <div className="aspect-video md:aspect-auto overflow-hidden bg-gray-100">
                <img
                  src={featured.image || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop"}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop";
                  }}
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                {featured.category && (
                  <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-3">
                    {featured.category}
                  </span>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                  {featured.title}
                </h3>
                <p className="text-gray-500 mb-5 line-clamp-3 leading-relaxed">
                  {featured.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                    {(featured.author || "A").charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-600">{featured.author || "Anonymous"}</span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Latest posts grid */}
        {rest.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400">
                Latest posts
              </h2>
              <Link
                to="/explore"
                className="text-sm font-medium text-indigo-600 hover:underline"
              >
                See all →
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <span className="font-bold text-gray-800">InkWell</span>
          </div>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} InkWell. Built with React & Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
}

