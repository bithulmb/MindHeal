import { Brain, FacebookIcon, Instagram, Twitter } from "lucide-react";
import Logo from "./Logo";
import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="bg-background shadow-md text-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-2"> 
            <Logo/>
            <p className="text-muted-foreground dark:text-muted-foreground">
            &copy; {new Date().getFullYear()} MindHeal.<br/> All rights reserved.
          </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground dark:text-foreground ">
              Quick Links
            </h3>
            <ul className="">
              <li>
                <Link
                  to="/home" 
                  className="text-muted-foreground dark:text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/services" 
                  className="text-muted-foreground dark:text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link 
                  to="/psychologists" 
                  className="text-muted-foreground dark:text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors"
                >
                  Psychologists
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-muted-foreground dark:text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-muted-foreground dark:text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground dark:text-foreground">
              Support
            </h3>
            <ul className="">
              <li>
                <Link 
                  to="/" 
                  className="text-muted-foreground dark:text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link 
                  to="/" 
                  className="text-muted-foreground dark:text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/" 
                  className="text-muted-foreground dark:text-muted-foreground hover:text-primary dark:hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground dark:text-foreground">
              Contact
            </h3>
            <ul className="space">
              <li className="text-muted-foreground dark:text-muted-foreground">
                Email: contact@mindheal.com
              </li>
              <li className="text-muted-foreground dark:text-muted-foreground">
                Phone: +919876543210
              </li>
              <li className="flex space-x-4 mt-2 text-muted-foreground dark:text-muted-foreground">
          <Link
            to="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500"
          >
            <FacebookIcon size={20} />
          </Link>
          <Link
            to="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-500"
          >
            <Instagram size={20} />
          </Link>
          <Link
            to="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400"
          >
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