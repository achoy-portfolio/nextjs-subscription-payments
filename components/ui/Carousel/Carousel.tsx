'use client';

import Card from '@/components/ui/Card';

// Add the Props type to match your Card component's requirements
interface Props {
  title: string;
  description: string;
  children?: React.ReactNode;
}

interface CardGridProps {
  cards: Props[];
}

const Carousel: React.FC<CardGridProps> = ({ cards }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-5xl m-auto my-8">
      {cards.map((card, index) => (
        <Card key={index} title={card.title} description={card.description}>
          {card.children}
        </Card>
      ))}
    </div>
  );
};

export default Carousel;
