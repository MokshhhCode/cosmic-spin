import { useAuth } from '../auth/AuthContext';

export default function Login() {
    const { loginWithGoogle } = useAuth();

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[url('/assets/space-bg.jpg')] bg-cover bg-center z-50">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

            <div className="relative bg-gray-900/80 p-10 rounded-2xl border border-blue-500/50 shadow-[0_0_60px_rgba(59,130,246,0.5)] text-center max-w-md w-full animate-fade-in-up">
                <div className="mb-8">
                    <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 drop-shadow-lg tracking-wider mb-2">
                        COSMIC SPIN
                    </h1>
                    <p className="text-blue-200 tracking-widest text-sm uppercase opacity-80">
                        Galactic Arena Warfare
                    </p>
                </div>

                <div className="space-y-6">
                    <button
                        onClick={loginWithGoogle}
                        className="group w-full py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl flex items-center justify-center gap-3 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-0 group-hover:opacity-50 transition-opacity transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] duration-1000"></div>
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" className="w-6 h-6" />
                        <span>INITIALIZE PILOT PROFILE</span>
                    </button>

                    <p className="text-xs text-gray-500 mt-6 border-t border-gray-700/50 pt-4">
                        Secure connection via Firebase Auth Protocol
                    </p>
                </div>
            </div>
        </div>
    );
}
