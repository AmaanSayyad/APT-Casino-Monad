const fs = require('fs');
const path = require('path');

// Comprehensive replacements for OG to MON/Monad conversion
const REPLACEMENTS = [
  // Currency replacements
  { pattern: /(\d+\.?\d*)\s*OG\b/g, replacement: '$1 MON' },
  { pattern: /\bOG\s*balance/gi, replacement: 'MON balance' },
  { pattern: /balance.*OG\b/gi, replacement: 'balance MON' },
  { pattern: /\bOG\s*amount/gi, replacement: 'MON amount' },
  { pattern: /\bOG\s*token/gi, replacement: 'MON token' },
  { pattern: /\bOG\s*currency/gi, replacement: 'MON currency' },
  { pattern: /\bOG\s*coin/gi, replacement: 'MON coin' },
  { pattern: /\bOG\s*funds/gi, replacement: 'MON funds' },
  
  // Network name replacements
  { pattern: /\bOG\s*Network/gi, replacement: 'Monad Network' },
  { pattern: /\b0G\s*Network/gi, replacement: 'Monad Network' },
  { pattern: /\bOG\s*Galileo/gi, replacement: 'Monad Testnet' },
  { pattern: /\b0G\s*Galileo/gi, replacement: 'Monad Testnet' },
  { pattern: /\bog-galileo/gi, replacement: 'monad-testnet' },
  { pattern: /\b0g-galileo/gi, replacement: 'monad-testnet' },
  
  // Variable and function names
  { pattern: /balanceInOg/g, replacement: 'balanceInMon' },
  { pattern: /balanceOg/g, replacement: 'balanceMon' },
  { pattern: /getCurrentBalanceInOG/g, replacement: 'getCurrentBalanceInMON' },
  { pattern: /valueOg/g, replacement: 'valueMon' },
  { pattern: /amountOg/g, replacement: 'amountMon' },
  { pattern: /formatOG/g, replacement: 'formatMON' },
  { pattern: /parseOG/g, replacement: 'parseMON' },
  
  // Comments and logs
  { pattern: /Transfer OG from/g, replacement: 'Transfer MON from' },
  { pattern: /Deposit OG to/g, replacement: 'Deposit MON to' },
  { pattern: /Withdraw.*OG/g, replacement: 'Withdraw MON' },
  { pattern: /Treasury balance.*OG/g, replacement: 'Treasury balance MON' },
  { pattern: /OG will be transferred/g, replacement: 'MON will be transferred' },
  { pattern: /OG transaction/g, replacement: 'MON transaction' },
  
  // Error messages and alerts
  { pattern: /Insufficient.*OG/g, replacement: 'Insufficient MON' },
  { pattern: /need (\d+\.?\d*) OG/g, replacement: 'need $1 MON' },
  { pattern: /have (\d+\.?\d*) OG/g, replacement: 'have $1 MON' },
  { pattern: /but need (\d+\.?\d*) OG/g, replacement: 'but need $1 MON' },
  { pattern: /but have (\d+\.?\d*) OG/g, replacement: 'but have $1 MON' },
  
  // UI text and labels
  { pattern: /'Withdraw All OG'/g, replacement: "'Withdraw All MON'" },
  { pattern: /"Withdraw All OG"/g, replacement: '"Withdraw All MON"' },
  { pattern: /bets of (\d+\.?\d*) OG each/g, replacement: 'bets of $1 MON each' },
  { pattern: /Max withdraw.*OG/g, replacement: 'Max withdraw MON' },
  { pattern: /Available.*OG/g, replacement: 'Available MON' },
  
  // Configuration and environment variables
  { pattern: /OG_GALILEO/g, replacement: 'MONAD_TESTNET' },
  { pattern: /og_galileo/g, replacement: 'monad_testnet' },
  { pattern: /ogGalileo/g, replacement: 'monadTestnet' },
  
  // Chain and network references
  { pattern: /0G-Galileo-Testnet/g, replacement: 'Monad Testnet' },
  { pattern: /OG Galileo/g, replacement: 'Monad Testnet' },
  { pattern: /0G Galileo/g, replacement: 'Monad Testnet' },
  
  // Documentation and descriptions
  { pattern: /powered by OG/gi, replacement: 'powered by Monad' },
  { pattern: /built on OG/gi, replacement: 'built on Monad' },
  { pattern: /using OG/gi, replacement: 'using MON' },
  { pattern: /with OG/gi, replacement: 'with MON' },
  
  // Standalone OG references (be careful not to replace parts of other words)
  { pattern: /\bOG\b(?!\s*(Network|Galileo|galileo))/g, replacement: 'MON' },
  
  // File and folder names in strings
  { pattern: /ogGalileoConfig/g, replacement: 'monadTestnetConfig' },
  { pattern: /og-galileo-testnet/g, replacement: 'monad-testnet' },
  
  // API endpoints and URLs
  { pattern: /evmrpc-testnet\.0g\.ai/g, replacement: 'testnet-rpc.monad.xyz' },
  { pattern: /chainscan-galileo\.0g\.ai/g, replacement: 'explorer.testnet.monad.xyz' },
  
  // Console logs and debug messages
  { pattern: /💰 Treasury balance.*OG/g, replacement: '💰 Treasury balance MON' },
  { pattern: /Balance.*OG/g, replacement: 'Balance MON' },
  { pattern: /OG balance/g, replacement: 'MON balance' },
];

function replaceInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let changeCount = 0;
    
    REPLACEMENTS.forEach(({ pattern, replacement }) => {
      const originalContent = content;
      content = content.replace(pattern, replacement);
      if (content !== originalContent) {
        modified = true;
        // Count matches for this pattern
        const matches = originalContent.match(pattern);
        if (matches) {
          changeCount += matches.length;
        }
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath} (${changeCount} changes)`);
      return changeCount;
    }
    return 0;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return 0;
  }
}

function processDirectory(dirPath, stats = { files: 0, changes: 0 }) {
  const items = fs.readdirSync(dirPath);
  
  items.forEach(item => {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip system directories and build outputs
      if (!['node_modules', '.git', '.next', 'dist', 'build', '.vercel', 'coverage'].includes(item)) {
        processDirectory(fullPath, stats);
      }
    } else if (stat.isFile()) {
      // Process various file types
      if (/\.(js|jsx|ts|tsx|json|md|txt|env|config)$/.test(item)) {
        stats.files++;
        const changes = replaceInFile(fullPath);
        stats.changes += changes;
      }
    }
  });
  
  return stats;
}

function main() {
  console.log('🔄 Starting comprehensive OG to MON/Monad replacement...');
  console.log('📁 Processing files in src/, docs/, and root directory...');
  
  const stats = { files: 0, changes: 0 };
  
  // Process src directory
  if (fs.existsSync('./src')) {
    processDirectory('./src', stats);
  }
  
  // Process docs directory if it exists
  if (fs.existsSync('./docs')) {
    processDirectory('./docs', stats);
  }
  
  // Process root level files
  const rootFiles = [
    'README.md',
    'package.json',
    '.env',
    '.env.local',
    '.env.example',
    'hardhat.config.js',
    'next.config.js',
    'tailwind.config.js',
    'vercel.json'
  ];
  
  rootFiles.forEach(file => {
    if (fs.existsSync(file)) {
      stats.files++;
      const changes = replaceInFile(file);
      stats.changes += changes;
    }
  });
  
  console.log('\n📊 Replacement Summary:');
  console.log(`📄 Files processed: ${stats.files}`);
  console.log(`🔄 Total changes made: ${stats.changes}`);
  console.log('\n✅ OG to MON/Monad replacement completed!');
  
  if (stats.changes > 0) {
    console.log('\n📝 Next steps:');
    console.log('1. Review the changes to ensure they look correct');
    console.log('2. Test the application to make sure everything works');
    console.log('3. Update any remaining manual references if needed');
    console.log('4. Commit your changes to version control');
  } else {
    console.log('\n💡 No changes were needed - all OG references may already be converted!');
  }
}

// Run the script
main();