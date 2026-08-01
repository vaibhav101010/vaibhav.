# Suman Assist - Chatbot Programmed Logic & Details

This directory contains a copy of all the files and logical rules that power the **Suman Assist** chatbot on the M/S Suman Jewellers website.

---

## 📁 Directory Structure
- [Chatbot.tsx](file:///c:/Users/Lenovo/Desktop/suman%20jewllery%20arpita/chat%20bot%20details/Chatbot.tsx) - Main chatbot react component, contains the interactive dialog logic, regex parser, state management, and user routing.
- [Chatbot.module.css](file:///c:/Users/Lenovo/Desktop/suman%20jewllery%20arpita/chat%20bot%20details/Chatbot.module.css) - Complete styling sheets for animations (like the pulse badge, text bubblers, etc.) and layout responsiveness.
- [rates_route.ts](file:///c:/Users/Lenovo/Desktop/suman%20jewllery%20arpita/chat%20bot%20details/rates_route.ts) - The backend API scheduler that pulls live prices for Gold and Silver from external market indexes.

---

## ⚙️ Core Chatbot Functionality & Programming Rules

### 1. Jewellery Name Interception (Bilingual & Hinglish Support)
The bot intercepts any user query containing common Hinglish/English names of jewellery items:
- **Earrings**: `earring`, `earrings`, `jhumka`, `jhumki`, `bali`, `baliya`, `top`, `tops`, `sui dhaga`, `sui-dhaga`
- **Ring**: `ring`, `rings`, `anguthi`, `angoothi`, `chhalla`, `challa`
- **Chain**: `chain`, `chains`, `zanjeer`, `mala`, `kanthi`, `chen`
- **Necklace**: `necklace`, `neckless`, `haar`, `har`, `set`, `gold set`, `silver set`, `choker`, `mangalsutra`, `pendant`, `locket`
- **Bracelet**: `bracelet`, `kada`, `kade`, `kangan`
- **Bangle**: `bangle`, `chudi`, `choodi`, `chudiyan`
- **Payal**: `payal`, `bichhiya`, `bichhia`, `pajeb`
- **General**: `jewel`, `jewelry`, `jewellery`, `gahna`, `gahne`, `ornament`

Once a name is matched, the bot interrupts the standard Q&A flow and prompts the customer to choose their intent:
1. **Price janna hai?**
2. **Order dena hai?**
3. **Enquiry karna hai?**
4. **Shop me available hai ya nahi?**
5. **Sale karna hai?**

---

### 2. Price/Rate Interception (Generic Price Check)
If the customer types price-related words (e.g. `price`, `rate`, `cost`, `bhav`, `daam`, `kitne ka`, `value`):
- **With Weight (e.g. "10g gold price"):** The bot parses the weight/metal and directly displays the calculated price.
- **Without Weight (e.g. "gold price" or "silver rate"):**
  - **Gold:** Fetches live rates, prints them, and prompts the user to input the weight.
  - **Silver:** Fetches live rate, prints it, and prompts the user to input the weight.
  - **Generic ("price"):** Shows quick reply buttons (`🟡 Gold Price` / `⚪ Silver Price`) to select the metal first.

---

### 3. Price Calculation Rules (Dukaan Pricing Rules)
Calculations are executed in real time based on live commodity feeds:

#### 🟡 Gold Price Formula:
$$\text{Total Bill} = (\text{Weight} \times \text{Purity Rate}) \times 1.15 \text{ (15\% Making Charge)} \times 1.03 \text{ (3\% GST)}$$
- Gold purity rate matches either `18K`, `22K` or `24K` feeds from the live API.

#### ⚪ Silver Price Formula:
$$\text{Jewellery Rate} = \text{Pure Silver Rate} - 20\text{/gram}$$
$$\text{Subtotal} = (\text{Weight} \times \text{Jewellery Rate}) + (\text{Weight} \times \text{Making Charge per Gram})$$
$$\text{Total Bill} = \text{Subtotal} \times 1.03 \text{ (3\% GST)}$$
- Silver making charges are calculated based on the item type (e.g. `Payal/Bichhiya` = ₹10/g, `Chains/Bracelets` = ₹25/g, `Rings/Necklace` = ₹100/g).

---

### 4. Custom Order Flow
If a user selects "Order dena hai", the bot guides them through a step-by-step form:
1. **Design Photo:** Asks to upload a design photo via attachment button.
2. **Purity / Weight details:** Collects estimated weight and gold purity (18K / 22K).
3. **Customer Name:** Collects full name.
4. **Phone Number:** Collects WhatsApp/contact number.
5. **Delivery Date:** Collects preferred date.
6. **WhatsApp Redirect:** Pre-fills all details and automatically redirects the customer to send the design and information to Suman Jewellers' owner WhatsApp number (`+91 98387 22733`).

---

### 5. Old Gold & Silver Exchange/Buyback Assistant
If a user wants to sell old gold/silver:
1. **Metal Selection:** Gold or Silver.
2. **Weight:** Input weight in grams.
3. **Purity:** Selects Carat (for Gold) or Purity level (for Silver).
4. **Stone Check:** Deducts non-precious stone weights if stones are present.
5. **Payout estimation:** Prints a breakdown of the metal valuation based on today's base rate and provides a WhatsApp link to visit the store.
