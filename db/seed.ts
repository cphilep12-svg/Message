import { getDb } from "../api/queries/connection";
import * as schema from "./schema";

async function seed() {
  const db = getDb();
  console.log("Seeding database...");

  // Seed collections
  const collectionData: schema.InsertCollection[] = [
    { name: "Hoodies", slug: "hoodies", description: "Premium faith-inspired hoodies", image: "/images/category-hoodies.jpg", sortOrder: 1 },
    { name: "T-Shirts", slug: "tees", description: "Essential tees with purpose", image: "/images/category-tees.jpg", sortOrder: 2 },
    { name: "Caps", slug: "caps", description: "Headwear that speaks truth", image: "/images/category-accessories.jpg", sortOrder: 3 },
    { name: "Accessories", slug: "accessories", description: "Details that matter", image: "/images/category-accessories.jpg", sortOrder: 4 },
    { name: "Built By Faith", slug: "built-by-faith", description: "Our signature collection", image: "/images/product-hoodie-bbf.jpg", sortOrder: 5 },
    { name: "OMMEMA", slug: "ommema", description: "The OMMEMA series", image: "/images/product-hoodie-ommema.jpg", sortOrder: 6 },
  ];

  for (const c of collectionData) {
    await db.insert(schema.collections).values(c).onDuplicateKeyUpdate({ set: c });
  }
  console.log("Collections seeded");

  // Seed products
  const productData: schema.InsertProduct[] = [
    {
      name: "Built By Faith Hoodie",
      slug: "built-by-faith-hoodie",
      description: "Our signature hoodie featuring \"BUILT BY FAITH\" in large gothic-style lettering across the back, with Hebrews 11:1 in gold below. Front features a gold embroidered MESSAGE wordmark. Premium 450gsm heavyweight cotton with brushed interior. Oversized fit with drop shoulders.",
      verse: "Now faith is the substance of things hoped for, the evidence of things not seen. — Hebrews 11:1",
      price: "120.00",
      comparePrice: "150.00",
      status: "active",
      stockStatus: "in_stock",
      quantity: 50,
      isFeatured: true,
      images: ["/images/product-hoodie-bbf.jpg"],
      featuredImage: "/images/product-hoodie-bbf.jpg",
    },
    {
      name: "OMMEMA Hoodie",
      slug: "ommema-hoodie",
      description: "The OMMEMA hoodie features our signature vertical sleeve design. \"OMMEMA\" in gold runs down the left sleeve, \"NEVER GIVE UP\" on the right sleeve, and \"I TRUST IN GOD\" embroidered on the hood tip. MESSAGE woven label at the back hem. Premium 450gsm heavyweight cotton.",
      verse: "For I am not ashamed of the gospel of Christ. — Romans 1:16",
      price: "120.00",
      status: "active",
      stockStatus: "in_stock",
      quantity: 40,
      isFeatured: true,
      images: ["/images/product-hoodie-ommema.jpg"],
      featuredImage: "/images/product-hoodie-ommema.jpg",
    },
    {
      name: "Message Essential Tee",
      slug: "message-essential-tee",
      description: "The Message Essential Tee is our everyday staple. Clean minimal design with a small gold MESSAGE logo on the left chest. Premium 240gsm heavyweight cotton with a relaxed, oversized fit. The perfect foundation for any outfit.",
      verse: "Your word is a lamp to my feet and a light to my path. — Psalm 119:105",
      price: "45.00",
      status: "active",
      stockStatus: "in_stock",
      quantity: 100,
      isFeatured: true,
      images: ["/images/product-tee.jpg"],
      featuredImage: "/images/product-tee.jpg",
    },
    {
      name: "Trust In God Cap",
      slug: "trust-in-god-cap",
      description: "The Trust In God Cap features clean white serif embroidery on the front panel. Gold adjustable metal strap at back. MESSAGE branded under-visor. Premium wool blend with structured 6-panel construction. One size fits most.",
      verse: "Trust in the Lord with all your heart. — Proverbs 3:5",
      price: "35.00",
      status: "active",
      stockStatus: "in_stock",
      quantity: 75,
      isFeatured: true,
      images: ["/images/product-cap.jpg"],
      featuredImage: "/images/product-cap.jpg",
    },
  ];

  for (const p of productData) {
    await db.insert(schema.products).values(p).onDuplicateKeyUpdate({ set: p });
  }
  console.log("Products seeded");

  // Seed product variants
  const hoodieSizes = ["S", "M", "L", "XL", "XXL"];
  const teeSizes = ["S", "M", "L", "XL", "XXL"];
  const capColors = ["Black", "White"];

  const variants = [];
  for (const size of hoodieSizes) {
    variants.push({ productId: 1, size, color: "Black", sku: `BBF-BLK-${size}`, quantity: 10 });
    variants.push({ productId: 2, size, color: "Black", sku: `OMM-BLK-${size}`, quantity: 8 });
  }
  for (const size of teeSizes) {
    variants.push({ productId: 3, size, color: "Black", sku: `TEE-BLK-${size}`, quantity: 20 });
  }
  for (const color of capColors) {
    variants.push({ productId: 4, size: "OS", color, sku: `CAP-${color === "Black" ? "BLK" : "WHT"}-OS`, quantity: 35 });
  }

  for (const v of variants) {
    await db.insert(schema.productVariants).values(v).onDuplicateKeyUpdate({ set: v });
  }
  console.log("Product variants seeded");

  // Seed product-collection junctions
  const junctions = [
    { productId: 1, collectionId: 1 }, // BBF Hoodie -> Hoodies
    { productId: 1, collectionId: 5 }, // BBF Hoodie -> Built By Faith
    { productId: 2, collectionId: 1 }, // OMMEMA Hoodie -> Hoodies
    { productId: 2, collectionId: 6 }, // OMMEMA Hoodie -> OMMEMA
    { productId: 3, collectionId: 2 }, // Tee -> T-Shirts
    { productId: 4, collectionId: 3 }, // Cap -> Caps
  ];

  for (const j of junctions) {
    await db.insert(schema.productCollections).values(j).onDuplicateKeyUpdate({ set: j });
  }
  console.log("Product collections seeded");

  // Seed testimonials
  const testimonialData = [
    { name: "Jordan M.", email: "jordan@example.com", text: "Wearing the Built By Faith hoodie reminds me every day that my faith is my foundation. The quality is unmatched.", verse: "Hebrews 11:1", status: "approved" as const },
    { name: "Sarah K.", email: "sarah@example.com", text: "MESSAGE isn't just clothing, it's a conversation starter. I've had so many people ask about the meaning.", verse: "1 Peter 3:15", status: "approved" as const },
    { name: "David R.", email: "david@example.com", text: "The OMMEMA sleeve detail gets noticed everywhere. Proud to represent my faith through fashion.", verse: "Romans 1:16", status: "approved" as const },
  ];

  for (const t of testimonialData) {
    await db.insert(schema.testimonials).values(t).onDuplicateKeyUpdate({ set: t });
  }
  console.log("Testimonials seeded");

  // Seed blog posts
  const blogData = [
    {
      title: "Built By Faith: The Story Behind the Brand",
      slug: "built-by-faith-story",
      content: "<p>MESSAGE was born from a simple prayer: \"Lord, let me wear my faith.\" What started as a personal desire to merge faith and fashion has grown into a movement.</p><p>Every piece we create carries Scripture. Every design starts with prayer. We believe that what you wear can be a witness.</p><p>The Built By Faith collection represents our foundation. Hebrews 11:1 reminds us that faith is the substance of things hoped for. When you put on this hoodie, you're not just wearing premium streetwear. You're declaring that your life is built on something eternal.</p>",
      excerpt: "The story of how MESSAGE came to be, rooted in prayer and a desire to wear faith boldly.",
      category: "faith" as const,
      author: "MESSAGE Team",
      image: "/images/product-hoodie-bbf.jpg",
      status: "published" as const,
      publishedAt: new Date(),
    },
    {
      title: "How Streetwear Became a Ministry",
      slug: "streetwear-ministry",
      content: "<p>Streetwear has always been about identity. It's about belonging to something bigger than yourself. For Christians, this concept takes on eternal significance.</p><p>When someone asks about the verse on your hoodie, that's an open door for the Gospel. When they notice \"OMMEMA\" on your sleeve and ask what it means, you get to share your faith.</p><p>We've heard countless stories of people starting conversations about Jesus because of a hoodie. That's not fashion. That's ministry.</p>",
      excerpt: "Discover how wearing your faith can open doors for the Gospel.",
      category: "streetwear" as const,
      author: "MESSAGE Team",
      image: "/images/product-hoodie-ommema.jpg",
      status: "published" as const,
      publishedAt: new Date(),
    },
    {
      title: "Finding Your Purpose Through Fashion",
      slug: "purpose-through-fashion",
      content: "<p>Your clothing speaks before you do. It communicates your values, your identity, your tribe. At MESSAGE, we believe it can also communicate your faith.</p><p>Proverbs 3:5 says to trust in the Lord with all your heart. When you choose to wear clothing that glorifies God, you're making a daily declaration of trust.</p><p>Fashion is fleeting, but purpose is eternal. Find yours.</p>",
      excerpt: "How the clothes you choose can reflect your divine purpose.",
      category: "purpose" as const,
      author: "MESSAGE Team",
      image: "/images/product-tee.jpg",
      status: "published" as const,
      publishedAt: new Date(),
    },
  ];

  for (const b of blogData) {
    await db.insert(schema.blogPosts).values(b).onDuplicateKeyUpdate({ set: b });
  }
  console.log("Blog posts seeded");

  console.log("Seed complete!");
}

seed().catch(console.error);
