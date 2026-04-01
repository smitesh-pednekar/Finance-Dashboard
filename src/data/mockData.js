export const mockTransactions = [
  // January 2025
  { id: '1',  date: '2025-01-02', description: 'Monthly Salary',        amount: 5500,   category: 'Salary',       type: 'income',  merchant: 'TechCorp Inc.' },
  { id: '2',  date: '2025-01-04', description: 'Apartment Rent',         amount: 1800,   category: 'Housing',      type: 'expense', merchant: 'Riverside Apartments' },
  { id: '3',  date: '2025-01-08', description: 'Grocery Shopping',       amount: 245.50, category: 'Food & Dining',type: 'expense', merchant: 'Whole Foods Market' },
  { id: '4',  date: '2025-01-10', description: 'Freelance Design',       amount: 800,    category: 'Freelance',    type: 'income',  merchant: 'Client A' },
  { id: '5',  date: '2025-01-12', description: 'Netflix Subscription',   amount: 15.99,  category: 'Subscriptions',type: 'expense', merchant: 'Netflix' },
  { id: '6',  date: '2025-01-14', description: 'Electricity Bill',       amount: 87.50,  category: 'Utilities',    type: 'expense', merchant: 'City Power' },
  { id: '7',  date: '2025-01-18', description: 'Restaurant Dinner',      amount: 68.20,  category: 'Food & Dining',type: 'expense', merchant: 'The Italian Place' },
  { id: '8',  date: '2025-01-20', description: 'Gas Station',            amount: 55.00,  category: 'Transportation',type:'expense', merchant: 'Shell' },
  { id: '9',  date: '2025-01-22', description: 'Amazon Shopping',        amount: 123.45, category: 'Shopping',     type: 'expense', merchant: 'Amazon' },
  { id: '10', date: '2025-01-25', description: 'Internet Bill',          amount: 59.99,  category: 'Utilities',    type: 'expense', merchant: 'Comcast' },
  { id: '11', date: '2025-01-28', description: 'Gym Membership',         amount: 45.00,  category: 'Healthcare',   type: 'expense', merchant: 'FitLife Gym' },

  // February 2025
  { id: '12', date: '2025-02-02', description: 'Monthly Salary',         amount: 5500,   category: 'Salary',       type: 'income',  merchant: 'TechCorp Inc.' },
  { id: '13', date: '2025-02-04', description: 'Apartment Rent',         amount: 1800,   category: 'Housing',      type: 'expense', merchant: 'Riverside Apartments' },
  { id: '14', date: '2025-02-08', description: 'Grocery Shopping',       amount: 198.75, category: 'Food & Dining',type: 'expense', merchant: "Trader Joe's" },
  { id: '15', date: '2025-02-10', description: 'Dividend Income',        amount: 250,    category: 'Investment',   type: 'income',  merchant: 'Vanguard' },
  { id: '16', date: '2025-02-14', description: "Valentine's Day Dinner", amount: 125.00, category: 'Food & Dining',type: 'expense', merchant: 'La Maison' },
  { id: '17', date: '2025-02-16', description: 'Spotify Premium',        amount: 9.99,   category: 'Subscriptions',type: 'expense', merchant: 'Spotify' },
  { id: '18', date: '2025-02-18', description: 'Pharmacy',               amount: 42.30,  category: 'Healthcare',   type: 'expense', merchant: 'CVS Pharmacy' },
  { id: '19', date: '2025-02-20', description: 'Uber Rides',             amount: 35.50,  category: 'Transportation',type:'expense', merchant: 'Uber' },
  { id: '20', date: '2025-02-22', description: 'Electricity Bill',       amount: 95.20,  category: 'Utilities',    type: 'expense', merchant: 'City Power' },
  { id: '21', date: '2025-02-25', description: 'Clothing Purchase',      amount: 189.00, category: 'Shopping',     type: 'expense', merchant: 'Zara' },

  // March 2025
  { id: '22', date: '2025-03-02', description: 'Monthly Salary',         amount: 5500,   category: 'Salary',       type: 'income',  merchant: 'TechCorp Inc.' },
  { id: '23', date: '2025-03-04', description: 'Apartment Rent',         amount: 1800,   category: 'Housing',      type: 'expense', merchant: 'Riverside Apartments' },
  { id: '24', date: '2025-03-08', description: 'Grocery Shopping',       amount: 221.30, category: 'Food & Dining',type: 'expense', merchant: 'Whole Foods Market' },
  { id: '25', date: '2025-03-12', description: 'Freelance Web Project',  amount: 1200,   category: 'Freelance',    type: 'income',  merchant: 'Client B' },
  { id: '26', date: '2025-03-15', description: 'Car Insurance',          amount: 120.00, category: 'Insurance',    type: 'expense', merchant: 'State Farm' },
  { id: '27', date: '2025-03-18', description: 'Concert Tickets',        amount: 85.00,  category: 'Entertainment',type: 'expense', merchant: 'Ticketmaster' },
  { id: '28', date: '2025-03-20', description: 'Gas Station',            amount: 60.00,  category: 'Transportation',type:'expense', merchant: 'BP' },
  { id: '29', date: '2025-03-22', description: 'Doctor Visit',           amount: 75.00,  category: 'Healthcare',   type: 'expense', merchant: 'City Medical' },
  { id: '30', date: '2025-03-25', description: 'Book Purchase',          amount: 38.50,  category: 'Shopping',     type: 'expense', merchant: 'Amazon' },
  { id: '31', date: '2025-03-28', description: 'Electricity Bill',       amount: 82.30,  category: 'Utilities',    type: 'expense', merchant: 'City Power' },

  // April 2025
  { id: '32', date: '2025-04-02', description: 'Monthly Salary',         amount: 5500,   category: 'Salary',       type: 'income',  merchant: 'TechCorp Inc.' },
  { id: '33', date: '2025-04-04', description: 'Apartment Rent',         amount: 1800,   category: 'Housing',      type: 'expense', merchant: 'Riverside Apartments' },
  { id: '34', date: '2025-04-09', description: 'Grocery Shopping',       amount: 265.80, category: 'Food & Dining',type: 'expense', merchant: 'Whole Foods Market' },
  { id: '35', date: '2025-04-12', description: 'Streaming Subscriptions',amount: 28.00,  category: 'Subscriptions',type: 'expense', merchant: 'Netflix & Disney+' },
  { id: '36', date: '2025-04-15', description: 'Tax Return',             amount: 1850,   category: 'Tax Refund',   type: 'income',  merchant: 'IRS' },
  { id: '37', date: '2025-04-18', description: 'Weekend Getaway',        amount: 420.00, category: 'Travel',       type: 'expense', merchant: 'Airbnb' },
  { id: '38', date: '2025-04-20', description: 'Auto Maintenance',       amount: 185.00, category: 'Transportation',type:'expense', merchant: 'AutoZone' },
  { id: '39', date: '2025-04-22', description: 'Electricity Bill',       amount: 78.60,  category: 'Utilities',    type: 'expense', merchant: 'City Power' },
  { id: '40', date: '2025-04-25', description: 'Shopping Mall',          amount: 312.00, category: 'Shopping',     type: 'expense', merchant: 'Nordstrom' },

  // May 2025
  { id: '41', date: '2025-05-02', description: 'Monthly Salary',         amount: 5500,   category: 'Salary',       type: 'income',  merchant: 'TechCorp Inc.' },
  { id: '42', date: '2025-05-04', description: 'Apartment Rent',         amount: 1800,   category: 'Housing',      type: 'expense', merchant: 'Riverside Apartments' },
  { id: '43', date: '2025-05-08', description: 'Grocery Shopping',       amount: 238.45, category: 'Food & Dining',type: 'expense', merchant: "Trader Joe's" },
  { id: '44', date: '2025-05-10', description: 'Performance Bonus',      amount: 1000,   category: 'Bonus',        type: 'income',  merchant: 'TechCorp Inc.' },
  { id: '45', date: '2025-05-12', description: 'Freelance Consulting',   amount: 600,    category: 'Freelance',    type: 'income',  merchant: 'Client C' },
  { id: '46', date: '2025-05-15', description: "Mother's Day Gift",      amount: 95.00,  category: 'Shopping',     type: 'expense', merchant: "Bloomingdale's" },
  { id: '47', date: '2025-05-18', description: 'Restaurant Brunch',      amount: 52.40,  category: 'Food & Dining',type: 'expense', merchant: 'Sunday Brunch' },
  { id: '48', date: '2025-05-20', description: 'Gym Membership',         amount: 45.00,  category: 'Healthcare',   type: 'expense', merchant: 'FitLife Gym' },
  { id: '49', date: '2025-05-22', description: 'Music Subscriptions',    amount: 19.98,  category: 'Subscriptions',type: 'expense', merchant: 'Spotify & Apple Music' },
  { id: '50', date: '2025-05-25', description: 'Electricity Bill',       amount: 91.40,  category: 'Utilities',    type: 'expense', merchant: 'City Power' },
  { id: '51', date: '2025-05-28', description: 'Movie Night Out',        amount: 38.00,  category: 'Entertainment',type: 'expense', merchant: 'AMC Theaters' },

  // June 2025
  { id: '52', date: '2025-06-02', description: 'Monthly Salary',         amount: 5500,   category: 'Salary',       type: 'income',  merchant: 'TechCorp Inc.' },
  { id: '53', date: '2025-06-04', description: 'Apartment Rent',         amount: 1800,   category: 'Housing',      type: 'expense', merchant: 'Riverside Apartments' },
  { id: '54', date: '2025-06-08', description: 'Grocery Shopping',       amount: 278.90, category: 'Food & Dining',type: 'expense', merchant: 'Whole Foods Market' },
  { id: '55', date: '2025-06-12', description: 'Summer Flight Tickets',  amount: 480.00, category: 'Travel',       type: 'expense', merchant: 'Delta Airlines' },
  { id: '56', date: '2025-06-15', description: 'Car Insurance',          amount: 120.00, category: 'Insurance',    type: 'expense', merchant: 'State Farm' },
  { id: '57', date: '2025-06-18', description: 'Restaurant Dinner',      amount: 72.50,  category: 'Food & Dining',type: 'expense', merchant: 'Steak House' },
  { id: '58', date: '2025-06-20', description: 'Gas Station',            amount: 58.00,  category: 'Transportation',type:'expense', merchant: 'Exxon' },
  { id: '59', date: '2025-06-22', description: 'Online Course',          amount: 99.00,  category: 'Education',    type: 'expense', merchant: 'Coursera' },
  { id: '60', date: '2025-06-25', description: 'Electricity Bill',       amount: 105.30, category: 'Utilities',    type: 'expense', merchant: 'City Power' },
];

export const EXPENSE_CATEGORIES = [
  'Housing', 'Food & Dining', 'Transportation', 'Entertainment',
  'Shopping', 'Utilities', 'Healthcare', 'Insurance',
  'Travel', 'Subscriptions', 'Education', 'Other',
];

export const INCOME_CATEGORIES = [
  'Salary', 'Freelance', 'Investment', 'Bonus', 'Tax Refund', 'Other',
];

export const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];
