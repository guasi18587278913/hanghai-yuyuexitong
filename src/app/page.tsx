import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F0FCF9] text-[#004D40]">
      <header className="absolute top-8 left-8">
        <h1 className="text-xl font-bold">生财有术</h1>
      </header>
      
      <main className="text-center">
        <div className="mb-4">
          <span className="inline-block bg-yellow-200 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full">
            内部专用
          </span>
        </div>
        <h2 className="text-5xl font-extrabold mb-3">
          深海圈・YouTube Shorts 训练营
        </h2>
        <p className="text-lg text-gray-600 mb-10">
          两步预约・30秒搞定和教练的1v1
        </p>
        <div className="flex justify-center gap-4">
          <Link 
            href="/booking"
            className="bg-[#10B981] text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-emerald-600 transition-colors"
          >
            我是学员, 立即预约
          </Link>
          <Link 
            href="/coach/availability"
            className="bg-yellow-400 text-gray-900 font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-yellow-500 transition-colors"
          >
            我是教练
          </Link>
          <Link
            href="/admin"
            className="bg-white text-gray-800 font-semibold py-3 px-8 rounded-lg border border-gray-300 shadow-md hover:bg-gray-100 transition-colors"
          >
            我是管理员
          </Link>
        </div>
      </main>

      <footer className="absolute bottom-8 left-8">
        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold text-xl">
          N
        </div>
      </footer>
    </div>
  );
} 