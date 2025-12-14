import { Module } from './types';

// 1. Comprehensive Syllabus Coverage (June 2026 Update)
export const MODULES: Module[] = [
  // --- A. Conceptual Framework & General ---
  { id: 'm0', title: 'Conceptual Framework', description: 'Objective, Elements, Measurement, Capital Maintenance.', topic: 'framework', progress: 100 },
  { id: 'm_ias1', title: 'IAS 1 Presentation of F.S.', description: 'Structure, OCI vs P&L, Going Concern, Current/Non-current.', topic: 'presentation', progress: 90 },
  { id: 'm_ias8', title: 'IAS 8 Accounting Policies', description: 'Estimates vs Policies, Errors, Retrospective application.', topic: 'presentation', progress: 80 },
  { id: 'm_ias10', title: 'IAS 10 Events After Reporting Period', description: 'Adjusting vs Non-adjusting events.', topic: 'presentation', progress: 95 },
  { id: 'm_ifrs13', title: 'IFRS 13 Fair Value', description: 'Hierarchy (Levels 1-3), Valuation techniques.', topic: 'presentation', progress: 40 },
  
  // --- B. Group Accounting (Consolidation) ---
  { id: 'm_ifrs3', title: 'IFRS 3 Business Combinations', description: 'Acquisition method, Goodwill, NCI, Contingent consideration.', topic: 'group-accounting', progress: 80 },
  { id: 'm_ifrs10', title: 'IFRS 10 Consolidated F.S.', description: 'Control definition, Consolidation procedures.', topic: 'group-accounting', progress: 45 },
  { id: 'm_ias27', title: 'IAS 27 Separate F.S.', description: 'Accounting for investments in subsidiaries in separate FS.', topic: 'group-accounting', progress: 20 },
  { id: 'm_ias28', title: 'IAS 28 Associates & Joint Ventures', description: 'Equity accounting method, Impairment.', topic: 'group-accounting', progress: 30 },
  { id: 'm_ifrs11', title: 'IFRS 11 Joint Arrangements', description: 'Joint Operations vs Joint Ventures.', topic: 'group-accounting', progress: 20 },
  { id: 'm_ias21', title: 'IAS 21 Foreign Exchange', description: 'Functional currency, Translation of foreign ops.', topic: 'group-accounting', progress: 50 },
  { id: 'm_ifrs12', title: 'IFRS 12 Disclosure of Interests', description: 'Disclosures for subs, joint arrangements, associates.', topic: 'group-accounting', progress: 10 },

  // --- C. Assets ---
  { id: 'm_ias16', title: 'IAS 16 PPE', description: 'Cost vs Revaluation, Depreciation, Componentization.', topic: 'assets', progress: 90 },
  { id: 'm_ias38', title: 'IAS 38 Intangible Assets', description: 'Recognition, R&D, Amortization, Infinite life.', topic: 'assets', progress: 70 },
  { id: 'm_ias36', title: 'IAS 36 Impairment', description: 'CGUs, Goodwill impairment, Reversal.', topic: 'assets', progress: 60 },
  { id: 'm_ias40', title: 'IAS 40 Investment Property', description: 'Fair Value Model vs Cost Model.', topic: 'assets', progress: 85 },
  { id: 'm_ias23', title: 'IAS 23 Borrowing Costs', description: 'Capitalization criteria, Qualifying assets.', topic: 'assets', progress: 95 },
  { id: 'm_ifrs16', title: 'IFRS 16 Leases', description: 'Lessee accounting (ROU Asset + Liability), Lessor accounting.', topic: 'assets', progress: 40 },
  { id: 'm_ias2', title: 'IAS 2 Inventories', description: 'Lower of Cost or NRV.', topic: 'assets', progress: 80 },
  { id: 'm_ias41', title: 'IAS 41 Agriculture', description: 'Biological assets, Fair value less costs to sell.', topic: 'assets', progress: 30 },
  { id: 'm_ifrs5', title: 'IFRS 5 HFS & Discontinued Ops', description: 'Criteria for HFS, Measurement, Presentation.', topic: 'assets', progress: 90 },

  // --- D. Revenue & Liabilities ---
  { id: 'm_ifrs15', title: 'IFRS 15 Revenue', description: '5-Step Model, Performance Obligations, Contract Costs.', topic: 'revenue', progress: 60 },
  { id: 'm_ias37', title: 'IAS 37 Provisions', description: 'Provisions vs Contingencies, Restructuring, Onerous contracts.', topic: 'liabilities', progress: 75 },
  { id: 'm_ias19', title: 'IAS 19 Employee Benefits', description: 'Defined Benefit Plans, Actuarial gains/losses, Asset Ceiling.', topic: 'liabilities', progress: 25 },
  { id: 'm_ifrs2', title: 'IFRS 2 Share-based Payment', description: 'Equity vs Cash settled, Vesting conditions.', topic: 'liabilities', progress: 30 },

  // --- E. Financial Instruments ---
  { id: 'm_ias32', title: 'IAS 32 Presentation', description: 'Equity vs Liability, Compound Instruments, Offsetting.', topic: 'financial-instruments', progress: 40 },
  { id: 'm_ifrs9', title: 'IFRS 9 Financial Instruments', description: 'Classification (AC, FVTOCI, FVTPL), ECL, Hedging.', topic: 'financial-instruments', progress: 20 },
  { id: 'm_ifrs7', title: 'IFRS 7 Disclosures', description: 'Risk disclosures (Credit, Liquidity, Market).', topic: 'financial-instruments', progress: 15 },

  // --- F. Other & Specialized ---
  { id: 'm_ias12', title: 'IAS 12 Income Taxes', description: 'Current Tax, Deferred Tax, Temporary Differences.', topic: 'other', progress: 55 },
  { id: 'm_ias33', title: 'IAS 33 EPS', description: 'Basic and Diluted EPS.', topic: 'other', progress: 50 },
  { id: 'm_ias24', title: 'IAS 24 Related Parties', description: 'Definitions and Disclosures.', topic: 'other', progress: 60 },
  { id: 'm_ias7', title: 'IAS 7 Cash Flows', description: 'Operating, Investing, Financing activities.', topic: 'other', progress: 45 },
  { id: 'm_ifrs8', title: 'IFRS 8 Operating Segments', description: 'CODM, Aggregation, 10% thresholds.', topic: 'other', progress: 40 },
  { id: 'm_ifrs1', title: 'IFRS 1 First-time Adoption', description: 'Transition date, Opening Balance Sheet.', topic: 'other', progress: 10 },
  { id: 'm_ifrs17', title: 'IFRS 17 Insurance Contracts', description: 'GMM, PAA, CSM concepts.', topic: 'other', progress: 5 }
];

export const EXAM_TECHNIQUES = [
  { title: 'Bloom Analysis', desc: 'Focus 40% time on Apply/Analyze. Definitions (Remember) only get you 10-15%.' },
  { title: 'Time Allocation', desc: 'Strictly follow 1.95 mins/mark. Q1 (25m) = 49 mins. Stop when time is up.' },
  { title: 'Answer Planning', desc: 'Spend first 5-10 mins of each question planning headers. Don\'t dive into calcs immediately.' },
  { title: 'Standard Structure', desc: 'Use "State, Explain, Apply". State the standard (IAS/IFRS), Explain the rule, Apply to facts.' },
  { title: 'Consolidation Tips', desc: 'Always leave space for workings (W1 Structure, W2 Net Assets, W3 Goodwill, W4 NCI, W5 Retained Earnings).' },
  { title: 'Presentation', desc: 'Use clear headings. Leave white space. Use short paragraphs.' },
];