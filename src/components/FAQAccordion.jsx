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

const FAQAccordion = ({ faqCategories }) => {
  const [openItems, setOpenItems] = useState(new Set());
  // All categories expanded by default; user can collapse any
  const [openCategories, setOpenCategories] = useState(
    () => new Set(faqCategories.map((_, i) => i))
  );

  const toggleCategory = (catIndex) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catIndex)) next.delete(catIndex);
      else next.add(catIndex);
      return next;
    });
    // Close any open FAQ in this category when collapsing
    setOpenItems((prev) => {
      const key = [...prev].find((k) => k.startsWith(`${catIndex}-`));
      return key ? new Set() : prev;
    });
  };

  const toggleItem = (key) => {
    setOpenItems((prev) =>
      prev.has(key) ? new Set() : new Set([key])
    );
  };

  return (
    <div className="space-y-10">
      {faqCategories.map((group, catIndex) => {
        const isCategoryOpen = openCategories.has(catIndex);
        return (
          <div key={catIndex} className="space-y-4">
            <button
              type="button"
              onClick={() => toggleCategory(catIndex)}
              className="w-full flex items-center justify-between text-left border-b border-gray-700 pb-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset rounded-t"
              aria-expanded={isCategoryOpen}
              aria-controls={`faq-category-${catIndex}`}
            >
              <h2 className="text-xl font-semibold text-orange-500">
                {group.category}
              </h2>
              <span className="flex-shrink-0 ml-2 text-gray-400">
                {isCategoryOpen ? (
                  <ChevronUpIcon className="h-5 w-5" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5" />
                )}
              </span>
            </button>
            <div
              id={`faq-category-${catIndex}`}
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isCategoryOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              {group.faqs.map((faq, faqIndex) => {
                const itemKey = `${catIndex}-${faqIndex}`;
                const isOpen = openItems.has(itemKey);
                return (
                  <div
                    key={itemKey}
                    className="bg-gray-800 rounded-lg shadow-md border border-gray-700 overflow-hidden mt-4 first:mt-0"
                  >
                    <button
                      className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset"
                      onClick={() => toggleItem(itemKey)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${itemKey}`}
                      aria-label={`${isOpen ? 'Collapse' : 'Expand'} question: ${faq.question}`}
                    >
                      <h3 className="text-lg font-semibold text-white pr-4">
                        {faq.question}
                      </h3>
                      <div className="flex-shrink-0">
                        {isOpen ? (
                          <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </button>
                    <div
                      id={`faq-answer-${itemKey}`}
                      className={`transition-all duration-300 ease-in-out ${
                        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      } overflow-hidden`}
                    >
                      <div className="px-6 pt-4 pb-4">
                        <p className="text-gray-200 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FAQAccordion;
