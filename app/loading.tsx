export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        <h2 className="text-2xl font-semibold text-gray-700 mt-4">Loading...</h2>
      </div>
    </div>
  );
}
