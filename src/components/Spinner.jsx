export default function Spinner({ size = "md" }) {
  const sizes = { sm: "h-6 w-6", md: "h-10 w-10", lg: "h-16 w-16" };
  return (
    <div className="flex justify-center items-center py-20">
      <div className={`animate-spin rounded-full border-t-2 border-indigo-600 border-r-2 border-gray-200 ${sizes[size]}`} />
    </div>
  );
}
