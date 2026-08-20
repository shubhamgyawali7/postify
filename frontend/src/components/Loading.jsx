const Loading = ({ type = "grid" }) => {
  if (type === "spinner") {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin" />
        <p className="text-xs text-slate-400 font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="card rounded-xl overflow-hidden p-4 space-y-3"
        >
          <div className="w-full h-40 rounded-lg skeleton-shimmer" />
          <div className="space-y-2">
            <div className="h-4 w-3/4 rounded skeleton-shimmer" />
            <div className="h-3 w-full rounded skeleton-shimmer" />
            <div className="h-3 w-2/3 rounded skeleton-shimmer" />
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full skeleton-shimmer" />
              <div className="h-3 w-16 rounded skeleton-shimmer" />
            </div>
            <div className="h-3 w-10 rounded skeleton-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loading;
