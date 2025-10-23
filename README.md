🚀 Project Name
Zakat Web3: Simple Donation App on Stellar

👤 About Me
Name: Abisam Hazim
Role: Web3 Developer
Skills: Blockchain Development, Soroban/Stellar Smart Contracts, Rust, React, TypeScript
Goal: To simplify charitable donations and zakat distribution using blockchain technology for transparency and trust.
Motto: “Donate easily, transparently, and securely.”

📘 Project Description
Zakat Web3 is a Stellar-based donation application that allows admins to create donation campaigns and users to donate XLM to those campaigns. Each campaign tracks the current collected amount, target amount, and donor contributions. The system ensures transparency by recording all donations on-chain, while the admin or campaign recipient can withdraw funds once the campaign reaches completion.

🌍 Vision
The vision of Zakat Web3 is to make giving and zakat collection transparent, secure, and accessible for everyone. By leveraging Stellar blockchain, it ensures that every donation is verifiable and tamper-proof, building trust between donors and recipients.

🧩 Software Development Plan

Smart Contract (Soroban / Stellar)

Structs: Campaign, Donation

Enums: CampaignStatus (Active, Completed, Closed)

Storage: Campaigns and Donations maps

Functions:

initialize() → Initialize contract with campaign counter

create_campaign(title, description, category, target_amount, recipient) → Create new campaign

get_campaigns() → Get all campaigns

get_campaign(id) → Get specific campaign

donate(id, donor, amount) → Donate to a campaign

get_donations(id) → Get donations for a campaign

close_campaign(id, caller) → Close campaign

withdraw(id, caller) → Withdraw funds after completion

Frontend Development (React + Vite)

Connect Web3 wallets (Freighter or Albedo)

Display campaigns, campaign details, and donation history

Simple UI to donate XLM and track progress

Backend/Database (Optional)

For caching campaigns/donations for faster UI rendering

Optional analytics and reporting

Testing & Debugging

Test contract and frontend on Stellar Testnet

Ensure secure withdrawal and donation handling

Deployment

Deploy contract via Soroban CLI

Host frontend on Vercel or Netlify

💻 Installation & Setup

Clone repository

git clone https://github.com/yourusername/zakat-web3.git
cd zakat-web3


Install dependencies

npm install


Create .env file

Add your RPC URL and contract ID

Run development server

npm run dev


Open in browser: http://localhost:5173

🐐 Project Mascot

Mascot: Giving Goat 🐐

Setting: Simple digital village

Theme Keywords: Charity, Transparency, Community

🏆 App Features

Web3 Wallet Integration (Freighter/Albedo)

Admin can create campaigns

Users can donate XLM

Track donations on-chain

Transparent and verifiable campaign progress

Withdraw funds only after campaign completion

📫 Contact
Developer: Abisam Hazim
Project Link: zakat-web3.vercel.app
