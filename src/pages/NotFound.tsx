export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col text-center p-8">
      <h1 className="text-5xl font-bold text-red-400 mb-4">Oops!</h1>
      <p className="text-xl text-gray-500 mb-6">
        Level-2 Programmer is now sleeping... 💤
      </p>
      <a
        href="/"
        className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
      >
        Wake them up → Go Home
      </a>
    </div>
  );
}
