import { replacementGuidePage } from './replacementGuidePage'

/*
 * Copy for the Sulzer Assistant on the Replacement Guide. Wording from the standalone
 * guide's chatbot (_reference/sulzer-guide/chatbot.js). `**text**` renders bold.
 */

export type AssistantQA = {
  q: string
  a: string
}

/** Knowledge base, in the guide's order. Ties in matching go to the earlier entry. */
export const assistantQA: AssistantQA[] = [
  {
    q: 'Which brands can you replace?',
    a: 'We have direct replacements for **Flygt, Grundfos, KSB, Wilo, Ebara,** and **Tsurumi** sewage pumps. Select your brand from the dropdown above, or search by part number or RSK code.',
  },
  {
    q: 'What is a drop-in replacement?',
    a: 'A **drop-in** replacement mounts directly onto your existing guide-rail base — no modifications needed. Some pumps require a Sulzer guide-rail adapter claw instead; we flag this clearly in the comparison card.',
  },
  {
    q: 'How do I find my replacement?',
    a: 'Two ways: enter your **part number or RSK code** in the search box (e.g. 581 30 22 or 98044186), or use the brand and model dropdowns. Your recommended Sulzer replacement appears instantly.',
  },
  {
    q: 'What is the ABS XFP range?',
    a: "The **ABS XFP** is Sulzer's premium submersible sewage pump range. It features the Contrablock Plus impeller for clog-resistant operation, **IE3 Premium Efficiency** motors, and IP68 protection — available from DN 80 to DN 300.",
  },
  {
    q: 'How much energy can I save?',
    a: 'Our IE3 motors typically save **10–20 %** over older IE1/IE2 pumps. Use the **Energy Savings Calculator** at the bottom of the page — enter your operating hours and electricity rate for an exact annual figure.',
  },
  {
    q: 'Where can I order?',
    a: 'Order via the **Sulzer webstore** (sense.sulzer.com) or through your local distributor. In Germany, **GC Gruppe** is our preferred partner. Click the buttons on the replacement card to get started.',
  },
  {
    q: 'What is IE3 efficiency?',
    a: '**IE3 "Premium Efficiency"** is the top motor rating under IEC 60034-30. Compared to IE1/IE2 motors in older pumps, IE3 runs cooler, lasts longer, and typically saves hundreds of euros per pump per year.',
  },
  {
    q: 'What is the Contrablock impeller?',
    a: "**Contrablock Plus** is Sulzer's patented clog-resistant impeller. Its geometry pulls fibrous material and rags away from the seal face, dramatically cutting blockage call-outs and maintenance costs in sewage applications.",
  },
  {
    q: 'My Sulzer pump is discontinued',
    a: `Enter the **product number** from the rating plate in the search box (e.g. 24130931), or pick **${replacementGuidePage.discontinuedBrand}** in the brand list. You'll see the **successor**, what it takes to fit it, and you can order it together with any **adapter kit** it needs.`,
  },
]

export const assistantCopy = {
  name: 'Sulzer Assistant',
  status: 'Online',
  greeting:
    "Hello! I'm the **Sulzer Assistant**. How can I help you find the right pump replacement today?",
  /** Chips under the greeting; after each answer, the first three that weren't just asked. */
  suggestions: [
    'Which brands can you replace?',
    'What is the ABS XFP range?',
    'How much energy can I save?',
    'What is a drop-in replacement?',
    'Where can I order?',
  ],
  /** No match: this text, then the link. */
  fallback: {
    text: "I'm not sure about that one — please contact a **Sulzer distributor** or visit",
    link: { label: 'sulzer.com', href: 'https://www.sulzer.com' },
    after: 'for specialist support.',
  },
  placeholder: 'Ask a question…',
  send: 'Send',
  open: 'Open Sulzer Assistant',
  close: 'Close Sulzer Assistant',
  closeChat: 'Close chat',
  typing: 'Sulzer Assistant is typing',
  suggestionsLabel: 'Suggested questions',
} as const
