const fs = require('fs');
const html = fs.readFileSync('C:/Users/kitty/.gemini/antigravity-ide/brain/13ac36d3-cf1e-48e9-9783-c9aeb1272f80/.system_generated/steps/7/content.md', 'utf8');

// Function to extract products
function extractProducts(sectionHtml) {
  const products = [];
  const cardRegex = /<article class="card[^"]*"[^>]*>([\s\S]*?)<\/article>/gi;
  let cardMatch;
  while ((cardMatch = cardRegex.exec(sectionHtml)) !== null) {
    const card = cardMatch[1];
    const titleMatch = card.match(/<h[1-6][^>]*class="card-title"[^>]*>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';
    const imgMatch = card.match(/<img[^>]*class="card-image"[^>]*src="([^"]*)"/i) || card.match(/<img[^>]*src="([^"]*)"/i);
    const img = imgMatch ? imgMatch[1] : '';
    const priceMatch = card.match(/<span[^>]*class="price price--withoutTax"[^>]*>([\s\S]*?)<\/span>/i);
    const price = priceMatch ? priceMatch[1].trim() : '';
    const oldPriceMatch = card.match(/<span[^>]*class="price price--non-sale"[^>]*>([\s\S]*?)<\/span>/i);
    const oldPrice = oldPriceMatch ? oldPriceMatch[1].trim() : '';
    const brandMatch = card.match(/<p class="card-text card-brand"[^>]*>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i);
    const brand = brandMatch ? brandMatch[1].trim() : '';
    const ratingMatch = card.match(/<span class="rating--count">([\s\S]*?)<\/span>/i);
    const rating = ratingMatch ? ratingMatch[1].trim() : '';

    if (title) {
      products.push({ title, img, price, oldPrice, brand, rating });
    }
  }
  return products;
}

const allProducts = extractProducts(html);
console.log('Total extracted products:', allProducts.length);
console.log('Unique titles:', new Set(allProducts.map(p => p.title)).size);
console.log('Sample product:', allProducts[0]);

fs.writeFileSync('products-extracted.json', JSON.stringify(allProducts, null, 2));
