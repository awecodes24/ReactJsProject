import { Link } from "react-router-dom";
import { timeAgo, readingTime } from "../utils/format";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop";

export default function BlogCard({ blog }) {
  const imgSrc = blog.image?.startsWith("http") || blog.image?.startsWith("data:")
    ? blog.image
    : FALLBACK_IMAGE;

  return (
    <Link
      to={`/blog/${blog.id}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 card-hover shadow-sm"
    >
      <div className="aspect-[16/9] overflow-hidden bg-gray-100">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          src={imgSrc}
          alt={blog.title}
          onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
          loading="lazy"
        />
      </div>
      <div className="p-5">
        {blog.category && (
          <span className="inline-block text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-2">
            {blog.category}
          </span>
        )}
        <h2 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {blog.title}
        </h2>
        {blog.subtitle && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-1">{blog.subtitle}</p>
        )}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {blog.description}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
              {(blog.author || "A").charAt(0).toUpperCase()}
            </div>
            <span className="font-medium text-gray-600">{blog.author || "Anonymous"}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>{readingTime(blog.description)}</span>
            {blog.createdAt && <span>·</span>}
            {blog.createdAt && <span>{timeAgo(blog.createdAt)}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}
