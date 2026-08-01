'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './Chatbot.module.css';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  image?: string;
  isCustomForm?: boolean;
  isWhatsAppEnquiry?: boolean;
  whatsappText?: string;
}

interface SilverItemDetails {
  makingChargePerGram: number;
  purityPercent: number;
  purityName: string;
}

function getSilverItemDetails(itemType: string): SilverItemDetails {
  const lowerType = itemType.toLowerCase();
  
  if (lowerType.includes('fancy payal') || lowerType.includes('fancy bichhiya') || (lowerType.includes('fancy') && (lowerType.includes('payal') || lowerType.includes('bichhiya')))) {
    return { makingChargePerGram: 10, purityPercent: 0.70, purityName: '70%' };
  }
  if (lowerType.includes('desi payal') || (lowerType.includes('desi') && lowerType.includes('payal'))) {
    return { makingChargePerGram: 10, purityPercent: 0.65, purityName: '65%' };
  }
  if (lowerType.includes('payal') || lowerType.includes('bichhiya')) {
    return { makingChargePerGram: 10, purityPercent: 0.65, purityName: '65%' };
  }
  
  if (lowerType.includes('necklace') || lowerType.includes('haar') || lowerType.includes('neck')) {
    return { makingChargePerGram: 100, purityPercent: 0.70, purityName: '70%' };
  }
  
  if (lowerType.includes('ring') || lowerType.includes('anguthi') || lowerType.includes('chhalla')) {
    return { makingChargePerGram: 100, purityPercent: 0.70, purityName: '70%' };
  }
  
  if (lowerType.includes('chain') || lowerType.includes('zanjeer') || lowerType.includes('bracelet') || lowerType.includes('kada') || lowerType.includes('kangan')) {
    return { makingChargePerGram: 25, purityPercent: 0.70, purityName: '70%' };
  }
  
  return { makingChargePerGram: 10, purityPercent: 0.65, purityName: '65%' };
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: 'Namaste! Welcome to M/S Suman Jewellers. How can I assist you with our collections or rates today?',
      sender: 'bot',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [hasUnread, setHasUnread] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Custom Order Flow States
  const [orderFlowStep, setOrderFlowStep] = useState<'photo' | 'detect_category_fallback' | 'purity_weight_size' | 'ask_if_want_to_order' | 'name' | 'phone' | 'delivery_date' | null>(null);
  const [orderData, setOrderData] = useState<{
    photoUrl: string | null;
    purityWeightSize: string;
    contactInfo: string;
    orderId: string;
    jewelryType: string;
    purity: string | null;
    weight: string | null;
    name?: string;
    phone?: string;
    deliveryDate?: string;
  }>({
    photoUrl: null,
    purityWeightSize: '',
    contactInfo: '',
    orderId: '',
    jewelryType: 'Jewelry',
    purity: null,
    weight: null,
    name: '',
    phone: '',
    deliveryDate: '',
  });

  // Old Gold / Silver Buying Assistant States
  const [buybackFlowStep, setBuybackFlowStep] = useState<'metal_type' | 'weight' | 'purity' | 'stones_check' | null>(null);
  const [buybackData, setBuybackData] = useState<{
    metal: 'gold' | 'silver' | null;
    weight: number | null;
    purity: number | null;
    purityName: string;
    hasStones: boolean | null;
  }>({
    metal: null,
    weight: null,
    purity: null,
    purityName: '',
    hasStones: null,
  });

  // Photo Flow options state
  const [photoFlowStep, setPhotoFlowStep] = useState<'options' | 'price_metal_select' | null>(null);
  const [photoFlowImage, setPhotoFlowImage] = useState<string | null>(null);
  const [photoFlowType, setPhotoFlowType] = useState<string>('Jewelry');

  // User Intent State for generic jewelry intercepts
  const [userIntent, setUserIntent] = useState<'price' | 'order' | 'enquiry' | 'available' | 'sale' | null>(null);

  // Attachment Staging State (Drafting Mode)
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedImageType, setAttachedImageType] = useState<string>('Jewelry');

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setHasUnread(false);
  };

  const getWhatsAppLink = (currentOrderData?: typeof orderData) => {
    const data = currentOrderData || orderData;
    const phoneNumber = "919838722733";
    
    // Auto-detect metal type based on user input details
    const inputLower = (data.purityWeightSize || '').toLowerCase();
    let metalType = 'Gold 🟡';
    if (inputLower.includes('silver') || inputLower.includes('chandi')) {
      metalType = 'Silver ⚪';
    } else if (inputLower.includes('diamond') || inputLower.includes('heera')) {
      metalType = 'Diamond 💎';
    }

    const isRing = (data.jewelryType || '').toLowerCase().includes('ring') || (data.jewelryType || '').toLowerCase().includes('anguthi');
    const purityWeightLabel = isRing ? '• *Purity, Weight & Ring Size:*' : '• *Purity & Weight:*';

    const textMessage = `Hello Suman Jewellers, I would like to place a custom jewellery order.

📋 *Order Details:*
• *Metal Type:* ${metalType}
• *Jewelry Type:* ${data.jewelryType || 'N/A'}
${purityWeightLabel} ${data.weight ? `${data.purity || 'N/A'} (${data.weight})` : (data.purityWeightSize || 'N/A')}

👤 *Customer Details:*
• *Name:* ${data.name || 'N/A'}
• *Phone:* ${data.phone || 'N/A'}
• *Delivery Date:* ${data.deliveryDate || 'N/A'}

I have attached/will send the design photo in the next message.`;
    
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(textMessage)}`;
  };

  const getBuybackWhatsAppLink = (data: typeof buybackData) => {
    const phoneNumber = "919838722733";
    const textMessage = `Namaste Suman Jewellers, I would like to get a final quote/payout for my old jewellery.

📋 *Old Jewellery Details:*
• *Metal:* ${data.metal === 'gold' ? 'Gold 🟡' : 'Silver ⚪'}
• *Weight:* ${data.weight} grams
• *Purity:* ${data.purityName || 'N/A'}
• *Contains Stones/Beads:* ${data.hasStones ? 'Yes' : 'No'}

