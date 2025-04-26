import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-neutral-light py-10 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 bg-gradient-to-r from-lavender to-teal rounded-full flex items-center justify-center">
                <i className="fa-solid fa-heart text-white text-sm"></i>
              </div>
              <h2 className="ml-2 text-xl font-poppins font-semibold bg-gradient-to-r from-lavender to-teal bg-clip-text text-transparent">Memoria</h2>
            </div>
            <p className="text-neutral-dark/80 text-sm">A compassionate space to maintain connection with loved ones through respectful technology.</p>
          </div>
          
          <div>
            <h3 className="font-poppins font-medium mb-4">Resources</h3>
            <ul className="space-y-2 text-neutral-dark/80">
              <li><a href="#" className="hover:text-lavender transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-lavender transition-colors">Grief Support</a></li>
              <li><a href="#" className="hover:text-lavender transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-lavender transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-poppins font-medium mb-4">Company</h3>
            <ul className="space-y-2 text-neutral-dark/80">
              <li><a href="#" className="hover:text-lavender transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-lavender transition-colors">Our Approach</a></li>
              <li><a href="#" className="hover:text-lavender transition-colors">Testimonials</a></li>
              <li><a href="#" className="hover:text-lavender transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-poppins font-medium mb-4">Stay Connected</h3>
            <p className="text-neutral-dark/80 text-sm mb-4">Join our newsletter for updates on how we're improving the memory companion experience.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="flex-grow py-2 px-4 bg-neutral-lightest rounded-l-lg focus:outline-none focus:ring-2 focus:ring-lavender/30" 
              />
              <button className="bg-lavender text-white px-4 rounded-r-lg">
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
        
        <div className="pt-6 border-t border-neutral-light flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-medium text-sm mb-4 md:mb-0">© {new Date().getFullYear()} Memoria. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="text-neutral-medium hover:text-lavender transition-colors">
              <i className="fa-brands fa-facebook"></i>
            </a>
            <a href="#" className="text-neutral-medium hover:text-lavender transition-colors">
              <i className="fa-brands fa-twitter"></i>
            </a>
            <a href="#" className="text-neutral-medium hover:text-lavender transition-colors">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="#" className="text-neutral-medium hover:text-lavender transition-colors">
              <i className="fa-brands fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
