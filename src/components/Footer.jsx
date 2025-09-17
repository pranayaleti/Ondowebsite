import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-20 border-t py-10 border-neutral-700 bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand/Description/Social */}
        <div>
          <h3 className="text-2xl font-bold mb-4 text-white">OnDo</h3>
          <p className="mb-6 text-neutral-300">
            We create stunning, high-performance websites and digital solutions that help businesses grow online.
          </p>
          <div className="flex space-x-4 text-2xl text-neutral-400">
            <Link to="#" aria-label="Facebook"><FaFacebookF /></Link>
            <Link to="#" aria-label="Twitter"><FaTwitter /></Link>
            <Link to="#" aria-label="Instagram"><FaInstagram /></Link>
            <Link to="#" aria-label="LinkedIn"><FaLinkedinIn /></Link>
          </div>
        </div>
        {/* Company */}
        <div>
          <h3 className="font-bold mb-4 text-white">Company</h3>
          <ul className="space-y-2 text-neutral-300">
            <li><Link to="#">About</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="#">Work</Link></li>
            <li><Link to="#">Careers</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        {/* Services */}
        <div>
          <h3 className="font-bold mb-4 text-white">Services</h3>
          <ul className="space-y-2 text-neutral-300">
            <li><Link to="/services">Web Design</Link></li>
            <li><Link to="/services">Web Development</Link></li>
            <li><Link to="/services">E-commerce</Link></li>
            <li><Link to="/services">UI/UX Design</Link></li>
            <li><Link to="/services">Digital Marketing</Link></li>
          </ul>
        </div>
        {/* Subscribe */}
        <div>
          <h3 className="font-bold mb-4 text-white">Subscribe</h3>
          <p className="mb-4 text-neutral-300">Subscribe to our newsletter to receive updates and insights on web design and development.</p>
          <form className="flex flex-col space-y-3">
            <input
              type="email"
              placeholder="Your email address"
              className="rounded-md bg-neutral-800 text-white border border-neutral-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-neutral-400"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-orange-500 to-orange-800 text-white font-semibold py-2 rounded-md"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center mt-10 text-neutral-400 text-sm border-t border-neutral-700 pt-6">
        <div>© {new Date().getFullYear()} <span className="text-orange-500">OndoSoft</span>. All rights reserved.</div>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <Link to="#">Privacy Policy</Link>
          <Link to="#">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
