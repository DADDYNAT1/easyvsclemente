// Portfolio Data Structure
const portfolios = {
    easy: {
        name: "Easy",
        tokens: [
            { symbol: "ENA", id: "ethena", amount: 2449, chain: "ethereum", image: "ENA.webp" },
            { symbol: "LTC", id: "litecoin", amount: 15.97, chain: "litecoin", image: "LTC.webp" },
            { symbol: "HYPE", id: "hyperliquid", amount: 44.58, chain: "hyperliquid", image: "HYPE.jpg" },
            { symbol: "PUMP", id: "pump-fun", amount: 533902, chain: "solana", image: "pump.jpg" },
            { symbol: "LINK", id: "chainlink", amount: 91, chain: "ethereum", image: "LINK.webp" }
        ],
        totalValue: 0,
        totalValue24hAgo: 0,
        initialValue: 0,
        api: "coingecko"
    },
    clemente: {
        name: "Clemente",
        tokens: [
            { symbol: "URANUS", contractAddress: "BFgdzMkTPdKKJeTipv2njtDEwhKxkgFueJQfJGt1jups", amount: 4320, chain: "solana", image: "uranus.webp" },
            { symbol: "TROLL", contractAddress: "5UUH9RTDiSpq6HKS6bp4NdU9PNJpXRXuiw6ShBTBhgH2", amount: 10700, chain: "solana", image: "troll.webp" },
            { symbol: "TOKABU", contractAddress: "H8xQ6poBjB9DTPMDTKWzWPrnxu4bDEhybxiouF8Ppump", amount: 32509, chain: "solana", image: "tokabu.webp" },
            { symbol: "GOD", contractAddress: "0x3D72DDD35cadb4e5B22CDB20b36f98077BE84284", amount: 258070, chain: "abstract", image: "GOD.avif" },
            { symbol: "DOCKERZXBT", contractAddress: "0x56f8AD6112C2DB9F9848243531B277cE1C3BE30c", amount: 475000, chain: "base", image: "Docker.webp" }
        ],
        totalValue: 0,
        totalValue24hAgo: 0,
        initialValue: 0,
        api: "dexscreener"
    }
};

// Challenge Data
let challengeData = {
    startDate: null,
    currentDay: 1,
    historicalData: []
};

// Voting Data
let votingData = {
    easyVotes: 0,
    clementeVotes: 0,
    hasVoted: false
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    initializeEventListeners();
    
    // Always use 8/11/2025 as start date and $10,000 initial values
    challengeData.startDate = new Date('2025-08-11').toISOString();
    portfolios.easy.initialValue = 10000;
    portfolios.clemente.initialValue = 10000;
    
    updateDayCounter();
    loadVotingData();
    updateVoteDisplay();
    
    fetchAllPrices();
    
    // Auto-refresh prices every 30 seconds
    setInterval(fetchAllPrices, 30 * 1000);
});

