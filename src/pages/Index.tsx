import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';

type Category = 'Мужское' | 'Женское' | 'Другое';

interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  exclusive: boolean;
  limited?: number;
  image: string;
  sizes?: string[];
  colors?: string[];
}

const products: Product[] = [
  { id: 'm1', name: 'Футболка Классика', price: 5000, category: 'Мужское', exclusive: false, image: '/placeholder.svg', sizes: ['S', 'M', 'L', 'XL'], colors: ['Черный', 'Белый'] },
  { id: 'm2', name: 'Футболка Премиум', price: 5000, category: 'Мужское', exclusive: false, image: '/placeholder.svg', sizes: ['S', 'M', 'L', 'XL'], colors: ['Черный'] },
  { id: 'm3', name: 'Футболка Дизайн', price: 5000, category: 'Мужское', exclusive: false, image: '/placeholder.svg', sizes: ['M', 'L', 'XL'], colors: ['Белый'] },
  { id: 'm4', name: 'Часы BASTET Empire Times', price: 5000, category: 'Мужское', exclusive: false, image: 'https://cdn.poehali.dev/files/Screenshot_20260102-211916.png', colors: ['Черный'] },
  { id: 'm5', name: 'Худи с капюшоном', price: 15000, category: 'Мужское', exclusive: true, image: '/placeholder.svg', sizes: ['M', 'L', 'XL'], colors: ['Черный'] },
  { id: 'm6', name: 'Футболка Лимитед', price: 5000, category: 'Мужское', exclusive: true, limited: 50, image: '/placeholder.svg', sizes: ['S', 'M', 'L', 'XL'], colors: ['Черный', 'Белый'] },
  { id: 'm7', name: 'Джинсы Классик', price: 100000, category: 'Мужское', exclusive: false, image: '/placeholder.svg', sizes: ['30', '32', '34', '36'], colors: ['Синий'] },
  { id: 'm8', name: 'Полотенце с логотипом', price: 2000, category: 'Мужское', exclusive: false, image: '/placeholder.svg', colors: ['Белый'] },
  { id: 'w1', name: 'Худи Ёлочка', price: 15000, category: 'Женское', exclusive: true, image: 'https://cdn.poehali.dev/projects/7738232e-9147-4f64-ba2b-4ee1f1b8edb7/files/e1ef76f1-bb53-4d88-ac4f-362d068bd960.jpg', sizes: ['XS', 'S', 'M', 'L'], colors: ['Черный'] },
  { id: 'w2', name: 'Платье Эксклюзив', price: 100000, category: 'Женское', exclusive: true, image: 'https://cdn.poehali.dev/files/Screenshot_20260103-133333.png', sizes: ['XS', 'S', 'M'], colors: ['Черный', 'Белый'] },
  { id: 'w3', name: 'Часы Премиум', price: 100000, category: 'Женское', exclusive: true, image: '/placeholder.svg', colors: ['Серебро', 'Золото'] },
  { id: 'o1', name: 'Шоппер', price: 2500, category: 'Другое', exclusive: false, image: '/placeholder.svg', colors: ['Черный', 'Белый'] },
  { id: 'o2', name: 'Брелок Стандарт', price: 500, category: 'Другое', exclusive: false, image: '/placeholder.svg', colors: ['Черный'] },
  { id: 'o3', name: 'Брелок Баста', price: 5000, category: 'Другое', exclusive: true, image: '/placeholder.svg', colors: ['Золото'] },
  { id: 'set1', name: 'Набор Стандарт', price: 20000, category: 'Другое', exclusive: false, image: '/placeholder.svg', colors: ['Микс'] },
  { id: 'set2', name: 'Набор Премиум', price: 50000, category: 'Другое', exclusive: true, image: '/placeholder.svg', colors: ['Микс'] },
];

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Мужское');
  const [showExclusive, setShowExclusive] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [sortBy, setSortBy] = useState('price-asc');
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(p => p.category === selectedCategory);
    
    if (showExclusive) {
      filtered = filtered.filter(p => p.exclusive);
    }
    
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    
    if (searchQuery) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    
    filtered.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
    
    return filtered;
  }, [selectedCategory, showExclusive, priceRange, sortBy, searchQuery]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-black sticky top-0 bg-white z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">EXCLUSIVE STORE</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Icon name="ShoppingBag" size={20} />
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-black text-white">
                    {cart.length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Корзина</SheetTitle>
              </SheetHeader>
              <div className="mt-8 space-y-4">
                {cart.length === 0 ? (
                  <p className="text-muted-foreground">Корзина пуста</p>
                ) : (
                  <>
                    {cart.map(item => (
                      <div key={item.product.id} className="flex items-center justify-between border-b pb-4">
                        <div className="flex-1">
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">{item.product.price.toLocaleString()} ₽ × {item.quantity}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    ))}
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-semibold">Итого:</span>
                        <span className="text-xl font-bold">{cartTotal.toLocaleString()} ₽</span>
                      </div>
                      <Button className="w-full bg-black text-white hover:bg-gray-900">
                        Оформить заказ
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
              <div>
                <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide">Категория</h3>
                <div className="space-y-2">
                  {(['Мужское', 'Женское', 'Другое'] as Category[]).map(cat => (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? 'default' : 'ghost'}
                      className={`w-full justify-start ${selectedCategory === cat ? 'bg-black text-white' : ''}`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide">Фильтры</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="exclusive"
                      checked={showExclusive}
                      onChange={(e) => setShowExclusive(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="exclusive" className="text-sm cursor-pointer">
                      Только эксклюзив
                    </label>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Цена: {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()} ₽
                    </label>
                    <Slider
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      min={0}
                      max={100000}
                      step={1000}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Сортировка</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="price-asc">Цена: по возрастанию</SelectItem>
                        <SelectItem value="price-desc">Цена: по убыванию</SelectItem>
                        <SelectItem value="name">По названию</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Input
                      placeholder="Поиск товаров..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">{selectedCategory}</h2>
              <p className="text-muted-foreground">Найдено товаров: {filteredProducts.length}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <Card key={product.id} className="group overflow-hidden border border-black hover:shadow-lg transition-all">
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.exclusive && (
                      <Badge className="absolute top-2 left-2 bg-black text-white">
                        ЭКСКЛЮЗИВ
                      </Badge>
                    )}
                    {product.limited && (
                      <Badge className="absolute top-2 right-2 bg-white text-black border border-black">
                        Осталось: {product.limited}
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">{product.name}</h3>
                    <p className="text-2xl font-bold mb-3">{product.price.toLocaleString()} ₽</p>
                    {product.sizes && (
                      <p className="text-xs text-muted-foreground mb-2">
                        Размеры: {product.sizes.join(', ')}
                      </p>
                    )}
                    {product.colors && (
                      <p className="text-xs text-muted-foreground mb-3">
                        Цвета: {product.colors.join(', ')}
                      </p>
                    )}
                    <Button
                      className="w-full bg-black text-white hover:bg-gray-900"
                      onClick={() => addToCart(product)}
                    >
                      <Icon name="Plus" size={16} className="mr-2" />
                      В корзину
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <Icon name="SearchX" size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg text-muted-foreground">Товары не найдены</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}