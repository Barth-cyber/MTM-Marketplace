import { Product, CartItem, FilterState } from '../types';

export interface WhatsappContextParams {
  activeProduct?: Product | null;
  messages?: Array<{ sender: string; text: string }>;
  cart?: CartItem[];
  compareList?: Product[];
  filterState?: FilterState;
  selectedCategory?: string;
}

export const getHumanExpertWhatsappUrl = (params: WhatsappContextParams = {}): string => {
  const phone = "2348066062008";
  let textMessage = "";

  // 1. User messages in MTM Agent Chat (Highest priority if user explicitly asked something in chat)
  const userMessages = params.messages?.filter(m => m.sender === 'user') || [];
  const lastUserMsg = userMessages[userMessages.length - 1];

  if (lastUserMsg && lastUserMsg.text.trim().length > 0) {
    const truncatedMsg = lastUserMsg.text.trim().length > 100 
      ? lastUserMsg.text.trim().slice(0, 100) + "..." 
      : lastUserMsg.text.trim();
    textMessage = `Hello MTM Human Expert, I am chatting from the MTM Marketplace App after speaking with MTM Agent about: "${truncatedMsg}". I would like to speak directly with a human specialist for further technical assistance.`;
  } 
  // 2. Active product currently selected or viewed
  else if (params.activeProduct) {
    const p = params.activeProduct;
    textMessage = `Hello MTM Human Expert, I am chatting from the MTM Marketplace App regarding the "${p.title}" (${p.category}, Brand: ${p.brand || 'MTM Verified'}, Price: ₦${p.priceNGN.toLocaleString()}). I need technical specifications, physical inspection details, and freight quotes for this equipment.`;
  } 
  // 3. Items in Cart
  else if (params.cart && params.cart.length > 0) {
    const firstItem = params.cart[0].product.title;
    const count = params.cart.length;
    textMessage = `Hello MTM Human Expert, I am chatting from the MTM Marketplace App regarding ${count} item(s) in my active cart (including "${firstItem}"). I need assistance with proforma invoicing, inspection booking, and delivery terms.`;
  } 
  // 4. Products in Compare List
  else if (params.compareList && params.compareList.length > 0) {
    const compareNames = params.compareList.map(item => item.title).slice(0, 2).join(' vs ');
    textMessage = `Hello MTM Human Expert, I am chatting from the MTM Marketplace App comparing industrial equipment (${compareNames}). I would like your expert advice on which machine is best suited for my facility.`;
  } 
  // 5. Active Search or Category Filter
  else if (params.filterState?.search || (params.selectedCategory && params.selectedCategory !== 'All')) {
    const topic = params.filterState?.search 
      ? `search query "${params.filterState.search}"` 
      : `${params.selectedCategory} category`;
    textMessage = `Hello MTM Human Expert, I am chatting from the MTM Marketplace App while exploring ${topic}. I need assistance finding verified equipment with escrow protection.`;
  } 
  // 6. Default (No prior interaction)
  else {
    textMessage = `Hello MTM Human Expert, I am chatting from the MTM Marketplace App and need assistance on your products/equipment, machinery specifications, or industrial setup options.`;
  }

  return `https://wa.me/${phone}?text=${encodeURIComponent(textMessage)}`;
};
