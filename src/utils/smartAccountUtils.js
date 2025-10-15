// MetaMask Smart Accounts utilities
export const SMART_ACCOUNT_FEATURES = {
  BATCH_TRANSACTIONS: 'batchTransactions',
  SPONSORED_TRANSACTIONS: 'sponsoredTransactions',
  SESSION_KEYS: 'sessionKeys',
  SOCIAL_RECOVERY: 'socialRecovery'
};

export const checkSmartAccountSupport = async (walletClient) => {
  if (!walletClient || !window.ethereum) return null;

  try {
    // Check if MetaMask supports Smart Accounts
    const provider = window.ethereum;
    
    // Check for Smart Account capabilities
    const capabilities = await provider.request({
      method: 'wallet_getCapabilities',
      params: [await walletClient.getAddresses()]
    }).catch(() => null);

    return {
      isSupported: !!capabilities,
      capabilities: capabilities || {},
      provider: 'MetaMask'
    };
  } catch (error) {
    console.error('Error checking Smart Account support:', error);
    return null;
  }
};

export const enableSmartAccountFeatures = async (walletClient) => {
  if (!walletClient || !window.ethereum) return false;

  try {
    const provider = window.ethereum;
    
    // Request Smart Account permissions
    const permissions = await provider.request({
      method: 'wallet_requestPermissions',
      params: [{
        eth_accounts: {},
        // Add Smart Account specific permissions here
      }]
    }).catch(() => null);

    return !!permissions;
  } catch (error) {
    console.error('Error enabling Smart Account features:', error);
    return false;
  }
};

export const batchTransactions = async (walletClient, transactions) => {
  if (!walletClient || !window.ethereum) return null;

  try {
    const provider = window.ethereum;
    
    // Check if batch transactions are supported
    const capabilities = await checkSmartAccountSupport(walletClient);
    if (!capabilities?.capabilities?.batchTransactions) {
      throw new Error('Batch transactions not supported');
    }

    // Execute batch transaction
    const result = await provider.request({
      method: 'eth_sendTransactionBatch',
      params: [transactions]
    });

    return result;
  } catch (error) {
    console.error('Error executing batch transactions:', error);
    throw error;
  }
};

export const getSmartAccountInfo = async (address, walletClient) => {
  if (!address || !walletClient) return null;

  try {
    // Get account code to determine if it's a smart account
    const code = await walletClient.getBytecode({ address });
    const isSmartAccount = code && code !== '0x';

    if (!isSmartAccount) {
      return {
        address,
        type: 'EOA',
        isSmartAccount: false
      };
    }

    // Get Smart Account capabilities
    const capabilities = await checkSmartAccountSupport(walletClient);

    return {
      address,
      type: 'Smart Account',
      isSmartAccount: true,
      code,
      codeSize: code?.length || 0,
      capabilities: capabilities?.capabilities || {},
      features: {
        batchTransactions: !!capabilities?.capabilities?.batchTransactions,
        sponsoredTransactions: !!capabilities?.capabilities?.sponsoredTransactions,
        sessionKeys: !!capabilities?.capabilities?.sessionKeys,
        socialRecovery: !!capabilities?.capabilities?.socialRecovery
      }
    };
  } catch (error) {
    console.error('Error getting Smart Account info:', error);
    return null;
  }
};

export const formatSmartAccountAddress = (address, isSmartAccount = false) => {
  if (!address) return '';
  
  const prefix = isSmartAccount ? '🔷' : '👤';
  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
  
  return `${prefix} ${shortAddress}`;
};