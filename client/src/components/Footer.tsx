import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[hsl(var(--lavender)/5)] to-[hsl(var(--teal)/5)] border-t border-neutral-light py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">
            <div className="flex items-center justify-center mb-2">
              <div className="h-8 w-8 gradient-bg rounded-full flex items-center justify-center">
                <i className="fa-solid fa-heart text-white text-sm"></i>
              </div>
              <h2 className="ml-2 text-xl font-poppins font-semibold text-gradient">Memoria</h2>
            </div>
            <p className="text-neutral-dark/80 text-sm max-w-md mx-auto mb-4">
              A compassionate space to maintain connection with loved ones through AI technology.
            </p>
          </div>
          
          <div className="pt-4 border-t border-neutral-light w-full flex flex-col md:flex-row justify-center items-center">
            <p className="text-neutral-medium text-sm">© {new Date().getFullYear()} Memoria. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
