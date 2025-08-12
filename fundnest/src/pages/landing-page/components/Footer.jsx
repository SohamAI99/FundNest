import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date()?.getFullYear();

  const footerSections = [
    {
      title: 'Platform',
      links: [
        { label: 'For Startups', href: '/user-registration?role=startup' },
        { label: 'For Investors', href: '/user-registration?role=investor' },
        { label: 'How It Works', href: '#how-it-works' },
        { label: 'Success Stories', href: '#testimonials' },
        { label: 'Pricing', href: '#pricing' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Help Center', href: '#help' },
        { label: 'API Documentation', href: '#api' },
        { label: 'Blog', href: '#blog' },
        { label: 'Webinars', href: '#webinars' },
        { label: 'Templates', href: '#templates' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '#about' },
        { label: 'Careers', href: '#careers' },
        { label: 'Press', href: '#press' },
        { label: 'Partners', href: '#partners' },
        { label: 'Contact', href: '#contact' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '#privacy' },
        { label: 'Terms of Service', href: '#terms' },
        { label: 'Cookie Policy', href: '#cookies' },
        { label: 'Security', href: '#security' },
        { label: 'Compliance', href: '#compliance' }
      ]
    }
  ];

  const socialLinks = [
    { name: 'Twitter', icon: 'Twitter', href: '#twitter' },
    { name: 'LinkedIn', icon: 'Linkedin', href: '#linkedin' },
    { name: 'Facebook', icon: 'Facebook', href: '#facebook' },
    { name: 'Instagram', icon: 'Instagram', href: '#instagram' },
    { name: 'YouTube', icon: 'Youtube', href: '#youtube' }
  ];

  const handleLinkClick = (href) => {
    if (href?.startsWith('/')) {
      navigate(href);
    } else if (href?.startsWith('#')) {
      // Smooth scroll to section (placeholder for future implementation)
      console.log(`Scroll to section: ${href}`);
    } else {
      window.open(href, '_blank', 'noopener noreferrer');
    }
  };

  const handleLogoClick = () => {
    navigate('/landing-page');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-primary text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div 
              className="flex items-center space-x-2 mb-6 cursor-pointer group"
              onClick={handleLogoClick}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-secondary rounded-lg flex items-center justify-center group-hover:scale-110 transition-smooth">
                <Icon name="TrendingUp" size={24} color="white" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold">FundNest</span>
            </div>
            
            <p className="text-white/80 mb-6 leading-relaxed max-w-md">
              Connecting promising startups with smart investors through AI-powered matching. 
              Build the future of funding with our verified ecosystem.
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks?.map((social) => (
                <button
                  key={social?.name}
                  onClick={() => handleLinkClick(social?.href)}
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-smooth focus-ring"
                  aria-label={`Follow us on ${social?.name}`}
                >
                  <Icon name={social?.icon} size={18} color="white" />
                </button>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections?.map((section) => (
            <div key={section?.title}>
              <h3 className="font-semibold text-lg mb-4">{section?.title}</h3>
              <ul className="space-y-3">
                {section?.links?.map((link) => (
                  <li key={link?.label}>
                    <button
                      onClick={() => handleLinkClick(link?.href)}
                      className="text-white/70 hover:text-white transition-smooth text-left"
                    >
                      {link?.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Stay Updated</h3>
              <p className="text-white/70">Get the latest funding opportunities and platform updates.</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-4 py-2">
                <Icon name="Mail" size={16} color="white" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-transparent text-white placeholder:text-white/60 border-none outline-none w-64"
                />
              </div>
              <button className="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-lg font-medium transition-smooth focus-ring">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Bar */}
      <div className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-6 text-sm text-white/70">
              <span>© {currentYear} FundNest. All rights reserved.</span>
              <span>•</span>
              <span>Made with ❤️ for entrepreneurs</span>
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2 text-white/70">
                <Icon name="Shield" size={14} />
                <span>SOC 2 Compliant</span>
              </div>
              <div className="flex items-center space-x-2 text-white/70">
                <Icon name="Lock" size={14} />
                <span>256-bit SSL</span>
              </div>
              <div className="flex items-center space-x-2 text-white/70">
                <Icon name="CheckCircle" size={14} />
                <span>GDPR Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;