import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PopularResources() {
  return (
    <section className="mb-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Popüler Kaynaklar</h2>
        <p className="text-muted-foreground">
          Size yardımcı olabilecek diğer kaynaklar
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="text-3xl mb-3">📚</div>
            <h3 className="font-semibold mb-2">Öğrenme Rehberi</h3>
            <p className="text-sm text-muted-foreground mb-4">
              İngilizce öğrenme ipuçları
            </p>
            <Link href="/blog">
              <Button variant="outline" size="sm">
                Rehberi İncele
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold mb-2">Modüller</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Öğrenme modüllerini keşfedin
            </p>
            <Link href="/moduller">
              <Button variant="outline" size="sm">
                Modülleri İncele
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="text-3xl mb-3">⭐</div>
            <h3 className="font-semibold mb-2">Başarı Hikayeleri</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Kullanıcı deneyimleri
            </p>
            <Link href="/blog">
              <Button variant="outline" size="sm">
                Hikayeleri Oku
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="text-3xl mb-3">📝</div>
            <h3 className="font-semibold mb-2">Blog</h3>
            <p className="text-sm text-muted-foreground mb-4">
              İngilizce öğrenme makaleleri
            </p>
            <Link href="/blog">
              <Button variant="outline" size="sm">
                Blog'u Ziyaret Et
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
