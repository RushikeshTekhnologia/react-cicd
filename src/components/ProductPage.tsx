import { useState, useEffect } from 'react';
import axios from 'axios';
import shoesImage from '../assets/images/shoeHD.png';
import bottleImage from '../assets/images/bottle.png';
import boxImage from '../assets/images/headphones.png';
import shirtImage from '../assets/images/shirt.webp';
import coffeeMugImage from '../assets/images/tumbler.webp';
import bag from '../assets/images/bag.jpg';
import lamp from '../assets/images/lamp.jpg';
import './ProductPage.css';

const STOREFRONT_PRODUCTS = [
    { id: 'SHOES-001', name: 'Shoes', description: 'Comfortable daily sneakers.', price: '$79', image: shoesImage },
    { id: 'BOTTLE-001', name: 'Bottle', description: 'Reusable bottle for travel.', price: '$24', image: bottleImage },
    { id: 'BOX-001', name: 'Box', description: 'Sturdy branded box.', price: '$24', image: boxImage },
    { id: 'SHIRT-001', name: 'Shirt', description: 'Premium custom t-shirt.', price: '$24', image: shirtImage },
    { id: 'COFFEE-MUG-001', name: 'Coffee Mug', description: 'Custom coffee tumbler.', price: '$24', image: coffeeMugImage },
    { id: 'BAG-001', name: 'Bag-hd', description: 'School Bag.', price: '$24', image: bag },
    { id: 'LAMP-001', name: 'Lamp-hd', description: 'lamp.', price: '$24', image: lamp },
    { id: 'BAG-002', name: 'Bag-8k', description: 'School Bag.', price: '$24', image: bag },
    { id: 'LAMP-002', name: 'Lamp-8k', description: 'lamp.', price: '$24', image: lamp },
    { id: 'MULTBAG-001', name: 'multicolorbag-8k', description: 'bag.', price: '$24', image: lamp },
];

// const EMBED_BASE_URL = 'http://localhost:5173/embed';
// const CLIENT_SLUG = 'local-store';
// const API_BASE_URL = 'http://localhost:8000';


const EMBED_BASE_URL = 'http://144.126.132.91/embed';
const CLIENT_SLUG = 'local-store';   // ⚠️ verify this matches your Django client slug
const API_BASE_URL = 'http://144.126.132.91:8000';


const ProductPage = () => {
    const [tokenMap, setTokenMap] = useState<Record<string, string>>({});
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    const [finishedDesign, setFinishedDesign] = useState<any>(null);

    // ─── Step 1: On load, fetch all products from Django and build the token map ───
    useEffect(() => {
        const loadProducts = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/products/?client=${CLIENT_SLUG}`);
                const data = response.data as { external_product_id: string; embed_token: string }[];
                const map: Record<string, string> = {};

                data.forEach((p) => {
                    if (p.external_product_id && p.embed_token) {
                        map[p.external_product_id] = p.embed_token;
                    }
                });

                setTokenMap(map);
            } catch (err) {
                console.error('Failed to fetch embed tokens:', err);
            }
        };

        loadProducts();
    }, []);

    // ─── Step 2: Listen for the popup sending back the finished design ───
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.event === 'DESIGN_COMPLETE') {
                console.log('Design received from popup:', event.data);
                setFinishedDesign(event.data);
                alert('Design added to cart!');
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    // ─── Step 3: Open the customizer popup using the dynamically fetched token ───
    const openCustomizer = (externalProductId: string) => {
        const embedToken = tokenMap[externalProductId];
        if (!embedToken) {
            alert('This product is not yet configured for 3D customization.');
            return;
        }
        const url = `${EMBED_BASE_URL}/${encodeURIComponent(CLIENT_SLUG)}?embed_token=${embedToken}`;
        const width = 1200, height = 800;
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;
        window.open(url, '3DDesigner', `width=${width},height=${height},left=${left},top=${top}`);
    };

    return (
        <main className="product-page">
            <section className="product-grid">
                {STOREFRONT_PRODUCTS.map((product) => {
                    const hasCustomizer = Boolean(tokenMap[product.id]);
                    return (
                        <article key={product.id} className="product-card">
                            {/* Fixed-size image container */}
                            <div className="product-card__image-wrapper">
                                <img
                                    className="product-card__image"
                                    src={product.image}
                                    alt={product.name}
                                />
                            </div>

                            <div className="product-card__content">
                                <h2>{product.name}</h2>
                                <p>{product.description}</p>
                                <span className="product-card__price">{product.price}</span>
                            </div>

                            {hasCustomizer && (
                                <button
                                    className="button-3d"
                                    type="button"
                                    onClick={() => openCustomizer(product.id)}
                                >
                                    3D Customizer
                                </button>
                            )}
                        </article>
                    );
                })}
            </section>
        </main>
    );
};

export default ProductPage;
