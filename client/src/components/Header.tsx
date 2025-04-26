import { Link } from "wouter";

const Header = () => {
  return (
    <header className="py-4 px-6 md:px-10 bg-white shadow-soft">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/">
          <a className="flex items-center">
            <div className="h-10 w-10 bg-gradient-to-r from-lavender to-teal rounded-full flex items-center justify-center">
              <i className="fa-solid fa-heart text-white text-lg"></i>
            </div>
            <h1 className="ml-3 text-2xl font-poppins font-semibold bg-gradient-to-r from-lavender to-teal bg-clip-text text-transparent">Memoria</h1>
          </a>
        </Link>
        <nav>
          <ul className="flex gap-8">
            <li><a href="#learn" className="text-neutral-medium hover:text-lavender transition-colors">How it Works</a></li>
            <li><a href="#" className="text-neutral-medium hover:text-lavender transition-colors">Support</a></li>
            <li><a href="#" className="text-neutral-medium hover:text-lavender transition-colors">About</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
