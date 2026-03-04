import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-slate-200">404</h1>
        <h2 className="text-2xl font-bold text-slate-900 mt-4">Page Not Found</h2>
        <p className="text-slate-500 mt-2 mb-8">The page you are looking for does not exist or has been moved.</p>
        <Link 
          href="/"
          className="bg-red-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
