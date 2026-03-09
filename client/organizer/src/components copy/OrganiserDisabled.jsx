import { Mail, Phone, ShieldAlert, RefreshCcw } from "lucide-react";

const OrganiserDisabled = () => {
  const retryLogin = () => {
    // 🔑 Clear disabled state and reload login page
    sessionStorage.removeItem("organiserDisabled");
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 text-center space-y-5">
        <ShieldAlert className="mx-auto text-red-500" size={48} />

        <h1 className="text-2xl font-bold text-gray-800">
          Account Disabled
        </h1>

        <p className="text-gray-600">
          Your organiser account has been disabled by the platform admin.
        </p>

        <p className="text-gray-500 text-sm">
          Please contact the administrator. If your account has been reactivated,
          you can try logging in again.
        </p>

        <div className="border-t pt-4 space-y-2 text-sm text-gray-700">
          <div className="flex items-center justify-center gap-2">
            <Mail size={16} />
            <span>support@eventrix.com</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Phone size={16} />
            <span>+91 98765 43210</span>
          </div>
        </div>

        {/* 🔁 Retry Button */}
        <button
          onClick={retryLogin}
          className="mt-6 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl transition-all"
        >
          <RefreshCcw size={18} />
          Try Login Again
        </button>
      </div>
    </div>
  );
};

export default OrganiserDisabled;
