# 30-Day Portfolio Challenge: Easy vs Clemente

## Project Overview
A web application that tracks and compares two crypto portfolios (Easy vs Clemente) over a 30-day period. The portfolios maintain the same tokens throughout the challenge, and we monitor which one outperforms the other using real-time price data from the Dexscreener API.

## Key Features
- Side-by-side portfolio comparison
- Real-time token price tracking via Dexscreener API
- 24-hour percentage change calculations
- 30-day performance tracking
- Mock wallets (not connected to blockchain)
- Visual performance indicators
- Data persistence using localStorage

## Technical Stack
- **Frontend**: HTML, CSS, JavaScript (vanilla)
- **API**: Dexscreener API for token prices
- **Storage**: localStorage for 30-day tracking
- **Charts**: Chart.js for performance visualization (optional)

## Project Structure
```
/10kport/
├── index.html          # Main HTML structure
├── styles.css          # Styling and layout
├── app.js             # Core application logic
├── CLAUDE.md          # Project documentation
└── README.md          # User documentation (if needed)
```

## Implementation Plan

### Phase 1: Setup ✅
- [x] Create CLAUDE.md documentation
- [ ] Set up project structure with HTML, CSS, and JavaScript files
- [ ] Create HTML layout for side-by-side portfolio comparison

### Phase 2: Core Functionality
- [ ] Implement mock wallet data structure for Easy and Clemente
- [ ] Integrate Dexscreener API for fetching token prices
- [ ] Calculate and display 24h percentage changes

### Phase 3: Performance Tracking
- [ ] Add overall portfolio performance tracking
- [ ] Implement data persistence (localStorage) for 30-day tracking
- [ ] Add day counter and challenge timeline

### Phase 4: Polish & Visualization
- [ ] Add styling and visual charts for performance comparison
- [ ] Implement performance indicators (who's leading)
- [ ] Add controls for managing tokens and resetting challenge

## Data Structure

### Portfolio Object
```javascript
{
  name: "Easy" | "Clemente",
  tokens: [
    {
      symbol: "PEPE",
      contractAddress: "0x...",
      amount: 1000000,
      currentPrice: 0.000001,
      price24hAgo: 0.0000009,
      initialPrice: 0.0000008
    }
  ],
  totalValue: 0,
  totalValue24hAgo: 0,
  initialValue: 0,
  startDate: "2024-01-01"
}
```

## API Integration

### Dexscreener API Endpoints
- Price Data: `https://api.dexscreener.com/latest/dex/tokens/{contractAddress}`
- Returns current price, 24h change, volume, etc.

## Features to Implement

### Must Have
- [x] Portfolio comparison layout
- [ ] Token input system
- [ ] Price fetching from Dexscreener
- [ ] 24h change calculations
- [ ] Total portfolio value tracking
- [ ] 30-day progress indicator
- [ ] Data persistence

### Nice to Have
- [ ] Historical price charts
- [ ] Export data to CSV
- [ ] Daily snapshots
- [ ] Performance notifications
- [ ] Mobile responsive design

## Current Status
**Phase**: Core Implementation Complete
**Last Updated**: All core features implemented, awaiting contract addresses for Clemente's tokens

### Completed Features
- ✅ Project structure created (HTML, CSS, JS)
- ✅ Side-by-side portfolio comparison layout
- ✅ Mock wallet data structures for both traders
- ✅ CoinGecko API integration for Easy's portfolio
- ✅ Dexscreener API structure for Clemente's portfolio
- ✅ 24-hour change calculations
- ✅ Total portfolio performance tracking
- ✅ 30-day challenge tracking with day counter
- ✅ Data persistence using localStorage
- ✅ Beautiful dark theme UI with gradients
- ✅ Responsive design for mobile/desktop
- ✅ Auto-refresh every 5 minutes

### Portfolio Details

#### Easy's Portfolio (CoinGecko API)
- 2,449 ENA
- 15.97 LTC
- 44.58 HYPE
- 533,902 PUMP
- 91 LINK (Chainlink)

#### Clemente's Portfolio (Dexscreener API)
- 4,320 URANUS (Solana) - *needs contract address*
- 10,700 TROLL (Solana) - *needs contract address*
- 32,509 TOKABU (Solana) - *needs contract address*
- 258,070 GOD (Abstract) - *needs contract address*
- 475,000 DOCKERZXBT (Base) - *needs contract address*

## Notes
- Mock wallets only - no real blockchain connection
- Same tokens must be maintained for full 30 days
- Focus on clear visual comparison between portfolios
- Update prices regularly (every few minutes or on demand)

## Testing Checklist
- [ ] Token addition works correctly
- [ ] Dexscreener API integration successful
- [ ] Price updates calculate correctly
- [ ] 24h changes display accurately
- [ ] Data persists across page refreshes
- [ ] 30-day tracking functions properly
- [ ] Visual indicators update in real-time

## Future Enhancements
- Add more traders to compare
- Historical performance graphs
- Leaderboard system
- Social sharing features
- Email notifications for daily updates