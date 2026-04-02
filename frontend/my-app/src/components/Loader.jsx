// src/components/Loader.jsx
export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-green-900/40" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-500 animate-spin" />
      </div>
      <p className="text-gray-500 text-sm animate-pulse">Loading...</p>
    </div>
  )
}
