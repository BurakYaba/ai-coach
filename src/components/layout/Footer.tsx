import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="font-bold text-xl">Fluenta</span>
            </div>
            <p className="text-gray-400 mb-4">
              AI destekli İngilizce öğrenme platformu
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Destek</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/sss" className="hover:text-white">
                  SSS
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="hover:text-white">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Kaynaklar</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/blog" className="hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/basari-hikayeleri" className="hover:text-white">
                  Başarı Hikayeleri
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/fiyatlandirma" className="hover:text-white">
                  Fiyatlandırma
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white">
                  Ücretsiz Kayıt
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white">
                  Giriş Yap
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Fluenta. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
