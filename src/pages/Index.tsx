import { H1, P, H2 } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { products, categories, productBundles } from "@/data/dummyData";
import { useCurrency } from "@/context/CurrencyContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import RecentlyViewedProducts from "@/components/RecentlyViewedProducts";
import ProductBundleCard from "@/components/ProductBundleCard";
import NewArrivalsFeed from "@/components/NewArrivalsFeed";
import AIProductRecommendations from "@/components/AIProductRecommendations";
import { useAuth } from "@/context/AuthContext";
import { Sparkles } from "lucide-react";

const Index = () => {
  const { formatPrice } = useCurrency();
  const { isAuthenticated } = useAuth();
  const featuredProducts = products.slice(0, 3); // Get first 3 products as featured

  const getCategoryImageUrl = (categoryName: string) => {
    const product = products.find(p => p.category === categoryName);
    return product ? product.imageUrl : 'https://via.placeholder.com/400x300?text=Category';
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center text-center bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558769132-cb1ad299b803?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 text-white p-8 max-w-4xl mx-auto">
          <H1 className="text-6xl font-extrabold mb-4 leading-tight">
            Discover Timeless Elegance
          </H1>
          <P className="text-xl mb-8">
            Curated collections for the modern individual. Experience luxury in every detail.
          </P>
          <div className="flex gap-4 justify-center">
            <Link to="/products">
              <Button size="lg" className="bg-accent-gold text-accent-gold-foreground hover:bg-accent-gold/90 text-lg px-8 py-6">
                Shop The Collection
              </Button>
            </Link>
            {isAuthenticated && (
              <Link to="/personalized">
                <Button size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white/20 text-lg px-8 py-6">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Personalized View
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="text-center space-y-8">
        <H2 className="text-4xl font-bold">Featured Products</H2>
        <P className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Handpicked selections that embody modern luxe minimalism.
        </P>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative w-full h-72 overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardHeader className="flex-grow">
                <CardTitle className="text-2xl font-semibold">{product.name}</CardTitle>
                <P className="text-sm text-muted-foreground mt-2 line-clamp-2 [&:not(:first-child)]:mt-2">
                  {product.description}
                </P>
              </CardHeader>
              <CardContent>
                <P className="text-3xl font-bold text-accent-gold [&:not(:first-child)]:mt-0">
                  {formatPrice(product.price)}
                </P>
              </CardContent>
              <CardFooter>
                <Link to={`/products/${product.id}`} className="w-full">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        <Link to="/products">
          <Button variant="outline" className="mt-8 border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-accent-gold-foreground text-lg px-8 py-6">
            View All Products
          </Button>
        </Link>
      </section>

      {/* Category Browsing Section */}
      <section className="text-center space-y-8">
        <H2 className="text-4xl font-bold">Shop by Category</H2>
        <P className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Find exactly what you're looking for.
        </P>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link to={`/products?category=${category.name}`} key={category.id}>
              <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                <div className="relative w-full h-60 overflow-hidden">
                  <img
                    src={getCategoryImageUrl(category.name)}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardHeader className="flex-grow text-center">
                  <CardTitle className="text-2xl font-semibold">{category.name}</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
        <Link to="/categories">
          <Button variant="outline" className="mt-8 border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-accent-gold-foreground text-lg px-8 py-6">
            View All Categories
          </Button>
        </Link>
      </section>

      {/* Product Bundles Section */}
      {productBundles.length > 0 && (
        <section className="text-center space-y-8">
          <H2 className="text-4xl font-bold">Special Bundles</H2>
          <P className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Curated collections at exclusive bundle prices.
          </P>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {productBundles.map((bundle) => (
              <ProductBundleCard key={bundle.id} bundle={bundle} />
            ))}
          </div>
        </section>
      )}

      {/* AI Recommendations for Authenticated Users */}
      {isAuthenticated && (
        <section>
          <AIProductRecommendations type="personalized" limit={8} title="Recommended For You" />
        </section>
      )}

      {/* New Arrivals Feed */}
      <section>
        <NewArrivalsFeed />
      </section>

      {/* Recently Viewed Section */}
      <section>
        <RecentlyViewedProducts />
      </section>
    </div>
  );
};

export default Index;