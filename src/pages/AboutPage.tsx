import React from 'react';
import { H1, P, H2 } from '@/components/ui/typography';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8">
      <div className="text-center">
        <H1 className="mb-4">About Modern Luxe</H1>
        <P className="text-xl text-muted-foreground">
          Crafting timeless elegance for the modern individual.
        </P>
      </div>

      <section className="space-y-6">
        <H2 className="text-center">Our Story</H2>
        <P>
          Modern Luxe was founded on the principle that true style is timeless, not fleeting.
          We believe in the power of meticulously crafted pieces that transcend seasons and trends,
          offering a curated selection that speaks to sophistication and understated luxury.
          Our journey began with a passion for quality materials, impeccable design, and a commitment
          to ethical practices.
        </P>
        <P>
          From our initial sketches to the final stitch, every item in our collection is
          thoughtfully designed to empower and inspire. We collaborate with artisans and designers
          who share our vision, ensuring that each garment and accessory is a testament to
          craftsmanship and enduring beauty.
        </P>
      </section>

      <section className="space-y-6">
        <H2 className="text-center">Our Philosophy</H2>
        <P>
          At Modern Luxe, we champion a minimalist aesthetic, focusing on clean lines,
          soft contrasts, and a refined monochrome palette, punctuated by a touch of
          accent gold. We celebrate the art of dressing with intention, offering versatile
          pieces that seamlessly integrate into your wardrobe and elevate your everyday.
        </P>
        <P>
          We are more than just a fashion platform; we are a destination for those who
          appreciate the subtle nuances of luxury and the quiet confidence that comes
          from wearing something truly exceptional.
        </P>
      </section>

      <section className="text-center space-y-4">
        <H2>Join Our Journey</H2>
        <P className="text-lg text-muted-foreground">
          Experience the Modern Luxe difference.
        </P>
      </section>
    </div>
  );
};

export default AboutPage;