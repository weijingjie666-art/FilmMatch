// Public retail reference snapshot for 135 / 36-exposure single rolls.
// Prices are intentionally ranges: format, pack size, expiry, seller and shipping change the final amount.
export const FILM_PRICE_UPDATED_AT = '2026-07-29';
export const FILM_PRICE_BASIS = '135 / 36 张单卷公开零售参考；120、4×5 和多卷装请按具体商品复核';
export const FILM_PRICE_SOURCES = [
  { label: 'CineStill Film 官方商店', url: 'https://cinestill.film/collections/shop-all' },
  { label: 'Kodak Gold 200 · B&H Photo', url: 'https://www.bhphotovideo.com/c/product/27712-USA/Kodak_135_36_200_Color_Print.html' },
  { label: 'Kodak Photo Systems 官方商店', url: 'https://kodak.photosys.com/collections/kodak-professional-color-pro-packs' },
  { label: 'Digital Camera World 2026 价格分析', url: 'https://www.digitalcameraworld.com/cameras/film-cameras/trends-make-film-photography-feel-expensive-but-this-popular-kodak-film-stock-is-actually-priced-better-than-it-was-in-the-1990s' },
];

// cny is the midpoint used by the calculator; low/high are what the UI shows to users.
export const FILM_PRICE_REFERENCES = {
  'KOD-GOLD-200': { cny: 75, low: 65, high: 95, source: 'CineStill / B&H 135 36 张公开零售参考' },
  'KOD-ULTRAMAX-400': { cny: 85, low: 75, high: 105, source: '公开零售参考；按 135 36 张估算' },
  'KOD-EKTAR-100': { cny: 115, low: 100, high: 135, source: '公开零售参考；按 135 36 张估算' },
  'KOD-PORTRA-160': { cny: 125, low: 110, high: 150, source: 'Kodak Photo Systems / 公开零售参考' },
  'KOD-PORTRA-400': { cny: 145, low: 125, high: 175, source: 'Kodak Photo Systems / CineStill 5 卷装折算' },
  'KOD-PORTRA-800': { cny: 155, low: 135, high: 185, source: 'CineStill 135 36 张公开零售参考' },
  'KOD-E100': { cny: 145, low: 125, high: 175, source: 'Kodak Photo Systems / 公开零售参考' },
  'KOD-TRIX-400': { cny: 120, low: 105, high: 145, source: '公开零售参考；按 135 36 张估算' },
  'KOD-TMAX-100': { cny: 105, low: 90, high: 125, source: '公开零售参考；按 135 36 张估算' },
  'KOD-TMAX-400': { cny: 115, low: 95, high: 135, source: '公开零售参考；按 135 36 张估算' },
  'KOD-TMAX-P3200': { cny: 170, low: 145, high: 205, source: '公开零售参考；高速黑白卷区间' },
  'FUJI-400': { cny: 85, low: 70, high: 105, source: '公开零售参考；按 135 36 张估算' },
  'FUJI-C200': { cny: 90, low: 75, high: 115, source: '公开零售参考；库存和版本差异较大' },
  'FUJI-VELVIA-50': { cny: 165, low: 140, high: 200, source: '公开零售参考；反转片价格区间' },
  'FUJI-VELVIA-100': { cny: 145, low: 120, high: 180, source: '公开零售参考；反转片价格区间' },
  'FUJI-PROVIA-100F': { cny: 145, low: 120, high: 180, source: '公开零售参考；反转片价格区间' },
  'FUJI-ACROS-II': { cny: 115, low: 95, high: 140, source: '公开零售参考；Neopan Acros II 135 36 张' },
  'FUJI-PRO-400H': { cny: 160, low: 130, high: 210, source: '停产/库存卷参考，成色和有效期影响较大' },
  'ILF-HP5-PLUS': { cny: 75, low: 65, high: 90, source: 'CineStill / ILFORD 公开零售参考' },
  'ILF-FP4-PLUS': { cny: 80, low: 70, high: 100, source: 'ILFORD 公开零售参考；按 135 36 张估算' },
  'ILF-PAN-F-PLUS': { cny: 80, low: 70, high: 100, source: 'ILFORD 公开零售参考；按 135 36 张估算' },
  'ILF-DELTA-100': { cny: 90, low: 75, high: 110, source: 'ILFORD 公开零售参考；按 135 36 张估算' },
  'ILF-DELTA-400': { cny: 90, low: 75, high: 110, source: 'ILFORD 公开零售参考；按 135 36 张估算' },
  'ILF-DELTA-3200': { cny: 125, low: 105, high: 155, source: 'ILFORD 公开零售参考；高速黑白卷区间' },
  'ILF-SFX-200': { cny: 110, low: 90, high: 135, source: 'ILFORD 公开零售参考；特殊感光乳剂' },
  'ILF-ORTHO-PLUS': { cny: 105, low: 90, high: 130, source: 'ILFORD 公开零售参考；按 135 36 张估算' },
  'KEN-KENTMERE-100': { cny: 55, low: 45, high: 70, source: 'HARMAN / Kentmere 公开零售参考' },
  'KEN-KENTMERE-400': { cny: 55, low: 45, high: 70, source: 'HARMAN / Kentmere 公开零售参考' },
  'CIN-50D': { cny: 125, low: 110, high: 145, source: 'CineStill 官方商店 35mm $16.99–17.99 折算' },
  'CIN-400D': { cny: 130, low: 115, high: 150, source: 'CineStill 官方商店 35mm $17.99 折算' },
  'CIN-800T': { cny: 125, low: 110, high: 145, source: 'CineStill 官方商店 35mm $16.99–17.99 折算' },
  'HAR-PHOENIX-200': { cny: 100, low: 85, high: 125, source: 'HARMAN 官方产品与公开零售参考' },
  'ORW-NC500': { cny: 105, low: 90, high: 130, source: 'ORWO 官方产品与公开零售参考' },
  'KOD-VISION3-50D': { cny: 100, low: 80, high: 135, source: '改装卷公开零售参考；装卷和冲洗流程差异较大' },
  'KOD-VISION3-500T': { cny: 105, low: 85, high: 140, source: '改装卷公开零售参考；是否去 Remjet 需复核' },
};
