import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Atelier Kasama — Crafted to Come Together | Luxury Furniture & Interiors',
  description:
    'Experience an ultra-premium scroll-driven 3D furniture assembly. Handcrafted European Canaletto Walnut dining tables, sculptural chairs, and bespoke architectural interior pieces.',
  keywords: [
    'luxury furniture',
    '3D scroll animation',
    'dining table',
    'Canaletto walnut',
    'interior architecture',
    'heirloom craftsmanship',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Space+Grotesk:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-primary antialiased font-body selection:bg-secondary/20 selection:text-primary">
        {children}
      </body>
    </html>
  );
}
