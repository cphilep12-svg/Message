// In-memory data store for development/demo without MySQL
// Swap this for real DB queries in production

import type { Product, Collection, Testimonial, BlogPost, Order } from "@db/schema";

let idCounters = {
  products: 4,
  collections: 6,
  testimonials: 3,
  blogPosts: 3,
  orders: 0,
  cartItems: 0,
  carts: 0,
  users: 0,
};

function nextId(type: keyof typeof idCounters) {
  return ++idCounters[type];
}

// ── Collections ────────────────────────────────────────────
export const collectionsData: Collection[] = [
  { id: 1, name: "Hoodies", slug: "hoodies", description: "Premium faith-inspired hoodies", image: "/images/category-hoodies.jpg", sortOrder: 1, createdAt: new Date() },
  { id: 2, name: "T-Shirts", slug: "tees", description: "Essential tees with purpose", image: "/images/category-tees.jpg", sortOrder: 2, createdAt: new Date() },
  { id: 3, name: "Caps", slug: "caps", description: "Headwear that speaks truth", image: "/images/category-accessories.jpg", sortOrder: 3, createdAt: new Date() },
  { id: 4, name: "Accessories", slug: "accessories", description: "Details that matter", image: "/images/category-accessories.jpg", sortOrder: 4, createdAt: new Date() },
  { id: 5, name: "Built By Faith", slug: "built-by-faith", description: "Our signature collection", image: "/images/product-hoodie-bbf.jpg", sortOrder: 5, createdAt: new Date() },
  { id: 6, name: "OMMEMA", slug: "ommema", description: "The OMMEMA series", image: "/images/product-hoodie-ommema.jpg", sortOrder: 6, createdAt: new Date() },
];

// ── Products ───────────────────────────────────────────────
export const productsData: Product[] = [
  {
    id: 1, name: "Built By Faith Hoodie", slug: "built-by-faith-hoodie",
    description: "Our signature hoodie featuring \"BUILT BY FAITH\" in large gothic-style lettering across the back, with Hebrews 11:1 in gold below. Front features a gold embroidered MESSAGE wordmark. Premium 450gsm heavyweight cotton with brushed interior. Oversized fit with drop shoulders.",
    verse: "Now faith is the substance of things hoped for, the evidence of things not seen. \u2014 Hebrews 11:1",
    price: "120.00", comparePrice: "150.00", status: "active", stockStatus: "in_stock",
    quantity: 50, isFeatured: true, images: ["/images/product-hoodie-bbf.jpg"],
    featuredImage: "/images/product-hoodie-bbf.jpg", createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 2, name: "OMMEMA Hoodie", slug: "ommema-hoodie",
    description: "The OMMEMA hoodie features our signature vertical sleeve design. \"OMMEMA\" in gold runs down the left sleeve, \"NEVER GIVE UP\" on the right sleeve, and \"I TRUST IN GOD\" embroidered on the hood tip. MESSAGE woven label at the back hem. Premium 450gsm heavyweight cotton.",
    verse: "For I am not ashamed of the gospel of Christ. \u2014 Romans 1:16",
    price: "120.00", comparePrice: null, status: "active", stockStatus: "in_stock",
    quantity: 40, isFeatured: true, images: ["/images/product-hoodie-ommema.jpg"],
    featuredImage: "/images/product-hoodie-ommema.jpg", createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 3, name: "Message Essential Tee", slug: "message-essential-tee",
    description: "The Message Essential Tee is our everyday staple. Clean minimal design with a small gold MESSAGE logo on the left chest. Premium 240gsm heavyweight cotton with a relaxed, oversized fit. The perfect foundation for any outfit.",
    verse: "Your word is a lamp to my feet and a light to my path. \u2014 Psalm 119:105",
    price: "45.00", comparePrice: null, status: "active", stockStatus: "in_stock",
    quantity: 100, isFeatured: true, images: ["/images/product-tee.jpg"],
    featuredImage: "/images/product-tee.jpg", createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 4, name: "Trust In God Cap", slug: "trust-in-god-cap",
    description: "The Trust In God Cap features clean white serif embroidery on the front panel. Gold adjustable metal strap at back. MESSAGE branded under-visor. Premium wool blend with structured 6-panel construction. One size fits most.",
    verse: "Trust in the Lord with all your heart. \u2014 Proverbs 3:5",
    price: "35.00", comparePrice: null, status: "active", stockStatus: "in_stock",
    quantity: 75, isFeatured: true, images: ["/images/product-cap.jpg"],
    featuredImage: "/images/product-cap.jpg", createdAt: new Date(), updatedAt: new Date(),
  },
];

