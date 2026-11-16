// the public address of the app: Open Graph urls must be absolute.
// On Vercel the production domain is provided by the platform, NEXT_PUBLIC_SITE_URL overrides it.
const getSiteUrl = (): string => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  return 'http://localhost:3000';
};

export const SITE_URL = getSiteUrl();

export const SITE_NAME = 'NoteHub';

export const OG_IMAGE = {
  url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
  width: 1200,
  height: 630,
  alt: 'NoteHub - a simple app for managing personal notes',
};
