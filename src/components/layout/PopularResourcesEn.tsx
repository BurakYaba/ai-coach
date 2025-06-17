import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PopularResourcesEn() {
  return (
    <section className="mb-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Popular Resources</h2>
        <p className="text-muted-foreground">
          Other resources that can help you
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="text-3xl mb-3">📚</div>
            <h3 className="font-semibold mb-2">Learning Guide</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Tips and strategies for effective English learning
            </p>
            <Link href="/en/blog">
              <Button variant="outline" size="sm" className="w-full">
                Explore
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold mb-2">Modules</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Explore all English learning modules and features
            </p>
            <Link href="/en/modules">
              <Button variant="outline" size="sm" className="w-full">
                View Modules
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="text-3xl mb-3">⭐</div>
            <h3 className="font-semibold mb-2">Success Stories</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Read inspiring stories from our learners
            </p>
            <Link href="/en/success-stories">
              <Button variant="outline" size="sm" className="w-full">
                Read Stories
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="text-3xl mb-3">❓</div>
            <h3 className="font-semibold mb-2">FAQ</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Find answers to frequently asked questions
            </p>
            <Link href="/en/faq">
              <Button variant="outline" size="sm" className="w-full">
                View FAQ
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
