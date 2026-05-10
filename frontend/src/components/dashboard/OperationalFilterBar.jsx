export default function OperationalFilterBar({
  searchTerm,
  setSearchTerm,
  riskFilter,
  setRiskFilter,
  showConversionRisk,
  setShowConversionRisk,
  showDelayedProcedure,
  setShowDelayedProcedure,
  sortBy,
  setSortBy,
}) {
  return (
    <div 
      className="
        border-b border-slate-800
        bg-slate-900
        px-6 py-5
      "
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">

        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">
            Search Patient
          </label>

          <input
            type="text"
            placeholder="Name or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="
              w-full rounded-xl
              border border-slate-700
              bg-slate-950
              px-4 py-3
              text-sm text-white
              placeholder:text-slate-500
              focus:outline-none
              focus:ring-2 focus:ring-blue-500/40
            "
          />
        </div>

        {/* Risk Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">
            Risk Level
          </label>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="
              w-full rounded-xl
              border border-slate-700
              bg-slate-950
              px-4 py-3
              text-sm text-white
              focus:outline-none
              focus:ring-2 focus:ring-blue-500/40
            "
          >
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="moderate">Moderate</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">
            Sort By
          </label>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="
              w-full rounded-xl
              border border-slate-700
              bg-slate-950
              px-4 py-3
              text-sm text-white
              focus:outline-none
              focus:ring-2 focus:ring-blue-500/40
            "
          >
            <option value="highest_risk">
              Highest Risk Score
            </option>

            <option value="lowest_risk">
              Lowest Risk Score
            </option>
          </select>
        </div>

        {/* Conversion Risk */}
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={showConversionRisk}
              onChange={(e) =>
                setShowConversionRisk(e.target.checked)
              }
            />

            Conversion Risk Only
          </label>
        </div>

        {/* Delayed Procedure */}
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={showDelayedProcedure}
              onChange={(e) =>
                setShowDelayedProcedure(e.target.checked)
              }
            />

            Delayed Procedure Only
          </label>
        </div>
      </div>
    </div>
  );
}