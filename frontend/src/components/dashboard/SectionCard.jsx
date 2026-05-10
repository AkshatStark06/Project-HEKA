export default function SectionCard({
  title,
  subtitle,
  children,
  rightContent,
}) {
  return (
    <div
      className="
        rounded-2xl
        border border-slate-800
        bg-slate-900/90
        shadow-xl shadow-black/20
        p-6
      "
    >
      <div className="flex items-start justify-between mb-6">

        <div>
          <h2 className="text-2xl font-semibold text-white">
            {title}
          </h2>

          {subtitle && (
            <p className="text-sm text-slate-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {rightContent && (
          <div>
            {rightContent}
          </div>
        )}

      </div>

      <div>
        {children}
      </div>
    </div>
  );
}