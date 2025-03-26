import { FacebookIcon, Instagram, Twitter } from "lucide-react";
import Logo from "./Logo";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-background shadow-md text-sm">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
          {/* Logo & Copyright */}
          <div className="space-y-3 flex flex-col items-center md:items-start">
            <Logo />
            <p className="text-muted-foreground dark:text-muted-foreground">
              &copy; {new Date().getFullYear()} MindHeal. <br /> All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground dark:text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              {["Home", "Services", "Psychologists", "About Us", "Contact"].map((item, index) => (
                <li key={index}>
                  <Link
                    to={`/${item.toLowerCase().replace(/\s+/g, "")}`}
                    className="text-muted-foreground dark:text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground dark:text-foreground">Support</h3>
            <ul className="space-y-2">
              {["Help Center", "Privacy Policy", "Terms of Service"].map((item, index) => (
                <li key={index}>
                  <Link
                    to="/"
                    className="text-muted-foreground dark:text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground dark:text-foreground">Contact</h3>
            <ul className="space-y-2">
              <li className="text-muted-foreground dark:text-muted-foreground">Email: contact@mindheal.com</li>
              <li className="text-muted-foreground dark:text-muted-foreground">Phone: +91 9876543210</li>
              <li className="flex justify-center md:justify-start space-x-4 mt-2">
                <Link to="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
                  <FacebookIcon size={20} />
                </Link>
                <Link to="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">
                  <Instagram size={20} />
                </Link>
                <Link to="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                  <Twitter size={20} />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