Please let me know when I can visit the store for physical verification.`;

    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(textMessage)}`;
  };

  const processBuybackStep = async (text: string) => {
    const cleanText = text.toLowerCase().trim();

    if (buybackFlowStep === 'metal_type') {
      let metal: 'gold' | 'silver' | null = null;
      if (cleanText.includes('gold') || cleanText.includes('sona') || cleanText.includes('sone') || cleanText.includes('yellow')) {
        metal = 'gold';
      } else if (cleanText.includes('silver') || cleanText.includes('chandi') || cleanText.includes('white')) {
        metal = 'silver';
      }

      if (!metal) {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            text: `Mujhe samajh nahi aaya. 🟡 Gold bechna chahte hain ya ⚪ Silver? Please niche diye buttons me se select karein ya type karein.`,
            sender: 'bot',
          },
        ]);
        return;
      }

      setBuybackData((prev) => ({ ...prev, metal }));
      setBuybackFlowStep('weight');
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          text: `Aapke **${metal === 'gold' ? 'Gold' : 'Silver'}** ke liye shukriya! \n\n⚖️ **Step 2:** Please old jewellery ka **total weight (in grams)** batayein (jaise '10' या '12.5 grams'):`,
          sender: 'bot',
        },
      ]);
      return;
    }

    if (buybackFlowStep === 'weight') {
      const match = cleanText.match(/(\d+(?:\.\d+)?)/);
      const weightVal = match ? parseFloat(match[1]) : null;

      if (!weightVal || isNaN(weightVal) || weightVal <= 0) {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            text: `Please items ka sahi weight batayein (numbers me, jaise '10' ya '10 grams'):`,
            sender: 'bot',
          },
        ]);
        return;
      }

      // Check if they also typed the metal name during weight input (for correction)
      let metal = buybackData.metal;
      if (cleanText.includes('silver') || cleanText.includes('chandi')) {
        metal = 'silver';
      } else if (cleanText.includes('gold') || cleanText.includes('sona') || cleanText.includes('sone')) {
        metal = 'gold';
      }

      setBuybackData((prev) => ({ ...prev, weight: weightVal, metal }));
      setBuybackFlowStep('purity');

      if (metal === 'gold') {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            text: `⚖️ **Step 3:** Please Gold ki purity (Carat) select karein:\n\n• **24K** (100%)\n• **22K** (91.6%)\n• **18K** (75.0%)\n• **14K** (58.5%)\n• **10K** (41.7%)`,
            sender: 'bot',
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            text: `⚖️ **Step 3:** Please Silver ki purity select karein:\n\n• **Pure Silver** (99.9%)\n• **Sterling Silver** (92.5%)\n• **Traditional/Local Silver** (~65%)`,
            sender: 'bot',
          },
        ]);
      }
      return;
    }

    if (buybackFlowStep === 'purity') {
      let purity = 1.0;
      let purityName = '24K';

      if (buybackData.metal === 'gold') {
        if (cleanText.includes('22') || cleanText.includes('916')) {
          purity = 0.916;
          purityName = '22K (91.6%)';
        } else if (cleanText.includes('18') || cleanText.includes('750')) {
          purity = 0.75;
          purityName = '18K (75.0%)';
        } else if (cleanText.includes('14') || cleanText.includes('585')) {
          purity = 0.585;
          purityName = '14K (58.5%)';
        } else if (cleanText.includes('10')) {
          purity = 0.417;
          purityName = '10K (41.7%)';
        } else if (cleanText.includes('24')) {
          purity = 1.0;
          purityName = '24K (100%)';
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              text: `Purity match nahi ho payi. Please 24K, 22K, 18K, 14K, ya 10K me se select karein:`,
              sender: 'bot',
            },
          ]);
          return;
        }
      } else {
        if (cleanText.includes('99.9') || cleanText.includes('pure') || cleanText.includes('999')) {
          purity = 1.0;
          purityName = 'Pure Silver (99.9%)';
        } else if (cleanText.includes('92.5') || cleanText.includes('sterling') || cleanText.includes('925')) {
          purity = 0.925;
          purityName = 'Sterling Silver (92.5%)';
        } else {
          purity = 0.65;
          purityName = 'Silver (65% Purity)';
        }
      }

      setBuybackData((prev) => ({ ...prev, purity, purityName }));
      setBuybackFlowStep('stones_check');
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          text: `✨ **Step 4:** Kya is jewellery me stone work, beads, enamel (mina), ya bhaari solder (tanka) laga hua hai?`,
          sender: 'bot',
        },
      ]);
      return;
    }

    if (buybackFlowStep === 'stones_check') {
      const hasStones = cleanText.includes('yes') || cleanText.includes('haan') || cleanText.includes('stone') || cleanText.includes('bead') || cleanText.includes('enamel') || cleanText.includes('mina');
      
      setIsTyping(true);
      try {
        const res = await fetch('/api/rates');
        let rates;
        if (res.ok) {
          rates = await res.json();
        } else {
          throw new Error();
        }
        
        const rawSilver = rates ? rates.silver : 85;
        const baseRate = buybackData.metal === 'gold' 
          ? rates.gold24k 
          : (rawSilver > 1000 ? rawSilver / 1000 : rawSilver);
        const rawValue = (buybackData.weight || 0) * (buybackData.purity || 1) * baseRate;
        const finalPayout = rawValue;

        const updatedBuybackData = { ...buybackData, hasStones };
        setBuybackData(updatedBuybackData);

        const breakdown = `Hello! Here is the estimated payout breakdown for your old jewellery:

• **Item:** ${buybackData.metal === 'gold' ? 'Gold 🟡' : 'Silver ⚪'} (${buybackData.purityName})
• **Net Weight:** ${buybackData.weight} grams
• **Today's Base Rate:** ₹${Math.round(baseRate).toLocaleString('en-IN')}/g
• **Gross Metal Value:** ₹${Math.round(rawValue).toLocaleString('en-IN')}
• **Stone Check Note:** ${hasStones ? 'Note: Non-precious stone/bead weight will be subtracted at our counter before final testing.' : 'Plain metal (no stone weight deductions).'}

💰 **Estimated Payout:** **₹${Math.round(finalPayout).toLocaleString('en-IN')}**

*(Note: This valuation is an estimate subject to final physical testing (XRF machine / weight verification) at our store.)*`;

        setBuybackFlowStep(null);
        setTimeout(() => {
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              text: breakdown,
              sender: 'bot',
            },
          ]);
        }, 1000);
      } catch (err) {
        // Fallback calculation using baseline
        const dateSeed = new Date().getDate();
        const baseRate = buybackData.metal === 'gold' ? (7250 + (dateSeed % 8 - 4) * 15) : 85;
        const rawValue = (buybackData.weight || 0) * (buybackData.purity || 1) * baseRate;
        const finalPayout = rawValue;

        const updatedBuybackData = { ...buybackData, hasStones };
        setBuybackData(updatedBuybackData);

        const breakdown = `Hello! Here is the estimated payout breakdown for your old jewellery:

• **Item:** ${buybackData.metal === 'gold' ? 'Gold 🟡' : 'Silver ⚪'} (${buybackData.purityName})
• **Net Weight:** ${buybackData.weight} grams
• **Today's Base Rate:** ₹${Math.round(baseRate).toLocaleString('en-IN')}/g
• **Gross Metal Value:** ₹${Math.round(rawValue).toLocaleString('en-IN')}
• **Stone Check Note:** ${hasStones ? 'Note: Non-precious stone/bead weight will be subtracted at our counter before final testing.' : 'Plain metal (no stone weight deductions).'}

💰 **Estimated Payout:** **₹${Math.round(finalPayout).toLocaleString('en-IN')}**

*(Note: This valuation is an estimate subject to final physical testing (XRF machine / weight verification) at our store.)*`;

        setBuybackFlowStep(null);
        setTimeout(() => {
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              text: breakdown,
              sender: 'bot',
            },
          ]);
        }, 1000);
      }
    }
  };

  const prevMessageWasUploadQuestion = (msgs: Message[]) => {
    const botMsgs = msgs.filter(m => m.sender === 'bot');
    if (botMsgs.length === 0) return false;
    const lastBotMsg = botMsgs[botMsgs.length - 1];
    return lastBotMsg.text.includes("yahan chat me upload kar sakte hain") || lastBotMsg.text.includes("Would you like to start the custom order flow");
  };



  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Detect jewelry type from filename
    const filename = file.name.toLowerCase();
    let detectedType = 'Jewelry';
    if (filename.includes('earring') || filename.includes('jhumka') || filename.includes('bali')) {
      detectedType = 'Earrings (झुमका)';
    } else if (filename.includes('ring') || filename.includes('anguthi')) {
      detectedType = 'Ring (अंगूठी)';
    } else if (filename.includes('chain') || filename.includes('zanjeer') || filename.includes('mala')) {
      detectedType = 'Chain (चैन)';
    } else if (filename.includes('necklace') || filename.includes('haar') || filename.includes('neck')) {
      detectedType = 'Necklace (हार)';
    } else if (filename.includes('bracelet') || filename.includes('kada') || filename.includes('kangan')) {
      detectedType = 'Bracelet/Kada (कड़ा)';
    } else if (filename.includes('bangle') || filename.includes('chudi')) {
      detectedType = 'Bangle (चूड़ी)';
    }

    setOrderData((prev) => ({ ...prev, jewelryType: detectedType }));

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      
      // If we are currently in an active custom order flow specifically waiting for a photo:
      if (orderFlowStep === 'photo') {
        const updatedData = { ...orderData, photoUrl: base64String, jewelryType: detectedType };
        setOrderData(updatedData);
        setOrderFlowStep('purity_weight_size');
        
        // Add the user message showing upload
        setMessages((prev) => [
          ...prev,
          {
            id: `user-img-${Date.now()}`,
            text: `📸 Attached photo for order (${detectedType}).`,
            sender: 'user',
            image: base64String
          }
        ]);
        const isRing = detectedType.toLowerCase().includes('ring') || detectedType.toLowerCase().includes('anguthi');
        const detailPromptText = isRing
          ? `Photo ke liye shukriya! Mujhe ye ek **${detectedType}** lag rahi hai. Is design ko samajhne ke liye please ye details batayein:\n\n1. **Aap ise kis purity me banwana chahte hain?** (18K / 22K)\n2. **Aapka budget ya estimated weight kitna hai?** (e.g., 5-8 grams)\n3. **Aapki Ring ka size kya hai? (Ring Size)**`
          : `Photo ke liye shukriya! Mujhe ye ek **${detectedType}** lag rahi hai. Is design ko samajhne ke liye please ye details batayein:\n\n1. **Aap ise kis purity me banwana chahte hain?** (18K / 22K)\n2. **Aapka budget ya estimated weight kitna hai?** (e.g., 5-8 grams)`;

        setTimeout(() => {
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              text: detailPromptText,
              sender: 'bot',
            },
          ]);
        }, 1000);
      } else {
        // Otherwise, stage the attachment for the input bar (Drafting Mode)
        setAttachedImage(base64String);
        setAttachedImageType(detectedType);
      }
    };
    reader.readAsDataURL(file);
  };

  const tryCalculation = async (query: string): Promise<string | null> => {
    // Regex matches numbers followed by g, gram, grams, gm, gms, tola, tolas
    const weightMatch = query.match(/(\d+(?:\.\d+)?)\s*(?:g|gram|grams|gm|gms|tola|tolas)\b/i);
    if (!weightMatch) return null;

    let weight = parseFloat(weightMatch[1]);
    const unit = weightMatch[0].toLowerCase();
    
    // Tola conversion (1 tola = 11.66 grams)
    if (unit.includes('tola')) {
      weight = weight * 11.66;
    }

    const isSilver = query.includes('silver') || query.includes('chandi');
    const isGold = query.includes('gold') || query.includes('sone') || query.includes('sona') || query.includes('xau') || (!isSilver && (query.includes('k') || query.includes('karat') || query.includes('carat')));

    try {
      const res = await fetch('/api/rates');
      if (!res.ok) return null;
      const rates = await res.json();

      if (isSilver) {
        const rawSilver = rates ? rates.silver : 225;
        const pureRate = rawSilver > 1000 ? rawSilver / 1000 : rawSilver;
        const jewelleryRate = pureRate - 20; // Jewellery base rate = Pure Rate - ₹20
        const details = getSilverItemDetails(query);
        const baseValue = weight * jewelleryRate;
        const makingCharge = weight * details.makingChargePerGram;
        const subtotal = baseValue + makingCharge;
        const gst = subtotal * 0.03;
        const total = subtotal + gst;

        const isPurityRequested = query.toLowerCase().includes('purity') || query.toLowerCase().includes('carat') || query.toLowerCase().includes('karat') || query.toLowerCase().includes('percent');
        const purityLine = isPurityRequested ? `\n• **Purity:** ${details.purityName}` : '';
        
        return `⚖️ **Price Calculation (${weightMatch[1]}g):**\n\n• **Item:** Silver${purityLine}\n• **Silver Weight:** ${weightMatch[1]} gram\n• **Pure Silver Rate:** ₹${Math.round(pureRate)}/gram\n• **Jewellery Rate:** ₹${Math.round(jewelleryRate)}/gram\n• **Silver Base Price:** ₹${Math.round(baseValue).toLocaleString('en-IN')}\n• **Making Charge (₹${details.makingChargePerGram}/g):** ₹${Math.round(makingCharge).toLocaleString('en-IN')}\n• **GST (3%):** ₹${Math.round(gst).toLocaleString('en-IN')}\n• **Total Bill:** **₹${Math.round(total).toLocaleString('en-IN')}**\n\n*(Note: Market rates ke according price change ho sakta hai.)*`;
      } else {
        // Default to 18k if not specified
        let purity = '18K';
        let rate = rates.gold18k;
        
        if (query.includes('22')) {
          purity = '22K';
          rate = rates.gold22k;
        } else if (query.includes('24')) {
          purity = '24K';
          rate = rates.gold24k;
        }

        if (!rate) return null;
        const baseValue = weight * rate;
        const makingCharge = baseValue * 0.15;
        const gst = (baseValue + makingCharge) * 0.03;
        const total = baseValue + makingCharge + gst;

        const displayWeight = unit.includes('tola') ? `${weightMatch[1]} tola (${Math.round(weight * 100) / 100}g)` : `${weightMatch[1]}`;

        return `⚖️ **Aaj ke rate ke hisab se calculation:**\n\n• **Gold Weight:** ${displayWeight} gram (${purity})\n• **Base Gold Price:** ₹${Math.round(baseValue).toLocaleString('en-IN')}\n• **Making Charge (15%):** ₹${Math.round(makingCharge).toLocaleString('en-IN')}\n• **GST (3%):** ₹${Math.round(gst).toLocaleString('en-IN')}\n• **Total Estimated Price:** **₹${Math.round(total).toLocaleString('en-IN')}**\n\n*(Note: Rates market fluctuation ke according change ho sakte hain.)*`;
      }
    } catch (err) {
      return null;
    }
  };

  const getBotResponse = async (query: string): Promise<string> => {
    const cleanQuery = query.toLowerCase().trim();

    // Try calculation engine first (but skip for old gold sell queries)
    const isSellQuery = 
      cleanQuery.includes('sell') || 
      cleanQuery.includes('bechna') || 
      cleanQuery.includes('bechne') || 
      cleanQuery.includes('bechni') || 
      cleanQuery.includes('bechana') || 
      cleanQuery.includes('buyback') || 
      cleanQuery.includes('value of old') || 
      cleanQuery.includes('purana sona') || 
      cleanQuery.includes('old gold') || 
      cleanQuery.includes('valuation') || 
      cleanQuery.includes('chandi bechni') ||
      cleanQuery.includes('old jewellery') ||
      cleanQuery.includes('old jewelry') ||
      cleanQuery.includes('purani jewellery') ||
      cleanQuery.includes('purani jewelry') ||
      cleanQuery.includes('sale krna') ||
      cleanQuery.includes('sale karna') ||
      cleanQuery.includes('sell krna') ||
      cleanQuery.includes('sell karna') ||
      ((cleanQuery.includes('puran') || /\bold\b/.test(cleanQuery)) && 
       (cleanQuery.includes('sona') || cleanQuery.includes('chandi') || cleanQuery.includes('gold') || cleanQuery.includes('silver') || cleanQuery.includes('jewel')));
    
    if (!isSellQuery) {
      const calculationResult = await tryCalculation(cleanQuery);
      if (calculationResult) {
        return calculationResult;
      }
    }

    // 1. Greetings & Small Talk
    if (
      cleanQuery === 'hi' ||
      cleanQuery === 'hello' ||
      cleanQuery === 'hey' ||
      cleanQuery.startsWith('greetings') ||
      cleanQuery.includes('good morning') ||
      cleanQuery.includes('good afternoon') ||
      cleanQuery.includes('good evening') ||
      cleanQuery === 'namaste'
    ) {
      return "Namaste! I am Suman Assist, your digital guide for M/S Suman Jewellers. 🌸\n\nI can help you check live gold and silver rates, find our showroom, check our timings, or connect you with the owner. What can I do for you today?";
    }

    // 1a. Silver Order / Enquiry Queries
    const hasJewelleryKeyword = 
      cleanQuery.includes('ring') || cleanQuery.includes('ngoothi') || cleanQuery.includes('anguthi') ||
      cleanQuery.includes('chhalla') || cleanQuery.includes('chain') || cleanQuery.includes('zanjeer') ||
      cleanQuery.includes('bracelet') || cleanQuery.includes('kada') || cleanQuery.includes('kangan') ||
      cleanQuery.includes('payal') || cleanQuery.includes('bichhiya') || cleanQuery.includes('necklace') ||
      cleanQuery.includes('haar') || cleanQuery.includes('neck') || cleanQuery.includes('locket') ||
      cleanQuery.includes('chhagal') || cleanQuery.includes('kamarband') || cleanQuery.includes('jewellery') ||
      cleanQuery.includes('jewelry') || cleanQuery.includes('gahne') || cleanQuery.includes('gahna') ||
      cleanQuery.includes('ornament') || cleanQuery.includes('item');

    const isSilverOrderQuery = 
      (cleanQuery.includes('silver') || cleanQuery.includes('chandi')) &&
      (cleanQuery.includes('order') || cleanQuery.includes('buy') || cleanQuery.includes('purchase') || cleanQuery.includes('banwa') || cleanQuery.includes('enquiry') || cleanQuery.includes('enquiri') || 
       ((cleanQuery.includes('price') || cleanQuery.includes('rate') || cleanQuery.includes('cost') || cleanQuery.includes('value')) && hasJewelleryKeyword));

    if (isSilverOrderQuery) {
      return "Agar aap Silver (Chandi) me order dena chahte hain, toh hamare paas Silver Rings with Stone aur Silver Chhalla jaisi items ke orders directly available hain.\n\nKisi bhi specific ya custom silver jewellery order ke liye aap direct hamare Store se contact kar sakte hain ya Owner se seedhe baat kar sakte hain.\n\n📞 **Owner Contact:** +91 98387 22733\n📍 **Store Address:** Waslleyganj, Near Sai Baba Mandir, Mirzapur, Uttar Pradesh";
    }

    // 1b. Chain Queries
    if (
      cleanQuery.includes('chain') ||
      cleanQuery.includes('zanjeer') ||
      cleanQuery.includes('mala')
    ) {
      return "Hamare yaha har tarah ki fancy chain milti hai light weight se heavy tak. Normal size 22 inch rahega, aur agar length zyada chahiye toh order par banega, jo bhi chain ka design customer choose kare ya describe kare.";
    }

    // 1c. Direct Gold / Silver Jewellery Queries
    const isDirectJewelleryQuery = 
      cleanQuery === 'gold' ||
      cleanQuery === 'silver' ||
      cleanQuery === 'gold jewellery' ||
      cleanQuery === 'silver jewellery' ||
      cleanQuery === 'gold jewelry' ||
      cleanQuery === 'silver jewelry' ||
      cleanQuery === 'jewellery' ||
      cleanQuery === 'jewelry' ||
      cleanQuery === 'gold item' ||
      cleanQuery === 'silver item' ||
      cleanQuery === 'sone ki jewellery' ||
      cleanQuery === 'chandi ki jewellery' ||
      cleanQuery === 'sone ke gahne' ||
      cleanQuery === 'chandi ke gahne';

    if (isDirectJewelleryQuery) {
      return "Aap iske baare me kya janna chahte hain? Kripya batayein:\n\n• **Order dena hai?**\n• **Price janna hai?**\n• **Sale karna hai?**\n• **Store me available hai ya nahi?**";
    }

    // 1d. Availability / Store Queries
    if (
      cleanQuery.includes('available') ||
      cleanQuery.includes('availabel') ||
      cleanQuery.includes('stock') ||
      cleanQuery.includes('mil jayega') ||
      cleanQuery.includes('hai kya') ||
      cleanQuery.includes('store me') ||
      cleanQuery.includes('showroom me')
    ) {
      return "Hamare store me bahut type ki fancy chains, rings aur unique designs available hain. Aap store visit kar lein ya hamare uploaded products ko dekh lein (Collections sections me). Aur zyada enquiry/satisfaction ke liye aap store visit karein.";
    }

    // Q2: Kya aaj showroom khula hai? / Is today open?
    if (
      cleanQuery.includes('aaj khula') ||
      cleanQuery.includes('aaj open') ||
      cleanQuery.includes('today open') ||
      cleanQuery.includes('is today open') ||
      cleanQuery.includes('aaj kya') ||
      cleanQuery.includes('aaj shop') ||
      cleanQuery.includes('aaj showroom')
    ) {
      return "Humara showroom Monday se Saturday subah 11:15 AM se raat 8:00 PM tak khula rehta hai. Sunday ko shop closed rehti hai, lekin Festive Season (Dhanteras, Akshaya Tritiya, Diwali etc.) me Sunday ko bhi showroom khula rehta hai.\n\n(Dhyan dein: 26th January, 15th August, aur Holi ke din showroom poore tarike se closed rehta hai.)";
    }

    // Q1: Aapka showroom kab khula rehta hai? / Showroom timings kya hain?
    if (
      cleanQuery.includes('timing') ||
      cleanQuery.includes('timings') ||
      cleanQuery.includes('kab khula') ||
      cleanQuery.includes('kab tak') ||
      cleanQuery.includes('hours') ||
      cleanQuery.includes('business hour') ||
      cleanQuery.includes('kab band') ||
      cleanQuery.includes('open timings') ||
      cleanQuery.includes('showroom time') ||
      cleanQuery.includes('open') ||
      cleanQuery.includes('close') ||
      cleanQuery.includes('sunday') ||
      cleanQuery.includes('holiday')
    ) {
      return "Humara showroom subah 11:15 AM se raat 8:00 PM tak khula rehta hai. Normal days me hum Har Sunday ko closed rehte hain. (Note: Festive season me jaise Dhanteras, Akshaya Tritiya, aur Diwali par Sunday ko bhi showroom khula rehta hai!)";
    }

    // Q3: Showroom ka address kya hai? Main wahan kaise pahunch sakta hoon?
    if (
      cleanQuery.includes('address') ||
      cleanQuery.includes('location') ||
      cleanQuery.includes('where') ||
      cleanQuery.includes('map') ||
      cleanQuery.includes('google maps') ||
      cleanQuery.includes('route') ||
      cleanQuery.includes('direction') ||
      cleanQuery.includes('directions') ||
      cleanQuery.includes('pahunch') ||
      cleanQuery.includes('kaise aayein') ||
      cleanQuery.includes('waslleyganj') ||
      cleanQuery.includes('wellesleyganj') ||
      cleanQuery.includes('mirzapur')
    ) {
      return "Humara showroom Waslleyganj, Near Sai Baba Mandir, Mirzapur, Uttar Pradesh, India par situated hai. Aap Google Maps par Waslleyganj Mirzapur search karke aasaani se direction le sakte hain.";
    }

    // Custom Order Upload Question Q&A
    if (
      cleanQuery.includes('photo kaise') ||
      cleanQuery.includes('details kaise') ||
      cleanQuery.includes('photo aur details') ||
      cleanQuery.includes('upload photo') ||
      cleanQuery.includes('send photo') ||
      cleanQuery.includes('design ki jewelry banwani') ||
      cleanQuery.includes('photo bhejoon')
    ) {
      return `Aap apni pasand ki jewelry ki photo aur details (Weight, Purity) yahan chat me upload kar sakte hain, ya phir seedhe humare WhatsApp Number [+91 98387 22733] par bhej sakte hain. Humari team aapko design dekhte hi estimated price aur timeline bata degi!\n\nWould you like to start the custom order flow now? (Type **"yes"** or **"Custom Order"** to start)`;
    }

    // Q5: Making charges aur Tax kitna lagta hai?
    if (
      cleanQuery.includes('making charge') ||
      cleanQuery.includes('making charges') ||
      cleanQuery.includes('tax') ||
      cleanQuery.includes('gst') ||
      cleanQuery.includes('making') ||
      cleanQuery.includes('charge') ||
      cleanQuery.includes('charges')
    ) {
      return "Humare yahan making charge flat 15% rehta hai (jis par festive time par discounts bhi milte hain) aur Government rule ke according 3% GST lagta hai.";
    }

    // Q4: Aaj ka Gold/Silver Rate (Sone/Chandi ka bhav) kya hai?
    const isProductKeywords = 
      cleanQuery.includes('ring') || 
      cleanQuery.includes('ngoothi') || 
      cleanQuery.includes('chain') || 
      cleanQuery.includes('zanjeer') || 
      cleanQuery.includes('mala') || 
      cleanQuery.includes('necklace') || 
      cleanQuery.includes('haar') || 
      cleanQuery.includes('jhumka') || 
      cleanQuery.includes('bali') || 
      cleanQuery.includes('earring') || 
      cleanQuery.includes('bangle') || 
      cleanQuery.includes('chudi') || 
      cleanQuery.includes('bracelet') || 
      cleanQuery.includes('kada') || 
      cleanQuery.includes('kangan') ||
      cleanQuery.includes('jewellery') ||
      cleanQuery.includes('jewelry') ||
      cleanQuery.includes('gahne') ||
      cleanQuery.includes('gahna') ||
      cleanQuery.includes('ornament') ||
      cleanQuery.includes('item');

    const isRatesQuery = 
      !isSellQuery && 
      !isProductKeywords && (
        cleanQuery.includes('today rate') ||
        cleanQuery.includes('today price') ||
        cleanQuery.includes('gold price') ||
        cleanQuery.includes('silver price') ||
        cleanQuery.includes('sone ka bhav') ||
        cleanQuery.includes('chandi ka rate') ||
        cleanQuery.includes('chandi ka bhav') ||
        ((cleanQuery.includes('rate') || cleanQuery.includes('price') || cleanQuery.includes('bhav') || cleanQuery.includes('cost')) && 
         (cleanQuery.includes('gold') || cleanQuery.includes('silver') || cleanQuery.includes('sona') || cleanQuery.includes('sone') || cleanQuery.includes('chandi')))
      );

    if (isRatesQuery) {
      try {
        const res = await fetch('/api/rates');
        if (res.ok) {
          const rates = await res.json();
          const rawSilver = rates.silver;
          const silverRatePerGram = rawSilver > 1000 ? rawSilver / 1000 : rawSilver;
          
          return `Aaj ke Gold aur Silver ke Base Rates hain:\n\n• **24K Gold:** ₹${Math.round(rates.gold24k).toLocaleString('en-IN')} / gram\n• **22K Gold:** ₹${Math.round(rates.gold22k).toLocaleString('en-IN')} / gram\n• **18K Gold:** ₹${Math.round(rates.gold18k).toLocaleString('en-IN')} / gram\n• **Silver Rate:** ₹${Math.round(silverRatePerGram).toLocaleString('en-IN')} / gram\n\n*(Note: Sone (Gold) par 15% Making Charge aur 3% GST alag se add hota hai. Chandi (Silver) par calculation Category ke according specific making charges aur 3% GST ke sath hoti hai.)*`;
        }
      } catch (err) {
        // Fallback
      }
      return "I'm having trouble fetching live rates right now. However, you can call us directly at **+91 98387 22733** for the latest rates, or check back in a moment!";
    }

    // Q7: Mujhe custom design jewelry banwani hai, kitna time lagega?
    if (
      cleanQuery.includes('custom design') ||
      cleanQuery.includes('custom jewelry') ||
      cleanQuery.includes('design jewelry') ||
      cleanQuery.includes('customise') ||
      cleanQuery.includes('design banwani') ||
      cleanQuery.includes('order design') ||
      cleanQuery.includes('banwani')
    ) {
      return "Custom jewelry design hone aur banne me lagbhag 14 se 21 days lagte hain. Agar aapko kisi specific event ke liye chahiye, toh please hume date pehle bata dein taaki hum priority par kaam kar sakein.";
    }

    // Q8: Ring resizing ya repair karwane me kitna time lagta hai?
    if (
      cleanQuery.includes('resizing') ||
      cleanQuery.includes('resize') ||
      cleanQuery.includes('repair') ||
      cleanQuery.includes('fixing') ||
      cleanQuery.includes('repairing') ||
      cleanQuery.includes('repair karwane')
    ) {
      return "Normal ring resizing ya minor repair me 2 se 4 working days lagte hain.";
    }

    // Q9: Jewelry par naam ya date engrave (likhwana) karwane me kitna time lagta hai?
    if (
      cleanQuery.includes('engrave') ||
      cleanQuery.includes('engraving') ||
      cleanQuery.includes('naam likhwana') ||
      cleanQuery.includes('date likhwana') ||
      cleanQuery.includes('likhwana') ||
      cleanQuery.includes('naam engrave')
    ) {
      return "Personal engraving service me 2 se 3 days ka time lagta hai.";
    }

    // Q10: Dhanteras / Akshaya Tritiya ke liye advance booking kab se start hoti hai?
    if (
      cleanQuery.includes('advance booking') ||
      cleanQuery.includes('pre-booking') ||
      cleanQuery.includes('booking kab') ||
      cleanQuery.includes('pre booking') ||
      cleanQuery.includes('advance book') ||
      cleanQuery.includes('dhanteras booking') ||
      cleanQuery.includes('akshaya tritiya booking')
    ) {
      return "Hum Dhanteras/Akshaya Tritiya ke liye advance booking festival date se 15 se 20 din pehle start kar dete hain. Festival time par hum Sunday ko bhi showroom open rakhte hain aur special discounts bhi offer karte hain.";
    }

    // Q11: Kya abhi koi festive offer ya discount chal raha hai?
    if (
      cleanQuery.includes('offer') ||
      cleanQuery.includes('discount') ||
      cleanQuery.includes('festive offer') ||
      cleanQuery.includes('festival offer') ||
      cleanQuery.includes('deal') ||
      cleanQuery.includes('sale') ||
      cleanQuery.includes('discounts') ||
      cleanQuery.includes('offers')
    ) {
      return "Festival season (Dhanteras, Diwali, Akshaya Tritiya) ke time par humare yahan special discounts aur 15% making charge par offers available rehte hain! Latest offer janne ke liye aap showroom visit kar sakte hain ya humse yahan enquiry kar sakte hain.";
    }

    // Q12: Online order karne par delivery kitne din me milegi?
    if (
      cleanQuery.includes('delivery') ||
      cleanQuery.includes('shipping') ||
      cleanQuery.includes('online order') ||
      cleanQuery.includes('courier') ||
      cleanQuery.includes('dispatch') ||
      cleanQuery.includes('deliver') ||
      cleanQuery.includes('delivery kitne')
    ) {
      return "Standard delivery me 5 se 7 business days lagte hain. Dispatch hone ke baad aapko tracking link WhatsApp/SMS par bhej diya jata hai.";
    }

    // Q13: Kya aapki jewelry Hallmarked / Certified hai?
    if (
      cleanQuery.includes('hallmarked') ||
      cleanQuery.includes('hallmark') ||
      cleanQuery.includes('certified') ||
      cleanQuery.includes('certif') ||
      cleanQuery.includes('bis') ||
      cleanQuery.includes('purity') ||
      cleanQuery.includes('purity check') ||
      cleanQuery.includes('guarantee')
    ) {
      return "Haan, bilkul! Humari saari gold jewelry 100% BIS Hallmarked hoti hai aur diamond jewelry certified hoti hai, jisse aapko purity ki poori guarantee milti hai.";
    }

    // Q14: Exchange aur Return policy kya hai?
    if (
      cleanQuery.includes('return') ||
      cleanQuery.includes('exchange') ||
      cleanQuery.includes('refund') ||
      cleanQuery.includes('return policy') ||
      cleanQuery.includes('exchange policy')
    ) {
      return "Return Window: Delivery/Purchase ke 7 days ke andar aap return ya exchange kar sakte hain.\n\nOld Gold Exchange: Hum BIS hallmarked gold ke liye 100% value exchange offer karte hain (market rate ke according).";
    }

    // Silver Catalog Availability Rules
    const isSilverQuery = cleanQuery.includes('silver') || cleanQuery.includes('chandi');
    if (isSilverQuery) {
      const availableSilverItems = [
        'ring', 'angoothi', 'anguthi', 'chhalla', 'necklace', 'haar', 'neck', 
        'chain', 'zanjeer', 'bracelet', 'kada', 'kangan', 'payal', 'bichhiya', 
        'locket', 'chhagal', 'kamarband', 'katori', 'bowl', 'chamach', 'spoon', 
        'paan', 'supari', 'belpatra', 'murti', 'bhagwan', 'idol'
      ];
      
      let isAvailable = false;
      for (const item of availableSilverItems) {
        if (cleanQuery.includes(item)) {
          isAvailable = true;
          break;
        }
      }
      
      if (isAvailable) {
        return "Haan bilkul, yeh silver item hamare store me directly available hai! Aap ise directly order kar sakte hain ya pricing aur latest designs dekhne ke liye hamare store visit kar sakte hain.";
      } else {
        // Unknown or complex silver item
        return "Yeh item check karne ke liye aap kripya hamare store me visit karein ya owner se direct contact karein taaki hum aapko correct availability aur pricing bata sakein.\n\n📞 **Owner Contact:** +91 98387 22733\n📍 **Store Address:** Waslleyganj, Near Sai Baba Mandir, Mirzapur";
      }
    }

    // Default Fallback
    return "Thank you! I am the automated assistant for M/S Suman Jewellers. \n\nFor custom orders, gold/silver weight options, or stock availability, chatting with us on WhatsApp is the fastest way. \n\n💬 **Click the WhatsApp button below** to start a chat, or call us directly at **+91 98387 22733**.";
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() && !attachedImage) return;

    const currentAttachedImage = attachedImage;
    const currentAttachedType = attachedImageType;

    // Clear attachment state immediately
    setAttachedImage(null);
    setAttachedImageType('Jewelry');

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: textToSend || `📸 Attached Photo (${currentAttachedType})`,
      sender: 'user',
      image: currentAttachedImage || undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // If there was an attached image
    if (currentAttachedImage) {
      if (textToSend.trim()) {
        // Text Priority Flow (Case B)
        setTimeout(() => {
          setIsTyping(false);
          const lowerText = textToSend.toLowerCase().trim();
          
          if (lowerText.includes('price') || lowerText.includes('rate') || lowerText.includes('cost') || lowerText.includes('kitne ka') || lowerText.includes('bhav')) {
            setOrderFlowStep('purity_weight_size');
            setOrderData({
              photoUrl: currentAttachedImage,
              jewelryType: currentAttachedType,
              purityWeightSize: '',
              contactInfo: '',
              orderId: `ord-${Date.now()}`,
              purity: null,
              weight: null
            });
            setMessages((prev) => [
              ...prev,
              {
                id: `bot-${Date.now()}`,
                text: `Aapki photo mil gayi hai! 📸 Hum aisi **${currentAttachedType}** design ko aapki pasand ke weight aur purity (18K / 22K) me customize kar sakte hain. \n\nAaj ke rate ke hisab se approximate budget janne ke liye please iska estimated weight batayein (jaise '10 gram' ya '15g').`,
                sender: 'bot',
              }
            ]);
          } else if (lowerText.includes('ban') || lowerText.includes('order') || lowerText.includes('make')) {
            setOrderFlowStep('purity_weight_size');
            setOrderData({
              photoUrl: currentAttachedImage,
              jewelryType: currentAttachedType,
              purityWeightSize: '',
              contactInfo: '',
              orderId: `ord-${Date.now()}`,
              purity: null,
              weight: null
            });
            setMessages((prev) => [
              ...prev,
              {
                id: `bot-${Date.now()}`,
                text: `Ji bilkul! Aisi **${currentAttachedType}** hum orders par custom banate hain. Is order ko aage badhane ke liye please details batayein:\n\n1. **Aap ise kis purity me banwana chahte hain?** (18K / 22K)\n2. **Estimated weight ya budget kitna hai?** (e.g. 5-8 grams)`,
                sender: 'bot',
              }
            ]);
          } else {
            setMessages((prev) => [
              ...prev,
              {
                id: `bot-${Date.now()}`,
                text: `Aapke message "${textToSend}" aur photo ke liye shukriya! 🌸\n\nHum aisi custom **${currentAttachedType}** designs banate hain. Final estimation aur order confirm karne ke liye aap niche diye button se direct WhatsApp par confirm kar sakte hain:`,
                sender: 'bot',
                isWhatsAppEnquiry: true,
                whatsappText: 'Hello Suman Jewellers, I want to inquire about this custom jewelry design.'
              }
            ]);
          }
        }, 1000);
      } else {
        // Photo Only Flow (Case A)
        setPhotoFlowImage(currentAttachedImage);
        setPhotoFlowType(currentAttachedType);
        setPhotoFlowStep('options');
        setTimeout(() => {
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              text: `Mujhe aapki photo mil gayi hai! Aap is photo ke saath kya karna chahte hain? Kripya bataiye:\n\n• **Sale karna hai?** (Kya aap ise bechna ya exchange karna chahte hain?)\n• **Order dena hai?** (Kya aap aisa same custom design banwana chahte hain?)\n• **Store Enquiry?** (Kya aap yeh jaanna chahte hain ki aisa related jewellery design hamare store me abhi available hai ya nahi?)`,
              sender: 'bot',
            }
          ]);
        }, 1000);
      }
      return;
    }

    // If we are currently in an active custom order flow
    if (orderFlowStep) {
      setTimeout(() => {
        setIsTyping(false);

        if (orderFlowStep === 'ask_if_want_to_order') {
          const cleanText = textToSend.toLowerCase().trim();
          if (cleanText.includes('order') || cleanText.includes('haan') || cleanText.includes('yes') || cleanText.includes('sure') || cleanText.includes('banwa')) {
            setUserIntent('order');
            setOrderFlowStep('name');
            setMessages((prev) => [
              ...prev,
              {
                id: `bot-${Date.now()}`,
                text: `Dhanyawad! Custom order details confirm karne ke liye kripya apna **Full Name** batayein:`,
                sender: 'bot',
              },
            ]);
          } else {
            setOrderFlowStep(null);
            setUserIntent(null);
            setMessages((prev) => [
              ...prev,
              {
                id: `bot-${Date.now()}`,
                text: `Thik hai, koi baat nahi! Agar aapko koi aur help chahiye toh kripya batayein. 😊`,
                sender: 'bot',
              },
            ]);
          }
          return;
        }
        
        if (orderFlowStep === 'detect_category_fallback') {
          const lowerText = textToSend.toLowerCase().trim();
          let type = 'Jewelry';
          if (lowerText.includes('earring') || lowerText.includes('jhumka') || lowerText.includes('bali')) {
            type = 'Earrings (झुमका)';
          } else if (lowerText.includes('ring') || lowerText.includes('anguthi')) {
            type = 'Ring (अंगूठी)';
          } else if (lowerText.includes('chain') || lowerText.includes('zanjeer') || lowerText.includes('mala')) {
            type = 'Chain (चैन)';
          } else if (lowerText.includes('necklace') || lowerText.includes('haar') || lowerText.includes('neck')) {
            type = 'Necklace (हार)';
          } else if (lowerText.includes('bracelet') || lowerText.includes('kada') || lowerText.includes('kangan')) {
            type = 'Bracelet/Kada (कड़ा)';
          } else if (lowerText.includes('bangle') || lowerText.includes('chudi')) {
            type = 'Bangle (चूड़ी)';
          } else {
            type = textToSend.trim();
          }

          const updatedData = { ...orderData, jewelryType: type };
          setOrderData(updatedData);
          setOrderFlowStep('purity_weight_size');

          const isRing = type.toLowerCase().includes('ring') || type.toLowerCase().includes('anguthi');
          const detailPromptText = isRing
            ? `Aapki **${type}** design ke liye shukriya! Is design ko samajhne ke liye please ye details batayein:\n\n1. **Aap ise kis purity me banwana chahte hain?** (18K / 22K)\n2. **Aapka budget ya estimated weight kitna hai?** (e.g., 5-8 grams)\n3. **Aapki Ring ka size kya hai? (Ring Size)**`
            : `Aapki **${type}** design ke liye shukriya! Is design ko samajhne ke liye please ye details batayein:\n\n1. **Aap ise kis purity me banwana chahte hain?** (18K / 22K)\n2. **Aapka budget ya estimated weight kitna hai?** (e.g., 5-8 grams)`;

          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              text: detailPromptText,
              sender: 'bot',
            },
          ]);
          return;
        }

        if (orderFlowStep === 'purity_weight_size') {
          const cleanText = textToSend.toLowerCase().trim();

          if (cleanText.includes('silver') || cleanText.includes('chandi')) {
            setOrderFlowStep(null);
            setMessages((prev) => [
              ...prev,
              {
                id: `bot-${Date.now()}`,
                text: `Agar aap Silver (Chandi) me order dena chahte hain, toh hamare paas Silver Rings with Stone aur Silver Chhalla jaisi items ke orders directly available hain.\n\nKisi bhi specific ya custom silver jewellery order ke liye aap direct hamare Store se contact kar sakte hain ya Owner se seedhe baat kar sakte hain.\n\n📞 **Owner Contact:** +91 98387 22733\n📍 **Store Address:** Waslleyganj, Near Sai Baba Mandir, Mirzapur, Uttar Pradesh`,
                sender: 'bot',
                isWhatsAppEnquiry: true,
                whatsappText: 'Hello Suman Jewellers, I want to place a silver jewellery order.'
              }
            ]);
            return;
          }
          
          // 1. Try to detect purity
          const purityMatch = cleanText.match(/\b(18|22|24)\s*(?:k|karat|carat)?\b/i);
          let detectedPurity = orderData.purity;
          if (purityMatch) {
            detectedPurity = purityMatch[1] + 'K';
          }

          // 2. Try to detect weight
          let textWithoutPurity = cleanText;
          if (purityMatch) {
            textWithoutPurity = cleanText.replace(purityMatch[0], '');
          }

          const rangeMatch = textWithoutPurity.match(/(\d+(?:\.\d+)?)\s*(?:-|to|se)\s*(\d+(?:\.\d+)?)/);
          const singleMatch = textWithoutPurity.match(/(\d+(?:\.\d+)?)\s*(?:g|gram|grams|gm|gms|tola|tolas)?\b/);
          
          let detectedWeight = orderData.weight;
          if (rangeMatch) {
            detectedWeight = `${rangeMatch[1]}-${rangeMatch[2]} grams`;
          } else if (singleMatch) {
            const val = parseFloat(singleMatch[1]);
            if (!isNaN(val) && val > 0) {
              detectedWeight = `${val} grams`;
            }
          }

          let finalDetectedPurity = detectedPurity;
          const isSilverOrder = orderData.jewelryType.toLowerCase().includes('silver') || orderData.jewelryType.toLowerCase().includes('chandi');
          if (isSilverOrder) {
            finalDetectedPurity = 'Silver';
          }

          // Accumulate in state
          const updatedOrderData = {
            ...orderData,
            purity: finalDetectedPurity,
            weight: detectedWeight,
            purityWeightSize: orderData.purityWeightSize 
              ? `${orderData.purityWeightSize}, ${textToSend}` 
              : textToSend
          };
          setOrderData(updatedOrderData);

          // Validation check
          if (!finalDetectedPurity && !detectedWeight) {
            setTimeout(() => {
              setIsTyping(false);
              setMessages((prev) => [
                ...prev,
                {
                  id: `bot-${Date.now()}`,
                  text: `Mujhe details nahi mil paayi. Please batayein:\n1. Aap ise kis purity me banwana chahte hain? (18K / 22K)\n2. Aapka budget ya estimated weight kitna hai? (e.g., 5-8 grams)`,
                  sender: 'bot',
                },
              ]);
            }, 1000);
          } else if (!finalDetectedPurity) {
            setTimeout(() => {
              setIsTyping(false);
              setMessages((prev) => [
                ...prev,
                {
                  id: `bot-${Date.now()}`,
                  text: `Weight (${detectedWeight}) ke liye shukriya! Please iski purity (18K ya 22K) bhi batayein taaki main rough estimate calculate kar sakoon.`,
                  sender: 'bot',
                },
              ]);
            }, 1000);
          } else if (!detectedWeight) {
            setTimeout(() => {
              setIsTyping(false);
              setMessages((prev) => [
                ...prev,
                {
                  id: `bot-${Date.now()}`,
                  text: `Purity/Metal (${finalDetectedPurity}) ke liye shukriya! Please iska estimated weight ya budget bhi batayein (e.g., 5-8 grams) taaki main rough estimate calculate kar sakoon.`,
                  sender: 'bot',
                },
              ]);
            }, 1000);
          } else {
            // BOTH are found! Proceed to calculation
            fetch('/api/rates')
              .then((res) => (res.ok ? res.json() : null))
              .then((rates) => {
                let isSilverCalculation = finalDetectedPurity === 'Silver';
                let rate = 0;
                let details = null;
                
                if (isSilverCalculation) {
                  const rawSilverRate = rates ? rates.silver : 85;
                  rate = rawSilverRate > 1000 ? rawSilverRate / 1000 : rawSilverRate;
                  details = getSilverItemDetails(orderData.jewelryType);
                } else {
                  rate = rates ? rates.gold22k : 6000;
                  if (finalDetectedPurity?.includes('18')) {
                    rate = rates ? rates.gold18k : 5000;
                  } else if (finalDetectedPurity?.includes('24')) {
                    rate = rates ? rates.gold24k : 6500;
                  }
                }

                const singleParts = detectedWeight?.match(/(\d+(?:\.\d+)?)/);
                const isSingleWeight = singleParts && !detectedWeight?.includes('-');
                const cleanQuery = textToSend.toLowerCase();
                const isPurityRequested = cleanQuery.includes('purity') || cleanQuery.includes('carat') || cleanQuery.includes('karat') || cleanQuery.includes('percent');

                let estimationText = '';
                const typePhrase = orderData.jewelryType !== 'Jewelry' ? `Aisi **${orderData.jewelryType}**` : `Aisi design`;

                if (isSilverCalculation && details) {
                  const jewelleryRate = rate - 20; // Jewellery Rate = Pure Rate - ₹20
                  const purityPhrase = isPurityRequested ? ` (${details.purityName})` : '';
                  if (isSingleWeight) {
                    const exactW = parseFloat(singleParts[1]);
                    const basePrice = exactW * jewelleryRate;
                    const makingCharge = exactW * details.makingChargePerGram;
                    const subtotal = basePrice + makingCharge;
                    const gst = subtotal * 0.03;
                    const totalPrice = subtotal + gst;

                    estimationText = `⚖️ **Price Calculation (${exactW}g):**\n\n• **Item:** ${orderData.jewelryType}\n• **Weight:** ${exactW} gram\n• **Pure Silver Rate:** ₹${Math.round(rate)}/gram\n• **Jewellery Rate:** ₹${Math.round(jewelleryRate)}/gram\n• **Silver Base Price:** ₹${Math.round(basePrice).toLocaleString('en-IN')}\n• **Making Charge (₹${details.makingChargePerGram}/g):** ₹${Math.round(makingCharge).toLocaleString('en-IN')}\n• **GST (3%):** ₹${Math.round(gst).toLocaleString('en-IN')}\n• **Total Bill:** **₹${Math.round(totalPrice).toLocaleString('en-IN')}**\n\n*(Note: Market rates ke according price change ho sakta hai.)*`;
                  } else {
                    const rangeParts = detectedWeight?.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/);
                    let minW = 5, maxW = 10;
                    if (rangeParts) {
                      minW = parseFloat(rangeParts[1]);
                      maxW = parseFloat(rangeParts[2]);
                    } else if (singleParts) {
                      const sW = parseFloat(singleParts[1]);
                      minW = Math.max(1, sW - 1);
                      maxW = sW + 1;
                    }
                    const minBase = minW * jewelleryRate;
                    const maxBase = maxW * jewelleryRate;
                    const minMaking = minW * details.makingChargePerGram;
                    const maxMaking = maxW * details.makingChargePerGram;
                    const minPrice = (minBase + minMaking) * 1.03;
                    const maxPrice = (maxBase + maxMaking) * 1.03;

                    estimationText = `⚖️ **Rough Estimate (Expected Range):**\n\n${typePhrase} ka weight **${minW}g se ${maxW}g** ke beech aayega. Jewellery Rate (₹${Math.round(jewelleryRate)}/g) + Making (₹${details.makingChargePerGram}/g) + 3% GST ke hisab se rough cost **₹${Math.round(minPrice).toLocaleString('en-IN')} se ₹${Math.round(maxPrice).toLocaleString('en-IN')}** ke beech aayega.`;
                  }
                } else {
                  const purityPhrase = isPurityRequested ? ` ${finalDetectedPurity}` : '';
                  if (isSingleWeight) {
                    const exactW = parseFloat(singleParts[1]);
                    const basePrice = exactW * rate;
                    const makingCharge = basePrice * 0.15;
                    const gst = (basePrice + makingCharge) * 0.03;
                    const totalPrice = basePrice + makingCharge + gst;

                    estimationText = `⚖️ **Price Calculation (${exactW}g):**\n\n• **Item:** ${orderData.jewelryType}\n• **Weight:** ${exactW} gram\n• **Base Gold Rate:** ₹${Math.round(rate)}/gram\n• **Base Price:** ₹${Math.round(basePrice).toLocaleString('en-IN')}\n• **Making Charge (15%):** ₹${Math.round(makingCharge).toLocaleString('en-IN')}\n• **GST (3%):** ₹${Math.round(gst).toLocaleString('en-IN')}\n• **Total Estimated Price:** **₹${Math.round(totalPrice).toLocaleString('en-IN')}**\n\n*(Note: Market rates ke according price change ho sakta hai.)*`;
                  } else {
                    const rangeParts = detectedWeight?.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/);
                    let minW = 5, maxW = 10;
                    if (rangeParts) {
                      minW = parseFloat(rangeParts[1]);
                      maxW = parseFloat(rangeParts[2]);
                    } else if (singleParts) {
                      const sW = parseFloat(singleParts[1]);
                      minW = Math.max(1, sW - 1);
                      maxW = sW + 1;
                    }
                    const minPrice = minW * rate * 1.15 * 1.03;
                    const maxPrice = maxW * rate * 1.15 * 1.03;

                    estimationText = `⚖️ **Rough Estimate (Expected Range):**\n\n${typePhrase} ka weight **${minW}g se ${maxW}g** ke beech aayega. Aaj ke Gold${purityPhrase} rate (₹${Math.round(rate)}/g) ke hisab se iska rough cost **₹${Math.round(minPrice).toLocaleString('en-IN')} se ₹${Math.round(maxPrice).toLocaleString('en-IN')}** ke beech aayega.\n\n*(Note: Isme 15% Making Charge aur 3% GST included hai.)*`;
                  }
                }

                if (userIntent === 'price') {
                  setOrderFlowStep('ask_if_want_to_order');
                  setIsTyping(false);
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: `bot-${Date.now()}`,
                      text: `${estimationText}\n\n❓ **Kya aap is design ka order custom banwana chahte hain?**`,
                      sender: 'bot',
                    },
                  ]);
                } else {
                  setOrderFlowStep('name');
                  setIsTyping(false);
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: `bot-${Date.now()}`,
                      text: `${estimationText}\n\n📝 **Order Form:**\nCustom order details confirm karne ke liye kripya apna **Full Name** batayein:`,
                      sender: 'bot',
                    },
                  ]);
                }
              })
              .catch(() => {
                if (userIntent === 'price') {
                  setOrderFlowStep(null);
                  setUserIntent(null);
                  setIsTyping(false);
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: `bot-${Date.now()}`,
                      text: `Rates fetch nahi ho paye. Rough price calculation ke liye please humare WhatsApp Number [+91 98387 22733] par design bhej kar direct check karein.`,
                      sender: 'bot',
                      isWhatsAppEnquiry: true,
                      whatsappText: `Hello Suman Jewellers, I wanted to get a price estimate for this design.`
                    },
                  ]);
                } else {
                  setOrderFlowStep('name');
                  setIsTyping(false);
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: `bot-${Date.now()}`,
                      text: `Rates fetch nahi ho paye, par hum order details save kar lete hain. Kripya apna **Full Name** batayein:`,
                      sender: 'bot',
                    },
                  ]);
                }
              });
          }
        } else if (orderFlowStep === 'name') {
          const updatedOrderData = {
            ...orderData,
            name: textToSend,
          };
          setOrderData(updatedOrderData);
          setOrderFlowStep('phone');
          
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              text: `Dhanyawad **${textToSend}**! \n\n📞 Next, please apna **WhatsApp/Phone Number** type/select karein:`,
              sender: 'bot',
            },
          ]);
        } else if (orderFlowStep === 'phone') {
          const updatedOrderData = {
            ...orderData,
            phone: textToSend,
          };
          setOrderData(updatedOrderData);
          setOrderFlowStep('delivery_date');
          
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              text: `Phone number note kar liya hai. \n\n📅 Aap is order ki delivery kab tak chahte hain? Preferred **Delivery Date** batayein (jaise '15 August' ya '10 days me'):`,
              sender: 'bot',
            },
          ]);
        } else if (orderFlowStep === 'delivery_date') {
          const finalOrderData = {
            ...orderData,
            deliveryDate: textToSend,
            contactInfo: `Name: ${orderData.name}, Phone: ${orderData.phone}, Delivery Date: ${textToSend}`,
          };
          
          setOrderData(finalOrderData);
          setOrderFlowStep(null);
          
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              text: `🎉 **Custom Order Details Saved!**\n\n📋 **Order Summary:**\n• **Item:** ${finalOrderData.jewelryType}\n• **Purity:** ${finalOrderData.purity || 'N/A'}\n• **Weight:** ${finalOrderData.weight || 'N/A'}\n\n👤 **Customer Details:**\n• **Name:** ${finalOrderData.name}\n• **Phone:** ${finalOrderData.phone}\n• **Delivery Date:** ${textToSend}\n\n🤝 Niche diye button par click karke details aur photo direct WhatsApp par forward karein order confirm karne ke liye:\n\nSend Design on WhatsApp`,
              sender: 'bot',
            },
          ]);

          // Automatically open WhatsApp redirect link
          const waLink = getWhatsAppLink(finalOrderData);
          window.open(waLink, '_blank');
        }
      }, 1000);
      return;
    }

    // If we are currently in a photo options decision flow
    if (photoFlowStep === 'options') {
      setTimeout(async () => {
        setIsTyping(false);
        const cleanText = textToSend.toLowerCase().trim();
        setPhotoFlowStep(null);

        if (cleanText.includes('sale') || cleanText.includes('bechna') || cleanText.includes('exchange')) {
          // Start buyback flow
          setUserIntent('sale');
          let metal: 'gold' | 'silver' | null = null;
          if (photoFlowType.toLowerCase().includes('gold') || cleanText.includes('gold') || cleanText.includes('sona')) {
            metal = 'gold';
          } else if (photoFlowType.toLowerCase().includes('silver') || cleanText.includes('silver') || cleanText.includes('chandi')) {
            metal = 'silver';
          }
          
          setBuybackFlowStep('weight');
          setBuybackData({
            metal: metal || 'gold',
            weight: null,
            purity: null,
            purityName: '',
            hasStones: null
          });

          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              text: `Old Jewellery Exchange/Sale flow chalu ho gaya hai. 💰\n\n⚖️ **Step 1:** Please item ka **total weight (in grams)** type/select karein (e.g., '10' ya '12.5 grams'):`,
              sender: 'bot',
            }
          ]);
        } else if (cleanText.includes('order') || cleanText.includes('banwana') || cleanText.includes('design')) {
          // Start custom order flow
          setUserIntent('order');
          setOrderFlowStep('purity_weight_size');
          setOrderData({
            photoUrl: photoFlowImage,
            jewelryType: photoFlowType,
            purityWeightSize: '',
            contactInfo: '',
            orderId: `ord-${Date.now()}`,
            purity: null,
            weight: null
          });

          const isSilver = photoFlowType.toLowerCase().includes('silver') || photoFlowType.toLowerCase().includes('chandi');
          const isRing = photoFlowType.toLowerCase().includes('ring') || photoFlowType.toLowerCase().includes('anguthi');
          
          let detailPromptText = '';
          const photoNote = !photoFlowImage ? '\n\n*(Note: Agar aapke paas design ki photo hai, toh aap use niche paperclip icon 📎 par click karke upload kar sakte hain.)*' : '';
          if (isSilver) {
            detailPromptText = isRing
              ? `Ji bilkul, aisi custom **${photoFlowType}** banwane ke liye please ye details batayein! 🎨${photoNote}\n\n1. **Estimated weight kitna hai?** (e.g. 5-8 grams)\n2. **Aapki Ring ka size kya hai? (Ring Size)**`
              : `Ji bilkul, aisi custom **${photoFlowType}** banwane ke liye please ye details batayein! 🎨${photoNote}\n\n1. **Estimated weight kitna hai?** (e.g. 5-8 grams)`;
          } else {
            detailPromptText = isRing
              ? `Ji bilkul, aisi custom **${photoFlowType}** banwane ke liye please ye details batayein! 🎨${photoNote}\n\n1. **Aap ise kis purity me banwana chahte hain?** (18K / 22K)\n2. **Estimated weight ya budget kitna hai?** (e.g. 5-8 grams)\n3. **Aapki Ring ka size kya hai? (Ring Size)**`
              : `Ji bilkul, aisi custom **${photoFlowType}** banwane ke liye please ye details batayein! 🎨${photoNote}\n\n1. **Aap ise kis purity me banwana chahte hain?** (18K / 22K)\n2. **Estimated weight ya budget kitna hai?** (e.g. 5-8 grams)`;
          }

          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              text: detailPromptText,
              sender: 'bot',
            }
          ]);
        } else if (cleanText.includes('price') || cleanText.includes('rate') || cleanText.includes('value') || cleanText.includes('daam') || cleanText.includes('cost') || cleanText.includes('bhav') || cleanText.includes('janna')) {
          // Start pricing/rough estimate flow
          setUserIntent('price');
          setOrderFlowStep('purity_weight_size');
          setOrderData({
            photoUrl: photoFlowImage,
            jewelryType: photoFlowType,
            purityWeightSize: '',
            contactInfo: '',
            orderId: `ord-${Date.now()}`,
            purity: null,
            weight: null
          });

          const isSilver = photoFlowType.toLowerCase().includes('silver') || photoFlowType.toLowerCase().includes('chandi');
          const isRing = photoFlowType.toLowerCase().includes('ring') || photoFlowType.toLowerCase().includes('anguthi');
          
          let detailPromptText = '';
          const photoNote = !photoFlowImage ? '\n\n*(Note: Agar aapke paas design ki photo hai, toh aap use niche paperclip icon 📎 par click karke upload kar sakte hain.)*' : '';
          if (isSilver) {
            detailPromptText = isRing
              ? `Aisi custom **${photoFlowType}** ka estimated price/rough calculation janne ke liye please details batayein! ⚖️${photoNote}\n\n1. **Estimated weight kitna hai?** (e.g. 5-8 grams)\n2. **Aapki Ring ka size kya hai? (Ring Size)**`
              : `Aisi custom **${photoFlowType}** ka estimated price/rough calculation janne ke liye please details batayein! ⚖️${photoNote}\n\n1. **Estimated weight kitna hai?** (e.g. 5-8 grams)`;
          } else {
            detailPromptText = isRing
              ? `Aisi custom **${photoFlowType}** ka estimated price/rough calculation janne ke liye please details batayein! ⚖️${photoNote}\n\n1. **Aap ise kis purity me banwana chahte hain?** (18K / 22K)\n2. **Estimated weight kitna hai?** (e.g. 5-8 grams)\n3. **Aapki Ring ka size kya hai? (Ring Size)**`
              : `Aisi custom **${photoFlowType}** ka estimated price/rough calculation janne ke liye please details batayein! ⚖️${photoNote}\n\n1. **Aap ise kis purity me banwana chahte hain?** (18K / 22K)\n2. **Estimated weight kitna hai?** (e.g. 5-8 grams)`;
          }

          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              text: detailPromptText,
              sender: 'bot',
            }
          ]);
        } else if (cleanText.includes('enquiry') || cleanText.includes('enquiri') || cleanText.includes('inquiry')) {
          // General WhatsApp enquiry
          setUserIntent('enquiry');
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              text: `Kisi bhi custom enquiry ke liye aap direct hamare WhatsApp Number par message kar sakte hain ya seedhe call kar sakte hain. Humari team aapko jald se jald response degi!\n\n📞 **Owner Contact:** +91 98387 22733\n📍 **Store Address:** Waslleyganj, Near Sai Baba Mandir, Mirzapur`,
              sender: 'bot',
              isWhatsAppEnquiry: true,
              whatsappText: `Namaste Suman Jewellers, mujhe custom ${photoFlowType} ke baare me inquiry karni hai.`
            }
          ]);
        } else if (cleanText.includes('avail') || cleanText.includes('stock') || cleanText.includes('dukaan') || cleanText.includes('shop') || cleanText.includes('showroom')) {
          // Availability check
          setUserIntent('available');
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              text: `Hamare store me bahut saare fancy designs ready stock me available rehte hain. Aisi **${photoFlowType}** ki ready-made designs aur stock confirmation ke liye aap niche click karke WhatsApp par check kar sakte hain, ya seedhe humare showroom par visit kar sakte hain!\n\n📍 **Store Address:** Waslleyganj, Near Sai Baba Mandir, Mirzapur\n📞 **Owner Contact:** +91 98387 22733`,
              sender: 'bot',
              isWhatsAppEnquiry: true,
              whatsappText: `Namaste Suman Jewellers, kya aapke store me ${photoFlowType} ready stock me available hai?`
            }
          ]);
        } else {
          // Fallback to normal bot response
          const replyText = await getBotResponse(textToSend);
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              text: replyText,
              sender: 'bot',
            }
          ]);
        }
      }, 1000);
      return;
    }

    // If we are currently in a price metal selection flow
    if (photoFlowStep === 'price_metal_select') {
      setTimeout(async () => {
        setIsTyping(false);
        const cleanText = textToSend.toLowerCase().trim();
        setPhotoFlowStep(null);

        if (cleanText.includes('gold') || cleanText.includes('sona') || cleanText.includes('sone')) {
          setUserIntent('price');
          setOrderFlowStep('purity_weight_size');
          setOrderData({
            photoUrl: null,
            jewelryType: 'Gold',
            purityWeightSize: '',
            contactInfo: '',
            orderId: `ord-${Date.now()}`,
            purity: null,
            weight: null
          });

          setIsTyping(true);
          try {
            const res = await fetch('/api/rates');
            const rates = res.ok ? await res.json() : null;
            let ratesText = '';
            if (rates) {
              ratesText = `Aaj ke Gold Rates:\n• **24K Gold:** ₹${Math.round(rates.gold24k).toLocaleString('en-IN')}/g\n• **22K Gold:** ₹${Math.round(rates.gold22k).toLocaleString('en-IN')}/g\n• **18K Gold:** ₹${Math.round(rates.gold18k).toLocaleString('en-IN')}/g\n\n`;
            }
            setIsTyping(false);
            setMessages((prev) => [
              ...prev,
              {
                id: `bot-${Date.now()}`,
                text: `${ratesText}Aapke Gold item ka rough price calculation (estimate) janne ke liye, please item ka **estimated weight (in grams)** batayein (e.g. '10 gram'):`,
                sender: 'bot',
              }
            ]);
          } catch (err) {
            setIsTyping(false);
            setMessages((prev) => [
              ...prev,
              {
                id: `bot-${Date.now()}`,
                text: `Aapke Gold item ka rough price calculation (estimate) janne ke liye, please item ka **estimated weight (in grams)** batayein (e.g. '10 gram'):`,
                sender: 'bot',
              }
            ]);
          }
        } else if (cleanText.includes('silver') || cleanText.includes('chandi')) {
          setUserIntent('price');
          setOrderFlowStep('purity_weight_size');
          setOrderData({
            photoUrl: null,
            jewelryType: 'Silver',
            purityWeightSize: '',
            contactInfo: '',
            orderId: `ord-${Date.now()}`,
            purity: 'Silver',
            weight: null
          });

          setIsTyping(true);
          try {
            const res = await fetch('/api/rates');
            const rates = res.ok ? await res.json() : null;
            let ratesText = '';
            if (rates) {
              const rawSilver = rates.silver;
              const silverRatePerGram = rawSilver > 1000 ? rawSilver / 1000 : rawSilver;
              ratesText = `Aaj ka Silver Rate:\n• **Silver:** ₹${Math.round(silverRatePerGram).toLocaleString('en-IN')}/g\n\n`;
            }
            setIsTyping(false);
            setMessages((prev) => [
              ...prev,
              {
                id: `bot-${Date.now()}`,
                text: `${ratesText}Aapke Silver item ka rough price calculation (estimate) janne ke liye, please item ka **estimated weight (in grams)** batayein (e.g. '15 gram'):`,
                sender: 'bot',
              }
            ]);
          } catch (err) {
            setIsTyping(false);
            setMessages((prev) => [
              ...prev,
              {
                id: `bot-${Date.now()}`,
                text: `Aapke Silver item ka rough price calculation (estimate) janne ke liye, please item ka **estimated weight (in grams)** batayein (e.g. '15 gram'):`,
                sender: 'bot',
              }
            ]);
          }
        } else {
          // Fallback to normal bot response
          const replyText = await getBotResponse(textToSend);
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              text: replyText,
              sender: 'bot',
            }
          ]);
        }
      }, 1000);
      return;
    }

    // If we are currently in an active buyback flow
    if (buybackFlowStep) {
      setTimeout(() => {
        setIsTyping(false);
        processBuybackStep(textToSend);
      }, 1000);
      return;
    }

    // Check if it is a sell/buyback query
    const cleanQuery = textToSend.toLowerCase().trim();
    const isSellQuery = 
      cleanQuery.includes('sell') || 
      cleanQuery.includes('bechna') || 
      cleanQuery.includes('bechne') || 
      cleanQuery.includes('bechni') || 
      cleanQuery.includes('bechana') || 
      cleanQuery.includes('buyback') || 
      cleanQuery.includes('value of old') || 
      cleanQuery.includes('purana sona') || 
      cleanQuery.includes('old gold') || 
      cleanQuery.includes('valuation') || 
      cleanQuery.includes('chandi bechni') ||
      cleanQuery.includes('old jewellery') ||
      cleanQuery.includes('old jewelry') ||
      cleanQuery.includes('purani jewellery') ||
      cleanQuery.includes('purani jewelry') ||
      cleanQuery.includes('sale krna') ||
      cleanQuery.includes('sale karna') ||
      cleanQuery.includes('sell krna') ||
      cleanQuery.includes('sell karna') ||
      ((cleanQuery.includes('puran') || /\bold\b/.test(cleanQuery)) && 
       (cleanQuery.includes('sona') || cleanQuery.includes('chandi') || cleanQuery.includes('gold') || cleanQuery.includes('silver') || cleanQuery.includes('jewel')));

    if (isSellQuery && !orderFlowStep && !buybackFlowStep) {
      // 1. Try to parse metal (only parse if it is clearly one or the other; don't default if query has both like the main welcome action query)
      let metal: 'gold' | 'silver' | null = null;
      const hasGold = cleanQuery.includes('gold') || cleanQuery.includes('sona') || cleanQuery.includes('sone');
      const hasSilver = cleanQuery.includes('silver') || cleanQuery.includes('chandi');

      if (hasGold && !hasSilver) {
        metal = 'gold';
      } else if (hasSilver && !hasGold) {
        metal = 'silver';
      }

      // 2. Try to parse weight
      const weightMatch = cleanQuery.match(/(\d+(?:\.\d+)?)\s*(?:g|gram|grams|gm|gms|tola|tolas)\b/i);
      let weightVal = weightMatch ? parseFloat(weightMatch[1]) : null;
      if (weightMatch && weightMatch[0].toLowerCase().includes('tola')) {
        weightVal = (weightVal || 0) * 11.66;
      }

      // 3. Try to parse purity
      let purity = null;
      let purityName = '';
      if (metal === 'gold') {
        if (cleanQuery.includes('22k') || cleanQuery.includes('22 k') || cleanQuery.includes('916')) {
          purity = 0.916;
          purityName = '22K (91.6%)';
        } else if (cleanQuery.includes('18k') || cleanQuery.includes('18 k') || cleanQuery.includes('750')) {
          purity = 0.75;
          purityName = '18K (75.0%)';
        } else if (cleanQuery.includes('14k') || cleanQuery.includes('14 k') || cleanQuery.includes('585')) {
          purity = 0.585;
          purityName = '14K (58.5%)';
        } else if (cleanQuery.includes('10k') || cleanQuery.includes('10 k')) {
          purity = 0.417;
          purityName = '10K (41.7%)';
        } else if (cleanQuery.includes('24k') || cleanQuery.includes('24 k')) {
          purity = 1.0;
          purityName = '24K (100%)';
        }
      } else if (metal === 'silver') {
        if (cleanQuery.includes('pure') || cleanQuery.includes('99.9') || cleanQuery.includes('999')) {
          purity = 1.0;
          purityName = 'Pure Silver (99.9%)';
        } else if (cleanQuery.includes('sterling') || cleanQuery.includes('92.5') || cleanQuery.includes('925')) {
          purity = 0.925;
          purityName = 'Sterling Silver (92.5%)';
        } else {
          purity = 0.65;
          purityName = 'Silver (65% Purity)';
        }
      }

      // If we parsed metal, weight and purity:
      if (metal && weightVal && purity) {
        setTimeout(async () => {
          setIsTyping(false);
          try {
            const res = await fetch('/api/rates');
            let rates;
            if (res.ok) {
              rates = await res.json();
            } else {
              throw new Error();
            }
            const rawSilver = rates ? rates.silver : 85;
            const baseRate = metal === 'gold' ? rates.gold24k : (rawSilver > 1000 ? rawSilver / 1000 : rawSilver);
            const rawValue = weightVal * purity * baseRate;
            const finalPayout = rawValue;

            const hasStones = cleanQuery.includes('stone') || cleanQuery.includes('bead') || cleanQuery.includes('enamel') || cleanQuery.includes('mina');
            const updatedBuybackData = { metal, weight: weightVal, purity, purityName, hasStones };
            setBuybackData(updatedBuybackData);

            const breakdown = `Hello! Here is the estimated payout breakdown for your old jewellery:

• **Item:** ${metal === 'gold' ? 'Gold 🟡' : 'Silver ⚪'} (${purityName})
• **Net Weight:** ${weightVal} grams
• **Today's Base Rate:** ₹${Math.round(baseRate).toLocaleString('en-IN')}/g
• **Gross Metal Value:** ₹${Math.round(rawValue).toLocaleString('en-IN')}
• **Stone Check Note:** ${hasStones ? 'Note: Non-precious stone/bead weight will be subtracted at our counter before final testing.' : 'Plain metal (no stone weight deductions).'}

💰 **Estimated Payout:** **₹${Math.round(finalPayout).toLocaleString('en-IN')}**

*(Note: This valuation is an estimate subject to final physical testing (XRF machine / weight verification) at our store.)*`;

            setMessages((prev) => [
              ...prev,
              {
                id: `bot-${Date.now()}`,
                text: breakdown,
                sender: 'bot',
              },
            ]);
          } catch (e) {
            // Fallback baseline calculation
            const dateSeed = new Date().getDate();
            const baseRate = metal === 'gold' ? (7250 + (dateSeed % 8 - 4) * 15) : 85;
            const rawValue = weightVal * purity * baseRate;
            const finalPayout = rawValue;

            const hasStones = cleanQuery.includes('stone') || cleanQuery.includes('bead') || cleanQuery.includes('enamel') || cleanQuery.includes('mina');
            const updatedBuybackData = { metal, weight: weightVal, purity, purityName, hasStones };
            setBuybackData(updatedBuybackData);

            const breakdown = `Hello! Here is the estimated payout breakdown for your old jewellery:

• **Item:** ${metal === 'gold' ? 'Gold 🟡' : 'Silver ⚪'} (${purityName})
• **Net Weight:** ${weightVal} grams
• **Today's Base Rate:** ₹${Math.round(baseRate).toLocaleString('en-IN')}/g
• **Gross Metal Value:** ₹${Math.round(rawValue).toLocaleString('en-IN')}
• **Stone Check Note:** ${hasStones ? 'Note: Non-precious stone/bead weight will be subtracted at our counter before final testing.' : 'Plain metal (no stone weight deductions).'}

💰 **Estimated Payout:** **₹${Math.round(finalPayout).toLocaleString('en-IN')}**

*(Note: This valuation is an estimate subject to final physical testing (XRF machine / weight verification) at our store.)*`;

            setMessages((prev) => [
              ...prev,
              {
                id: `bot-${Date.now()}`,
                text: breakdown,
                sender: 'bot',
              },
            ]);
          }
        }, 1000);
        return;
      }

      // Start the interactive flow with whatever details we could parse
      const updatedBuybackData = { metal, weight: weightVal, purity, purityName: purityName || '', hasStones: null };
      setBuybackData(updatedBuybackData);
      
      let nextStep: 'metal_type' | 'weight' | 'purity' | 'stones_check' = 'metal_type';
      let botPrompt = '';

      if (!metal) {
        nextStep = 'metal_type';
        botPrompt = `Haan, hamare yaha old gold aur silver sale (exchange/buyback) hota hai. Aapki kaun si jewellery hai (Gold ya Silver)?`;
      } else if (!weightVal) {
        nextStep = 'weight';
        botPrompt = `Hello! I am your Old Gold & Silver Buying Assistant for M/S Suman Jewellers. 💰\n\nAapke **${metal === 'gold' ? 'Gold' : 'Silver'}** ke estimate ke liye, please item ka total weight (in grams) batayein (e.g. 10 grams):`;
      } else if (!purity) {
        nextStep = 'purity';
        if (metal === 'gold') {
          botPrompt = `Hello! I am your Old Gold & Silver Buying Assistant for M/S Suman Jewellers. 💰\n\nItem: **Gold**, Weight: **${weightVal} grams**.\n\nPlease Gold ki purity (Carat) select karein:\n\n• **24K** (100%)\n• **22K** (91.6%)\n• **18K** (75.0%)\n• **14K** (58.5%)\n• **10K** (41.7%)`;
        } else {
          botPrompt = `Hello! I am your Old Gold & Silver Buying Assistant for M/S Suman Jewellers. 💰\n\nItem: **Silver**, Weight: **${weightVal} grams**.\n\nPlease Silver ki purity select karein:\n\n• **Pure Silver** (99.9%)\n• **Sterling Silver** (92.5%)\n• **Traditional/Local Silver** (~70-80%)`;
        }
      } else {
        nextStep = 'stones_check';
        botPrompt = `Hello! I am your Old Gold & Silver Buying Assistant for M/S Suman Jewellers. 💰\n\nItem: **${metal === 'gold' ? 'Gold' : 'Silver'}** (${purityName || 'N/A'}), Weight: **${weightVal} grams**.\n\nKya is jewellery me stone work, beads, enamel, ya bhaari solder (tanka) laga hua hai?`;
      }

      setBuybackFlowStep(nextStep);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            text: botPrompt,
            sender: 'bot',
          },
        ]);
      }, 1000);
      return;
    }

    // Intercept generic jewelry keyword queries to ask their intent first
    const lowerText = textToSend.toLowerCase().trim();

    // Intercept generic price word queries without specified weight to start interactive calculation
    const isPriceQuery = 
      lowerText.includes('price') || 
      lowerText.includes('rate') || 
      lowerText.includes('cost') || 
      lowerText.includes('bhav') || 
      lowerText.includes('daam') || 
      lowerText.includes('kitne ka') || 
      lowerText.includes('value');

    const weightMatchCheck = lowerText.match(/(\d+(?:\.\d+)?)\s*(?:g|gram|grams|gm|gms|tola|tolas)\b/i);

    if (isPriceQuery && !weightMatchCheck && !orderFlowStep && !buybackFlowStep && !photoFlowStep) {
      const hasGold = lowerText.includes('gold') || lowerText.includes('sona') || lowerText.includes('sone');
      const hasSilver = lowerText.includes('silver') || lowerText.includes('chandi');

      if (hasGold && !hasSilver) {
        setUserIntent('price');
        setOrderFlowStep('purity_weight_size');
        setOrderData({
          photoUrl: null,
          jewelryType: 'Gold',
          purityWeightSize: '',
          contactInfo: '',
          orderId: `ord-${Date.now()}`,
          purity: null,
          weight: null
        });

        setTimeout(async () => {
          setIsTyping(true);
          try {
            const res = await fetch('/api/rates');
            const rates = res.ok ? await res.json() : null;
            let ratesText = '';
            if (rates) {
              ratesText = `Aaj ke Gold Rates:\n• **24K Gold:** ₹${Math.round(rates.gold24k).toLocaleString('en-IN')}/g\n• **22K Gold:** ₹${Math.round(rates.gold22k).toLocaleString('en-IN')}/g\n• **18K Gold:** ₹${Math.round(rates.gold18k).toLocaleString('en-IN')}/g\n\n`;
            }
            setIsTyping(false);
            setMessages((prev) => [
              ...prev,
              {
                id: `bot-${Date.now()}`,
                text: `${ratesText}Aapke Gold item ka rough price calculation (estimate) janne ke liye, please item ka **estimated weight (in grams)** batayein (e.g. '10 gram'):`,
                sender: 'bot',
              }
            ]);
          } catch (err) {
            setIsTyping(false);
            setMessages((prev) => [
              ...prev,
              {
                id: `bot-${Date.now()}`,
                text: `Aapke Gold item ka rough price calculation (estimate) janne ke liye, please item ka **estimated weight (in grams)** batayein (e.g. '10 gram'):`,
                sender: 'bot',
              }
            ]);
          }
        }, 1000);
        return;
      } else if (hasSilver && !hasGold) {
        setUserIntent('price');
        setOrderFlowStep('purity_weight_size');
        setOrderData({
          photoUrl: null,
          jewelryType: 'Silver',
          purityWeightSize: '',
          contactInfo: '',
          orderId: `ord-${Date.now()}`,
          purity: 'Silver',
          weight: null
        });

        setTimeout(async () => {
          setIsTyping(true);
          try {
            const res = await fetch('/api/rates');
            const rates = res.ok ? await res.json() : null;
            let ratesText = '';
            if (rates) {
              const rawSilver = rates.silver;
              const silverRatePerGram = rawSilver > 1000 ? rawSilver / 1000 : rawSilver;
              ratesText = `Aaj ka Silver Rate:\n• **Silver:** ₹${Math.round(silverRatePerGram).toLocaleString('en-IN')}/g\n\n`;
            }
            setIsTyping(false);
            setMessages((prev) => [
              ...prev,
              {
                id: `bot-${Date.now()}`,
                text: `${ratesText}Aapke Silver item ka rough price calculation (estimate) janne ke liye, please item ka **estimated weight (in grams)** batayein (e.g. '15 gram'):`,
                sender: 'bot',
              }
            ]);
          } catch (err) {
            setIsTyping(false);
            setMessages((prev) => [
              ...prev,
              {
                id: `bot-${Date.now()}`,
                text: `Aapke Silver item ka rough price calculation (estimate) janne ke liye, please item ka **estimated weight (in grams)** batayein (e.g. '15 gram'):`,
                sender: 'bot',
              }
            ]);
          }
        }, 1000);
        return;
      } else {
        // Ask Gold or Silver price check selection
        setPhotoFlowStep('price_metal_select');
        setPhotoFlowType('Jewelry');
        setPhotoFlowImage(null);

        setTimeout(() => {
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              text: `Aap kis metal (Gold 🟡 ya Silver ⚪) ka price check/calculation estimate check karna chahte hain? Kripya select karein:`,
              sender: 'bot',
            }
          ]);
        }, 1000);
        return;
      }
    }

    const isGeneralInfoQuery = 
      lowerText.includes('timing') || lowerText.includes('timings') || lowerText.includes('khula') || lowerText.includes('open') || lowerText.includes('close') ||
      lowerText.includes('address') || lowerText.includes('location') || lowerText.includes('map') || lowerText.includes('where') ||
      lowerText.includes('making') || lowerText.includes('charge') || lowerText.includes('gst') || lowerText.includes('tax') ||
      lowerText.includes('hi') || lowerText.includes('hello') || lowerText.includes('namaste') ||
      lowerText.includes('offer') || lowerText.includes('discount') || lowerText.includes('delivery') || lowerText.includes('hallmark') ||
      lowerText.includes('resizing') || lowerText.includes('repair') || lowerText.includes('engrave') || lowerText.includes('booking') ||
      lowerText.includes('return') || lowerText.includes('exchange');

    const isRatesQueryText = 
      lowerText.includes('today rate') ||
      lowerText.includes('today price') ||
      lowerText.includes('gold price') ||
      lowerText.includes('silver price') ||
      lowerText.includes('sone ka bhav') ||
      lowerText.includes('chandi ka rate') ||
      lowerText.includes('chandi ka bhav') ||
      ((lowerText.includes('rate') || lowerText.includes('price') || lowerText.includes('bhav') || lowerText.includes('cost')) && 
       (lowerText.includes('gold') || lowerText.includes('silver') || lowerText.includes('sona') || lowerText.includes('sone') || lowerText.includes('chandi')));

    let detectedType: string | null = null;
    if (
      !isSellQuery && 
      !orderFlowStep && 
      !buybackFlowStep && 
      !photoFlowStep && 
      !isRatesQueryText && 
      !isGeneralInfoQuery
    ) {
      const isEarring = lowerText.includes('earring') || lowerText.includes('jhumka') || lowerText.includes('jhumki') || lowerText.includes('bali') || lowerText.includes('baliya') || /\btop\b/.test(lowerText) || /\btops\b/.test(lowerText) || lowerText.includes('sui dhaga') || lowerText.includes('sui-dhaga');
      const isRing = /\bring\b/.test(lowerText) || /\brings\b/.test(lowerText) || lowerText.includes('anguthi') || lowerText.includes('angoothi') || lowerText.includes('chhalla') || lowerText.includes('challa');
      const isChain = lowerText.includes('chain') || lowerText.includes('chen') || lowerText.includes('zanjeer') || lowerText.includes('mala');
      const isNecklace = lowerText.includes('necklace') || lowerText.includes('neckless') || /\bhaar\b/.test(lowerText) || /\bhar\b/.test(lowerText) || /\bset\b/.test(lowerText) || lowerText.includes('choker') || lowerText.includes('mangalsutra') || lowerText.includes('locket') || lowerText.includes('pendant');
      const isBracelet = lowerText.includes('bracelet') || lowerText.includes('braclet') || lowerText.includes('kada') || lowerText.includes('kade') || lowerText.includes('kangan');
      const isBangle = lowerText.includes('bangle') || lowerText.includes('chudi') || lowerText.includes('choodi') || lowerText.includes('chudiyan');
      const isPayal = lowerText.includes('payal') || lowerText.includes('bichhiya') || lowerText.includes('bichhia') || lowerText.includes('pajeb');
      const isGeneralJewelry = lowerText.includes('jewel') || lowerText.includes('gahna') || lowerText.includes('gahne') || lowerText.includes('ornament');

      if (isEarring) {
        detectedType = 'Earrings (झुमका/बाली)';
      } else if (isRing) {
        detectedType = 'Ring (अंगूठी/छल्ला)';
      } else if (isChain) {
        detectedType = 'Chain (चैन/माला)';
      } else if (isNecklace) {
        detectedType = 'Necklace (हार/सेट)';
      } else if (isBracelet) {
        detectedType = 'Bracelet/Kada (कड़ा/ब्रेस्लेट)';
      } else if (isBangle) {
        detectedType = 'Bangle (चूड़ी/कंगन)';
      } else if (isPayal) {
        detectedType = 'Payal/Bichhiya (पायल/बिछिया)';
      } else if (isGeneralJewelry) {
        detectedType = 'Jewellery (आभूषण)';
      }
    }

    if (detectedType) {
      let metalPrefix = '';
      if (lowerText.includes('silver') || lowerText.includes('chandi')) {
        metalPrefix = 'Silver ';
      } else if (lowerText.includes('gold') || lowerText.includes('sona') || lowerText.includes('sone')) {
        metalPrefix = 'Gold ';
      }
      
      const fullType = metalPrefix ? metalPrefix + detectedType : detectedType;
      
      setPhotoFlowStep('options');
      setPhotoFlowType(fullType);
      setPhotoFlowImage(null);

      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            text: `Mujhe aapki **${fullType}** ke liye enquiry mil gayi hai! Aap is item ke saath kya karna chahte hain? Kripya batayein:\n\n• **Price janna hai?** (Rough estimate pricing calculator)\n• **Order dena hai?** (Custom order flow)\n• **Enquiry karna hai?** (Owner se direct contact)\n• **Shop me available hai ya nahi?** (Stock confirmation)\n• **Sale karna hai?** (Old gold/silver sell/exchange)`,
            sender: 'bot',
          }
        ]);
      }, 1000);
      return;
    }

    // Normal Q&A flow
    const replyText = await getBotResponse(textToSend);

    // Realistic delay for chatbot response
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          text: replyText,
          sender: 'bot',
          isCustomForm: replyText.includes('Custom Order / New Design Flow') || replyText.includes('Custom Order / New Design Flow'),
        },
      ]);

      // If user typed "yes" or clicked "Custom Order" to start custom order flow
      const cleanText = textToSend.toLowerCase().trim();
      if (
        (cleanText === 'yes' || cleanText === 'haan' || cleanText === 'sure' || cleanText === 'start') &&
        prevMessageWasUploadQuestion(messages)
      ) {
        setOrderFlowStep('photo');
        setOrderData({ photoUrl: null, purityWeightSize: '', contactInfo: '', orderId: '', jewelryType: 'Jewelry', purity: null, weight: null, name: '', phone: '', deliveryDate: '' });
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setMessages((prevMsg) => [
            ...prevMsg,
            {
              id: `bot-start-${Date.now()}`,
              text: `🎨 **Custom Order / New Design Flow**\n\n**Step 1:** Please upload a photo of the design you want us to make. Click the paperclip icon (📎) in the input bar or upload here:`,
              sender: 'bot',
              isCustomForm: true,
            },
          ]);
        }, 1000);
      } else if (
        cleanText === 'order' ||
        cleanText === 'place order' ||
        cleanText === 'custom order' ||
        cleanText === 'custom order / new design' ||
        cleanText.includes('new design') ||
        cleanText.includes('custom order') ||
        cleanText.includes('design banwani')
      ) {
        setOrderFlowStep('photo');
        setOrderData({ photoUrl: null, purityWeightSize: '', contactInfo: '', orderId: '', jewelryType: 'Jewelry', purity: null, weight: null, name: '', phone: '', deliveryDate: '' });
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setMessages((prevMsg) => [
            ...prevMsg,
            {
              id: `bot-start-${Date.now()}`,
              text: `🎨 **Custom Order / New Design Flow**\n\n**Step 1:** Please upload a photo of the design you want us to make. Click the paperclip icon (📎) in the input bar or upload here:`,
              sender: 'bot',
              isCustomForm: true,
            },
          ]);
        }, 1000);
      }
    }, 1000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome',
        text: 'Namaste! Welcome to M/S Suman Jewellers. How can I assist you with our collections or rates today?',
        sender: 'bot',
      },
    ]);
    setOrderFlowStep(null);
    setOrderData({
      photoUrl: null,
      purityWeightSize: '',
      contactInfo: '',
      orderId: '',
      jewelryType: 'Jewelry',
      purity: null,
      weight: null,
    });
    setBuybackFlowStep(null);
    setBuybackData({
      metal: null,
      weight: null,
      purity: null,
      purityName: '',
      hasStones: null,
    });
    setPhotoFlowStep(null);
    setPhotoFlowImage(null);
    setPhotoFlowType('Jewelry');
    setUserIntent(null);
    setAttachedImage(null);
    setAttachedImageType('Jewelry');
  };

  let quickReplies = [];
  if (photoFlowStep === 'options') {
    quickReplies = [
      { text: '⚖️ Price janna hai', query: 'Price janna hai' },
      { text: '✨ Order dena hai', query: 'Order dena hai' },
      { text: '💬 Enquiry karna hai', query: 'Enquiry karna hai' },
      { text: '🛍️ Shop me available hai ya nahi', query: 'Shop me available hai ya nahi' },
      { text: '💰 Sale karna hai', query: 'Sale karna hai' },
    ];
  } else if (photoFlowStep === 'price_metal_select') {
    quickReplies = [
      { text: '🟡 Gold Price', query: 'Gold Price' },
      { text: '⚪ Silver Price', query: 'Silver Price' },
    ];
  } else if (orderFlowStep === 'ask_if_want_to_order') {
    quickReplies = [
      { text: '✨ Haan, Order dena hai', query: 'Order dena hai' },
      { text: '❌ Nahi, bas price janna tha', query: 'Nahi' },
    ];
  } else if (orderFlowStep === 'detect_category_fallback') {
    quickReplies = [
      { text: '💍 Ring (अंगूठी)', query: 'Ring' },
      { text: '📿 Chain (चैन)', query: 'Chain' },
      { text: '💎 Necklace (हार)', query: 'Necklace' },
      { text: '✨ Kada/Bracelet (कड़ा)', query: 'Bracelet' },
      { text: '💫 Bangle (चूड़ी)', query: 'Bangle' },
      { text: '👂 Earrings (झुमका)', query: 'Earrings' },
    ];
  } else if (buybackFlowStep === 'metal_type') {
    quickReplies = [
      { text: '🟡 Gold', query: 'Gold' },
      { text: '⚪ Silver', query: 'Silver' },
    ];
  } else if (buybackFlowStep === 'purity') {
    if (buybackData.metal === 'gold') {
      quickReplies = [
        { text: '24K (100%)', query: '24K' },
        { text: '22K (91.6% - 916)', query: '22K' },
        { text: '18K (75% - 750)', query: '18K' },
        { text: '14K (58.5% - 585)', query: '14K' },
        { text: '10K (41.7%)', query: '10K' },
      ];
    } else {
      quickReplies = [
        { text: 'Pure Silver (99.9%)', query: 'Pure Silver (99.9%)' },
        { text: 'Sterling Silver (92.5%)', query: 'Sterling Silver (92.5%)' },
        { text: 'Traditional Silver (65%)', query: 'Traditional Silver (65%)' },
      ];
    }
  } else if (buybackFlowStep === 'stones_check') {
    quickReplies = [
      { text: 'Yes (Stones/Beads)', query: 'Yes' },
      { text: 'No (Plain metal)', query: 'No' },
    ];
  } else {
    quickReplies = [
      { text: 'Location', query: 'Showroom Location' },
      { text: 'Timings', query: 'Showroom Timings' },
      { text: 'Gold/Silver Rates', query: "Today's Gold Rate" },
      { text: 'Custom Order ✨', query: 'Custom Order / New Design' },
      { text: 'Sell Old Gold 💰', query: 'Sell Old Gold / Silver Valuation' },
      { text: 'Contact Owner', query: 'Contact Owner Info' },
    ];
  }

  return (
    <>
      {/* Floating Button */}
      <button 
        className={`${styles.floatingBtn} ${isOpen ? styles.floatingBtnActive : ''}`} 
        onClick={toggleChat}
        aria-label="Chat assistant"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
        {!isOpen && <div className={styles.pulse} />}
        {hasUnread && !isOpen && <div className={styles.badge} />}
      </button>

      {/* Chat Window */}
      <div className={`${styles.chatWindow} ${isOpen ? styles.chatWindowOpen : ''} ${isMaximized ? styles.chatWindowMaximized : ''}`} data-lenis-prevent>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <div className={styles.avatar}>
              <img
                src="/images/logo-gold.png"
                alt="Suman Jewellers Logo"
                style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%' }}
              />
            </div>
            <div className={styles.statusInfo}>
              <h3>Suman Assist</h3>
              <div className={styles.status}>
                <div className={styles.onlineDot} />
                <span>Online & Ready</span>
              </div>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button
              className={styles.clearBtn}
              onClick={handleClearChat}
              title="Clear Chat / New Chat"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
            <button
              className={styles.maximizeBtn}
              onClick={() => setIsMaximized(!isMaximized)}
              title={isMaximized ? "Minimize Chat" : "Maximize Chat"}
            >
              {isMaximized ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7"></path>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"></path>
                </svg>
              )}
            </button>
            <button className={styles.closeBtn} onClick={toggleChat} title="Close Chat">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className={styles.messages} data-lenis-prevent>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.msg} ${msg.sender === 'user' ? styles.msgUser : styles.msgBot}`}
              style={{ whiteSpace: 'pre-line' }}
            >
              {msg.text}
              {msg.image && (
                <img src={msg.image} className={styles.msgImage} alt="Uploaded Design" />
              )}
              {msg.isCustomForm && orderFlowStep === 'photo' && (
                <div>
                  <label className={styles.formUploadBtn}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                    </svg>
                    <span>Upload Jewelry Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              )}
              {msg.text.includes("Send Design on WhatsApp") && (
                <div>
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.whatsappBtn}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span>Send Design on WhatsApp</span>
                  </a>
                </div>
              )}
              {msg.isWhatsAppEnquiry && msg.whatsappText && (
                <div style={{ marginTop: '8px' }}>
                  <a
                    href={`https://wa.me/919838722733?text=${encodeURIComponent(msg.whatsappText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.whatsappBtn}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              )}
              {msg.text.includes("Send Buyback Details on WhatsApp") && (
                <div style={{ marginTop: '8px' }}>
                  <a
                    href={getBuybackWhatsAppLink(buybackData)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.whatsappBtn}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span>Send Buyback Details on WhatsApp</span>
                  </a>
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className={styles.typingIndicator}>
              <div className={styles.dot} />
              <div className={styles.dot} />
              <div className={styles.dot} />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <div className={styles.quickReplies} data-lenis-prevent>
          {quickReplies.map((reply) => (
            <button
              key={reply.text}
              className={styles.quickReplyBtn}
              onClick={() => handleSend(reply.query)}
            >
              {reply.text}
            </button>
          ))}
        </div>

        {/* Staged Attachment Preview */}
        {attachedImage && (
          <div className={styles.attachedPreview}>
            <div className={styles.previewContainer}>
              <img src={attachedImage} alt="Attachment Preview" />
              <span className={styles.previewBadge}>{attachedImageType}</span>
              <button 
                type="button" 
                className={styles.removeAttachmentBtn}
                onClick={() => setAttachedImage(null)}
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Input Area */}
        <form
          className={styles.inputArea}
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputValue);
          }}
        >
          <label className={styles.fileUploadBtn} title="Upload jewelry design photo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
            </svg>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
          </label>
          <input
            type="text"
            className={styles.input}
            placeholder="Ask about rates, timings, location..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            type="submit"
            className={styles.sendBtn}
            disabled={!inputValue.trim() && !attachedImage}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    </>
  );
}
