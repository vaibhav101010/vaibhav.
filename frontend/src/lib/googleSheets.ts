import { Product } from '@/components/ProductCard';

export interface CategoryItem {
  page: string;
  label: string;
  count: string;
  image: string;
}

/**
 * Standard, robust CSV parser with zero external dependencies.
 * Correctly handles quotes, escaped characters, and multi-line values.
 */
function parseCSV(text: string): string[][] {
  const lines: string[][] = [];
  let row: string[] = [];
  let inQuotes = false;
  let currentVal = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentVal += '"';
        i++; // Skip the escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(currentVal.trim());
      currentVal = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      row.push(currentVal.trim());
      lines.push(row);
      row = [];
      currentVal = '';
    } else {
      currentVal += char;
    }
  }

  if (row.length > 0 || currentVal) {
    row.push(currentVal.trim());
    lines.push(row);
  }

  return lines;
}

/**
 * Normalizes column header keys to be resilient against whitespaces, case sensitivity, or trailing punctuation.
 * Example: "Label " -> "label", "Image." -> "image", "count " -> "count"
 */
function normalizeKey(key: string): string {
  return key.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Fetches and parses category items from Google Sheets.
 * If the fetch fails or the sheet is empty, returns null.
 */
export async function fetchCategoriesFromSheet(): Promise<CategoryItem[] | null> {

  const csvUrl =
    process.env.NEXT_PUBLIC_GOOGLE_SHEET_CSV_URL ||
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTZYeKlEFdJ_f42VDXSnyVfixQAh858uIvHPhzzQC9--i4_VUd1FCI0cnEf_9LDADFSTRbjMblqZ1pa/pub?gid=0&single=true&output=csv';

  try {
    const response = await fetch(csvUrl, { cache: 'no-store' } as any); // Always fetch the latest data from Google Sheets
    if (!response.ok) {
      throw new Error(`Failed to fetch Google Sheet data: ${response.statusText}`);
    }

    const csvText = await response.text();
    const rows = parseCSV(csvText);

    if (rows.length < 2) {
      return null;
    }

    const headers = rows[0].map(normalizeKey);
    const pageIndex = headers.indexOf('page');
    const labelIndex = headers.indexOf('label');
    const countIndex = headers.indexOf('count');
    const imageIndex = headers.indexOf('image');

    // Make sure we have at least page, label, and image headers
    if (pageIndex === -1 || labelIndex === -1 || imageIndex === -1) {
      console.warn('Google Sheet headers did not match expected structure ("Page", "Label", "Image")', headers);
      return null;
    }

    const categories: CategoryItem[] = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length <= Math.max(pageIndex, labelIndex, imageIndex)) {
        continue;
      }

      const page = row[pageIndex];
      const label = row[labelIndex];
      const image = row[imageIndex];
      // count is optional, fallback to empty string
      const count = countIndex !== -1 ? row[countIndex] : '';

      if (page && label && image) {
        categories.push({
          page: page.toLowerCase().trim(),
          label: label.trim(),
          count: count.trim(),
          image: image.trim(),
        });
      }
    }

    return categories;
  } catch (error) {
    console.error('Error loading categories from Google Sheet:', error);
    return null;
  }
}

// -----------------------------------------------------
// PRODUCTS FROM GOOGLE SHEETS
// -----------------------------------------------------

export async function fetchProductsFromSheet(): Promise<Product[] | null> {

  const csvUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_PRODUCTS_URL;
  
  if (!csvUrl) {
    return null; // Don't fetch if no URL is provided
  }

  try {
    const response = await fetch(csvUrl, { cache: 'no-store' } as any);
    if (!response.ok) {
      throw new Error(`Failed to fetch Google Sheet products: ${response.statusText}`);
    }

    const csvText = await response.text();
    const rows = parseCSV(csvText);

    if (rows.length < 2) {
      return null;
    }

    const headers = rows[0].map(normalizeKey);
    const nameIndex = headers.indexOf('name');
    const imageIndex = headers.indexOf('image');
    const weightIndex = headers.indexOf('weight');
    const purityIndex = headers.indexOf('purity');
    const badgeIndex = headers.indexOf('badge');
    const categoryIndex = headers.indexOf('category'); // Used for 'gold' or 'silver' pages

    if (nameIndex === -1 || imageIndex === -1) {
      console.warn('Google Sheet products headers did not match expected structure ("Name", "Image")', headers);
      return null;
    }

    const products: Product[] = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length <= Math.max(nameIndex, imageIndex)) {
        continue;
      }

      const name = row[nameIndex];
      const image = row[imageIndex];
      
      const weight = weightIndex !== -1 && row[weightIndex] ? row[weightIndex].trim() : undefined;
      const purity = purityIndex !== -1 && row[purityIndex] ? row[purityIndex].trim() : undefined;
      const badge = badgeIndex !== -1 && row[badgeIndex] ? row[badgeIndex].trim() : undefined;
      const category = categoryIndex !== -1 && row[categoryIndex] ? row[categoryIndex].trim().toLowerCase() : undefined;

      if (name && image) {
        products.push({
          name: name.trim(),
          image: image.trim(),
          price: 'TBD', // This will be calculated dynamically based on live rates
          weight,
          purity,
          badge,
          category
        });
      }
    }

    return products;
  } catch (error) {
    console.error('Error loading products from Google Sheet:', error);
    return null;
  }
}
