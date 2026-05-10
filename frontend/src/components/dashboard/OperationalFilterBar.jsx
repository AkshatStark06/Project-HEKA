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
    <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Search Patient
          </label>

          <input
            type="text"
            placeholder="Name or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Risk Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Risk Level
          </label>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="moderate">Moderate</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Sort By
          </label>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
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
          <label className="flex items-center gap-2 text-sm text-slate-700">
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
          <label className="flex items-center gap-2 text-sm text-slate-700">
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