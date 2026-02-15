// Simple license key validation
// Format: PRODUCT-XXXX-XXXX-XXXX
// Validates checksum and product prefix

const LICENSE_KEY = process.env.LICENSE_KEY || '';

/**
 * Validates a license key format and checksum
 * Format: AI-XXXX-XXXX-XXXX or AI-ENT-XXXX-XXXX-XXXX
 * The last 4 characters are a simple checksum of the previous segments
 */
export function validateLicense(key: string, product: string): boolean {
  if (!key || typeof key !== 'string') return false;
  
  // Handle multi-part product names like "AI-ENT"
  const productParts = product.toUpperCase().split('-');
  const numProductParts = productParts.length;
  
  // Check format: PRODUCT-XXXX-XXXX-XXXX (4 total parts for single product, 5 for ENT)
  const expectedParts = 3 + numProductParts; // product parts + 3 data segments
  const pattern = new RegExp(`^${product.toUpperCase().replace(/-/g, '\\-')}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$`);
  if (!pattern.test(key)) return false;
  
  // Simple checksum validation (last 4 chars should be derived from first data segments)
  const parts = key.split('-');
  if (parts.length !== expectedParts) return false;
  
  // Get the last 3 parts (2 data segments + checksum)
  const seg1 = parts[numProductParts];
  const seg2 = parts[numProductParts + 1];
  const checksum = parts[numProductParts + 2];
  const computedChecksum = computeChecksum(seg1 + seg2);
  
  return checksum === computedChecksum;
}

/**
 * Compute a simple 4-char checksum from a string
 */
function computeChecksum(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Convert to positive 4-char alphanumeric
  const positiveHash = Math.abs(hash);
  return positiveHash.toString(36).toUpperCase().padStart(4, '0').slice(0, 4);
}

/**
 * Get current license status
 * For AI Platform, license is REQUIRED - no free tier
 */
export function getLicenseStatus(): { valid: boolean; tier: 'free' | 'pro' | 'enterprise' } {
  const key = LICENSE_KEY;
  
  if (!key) {
    return { valid: false, tier: 'free' };
  }
  
  // Check for enterprise license
  if (validateLicense(key, 'AI-ENT')) {
    return { valid: true, tier: 'enterprise' };
  }
  
  // Check for pro license (lifetime $79-99)
  if (validateLicense(key, 'AI')) {
    return { valid: true, tier: 'pro' };
  }
  
  return { valid: false, tier: 'free' };
}

/**
 * Check if license is valid (required for AI Platform)
 */
export function isLicenseValid(): boolean {
  const { valid } = getLicenseStatus();
  return valid;
}

/**
 * Get license error message
 */
export function getLicenseError(): string {
  return 'Valid LICENSE_KEY required. Purchase at https://your-store.com/ai-platform';
}