// Event Listeners
function initializeEventListeners() {
    document.getElementById('refresh-prices-btn').addEventListener('click', fetchAllPrices);
    
    // Modal controls (keeping for future use if needed)
    const modal = document.getElementById('token-modal');
    const closeBtn = document.querySelector('.close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Start New Challenge
function startNewChallenge() {
    // Set start date to August 11, 2025
    challengeData.startDate = new Date('2025-08-11').toISOString();
    challengeData.currentDay = 1;
    challengeData.historicalData = [];
    
    document.getElementById('start-date').textContent = new Date('2025-08-11').toLocaleDateString();
    
    // Both portfolios start at $10,000
    portfolios.easy.initialValue = 10000;
    portfolios.clemente.initialValue = 10000;
    
    saveToLocalStorage();
}

// Update Day Counter
function updateDayCounter() {
    if (challengeData.startDate) {
        const start = new Date('2025-08-11');
        const now = new Date('2025-08-13'); // Today is Aug 13
        
        // Calculate days: Aug 11 = Day 1, Aug 12 = Day 2, Aug 13 = Day 3
        const msPerDay = 1000 * 60 * 60 * 24;
        const daysDiff = Math.floor((now - start) / msPerDay) + 1;
        
        challengeData.currentDay = Math.min(daysDiff, 30);
        document.getElementById('current-day').textContent = challengeData.currentDay;
        document.getElementById('start-date').textContent = '8/11/2025';
    }
}

// Fetch Prices from CoinGecko
async function fetchCoinGeckoPrices() {
    const ids = portfolios.easy.tokens.map(t => t.id).join(',');
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        let totalValue = 0;
        let totalValue24hAgo = 0;
        
        portfolios.easy.tokens.forEach(token => {
            if (data[token.id]) {
                token.currentPrice = data[token.id].usd;
                token.change24h = data[token.id].usd_24h_change || 0;
                
                const tokenValue = token.amount * token.currentPrice;
                totalValue += tokenValue;
                
                // Calculate 24h ago value
                const price24hAgo = token.currentPrice / (1 + token.change24h / 100);
                totalValue24hAgo += token.amount * price24hAgo;
                
                console.log(`${token.symbol}: Price = $${token.currentPrice}, Amount = ${token.amount}, Total = $${tokenValue}`);
            } else {
                console.log(`Warning: No data for ${token.symbol} (${token.id})`);
            }
        });
        
        portfolios.easy.totalValue = totalValue;
        portfolios.easy.totalValue24hAgo = totalValue24hAgo;
        
        updatePortfolioDisplay('easy');
        
    } catch (error) {
        console.error('Error fetching CoinGecko prices:', error);
        showNotification('Error fetching prices for Easy\'s portfolio', 'error');
    }
}

// Fetch Prices from Dexscreener
async function fetchDexscreenerPrices() {
    // For now, we'll need contract addresses to be added
    // This is a placeholder that shows the structure
    
    let totalValue = 0;
    let totalValue24hAgo = 0;
    
    for (const token of portfolios.clemente.tokens) {
        if (!token.contractAddress) {
            console.log(`Need contract address for ${token.symbol}`);
            continue;
        }
        
        try {
            const url = `https://api.dexscreener.com/latest/dex/tokens/${token.contractAddress}`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.pairs && data.pairs.length > 0) {
                // Get the pair with highest liquidity
                const bestPair = data.pairs.reduce((prev, current) => 
                    (prev.liquidity?.usd || 0) > (current.liquidity?.usd || 0) ? prev : current
                );
                
                token.currentPrice = parseFloat(bestPair.priceUsd) || 0;
                token.change24h = bestPair.priceChange?.h24 || 0;
                
                const tokenValue = token.amount * token.currentPrice;
                totalValue += tokenValue;
                
                // Calculate 24h ago value
                const price24hAgo = token.currentPrice / (1 + token.change24h / 100);
                totalValue24hAgo += token.amount * price24hAgo;
            }
        } catch (error) {
            console.error(`Error fetching price for ${token.symbol}:`, error);
        }
    }
    
    portfolios.clemente.totalValue = totalValue;
    portfolios.clemente.totalValue24hAgo = totalValue24hAgo;
    
    updatePortfolioDisplay('clemente');
}

// Fetch All Prices
async function fetchAllPrices() {
    showNotification('Fetching latest prices...', 'info');
    
    await Promise.all([
        fetchCoinGeckoPrices(),
        fetchDexscreenerPrices()
    ]);
    
    updatePerformanceIndicator();
    saveToLocalStorage();
    saveHistoricalData();
    
    showNotification('Prices updated successfully!', 'success');
}

// Update Portfolio Display
function updatePortfolioDisplay(portfolioKey) {
    const portfolio = portfolios[portfolioKey];
    const prefix = portfolioKey;
    
    // Update total value with color based on profit/loss
    const totalElement = document.getElementById(`${prefix}-total`);
    totalElement.textContent = formatCurrency(portfolio.totalValue);
    
    // Add color class based on comparison to $10,000 starting value
    if (portfolio.totalValue > 10000) {
        totalElement.classList.add('positive');
        totalElement.classList.remove('negative');
    } else if (portfolio.totalValue < 10000) {
        totalElement.classList.add('negative');
        totalElement.classList.remove('positive');
    } else {
        totalElement.classList.remove('positive', 'negative');
    }
    
    // Update 24h change
    const change24h = portfolio.totalValue24hAgo > 0 
        ? ((portfolio.totalValue - portfolio.totalValue24hAgo) / portfolio.totalValue24hAgo * 100)
        : 0;
    
    const change24hElement = document.getElementById(`${prefix}-24h-change`);
    change24hElement.textContent = formatPercentage(change24h);
    change24hElement.className = `value ${change24h >= 0 ? 'positive' : 'negative'}`;
    
    // Update total change from $10,000 starting value
    const initialValue = 10000;
    const totalChange = ((portfolio.totalValue - initialValue) / initialValue * 100);
    
    const totalChangeElement = document.getElementById(`${prefix}-total-change`);
    totalChangeElement.textContent = formatPercentage(totalChange);
    totalChangeElement.className = `value ${totalChange >= 0 ? 'positive' : 'negative'}`;
    
    // Update token list
    const tokenListElement = document.getElementById(`${prefix}-tokens`);
    tokenListElement.innerHTML = '';
    
    portfolio.tokens.forEach(token => {
        const tokenElement = document.createElement('div');
        tokenElement.className = 'token-item';
        tokenElement.innerHTML = `
            <div class="token-info">
                <img src="${token.image}" alt="${token.symbol}" class="token-logo">
                <div class="token-details">
                    <span class="token-symbol">${token.symbol}</span>
                    <span class="token-amount">${formatNumber(token.amount)} tokens @ ${formatTokenPrice(token.currentPrice || 0)}</span>
                </div>
            </div>
            <div class="token-value">
                <div class="token-price">${formatCurrency(token.amount * (token.currentPrice || 0))}</div>
                <div class="token-change ${(token.change24h || 0) >= 0 ? 'positive' : 'negative'}">
                    ${formatPercentage(token.change24h || 0)} (24h)
                </div>
            </div>
        `;
        tokenListElement.appendChild(tokenElement);
    });
}

