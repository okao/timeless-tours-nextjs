// components/base/Accordion.tsx
'use client';

import { useState } from 'react';

interface AccordionItem {
  id?: number;
  title: string;
  content: string;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
}

export default function Accordion({ items, allowMultiple = false }: AccordionProps) {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    if (allowMultiple) {
      setOpenItems(prev => 
        prev.includes(index) 
          ? prev.filter(i => i !== index)
          : [...prev, index]
      );
    } else {
      setOpenItems(prev => 
        prev.includes(index) ? [] : [index]
      );
    }
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <button
            onClick={() => toggleItem(index)}
            className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-all duration-300"
          >
            <span className="font-semibold text-slate-800">{item.title}</span>
            <i className={`ri-arrow-${openItems.includes(index) ? 'up' : 'down'}-s-line text-xl text-slate-600 transition-transform duration-300 ${
              openItems.includes(index) ? 'rotate-180' : ''
            }`}></i>
          </button>
          <div className={`overflow-hidden transition-all duration-300 ease-out ${
            openItems.includes(index) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="px-6 pb-4 text-slate-600 leading-relaxed">
              {item.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
