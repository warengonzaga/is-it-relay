import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

const faqs = [
  {
    question: "What is Is It Relay?",
    answer:
      "Is It Relay is an independent community tool to quickly detect if a wallet address belongs to Relay Protocol infrastructure. It checks solver addresses and v2 depository contracts across all supported chains.",
  },
  {
    question: "How does it work?",
    answer:
      "Simply enter any EVM (0x...) or Solana (base58) wallet address. The app fetches all chains from Relay Protocol API and checks if your address matches any solver addresses or v2 depository contracts. Results show match type, matched chains, and explorer links.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="max-w-2xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Frequently Asked Questions</h2>
      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <Card key={faq.question} className="p-0 overflow-hidden transition-all duration-300">
            <Button
              variant="ghost"
              className="w-full flex justify-between items-center px-4 py-3 text-left text-base font-medium h-auto min-h-[48px]"
              aria-expanded={openIndex === idx}
              aria-controls={`faq-panel-${idx}`}
              onClick={() => handleToggle(idx)}
            >
              <span className="flex-1">{faq.question}</span>
              <span className="ml-2 flex-shrink-0 transition-transform duration-300">
                {openIndex === idx ? "-" : "+"}
              </span>
            </Button>
            <div
              id={`faq-panel-${idx}`}
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === idx ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-4 pb-4 text-muted-foreground">
                {faq.answer}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
