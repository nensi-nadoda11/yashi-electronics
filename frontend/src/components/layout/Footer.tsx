import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { quickLinks, supportLinks } from "../../data/mock-data";
import { Container } from "../ui/Container";

export function Footer() {
  return (
    <footer
      id="footer"
      className="mt-12 border-t border-slate-200 bg-slate-950 text-slate-200"
    >
      <Container className="py-12">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.8fr_0.8fr_1fr]">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-300">
              Yashi Electronics
            </p>
            <h2 className="text-2xl font-bold text-white">
              Clean electronics shopping with a simple, focused experience.
            </h2>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <div className="grid gap-2 text-sm text-slate-400">
              {quickLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">
              Customer Support
            </h3>
            <div className="grid gap-2 text-sm text-slate-400">
              {supportLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Contact</h3>
            <div className="grid gap-3 text-sm text-slate-400">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-brand-300" />
                <span>+91 98XXX XXXXX</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-brand-300" />
                <span>support@yashielectronics.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-brand-300" />
                <span>Mon-Sat, 10:00 AM to 7:00 PM</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-brand-300" />
                <span>
                  GIDC Electronic Estate, Sector 26, Gandhinagar, Gujarat
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-5 text-sm text-slate-500">
          <p>&copy; 2026 Yashi Electronics. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}
