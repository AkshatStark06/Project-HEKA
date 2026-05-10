const SectionCard = ({ title, children }) => {
  return (
    <div className="bg-white rounded-xl shadow p-5 mb-6">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2">
        {title}
      </h2>

      {children}
    </div>
  )
}

export default SectionCard