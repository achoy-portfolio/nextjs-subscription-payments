import Pricing from '@/components/ui/Pricing/Pricing';
import Hero from '@/components/ui/Hero/Hero';
import Carousel from '@/components/ui/Carousel/Carousel';
import { createClient } from '@/utils/supabase/server';
import {
  getProducts,
  getSubscription,
  getUser
} from '@/utils/supabase/queries';

const cards: Props[] = [
  {
    title: 'Comprehensive Study Materials',
    description:
      'Access a vast library of practice questions, mock exams, and detailed explanations covering all key areas of the PEBC MCQ and OSCE exams.',
    children: <div>Includes flashcards, study guides, and more!</div>
  },
  {
    title: 'Expert Guidance and Support',
    description:
      'Benefit from the expertise of licensed Canadian pharmacists who have successfully navigated the PEBC exams.',
    children: (
      <div>
        Get personalized advice and support through our community forum and live
        Q&A sessions.
      </div>
    )
  },
  {
    title: 'Flexible and Affordable Plans',
    description: 'Choose the study plan that best fits your needs and budget.',
    children: (
      <div>Enjoy access to our platform on any device, anytime, anywhere.</div>
    )
  }
];

export default async function PricingPage() {
  const supabase = createClient();
  const [user, products, subscription] = await Promise.all([
    getUser(supabase),
    getProducts(supabase),
    getSubscription(supabase)
  ]);

  return (
    <div className="flex flex-col space-y-12">
      <Hero
        title="Study smarter for the PEBC MCQ and OSCE exams with PharmExam"
        description="Developed by Canadian pharmacists for both Canadian and international graduates, we offer comprehensive study resources and expert guidance to help you succeed on the MCQ and OSCE."
        imageUrl=""
        buttonText="Get Started"
        buttonLink="#pricing"
      />

      <div className="mt-12">
        <Carousel cards={cards} />
      </div>

      <div className="mt-12">
        <section id="pricing">
          <Pricing
            user={user}
            products={products ?? []}
            subscription={subscription}
          />
        </section>
      </div>
    </div>
  );
}
