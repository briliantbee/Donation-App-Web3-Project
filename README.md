# Zakat Web3 — Simple Donation App on Stellar

Zakat Web3 is a lightweight donation application built on Stellar (Soroban) that makes charitable donations and zakat collection transparent, auditable, and easy to use. Admins can create campaigns and users can donate XLM; every donation is recorded on-chain and withdrawable by the campaign recipient once conditions are met.

---

## 🚀 Summary
- Name: Zakat Web3
- Author: Abisam Hazim
- Role: Web3 Developer
- Skills: Blockchain (Soroban / Stellar), Rust, React, TypeScript
- Motto: “Donate easily, transparently, and securely.”

---

## 🌍 Vision
Make giving and collecting zakat transparent, secure, and accessible to everyone using blockchain technology. Leveraging Stellar ensures every donation is verifiable and tamper-resistant.

---

## 🧩 Key Features
- Web3 wallet integration (Freighter / Albedo)
- Admins can create campaigns
- Users can donate XLM directly to campaigns
- All donations are recorded on-chain (Stellar)
- Campaign progress display (collected vs target)
- Donations can be withdrawn only after campaign completion
- Optional: backend caching for a more responsive UI and analytics

---

## 🏗️ Architecture & Development Plan

### Smart Contract (Soroban / Stellar)
Structs:
- Campaign
- Donation

Enums:
- CampaignStatus: Active, Completed, Closed

Storage:
- mapping Campaigns
- mapping Donations

API / Functions:
- initialize() — Initialize contract (campaign counter)
- create_campaign(title, description, category, target_amount, recipient) — Create a new campaign
- get_campaigns() — Fetch all campaigns
- get_campaign(id) — Fetch a specific campaign
- donate(id, donor, amount) — Donate to a campaign
- get_donations(id) — Campaign donation history


Testing:
- Test the contract on Stellar Testnet
- Test edge cases (double withdraw, underflow, unauthorized calls)

Deployment:
- Build & deploy the contract via Soroban CLI to testnet/mainnet as needed

### Frontend (React + Vite)
- Connect wallets (Freighter / Albedo)
- Campaign listing page
- Campaign detail page with donation history
- Simple donate component (amount input, confirm)
- Progress bar and campaign status display

### Backend (Optional)
- Cache campaigns/donations for performance
- Analytics / reporting endpoints (optional)

---

## 💻 Quick Start — Installation & Setup

1. Clone the repo
   ```bash
   git clone https://github.com/yourusername/zakat-web3.git
   cd zakat-web3
   ```

2. Install dependencies
   ```bash
   npm install
   ```


3. Run the development server
   ```bash
   npm run dev
   ```

4. Open in your browser:
   ```
   http://localhost:5173
   ```

Build for production:
```bash
npm run build
npm run preview
```

---

## 🧪 Testing & Debugging
- Use Stellar Testnet for testing donations and withdrawals.
- Write unit tests for the smart contract (Rust/Soroban) and integration tests between frontend and wallet.
- Validate donation amounts on the client and enforce authorization checks for withdrawals.

---

## 📦 Deployment
- Deploy the smart contract via Soroban CLI (follow the official Soroban docs).
- Host the frontend on Vercel, Netlify, or any static hosting provider.
- Ensure environment variables (RPC URL, contract ID) are set in your hosting environment.

---

## 🤝 Contributing
Contributions are welcome! To contribute:
1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit and open a PR
4. Add a description of changes and how to test them

---

## 🐐 Mascot
- Giving Goat 🐐  
- Setting: Simple digital village  
- Theme: Charity, Transparency, Community

---

## 📫 Contact
- Developer: Abisam Hazim  
- Project demo: https://zakat-web3.vercel.app

---

## License
Choose a license for the project (e.g., MIT) and add a LICENSE file.

---

Thank you for contributing — may Zakat Web3 help make donation processes more transparent and trustworthy.