// Update Performance Indicator
function updatePerformanceIndicator() {
    const initialValue = 10000;
    const easyChange = ((portfolios.easy.totalValue - initialValue) / initialValue * 100);
    const clementeChange = ((portfolios.clemente.totalValue - initialValue) / initialValue * 100);
    
    const leaderName = document.getElementById('leader-name');
    const leaderPercentage = document.getElementById('leader-percentage');
    
    if (easyChange > clementeChange) {
        leaderName.textContent = 'Easy Leading';
        leaderPercentage.textContent = `+${formatPercentage(easyChange - clementeChange)}`;
        leaderPercentage.style.color = '#10b981';
    } else if (clementeChange > easyChange) {
        leaderName.textContent = 'Clemente Leading';
        leaderPercentage.textContent = `+${formatPercentage(clementeChange - easyChange)}`;
        leaderPercentage.style.color = '#10b981';
    } else {
        leaderName.textContent = 'Tied';
        leaderPercentage.textContent = '0%';
        leaderPercentage.style.color = '#94a3b8';
    }
}

// Format Helpers
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

function formatTokenPrice(price) {
    if (!price || price === 0) return '$0.0000';
    
    // For PUMP token specifically or any very small price
    if (price < 0.00001) {
        // Show in scientific notation for very small numbers
        const exponent = Math.floor(Math.log10(price));
        const mantissa = price / Math.pow(10, exponent);
        return `$${mantissa.toFixed(2)}e${exponent}`;
    }
    
    if (price >= 1) {
        return `$${price.toFixed(2)}`;
    } else if (price >= 0.01) {
        return `$${price.toFixed(4)}`;
    } else if (price >= 0.0001) {
        return `$${price.toFixed(6)}`;
    } else {
        return `$${price.toFixed(8)}`;
    }
}

function formatPercentage(value) {
    const formatted = value.toFixed(2);
    return value >= 0 ? `+${formatted}%` : `${formatted}%`;
}

function formatNumber(value) {
    return new Intl.NumberFormat('en-US').format(value);
}

// Local Storage Functions
function saveToLocalStorage() {
    localStorage.setItem('portfolios', JSON.stringify(portfolios));
    localStorage.setItem('challengeData', JSON.stringify(challengeData));
}

function loadFromLocalStorage() {
    const savedPortfolios = localStorage.getItem('portfolios');
    const savedChallengeData = localStorage.getItem('challengeData');
    
    if (savedPortfolios) {
        const parsed = JSON.parse(savedPortfolios);
        // Don't load token definitions from localStorage, only values
        if (parsed.easy) {
            portfolios.easy.totalValue = parsed.easy.totalValue || 0;
            portfolios.easy.totalValue24hAgo = parsed.easy.totalValue24hAgo || 0;
            portfolios.easy.initialValue = parsed.easy.initialValue || 0;
        }
        if (parsed.clemente) {
            portfolios.clemente.totalValue = parsed.clemente.totalValue || 0;
            portfolios.clemente.totalValue24hAgo = parsed.clemente.totalValue24hAgo || 0;
            portfolios.clemente.initialValue = parsed.clemente.initialValue || 0;
        }
    }
    
    if (savedChallengeData) {
        Object.assign(challengeData, JSON.parse(savedChallengeData));
    }
}

function saveHistoricalData() {
    const snapshot = {
        date: new Date().toISOString(),
        day: challengeData.currentDay,
        easy: {
            totalValue: portfolios.easy.totalValue,
            change24h: ((portfolios.easy.totalValue - portfolios.easy.totalValue24hAgo) / portfolios.easy.totalValue24hAgo * 100)
        },
        clemente: {
            totalValue: portfolios.clemente.totalValue,
            change24h: ((portfolios.clemente.totalValue - portfolios.clemente.totalValue24hAgo) / portfolios.clemente.totalValue24hAgo * 100)
        }
    };
    
    challengeData.historicalData.push(snapshot);
    
    // Keep only last 30 days of data
    if (challengeData.historicalData.length > 30) {
        challengeData.historicalData = challengeData.historicalData.slice(-30);
    }
    
    saveToLocalStorage();
}

