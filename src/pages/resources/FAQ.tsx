import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

// FAQ data from the existing FAQSection
const faqs = [
  {
    question: 'What is Synapses?',
    answer:
      "Synapses is the GRC Intelligence Platform — your personalized workspace for navigating regulations, connecting with compliance professionals, and building intelligent tools like GRC agents. It's where the future of compliance is created."
  },
  {
    question: 'Who is Synapses for?',
    answer:
      "Synapses is designed for compliance officers, risk professionals, regulators, RegTech founders, consultants, auditors, researchers, and educators. Whether you're shaping strategy or testing new tools, Synapses brings the ecosystem together."
  },
  {
    question: 'What is a GRC Agent?',
    answer:
      'GRC Agents are smart, task-specific assistants powered by trusted language models. They help automate or accelerate common compliance tasks — like summarizing regulations, checking audit readiness, or interpreting policy gaps.'
  },
  {
    question: 'Can I create my own compliance AI agent?',
    answer:
      'Yes! Synapses lets you build your own custom agent — choose the LLM (like GPT or Claude), set its focus (e.g., AML, GDPR), define how it responds, and get to work. No code or tech background needed.'
  },
  {
    question: 'What can I do with my Synapses dashboard?',
    answer:
      "Your dashboard is fully customizable — display regulatory calendars, daily insights, badge achievements, community questions, and even live agent performance. It's your control center for compliance work and growth."
  },
  {
    question: 'How does Synapses compare to LinkedIn or GitHub?',
    answer:
      "LinkedIn is for connections. GitHub is for developers. Synapses is for compliance professionals who want both — and more. It's the professional platform for building your GRC identity, tools, and impact."
  },
  {
    question: "I'm not technical — can I still use Synapses?",
    answer:
      "Absolutely. Synapses is built for non-technical users. Whether you're asking questions, customizing dashboards, or training agents, we've made it intuitive, secure, and human-friendly."
  },
  {
    question: 'Is Synapses free?',
    answer:
      'Yes — joining as an early user is completely free. In the future, advanced features (like private workspaces or enterprise dashboards) may be part of a premium plan.'
  },
  {
    question: 'Can I invite my team or organization?',
    answer:
      'Yes. Synapses is perfect for teams — coming soon are features like Team Huddles, compliance challenges, and shared dashboards. Invite your team now to build together.'
  },
  {
    question: 'Can I test upcoming RegTech tools on Synapses?',
    answer:
      'Yes! As a Synapses early user, you can be one of the first to test new RegTech tools built by developers and compliance innovators — and give feedback that helps shape the future of the industry.'
  },
  {
    question: 'When is Synapses launching?',
    answer:
      'Synapses is currently in early access. Our MVP is live with a curated group of GRC professionals. Join today to help shape what comes next. Full launch is expected in late 2025.'
  },
  {
    question: 'What if I have more questions?',
    answer:
      "We'd love to help. Reach out to us directly at help@synapses.ai — or ask inside the Synapses community."
  }
];

// FAQ categories for better organization
const categories = [
  { id: 'all', name: 'All' },
  { id: 'platform', name: 'Platform' },
  { id: 'agents', name: 'GRC Agents' },
  { id: 'getting-started', name: 'Getting Started' },
  { id: 'account', name: 'Account' }
];

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter(
    faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />

      {/* Hero Section - Stripe-inspired */}
      <section className='bg-gradient-to-b from-blue-50 to-white pt-24 pb-10'>
        <div className='container mx-auto px-4'>
          <div className='max-w-3xl mx-auto text-center'>
            <h1 className='text-3xl md:text-4xl font-bold mb-6'>How can we help?</h1>
            <div className='relative mx-auto max-w-xl'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <Search className='h-5 w-5 text-gray-400' />
              </div>
              <Input
                type='search'
                placeholder='Search frequently asked questions...'
                className='pl-10 py-6 text-lg rounded-lg'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className='border-b'>
        <div className='container mx-auto px-4'>
          <div className='flex overflow-x-auto py-4 gap-2 scrollbar-none'>
            {categories.map(category => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? 'default' : 'outline'}
                onClick={() => setActiveCategory(category.id)}
                className='rounded-full whitespace-nowrap'
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className='py-12 flex-grow bg-white'>
        <div className='container mx-auto px-4'>
          <div className='max-w-3xl mx-auto'>
            {filteredFaqs.length > 0 ? (
              <Accordion type='single' collapsible className='mb-12'>
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className='border-b border-gray-200'
                  >
                    <AccordionTrigger className='text-lg font-medium py-4 hover:no-underline'>
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className='text-gray-600 pb-6'>
                      <p>{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className='text-center py-12'>
                <h3 className='text-xl font-medium mb-2'>No results found</h3>
                <p className='text-gray-500 mb-8'>
                  Try adjusting your search or filter to find what you're looking for
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}

            <div className='mt-12 p-6 bg-blue-50 rounded-lg'>
              <h3 className='font-bold text-xl mb-3'>Still need help?</h3>
              <p className='mb-4'>Can't find what you're looking for? Our team is here to help.</p>
              <Button>Contact Support</Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;
