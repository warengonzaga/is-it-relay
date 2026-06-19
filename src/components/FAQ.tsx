import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

const faqs = [
  {
    question: "What is Is It Relay?",
    answer:
      "Is It Relay is an independent community tool to quickly detect if an address belongs to Relay Protocol infrastructure or a Relay deposit-address flow. It checks solver addresses, depository contracts, protocol contracts (multicall, routers, receivers, etc.), and matching Relay deposit requests across all supported chains including EVM, Solana, and Bitcoin.",
  },
  {
    question: "How does it work?",
    answer:
      "Simply enter any EVM (0x...), Solana (base58), or Bitcoin (bc1..., 1..., 3...) address. The app fetches Relay Protocol chain metadata and also queries Relay's Requests API for deposit-address matches. Results show the match type, matched chains, deposit-request metadata, and explorer links when available.",
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
