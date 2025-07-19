import Image from "next/image";

// Modern animated background component
const AuthBackgroundGradient = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Main gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-purple-900/85 to-indigo-900/90"></div>

      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-1/2 w-[60rem] h-[60rem] -translate-x-1/2 -translate-y-1/2 opacity-30">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 blur-3xl animate-pulse"></div>
      </div>
      <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] opacity-20">
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400 via-blue-400 to-purple-400 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Floating elements */}
      <div className="hidden lg:block absolute top-1/4 left-10 w-24 h-24 rounded-full bg-blue-400/20 blur-xl animate-float"></div>
      <div
        className="hidden lg:block absolute bottom-1/3 right-10 w-20 h-20 rounded-full bg-purple-400/20 blur-xl animate-float"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="hidden lg:block absolute top-2/3 right-1/4 w-16 h-16 rounded-full bg-indigo-400/20 blur-xl animate-float"
        style={{ animationDelay: "2s" }}
      ></div>
    </div>
  );
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Background elements */}
      <AuthBackgroundGradient />

      {/* Header with logo */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-center sm:justify-start">
          <div className="flex items-center space-x-2">
            <div className="w-14 h-14 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Fluenta"
                width={64}
                height={64}
                className="w-12 h-14"
              />
            </div>
            <h1 className="text-2xl font-bold text-white">Fluenta</h1>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="relative z-10 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md">
          {/* Modern card container */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
