import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { HeaderProps } from "@/types";
import Login from "./auth/Login";

// Header component to display the site navigation bar
const Header: React.FC<HeaderProps> = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const currentPage = router.pathname;

  const genericHamburgerLine =
    "h-1 w-6 my-0.5 rounded-full transition-all duration-300 bg-gray-900 dark:bg-gray-100";

  const links = [
    { path: "/", label: "Home" },
    { path: "/profile", label: "Profile" },
    { path: "/admin", label: "Admin" },
    { path: "/leaderboard", label: "Leaderboard" },
    { path: "/login", label: "Login" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div>
      <nav className="fixed-top w-full">
        <div className="px-8 mx-auto max-w-7xl transition-all duration-300 ">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                className="text-gray-900 ml-4 md:ml-0 dark:text-gray-100  hover:text-gray-900 hover:opacity-80 px-3 py-2 rounded-md text-sm font-medium"
                href="/"
              >
                Wrap Dapp
              </Link>
              <div className="hidden md:block">
                <div className="flex items-baseline ml-10 space-x-4">
                  {links.map((link) => (
                    <Link
                      key={link.path}
                      className={`${
                        currentPage === link.path
                          ? "text-gray-900 dark:text-gray-100"
                          : "text-gray-300 dark:text-gray-400"
                      } hover:text-gray-900 dark:hover:text-gray-100 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300`}
                      href={link.path}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex ml-auto">
              <Login />
            </div>
            <div className="flex -mr-2 md:hidden">
              <button
                className="flex flex-col h-10 w-10 rounded justify-center items-center group"
                onClick={toggleMobileMenu}
              >
                <div
                  className={`${genericHamburgerLine} ${
                    isMobileMenuOpen
                      ? "rotate-45 translate-y-1 opacity group-hover:opacity-100 mt-3"
                      : "opacity group-hover:opacity-100"
                  }`}
                />
                <div
                  className={`${genericHamburgerLine} ${
                    isMobileMenuOpen
                      ? "opacity-0"
                      : "opacity group-hover:opacity-100"
                  }`}
                />
                <div
                  className={`${genericHamburgerLine} ${
                    isMobileMenuOpen
                      ? "-rotate-45 -translate-y-3 opacity group-hover:opacity-100"
                      : "opacity group-hover:opacity-100"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Add the mobile menu */}
      <div
        className={`${
          isMobileMenuOpen ? "block" : "hidden"
        } md:hidden fixed mt-16 inset-0 z-50`}
        // close the menu on click
      >
        <div className="absolute top-0 left-0 w-full h-screen bg-white ">
          <div className="p-4">
            {links.map((link) => (
              <Link
                key={link.path}
                onClick={toggleMobileMenu}
                className={`${
                  currentPage === link.path
                    ? "text-gray-900 dark:text-gray-100"
                    : "text-gray-400 dark:text-gray-400"
                } block mb-4 px-3 py-2 rounded-md text-base font-medium transition-all duration-300`}
                href={link.path}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
