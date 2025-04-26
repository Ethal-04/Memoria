import { Link } from "wouter";

const Header = () => {
  return (
    <header className="py-4 px-6 md:px-10 bg-white shadow-soft">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center">
            <div className="h-10 w-10 gradient-bg rounded-full flex items-center justify-center shadow-md">
              <i className="fa-solid fa-heart text-white text-lg"></i>
            </div>
            <h1 className="ml-3 text-2xl font-poppins font-semibold text-gradient">Memoria</h1>
          </div>
        </Link>
        <nav>
          <ul className="flex gap-6">
            <li><a href="#learn" className="text-neutral-medium hover:text-[hsl(var(--lavender))] transition-colors">How it Works</a></li>
            <li>
              <Link href="/create">
                <a className="px-5 py-2 gradient-bg text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all">
                  Create Companion
                </a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
