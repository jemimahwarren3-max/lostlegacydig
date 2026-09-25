import { ProductCard } from '@/components/product-card';
import { PRODUCTS_WITH_CREATORS } from '@/lib/mock-data';
import { ProductType, PRODUCT_TYPE_LABELS } from '@/lib/types';

export const metadata = {
  title: 'Marketplace — Lost Legacy Digital',
  description: 'Digital products, physical crafts, services and experiences from Zimbabwean creators.',
};

const TYPE_TABS: { value: ProductType | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'digital', label: PRODUCT_TYPE_LABELS.digital },
  { value: 'physical', label: PRODUCT_TYPE_LABELS.physical },
  { value: 'service', label: PRODUCT_TYPE_LABELS.service },
  { value: 'experience', label: PRODUCT_TYPE_LABELS.experience },
];

export default function MarketplacePage({
  searchParams,
}: {
  searchParams: { type?: string; category?: string };
}) {
  const activeType = searchParams.type || 'all';

  let products = PRODUCTS_WITH_CREATORS;
  if (activeType !== 'all') {
    products = products.filter((p) => p.type === activeType);
  }
  if (searchParams.category) {
    products = products.filter((p) => p.category === searchParams.category);
  }

  const categories = Array.from(new Set(PRODUCTS_WITH_CREATORS.map((p) => p.category)));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-playfair text-3xl sm:text-4xl font-bold">Marketplace</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          Digital products, physical crafts, services and experiences from Zimbabwean creators,
          historians and communities.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {TYPE_TABS.map((tab) => {
          const href = tab.value === 'all' ? '/marketplace' : `/marketplace?type=${tab.value}`;
          const active = activeType === tab.value;
          return (
            <a key={tab.value} href={href}>
              <button className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${active ? 'bg-primary text-primary-foreground shadow' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}>
                {tab.label}
              </button>
            </a>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <a href={activeType === 'all' ? '/marketplace' : `/marketplace?type=${activeType}`}>
          <button className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${!searchParams.category ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
            All categories
          </button>
        </a>
        {categories.map((cat) => {
          const params = new URLSearchParams();
          if (activeType !== 'all') params.set('type', activeType);
          params.set('category', cat);
          return (
            <a key={cat} href={`/marketplace?${params.toString()}`}>
              <button className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${searchParams.category === cat ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
                {cat}
              </button>
            </a>
          );
        })}
      </div>

      {products.length === 0 ? (
        <p className="text-muted-foreground text-sm">No products match these filters yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
