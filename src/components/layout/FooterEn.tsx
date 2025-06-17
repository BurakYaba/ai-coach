import Link from "next/link";

export default function FooterEn() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="font-bold text-xl">Fluenta</span>
            </div>
            <p className="text-gray-400 mb-4">
              AI-powered English learning platform
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/en/faq" className="hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/en/contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/en/blog" className="hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/en/success-stories" className="hover:text-white">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/en/pricing" className="hover:text-white">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white">
                  Free Sign Up
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white">
                  Log In
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Fluenta. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