// ── Product Variants ───────────────────────────────────────
export const variantsData = [
  { id: 1, productId: 1, size: "S", color: "Black", sku: "BBF-BLK-S", quantity: 10, createdAt: new Date() },
  { id: 2, productId: 1, size: "M", color: "Black", sku: "BBF-BLK-M", quantity: 10, createdAt: new Date() },
  { id: 3, productId: 1, size: "L", color: "Black", sku: "BBF-BLK-L", quantity: 10, createdAt: new Date() },
  { id: 4, productId: 1, size: "XL", color: "Black", sku: "BBF-BLK-XL", quantity: 10, createdAt: new Date() },
  { id: 5, productId: 1, size: "XXL", color: "Black", sku: "BBF-BLK-XXL", quantity: 10, createdAt: new Date() },
  { id: 6, productId: 2, size: "S", color: "Black", sku: "OMM-BLK-S", quantity: 8, createdAt: new Date() },
  { id: 7, productId: 2, size: "M", color: "Black", sku: "OMM-BLK-M", quantity: 8, createdAt: new Date() },
  { id: 8, productId: 2, size: "L", color: "Black", sku: "OMM-BLK-L", quantity: 8, createdAt: new Date() },
  { id: 9, productId: 2, size: "XL", color: "Black", sku: "OMM-BLK-XL", quantity: 8, createdAt: new Date() },
  { id: 10, productId: 2, size: "XXL", color: "Black", sku: "OMM-BLK-XXL", quantity: 8, createdAt: new Date() },
  { id: 11, productId: 3, size: "S", color: "Black", sku: "TEE-BLK-S", quantity: 20, createdAt: new Date() },
  { id: 12, productId: 3, size: "M", color: "Black", sku: "TEE-BLK-M", quantity: 20, createdAt: new Date() },
  { id: 13, productId: 3, size: "L", color: "Black", sku: "TEE-BLK-L", quantity: 20, createdAt: new Date() },
  { id: 14, productId: 3, size: "XL", color: "Black", sku: "TEE-BLK-XL", quantity: 20, createdAt: new Date() },
  { id: 15, productId: 3, size: "XXL", color: "Black", sku: "TEE-BLK-XXL", quantity: 20, createdAt: new Date() },
  { id: 16, productId: 4, size: "OS", color: "Black", sku: "CAP-BLK-OS", quantity: 35, createdAt: new Date() },
  { id: 17, productId: 4, size: "OS", color: "White", sku: "CAP-WHT-OS", quantity: 40, createdAt: new Date() },
];

// ── Product Collections junction ───────────────────────────
export const productCollectionsData = [
  { productId: 1, collectionId: 1 },
  { productId: 1, collectionId: 5 },
  { productId: 2, collectionId: 1 },
  { productId: 2, collectionId: 6 },
  { productId: 3, collectionId: 2 },
  { productId: 4, collectionId: 3 },
];

// ── Testimonials ───────────────────────────────────────────
export const testimonialsData: Testimonial[] = [
  { id: 1, name: "Jordan M.", email: "jordan@example.com", text: "Wearing the Built By Faith hoodie reminds me every day that my faith is my foundation. The quality is unmatched.", verse: "Hebrews 11:1", status: "approved", createdAt: new Date() },
  { id: 2, name: "Sarah K.", email: "sarah@example.com", text: "MESSAGE isn't just clothing, it's a conversation starter. I've had so many people ask about the meaning.", verse: "1 Peter 3:15", status: "approved", createdAt: new Date() },
  { id: 3, name: "David R.", email: "david@example.com", text: "The OMMEMA sleeve detail gets noticed everywhere. Proud to represent my faith through fashion.", verse: "Romans 1:16", status: "approved", createdAt: new Date() },
];

// ── Blog Posts ─────────────────────────────────────────────
export const blogPostsData: BlogPost[] = [
  {
    id: 1, title: "Built By Faith: The Story Behind the Brand", slug: "built-by-faith-story",
    content: "<p>MESSAGE was born from a simple prayer: \"Lord, let me wear my faith.\" What started as a personal desire to merge faith and fashion has grown into a movement.</p><p>Every piece we create carries Scripture. Every design starts with prayer. We believe that what you wear can be a witness.</p><p>The Built By Faith collection represents our foundation. Hebrews 11:1 reminds us that faith is the substance of things hoped for. When you put on this hoodie, you're not just wearing premium streetwear. You're declaring that your life is built on something eternal.</p>",
    excerpt: "The story of how MESSAGE came to be, rooted in prayer and a desire to wear faith boldly.",
    category: "faith", author: "MESSAGE Team", image: "/images/product-hoodie-bbf.jpg",
    status: "published", publishedAt: new Date(), createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 2, title: "How Streetwear Became a Ministry", slug: "streetwear-ministry",
    content: "<p>Streetwear has always been about identity. It's about belonging to something bigger than yourself. For Christians, this concept takes on eternal significance.</p><p>When someone asks about the verse on your hoodie, that's an open door for the Gospel. When they notice \"OMMEMA\" on your sleeve and ask what it means, you get to share your faith.</p><p>We've heard countless stories of people starting conversations about Jesus because of a hoodie. That's not fashion. That's ministry.</p>",
    excerpt: "Discover how wearing your faith can open doors for the Gospel.",
    category: "streetwear", author: "MESSAGE Team", image: "/images/product-hoodie-ommema.jpg",
    status: "published", publishedAt: new Date(), createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: 3, title: "Finding Your Purpose Through Fashion", slug: "purpose-through-fashion",
    content: "<p>Your clothing speaks before you do. It communicates your values, your identity, your tribe. At MESSAGE, we believe it can also communicate your faith.</p><p>Proverbs 3:5 says to trust in the Lord with all your heart. When you choose to wear clothing that glorifies God, you're making a daily declaration of trust.</p><p>Fashion is fleeting, but purpose is eternal. Find yours.</p>",
    excerpt: "How the clothes you choose can reflect your divine purpose.",
    category: "purpose", author: "MESSAGE Team", image: "/images/product-tee.jpg",
    status: "published", publishedAt: new Date(), createdAt: new Date(), updatedAt: new Date(),
  },
];

// ── Orders ─────────────────────────────────────────────────
export const ordersData: Order[] = [];

// ── Cart storage ───────────────────────────────────────────
export const cartsData: Array<{ id: number; userId: number | null; sessionId: string | null; status: string; createdAt: Date; updatedAt: Date }> = [];
export const cartItemsData: Array<{ id: number; cartId: number; productId: number; variantId: number | null; quantity: number; price: string; createdAt: Date }> = [];

export { nextId };
