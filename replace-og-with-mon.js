const fs = require('fs');
const path = require('path');

// Specific replacements for OG to MON conversion
const SPECIFIC_REPLACEMENTS = [
  // Balance and currency displays
  { pattern: /(\d+\.?\d*)\s*OG/g, replacement: '$1 MON' },
  { pattern: /OG\s*balance/gi, replacement: 'MON balance' },
  { pattern: /balance.*OG/gi, replacement: 'balance MON' },
  { pattern: /OG\s*amount/gi, replacement: 'MON amount' },
  { pattern: /OG\s*token/gi, replacement: 'MON token' },
  { pattern: /OG\s*currency/gi, replacement: 'MON currency' },
  
  // Variable names
  { pattern: /balanceInOg/g, replacement: 'balanceInMon' },
  { pattern: /getCurrentBalanceInOG/g, replacement: 'getCurrentBalanceInMON' },
  { pattern: /valueOg/g, replacement: 'valueMon' },
  
  // Comments and logs
  { pattern: /Transfer OG from/g, replacement: 'Transfer MON from' },
  { pattern: /Withdraw.*OG/g, replacement: 'Withdraw MON' },
  { pattern: /OG will be transferred/g, replacement: 'MON will be transferred' },
  { pattern: /Treasury balance.*OG/g, replacement: 'Treasury balance MON' },
  
  // Error messages
  { pattern: /Insufficient balance.*OG/g, replacement: 'Insufficient balance MON' },
  { pattern: /need (\d+\.?\d*) OG/g, replacement: 'need $1 MON' },
  { pattern: /have (\d+\.?\d*) OG/g, replacement: 'have $1 MON' },
  
  // UI text
  { pattern: /'Withdraw All OG'/g, replacement: "'Withdraw All MON'" },
  { pattern: /"Withdraw All OG"/g, replacement: '"Withdraw All MON"' },
  { pattern: /bets of (\d+\.?\d*) OG each/g, replacement: 'bets of $1 MON each' },
  
  // Network references (keep these as they are - we're not changing the network name)
  // { pattern: /0G.*Network/g, replacement: 'Monad Network' }, // Don't change this
  // { pattern: /og-galileo/g, replacement: 'monad-testnet' }, // Already handled in env
];

function replaceInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    SPECIFIC_REPLACEMENTS.forEach(({ pattern, replacement }) => {
      const originalContent = content;
      content = content.replace(pattern, replacement);
      if (content !== originalContent) {
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  items.forEach(item => {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip node_modules, .git, and other system directories
      if (!['node_modules', '.git', '.next', 'dist', 'build'].includes(item)) {
        processDirectory(fullPath);
      }
    } else if (stat.isFile()) {
      // Process JavaScript, TypeScript, and JSX files
      if (/\.(js|jsx|ts|tsx)$/.test(item)) {
        replaceInFile(fullPath);
      }
    }
  });
}

console.log('🔄 Starting OG to MON replacement...');
processDirectory('./src');
console.log('✅ OG to MON replacement completed!');