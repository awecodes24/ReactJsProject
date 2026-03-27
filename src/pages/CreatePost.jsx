import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { blogApi } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const CATEGORIES = ["Technology", "Science", "Culture", "Travel", "Health", "Finance", "Other"];

export default function CreatePost() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    image: "",
    category: "",
    tags: "",
  });
  const [imageMode, setImageMode] = useState("url"); // "url" | "file"
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setForm((prev) => ({ ...prev, image: reader.result }));
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Title is required."); return; }
    if (!form.description.trim()) { toast.error("Content is required."); return; }

    setSubmitting(true);
    try {
      const tags = form.tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      const payload = {
        ...form,
        tags,
        author: user.name,
        authorId: user.id,
        createdAt: new Date().toISOString(),
      };
      delete payload.tags; // re-add as array
      payload.tags = tags;

      const res = await blogApi.create(payload);
      toast.success("Post published! 🎉");
      navigate(`/blog/${res.data.id}`);
    } catch {
      toast.error("Failed to publish. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const wordCount = form.description.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">New post</h1>
              <p className="text-gray-500 text-sm mt-1">
                Writing as <span className="font-medium text-indigo-600">{user?.name}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPreview(!preview)}
                className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
              >
                {preview ? "Edit" : "Preview"}
              </button>
            </div>
          </div>

          {preview ? (
            /* Preview mode */
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              {form.category && (
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">{form.category}</span>
              )}
              <h2 className="text-3xl font-extrabold text-gray-900 mt-2 mb-1">{form.title || "Your title"}</h2>
              {form.subtitle && <p className="text-lg text-gray-500 mb-4">{form.subtitle}</p>}
              {form.image && (
                <img src={form.image} alt="preview" className="w-full rounded-xl mb-6 object-cover max-h-72" />
              )}
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{form.description || "Your content will appear here…"}</div>
            </div>
          ) : (
            /* Edit mode */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Give your post a great title"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                  maxLength={120}
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{form.title.length}/120</p>
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Subtitle</label>
                <input
                  name="subtitle"
                  value={form.subtitle}
                  onChange={handleChange}
                  placeholder="A short tagline (optional)"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Cover image</label>
                <div className="flex gap-3 mb-3">
                  {["url", "file"].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => { setImageMode(mode); setForm(p => ({ ...p, image: "" })); }}
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                        imageMode === mode
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "border-gray-200 text-gray-600 hover:border-indigo-300"
                      }`}
                    >
                      {mode === "url" ? "Image URL" : "Upload file"}
                    </button>
                  ))}
                </div>
                {imageMode === "url" ? (
                  <input
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                  />
                )}
                {form.image && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-gray-100">
                    <img
                      src={form.image}
                      alt="preview"
                      className="w-full max-h-48 object-cover"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  </div>
                )}
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={14}
                  placeholder="Write your post here… (use blank lines between paragraphs)"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-y leading-relaxed"
                />
                <p className="text-xs text-gray-400 mt-1">{wordCount} words</p>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tags</label>
                <input
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="react, javascript, webdev (comma-separated)"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-sm"
                >
                  {submitting ? "Publishing…" : "Publish post"}
                </button>
                <Link
                  to="/"
                  className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors text-center"
                >
                  Cancel
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
