export default function SectionCard({
  title,
  subtitle,
  children,
  rightContent,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">

      <div className="flex items-start justify-between mb-5">

        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {title}
          </h2>

          {subtitle && (
            <p className="text-sm text-slate-500 mt-1">
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