// Reset Challenge
function resetChallenge() {
    if (confirm('Are you sure you want to reset the 30-day challenge? All data will be lost.')) {
        localStorage.clear();
        location.reload();
    }
}

// Show Token Modal
function showTokenModal() {
    const modal = document.getElementById('token-modal');
    modal.style.display = 'block';
    updateTokenList();
}

// Update Token List in Modal
function updateTokenList() {
    const tokenListDiv = document.getElementById('current-tokens');
    tokenListDiv.innerHTML = '';
    
    // Show Easy's tokens
    const easyHeader = document.createElement('h5');
    easyHeader.textContent = "Easy's Tokens:";
    easyHeader.style.marginBottom = '10px';
    tokenListDiv.appendChild(easyHeader);
    
    portfolios.easy.tokens.forEach(token => {
        const entry = document.createElement('div');
        entry.className = 'token-entry';
        entry.innerHTML = `
            <span>${token.symbol} - ${formatNumber(token.amount)} tokens</span>
        `;
        tokenListDiv.appendChild(entry);
    });
    
    // Show Clemente's tokens
    const clementeHeader = document.createElement('h5');
    clementeHeader.textContent = "Clemente's Tokens (need contract addresses):";
    clementeHeader.style.marginTop = '15px';
    clementeHeader.style.marginBottom = '10px';
    tokenListDiv.appendChild(clementeHeader);
    
    portfolios.clemente.tokens.forEach(token => {
        const entry = document.createElement('div');
        entry.className = 'token-entry';
        entry.innerHTML = `
            <span>${token.symbol} - ${formatNumber(token.amount)} tokens</span>
            ${!token.contractAddress ? '<span style="color: #ef4444; font-size: 0.9rem;">Missing address</span>' : ''}
        `;
        tokenListDiv.appendChild(entry);
    });
}

// Notification System
function showNotification(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    // You could add a toast notification here
}

// Voting System Functions
function loadVotingData() {
    const saved = localStorage.getItem('votingData');
    if (saved) {
        votingData = JSON.parse(saved);
    }
}

function saveVotingData() {
    localStorage.setItem('votingData', JSON.stringify(votingData));
}

function castVote(trader) {
    if (votingData.hasVoted) {
        alert('You have already voted! One vote per person.');
        return;
    }
    
    if (trader === 'easy') {
        votingData.easyVotes++;
    } else if (trader === 'clemente') {
        votingData.clementeVotes++;
    }
    
    votingData.hasVoted = true;
    saveVotingData();
    updateVoteDisplay();
    
    // Show thank you message
    alert(`Thank you for voting for ${trader === 'easy' ? 'Easy' : 'Clemente'}!`);
}

function updateVoteDisplay() {
    const totalVotes = votingData.easyVotes + votingData.clementeVotes;
    
    // Update vote counts
    document.getElementById('easy-votes').textContent = `${votingData.easyVotes} ${votingData.easyVotes === 1 ? 'vote' : 'votes'}`;
    document.getElementById('clemente-votes').textContent = `${votingData.clementeVotes} ${votingData.clementeVotes === 1 ? 'vote' : 'votes'}`;
    document.getElementById('total-votes').textContent = `Total Votes: ${totalVotes}`;
    
    // Calculate percentages
    let easyPercentage = 50;
    let clementePercentage = 50;
    
    if (totalVotes > 0) {
        easyPercentage = Math.round((votingData.easyVotes / totalVotes) * 100);
        clementePercentage = Math.round((votingData.clementeVotes / totalVotes) * 100);
    }
    
    // Update percentage displays
    document.getElementById('easy-percentage').textContent = `${easyPercentage}%`;
    document.getElementById('clemente-percentage').textContent = `${clementePercentage}%`;
    
    // Update progress bars
    document.getElementById('easy-bar').style.width = `${easyPercentage}%`;
    document.getElementById('clemente-bar').style.width = `${clementePercentage}%`;
    
    // Disable buttons if already voted
    if (votingData.hasVoted) {
        const buttons = document.querySelectorAll('.vote-btn');
        buttons.forEach(btn => {
            btn.disabled = true;
            btn.textContent = 'Already Voted';
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
        });
    }
}

// Make castVote available globally for onclick handlers
window.castVote = castVote;