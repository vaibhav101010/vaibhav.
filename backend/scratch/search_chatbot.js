const fs = require('fs');
const code = fs.readFileSync('src/components/Chatbot.tsx', 'utf8');

const lines = code.split('\n');
lines.forEach((line, index) => {
  if (line.includes('setBuybackData') || line.includes('buybackData.metal') || line.includes('buybackFlowStep')) {
    console.log(`Line ${index + 1}: ${line.trim()}`);
  }
});
