import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const items = [
  {
    q: "Are you accepting investments?",
    a: "No. Halaxis is not publicly accepting investments. This site collects accredited-investor interest only. Payment flows remain disabled until ENABLE_PAYMENTS is turned on after required counsel and regulatory steps.",
  },
  {
    q: "Is this an offer of securities?",
    a: "No. Nothing on this website is an offer to sell or a solicitation to buy any security. Any future offering, if it occurs, will be made only through counsel-reviewed documents and only where lawful.",
  },
  {
    q: "Are you a registered investment adviser?",
    a: "Do not infer SEC registration, approval, or exempt-status from this website. Registration status is a counsel-review item and will be stated accurately only after qualified counsel confirms it.",
  },
  {
    q: "What does Sharia-compliant mean here?",
    a: "At a high level, the intended program screens for riba (interest), excessive gharar (uncertainty), maysir (speculation/gambling), and prohibited sectors. Formal scholar review and a published methodology are pending. See the Sharia & Compliance page.",
  },
  {
    q: "Do you publish performance?",
    a: "No. We do not publish, imply, or forecast returns, AUM, or track record on this site. Any future figures would appear only in counsel-reviewed materials.",
  },
  {
    q: "Who should join the interest list?",
    a: "Accredited investors (or equivalent under applicable law) and their advisers who want to be notified if and when a lawful communication path exists. Submitting the form is not a subscription.",
  },
];

export function Faq() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((item, index) => (
        <AccordionItem key={item.q} value={`item-${index}`}>
          <AccordionTrigger>{item.q}</AccordionTrigger>
          <AccordionContent>{item.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
