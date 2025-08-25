import { useState } from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-blue-200 flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 md:px-8 py-4 bg-white/80 backdrop-blur-md shadow-md relative z-50">
        <div className="flex items-center gap-2">
          {/* Responsive Recycle Logo */}
          <img
            src="/image.png"
            alt="Recycle Logo"
            className="w-10 h-10 md:w-12 md:h-12 object-contain"
            style={{ background: "none" }}
          />
          <span className="text-lg md:text-2xl font-bold text-green-700">
            Recyclable Waste Pickup
          </span>
        </div>
        {/* Hamburger Icon */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10"
          onClick={() => setNavOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          <span className="block w-6 h-0.5 bg-green-700 mb-1 rounded transition-all"></span>
          <span className="block w-6 h-0.5 bg-green-700 mb-1 rounded transition-all"></span>
          <span className="block w-6 h-0.5 bg-green-700 rounded transition-all"></span>
        </button>
        {/* Nav Links */}
        <div
          className={`${
            navOpen
              ? "flex flex-col fixed top-0 left-0 w-full  bg-white/95 shadow-md z-[9999] pt-20"
              : "hidden"
          } md:flex md:static md:flex-row md:bg-transparent md:shadow-none md:w-auto md:items-center gap-4 md:gap-6`}
          style={navOpen ? { minHeight: "100vh" } : {}}
        >
            <button
                className={`${
            navOpen
              ? "absolute top-10 right-10 text-gray-500 hover:text-red-500 text-3xl"
              : "hidden"
          } `}
          style={navOpen ? { minHeight: "30vh" } : {}} 
                onClick={() => setNavOpen(false)}
                aria-label="Close navigation"
              >
                &times;
              </button>
          <Link
            to="/"
            className="text-green-700 font-semibold hover:underline px-4 py-2 md:px-0 md:py-0"
            onClick={() => setNavOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/login"
            className="text-green-700 font-semibold hover:underline px-4 py-2 md:px-0 md:py-0"
            onClick={() => setNavOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/register"
            className="text-green-700 font-semibold hover:underline px-4 py-2 md:px-0 md:py-0"
            onClick={() => setNavOpen(false)}
          >
            Register
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-center flex-1 px-4 md:px-8 py-8 md:py-12 gap-8 md:gap-12">
        <div className="w-full max-w-xl">
          <h1 className="text-3xl md:text-5xl font-extrabold text-green-800 mb-6">
            Schedule Your{" "}
            <span className="text-blue-500">Recyclable Waste Pickup</span>{" "}
            Easily!
          </h1>
          <p className="text-base md:text-lg text-gray-700 mb-6">
            This platform connects residents with local recycling centers and
            startups. Schedule a pickup for your recyclable materials and help
            make your city cleaner and greener!
          </p>
          <ul className="mb-8 space-y-3 text-gray-700 text-sm md:text-base">
            <li className="flex items-center gap-2">
              <span className="text-green-600 text-xl">✔️</span>
              Request pickup for plastic, paper, glass, metal, e-waste, and more
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600 text-xl">✔️</span>
              Track your request status: pending, scheduled, or completed
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600 text-xl">✔️</span>
              Admins can manage users and update request statuses
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600 text-xl">✔️</span>
              Secure login and registration for all users
            </li>
          </ul>
          <div className="flex gap-4">
            <Link
              to="/login"
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-green-700 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-blue-600 transition"
            >
              Register
            </Link>
          </div>
        </div>
        <div className="flex-1 flex justify-center mb-6 md:mb-0">
          {/* Responsive Recycle Logo */}
          <img
            src="/image.png"
            alt="Recycling"
            className="z-1 w-48 h-48 md:w-80 md:h-80 object-contain drop-shadow-xl"
            style={{ background: "none" }}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-4 text-gray-500 text-sm bg-white/60">
        &copy; {new Date().getFullYear()} Recyclable Waste Pickup. All rights
        reserved.
      </footer>
    </div>
  );
}
