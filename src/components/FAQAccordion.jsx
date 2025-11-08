import { useState } from 'react';

// Fallback chevron icons if Heroicons is not available
const ChevronDownIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const ChevronUpIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
);

const FAQAccordion = ({ faqs }) => {
  const [openItems, setOpenItems] = useState(new Set());

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="bg-gray-800 rounded-lg shadow-md border border-gray-700 overflow-hidden"
        >
          <button
            className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset"
            onClick={() => toggleItem(index)}
            aria-expanded={openItems.has(index)}
            aria-controls={`faq-answer-${index}`}
          >
            <h3 className="text-lg font-semibold text-white pr-4">
              {faq.question}
            </h3>
            <div className="flex-shrink-0">
              {openItems.has(index) ? (
                <ChevronUpIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </button>
          
          <div
            id={`faq-answer-${index}`}
            className={`transition-all duration-300 ease-in-out ${
              openItems.has(index) 
                ? 'max-h-96 opacity-100' 
                : 'max-h-0 opacity-0'
            } overflow-hidden`}
          >
            <div className="px-6 pt-4 pb-4">
              <p className="text-gray-300 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FAQAccordion;
