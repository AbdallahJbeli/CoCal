import React from "react";
import { Egg, Coffee, Menu } from "lucide-react";
import "../assets/css/App.css";

const Navabar = () => {
  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm">
      <header className="border-b border-green-600 px-4 shadow-sm">
        <div className="mx-auto flex max-w-screen-lg flex-col py-3 sm:flex-row sm:items-center sm:justify-between">
          <a
            className="flex items-center text-2xl font-bold hover:opacity-90 transition-opacity"
            href="/"
          >
            <span className="flex items-center mr-2">
              <Egg className="h-7 w-7 text-green-600" />
              <Coffee className="h-7 w-7 text-amber-600 ml-1" />
            </span>
            <span className="text-amber-800">
              Co<span className="text-green-600">Cal</span>
            </span>
          </a>

          <input className="peer hidden" type="checkbox" id="navbar-open" />
          <label
            className="absolute right-3 top-4 cursor-pointer sm:hidden"
            htmlFor="navbar-open"
          >
            <span className="sr-only">Toggle Navigation</span>
            <Menu className="h-7 w-7 text-gray-600 hover:text-green-600 transition-colors" />
          </label>

          <nav
            aria-label="Header Navigation"
            className="peer-checked:flex hidden pb-4 sm:flex sm:pb-0"
          >
            <ul className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <li>
                <a
                  className="text-gray-600 hover:text-green-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50 sm:hover:bg-transparent"
                  href="/"
                >
                  Accueil
                </a>
              </li>

              <li>
                <a
                  className="text-gray-600 hover:text-green-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50 sm:hover:bg-transparent"
                  href="#testimonials"
                >
                  Témoignages
                </a>
              </li>
              <li>
                <a
                  className="text-gray-600 hover:text-green-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50 sm:hover:bg-transparent"
                  href="#mission"
                >
                  À propos
                </a>
              </li>
              <li>
                <a
                  className="text-gray-600 hover:text-green-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50 sm:hover:bg-transparent"
                  href="#contact"
                >
                  Contact
                </a>
              </li>
              <li className="mt-2 sm:mt-0">
                <a
                  className="inline-block rounded-full border-2 border-green-600 px-6 py-1.5 font-medium text-green-600 hover:bg-green-600 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  href="/login"
                >
                  Connexion
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </div>
  );
};

export default Navabar;
