import { Flashcard, QuizQuestion, PracticeQuestion, MockExamDef, Module, BloomLevel } from '../types';

// --- MOCK DATABASE CONTENT ---

const SAMPLE_FLASHCARDS_DB: Flashcard[] = [
  // --- IAS 1: Presentation of Financial Statements (10 Cards) ---
  { 
    id: 'fc_ias1_01', 
    moduleId: 'm_ias1', 
    taxonomy: 'Remember', 
    front: 'What constitutes a "Complete Set of Financial Statements" under IAS 1?', 
    back: '1. Statement of Financial Position\n2. Statement of Profit or Loss and OCI\n3. Statement of Changes in Equity\n4. Statement of Cash Flows\n5. Notes (Accounting policies & info)\n6. Comparative information\n7. Third SOFP (if retrospective change).' 
  },
  { 
    id: 'fc_ias1_02', 
    moduleId: 'm_ias1', 
    taxonomy: 'Understand', 
    front: 'Define the "Going Concern" basis of accounting.', 
    back: 'FS are prepared assuming the entity will continue trading for the foreseeable future (at least 12 months). Assets/Liabilities are recorded at book value, NOT break-up value.' 
  },
  { 
    id: 'fc_ias1_03', 
    moduleId: 'm_ias1', 
    taxonomy: 'Apply', 
    front: 'When is a liability classified as "Current" regarding settlement rights?', 
    back: 'When the entity does NOT have an unconditional right to defer settlement for at least 12 months after the reporting date.' 
  },
  { 
    id: 'fc_ias1_04', 
    moduleId: 'm_ias1', 
    taxonomy: 'Analyze', 
    front: 'How is a long-term loan treated if a covenant is breached ON/BEFORE year-end?', 
    back: 'Classified as CURRENT. Even if the lender agrees to waive the breach *after* the reporting date, the right to defer did not exist *at* the reporting date.' 
  },
  { 
    id: 'fc_ias1_05', 
    moduleId: 'm_ias1', 
    taxonomy: 'Apply', 
    front: 'When is "Offsetting" of assets and liabilities permitted?', 
    back: 'Only when required/permitted by a specific IFRS (e.g., IAS 12 Net Tax) or when it reflects the substance of the transaction (e.g., gain on disposal of assets).' 
  },
  { 
    id: 'fc_ias1_06', 
    moduleId: 'm_ias1', 
    taxonomy: 'Remember', 
    front: 'List 3 OCI items that are NOT reclassified (recycled) to Profit or Loss.', 
    back: '1. Revaluation surplus gains (IAS 16/38).\n2. Remeasurement of Defined Benefit Plans (IAS 19).\n3. Fair value changes in Equity Instruments designated at FVTOCI (IFRS 9).' 
  },
  { 
    id: 'fc_ias1_07', 
    moduleId: 'm_ias1', 
    taxonomy: 'Evaluate', 
    front: 'Explain the "True and Fair Override" (Departure from IFRS).', 
    back: 'Extremely rare. Permitted only if compliance would be misleading. Requires disclosure of the departure, reason, and financial impact.' 
  },
  { 
    id: 'fc_ias1_08', 
    moduleId: 'm_ias1', 
    taxonomy: 'Apply', 
    front: 'When is a "Third Statement of Financial Position" required?', 
    back: 'When an entity applies a policy retrospectively, makes a retrospective restatement, or reclassifies items, AND the effect on the opening balance sheet is material.' 
  },
  { 
    id: 'fc_ias1_09', 
    moduleId: 'm_ias1', 
    taxonomy: 'Analyze', 
    front: 'How are dividends on Redeemable Preference Shares presented?', 
    back: 'In P&L as a FINANCE COST (Interest Expense), because the shares are classified as Liabilities, not Equity.' 
  },
  { 
    id: 'fc_ias1_10', 
    moduleId: 'm_ias1', 
    taxonomy: 'Understand', 
    front: 'What is the requirement for "Frequency of Reporting"?', 
    back: 'At least annually. If the period changes, must disclose the reason and the fact that amounts are not entirely comparable.' 
  },

  // IFRS 15 Samples (Existing placeholder - kept for other modules)
  { id: 'fc_15_r1', moduleId: 'm_ifrs15', taxonomy: 'Remember', front: 'List the 5 steps of IFRS 15.', back: '1. Identify Contract. 2. Identify POs. 3. Determine Price. 4. Allocate Price. 5. Recognize Revenue.' },
];

const SAMPLE_QUIZ_DB: QuizQuestion[] = [
  // --- IAS 1: Presentation of Financial Statements (15 Questions) ---
  { 
    id: 'q_ias1_01', 
    moduleId: 'm_ias1', 
    taxonomy: 'Remember', 
    question: 'Which of the following is NOT a component of a complete set of financial statements under IAS 1?', 
    options: ['Statement of Changes in Equity', 'Notes comprising significant accounting policies', 'Management Commentary / Directors Report', 'Statement of Cash Flows'], 
    correctAnswer: 2, 
    explanation: 'Management Commentary or Directors Reports are outside the scope of IFRS Standards, though typically presented in the annual report.' 
  },
  { 
    id: 'q_ias1_02', 
    moduleId: 'm_ias1', 
    taxonomy: 'Apply', 
    question: 'Entity A has a loan due in 3 months. After year-end but before FS approval, it refinances the loan for 2 years. How is this classified at year-end?', 
    options: ['Non-current liability', 'Current liability', 'Equity', 'Contingent liability'], 
    correctAnswer: 1, 
    explanation: 'Current Liability. The refinancing is a non-adjusting event (IAS 10) because the right to defer did not exist at the reporting date.' 
  },
  { 
    id: 'q_ias1_03', 
    moduleId: 'm_ias1', 
    taxonomy: 'Analyze', 
    question: 'Entity B breached a loan covenant at year-end making it payable on demand. The lender agreed to waive the breach 1 month AFTER year-end. Classification?', 
    options: ['Current Liability', 'Non-current Liability', 'Split accounting', 'Disclosed only as a note'], 
    correctAnswer: 0, 
    explanation: 'Current Liability. To be non-current, the unconditional right to defer settlement must exist AT the reporting date. The waiver came too late.' 
  },
  { 
    id: 'q_ias1_04', 
    moduleId: 'm_ias1', 
    taxonomy: 'Understand', 
    question: 'Which item is recognized in OCI and subsequently "reclassified" (recycled) to Profit or Loss?', 
    options: ['Revaluation surplus on PPE', 'Actuarial gains on defined benefit plans', 'Cash flow hedge gains (effective portion)', 'Fair value gain on equity instrument (FVTOCI)'], 
    correctAnswer: 2, 
    explanation: 'Cash flow hedge gains are reclassified to P&L when the hedged item affects P&L. Others listed are "OCI - No Reclassification".' 
  },
  { 
    id: 'q_ias1_05', 
    moduleId: 'm_ias1', 
    taxonomy: 'Apply', 
    question: 'Expenses in P&L are classified as "Cost of Sales", "Distribution", and "Admin". This method is:', 
    options: ['Nature of expense', 'Function of expense', 'Direct allocation', 'Activity-based costing'], 
    correctAnswer: 1, 
    explanation: 'This is the "Function of Expense" method. The "Nature" method would list items like Depreciation, Staff costs, Materials.' 
  },
  { 
    id: 'q_ias1_06', 
    moduleId: 'm_ias1', 
    taxonomy: 'Evaluate', 
    question: 'Management concludes there are material uncertainties regarding Going Concern but decides the basis is still appropriate. Reporting action?', 
    options: ['Prepare FS on break-up basis', 'Prepare FS on going concern basis, disclose nothing', 'Prepare FS on going concern basis, disclose uncertainties', 'Qualify the audit report'], 
    correctAnswer: 2, 
    explanation: 'If the basis is appropriate but uncertainty exists, specific disclosure of that uncertainty is required (IAS 1.25).' 
  },
  { 
    id: 'q_ias1_07', 
    moduleId: 'm_ias1', 
    taxonomy: 'Analyze', 
    question: 'How are final dividends declared on equity shares AFTER the reporting date treated?', 
    options: ['Liability in SOFP', 'Adjusting event', 'Non-adjusting event (Disclosed in notes)', 'Reduction in Retained Earnings at YE'], 
    correctAnswer: 2, 
    explanation: 'Dividends are not a liability until declared/approved. If declared after year-end, they are disclosed in notes but not recognized in the accounts.' 
  },
  { 
    id: 'q_ias1_08', 
    moduleId: 'm_ias1', 
    taxonomy: 'Remember', 
    question: 'Which of the following is defined as a "Current Asset"?', 
    options: ['Asset held for > 12 months', 'Inventory sold within the normal operating cycle (18 months)', 'Deferred Tax Asset', 'Goodwill'], 
    correctAnswer: 1, 
    explanation: 'Assets realized within the entity\'s normal operating cycle are Current, even if the cycle is longer than 12 months.' 
  },
  { 
    id: 'q_ias1_09', 
    moduleId: 'm_ias1', 
    taxonomy: 'Analyze', 
    question: 'Comparative information for the previous period is required for:', 
    options: ['Numerical information only', 'Narrative information only', 'All amounts and relevant narrative information', 'Only the Statement of Profit or Loss'], 
    correctAnswer: 2, 
    explanation: 'IAS 1 requires comparative information for all amounts reported in the current period’s financial statements and relevant narrative info.' 
  },
  { 
    id: 'q_ias1_10', 
    moduleId: 'm_ias1', 
    taxonomy: 'Evaluate', 
    question: 'An entity departs from an IFRS requirement because compliance would be misleading ("True and Fair Override"). What is NOT required?', 
    options: ['Disclosure of the departure', 'Disclosure of the financial impact', 'Approval from the local government', 'Statement that FS present fairly'], 
    correctAnswer: 2, 
    explanation: 'Regulatory/Government approval is not a condition in IAS 1, though the conceptual framework and local laws might interact. The standard requires specific disclosures.' 
  },
  { 
    id: 'q_ias1_11', 
    moduleId: 'm_ias1', 
    taxonomy: 'Create', 
    question: 'Scenario: TechCorp has a $5m bank overdraft repayable on demand, integral to cash management. Presentation in Statement of Cash Flows?', 
    options: ['Operating Activity', 'Financing Activity', 'Investing Activity', 'Component of Cash & Cash Equivalents'], 
    correctAnswer: 3, 
    explanation: 'While a liability in SOFP, for Cash Flow purposes, repayable-on-demand overdrafts integral to cash management are deducted from Cash & Cash Equivalents.' 
  },
  { 
    id: 'q_ias1_12', 
    moduleId: 'm_ias1', 
    taxonomy: 'Remember', 
    question: 'What is the principle-based definition of "Materiality"?', 
    options: ['Items > 5% of profit', 'Items > 1% of revenue', 'Omissions/misstatements that could influence economic decisions of users', 'Items decided by auditors'], 
    correctAnswer: 2, 
    explanation: 'Materiality is based on the nature or magnitude of information and its potential influence on users.' 
  },
  { 
    id: 'q_ias1_13', 
    moduleId: 'm_ias1', 
    taxonomy: 'Evaluate', 
    question: 'Company Y wants to offset a $100k receivable from Supplier A against a $80k payable to Supplier A. No legal right exists. Permitted?', 
    options: ['Yes, always', 'Yes, to show net exposure', 'No, must not offset assets and liabilities', 'Yes, if disclosed'], 
    correctAnswer: 2, 
    explanation: 'IAS 1 prohibits offsetting assets and liabilities unless required/permitted by a standard. Without a legal right (IAS 32), gross presentation is mandatory.' 
  },
  { 
    id: 'q_ias1_14', 
    moduleId: 'm_ias1', 
    taxonomy: 'Understand', 
    question: 'Total Comprehensive Income comprises:', 
    options: ['Profit/Loss + Dividends', 'Profit/Loss + Other Comprehensive Income', 'Revenue + Expenses', 'Assets + Liabilities'], 
    correctAnswer: 1, 
    explanation: 'Total Comprehensive Income = Profit or Loss (P&L) + Other Comprehensive Income (OCI).' 
  },
  { 
    id: 'q_ias1_15', 
    moduleId: 'm_ias1', 
    taxonomy: 'Apply', 
    question: 'A company changes its reporting period to 15 months. What is NOT required to be disclosed?', 
    options: ['The reason for the change', 'The fact that amounts are not comparable', 'Pro-forma 12-month figures', 'The period covered'], 
    correctAnswer: 2, 
    explanation: 'IAS 1 requires disclosing the reason and the fact of non-comparability. It does NOT require calculating hypothetical "pro-forma" 12-month figures.' 
  },
  
  // IFRS 3 Samples (Existing placeholder - kept for other modules)
  { id: 'q_ifrs3_1', moduleId: 'm_ifrs3', taxonomy: 'Apply', question: 'Acquisition costs of $5m incurred.', options: ['Capitalize to Goodwill', 'Expense in P&L', 'Deduct from Equity', 'Ignore'], correctAnswer: 1, explanation: 'Transaction costs are expensed (except debt/equity issue costs).' },
];

const PRACTICE_DB: PracticeQuestion[] = [
  { id: 'pq_dec23_1', title: 'Gamma Group - Consolidation', topic: 'IFRS 10', year: 'Dec 2023', marks: 25, taxonomy: 'Create', scenario: 'Alpha acquires 80% Beta. Beta has unrecorded Brand ($10m). Alpha sells goods to Beta (Margin 20%, $5m in stock). Prepare CSOFP.', solution: '1. Net Assets Table (Adjust for Brand, Depn). 2. Goodwill (Consid + NCI - NA). 3. NCI calc. 4. Retained Earnings (deduct PURP: 5m * 20% = 1m).', examinerComment: 'Common error: deducting PURP from wrong entity RE.' },
  { id: 'pq_jun23_2', title: 'Delta Airlines - Leases', topic: 'IFRS 16', year: 'Jun 2023', marks: 15, taxonomy: 'Analyze', scenario: 'Lease of 10 years. Rent free period 6 months. Variable payments based on CPI. Discuss measurement.', solution: 'Lease Term = 10 yrs. Payments spread. Variable (CPI) included in liability measurement. Remeasure when CPI changes.' },
  { id: 'pq_dec22_3', title: 'BioFarm - Agriculture', topic: 'IAS 41', year: 'Dec 2022', marks: 10, taxonomy: 'Apply', scenario: 'Sheep fair value change.', solution: 'P&L gain/loss.' },
  { id: 'pq_jun22_4', title: 'TechCo - Intangibles', topic: 'IAS 38', year: 'Jun 2022', marks: 12, taxonomy: 'Evaluate', scenario: 'Capitalizing advertising costs.', solution: 'Expense immediately.' },
  { id: 'pq_dec21_5', title: 'ConstructCo - Revenue', topic: 'IFRS 15', year: 'Dec 2021', marks: 20, taxonomy: 'Analyze', scenario: 'Input vs Output methods.', solution: 'Output preferred.' },
];

const MOCKS_DB: MockExamDef[] = [
  {
    id: 'mock_1',
    title: 'Mock Exam 1: Comprehensive',
    durationMinutes: 195,
    questions: [
      { title: 'Q1: Group Accounting', marks: 25, scenario: 'Complex group with Associate.', requirements: ['CSOFP', 'GW Calculation'] },
      { title: 'Q2: Revenue & Assets', marks: 25, scenario: 'IFRS 15 steps + Impairment.', requirements: ['Advise treatment'] },
      { title: 'Q3: Financial Instruments', marks: 25, scenario: 'Convertible bonds + Hedging.', requirements: ['Calculations', 'Journal entries'] },
      { title: 'Q4: Current Issues', marks: 25, scenario: 'Framework & Ethics.', requirements: ['Discuss'] },
    ]
  },
  {
    id: 'mock_2',
    title: 'Mock Exam 2: Speed Run',
    durationMinutes: 195,
    questions: [
      { title: 'Q1: Consolidated P&L', marks: 25, scenario: 'Mid-year acquisition.', requirements: ['CSPLOCI'] },
      { title: 'Q2: Leases & Tax', marks: 25, scenario: 'Sale and leaseback + Deferred Tax.', requirements: ['Explain', 'Calculate'] },
      { title: 'Q3: Provisions', marks: 25, scenario: 'Restructuring & Environmental.', requirements: ['Provision criteria'] },
      { title: 'Q4: SME & IFRS 1', marks: 25, scenario: 'Transition to IFRS.', requirements: ['Explain exemptions'] },
    ]
  }
];

// --- GENERATOR LOGIC ---
// Helper to generate items for modules without specific DB content
const generateFullModuleContent = (module: Module) => {
  const cards: Flashcard[] = [];
  const quiz: QuizQuestion[] = [];

  const fcDist = { Remember: 4, Understand: 4, Apply: 4, Analyze: 3, Evaluate: 2, Create: 1 };
  const qDist = { Remember: 4, Understand: 4, Apply: 8, Analyze: 6, Evaluate: 4, Create: 2 };

  let cardCount = 1;
  Object.entries(fcDist).forEach(([tax, count]) => {
    for (let i = 0; i < count; i++) {
      cards.push({
        id: `gen_fc_${module.id}_${cardCount++}`,
        moduleId: module.id,
        taxonomy: tax as BloomLevel,
        front: `${tax} Question ${i + 1} for ${module.title}`,
        back: `This is a generated placeholder answer demonstrating the ${tax} level of Bloom's Taxonomy.`
      });
    }
  });

  let quizCount = 1;
  Object.entries(qDist).forEach(([tax, count]) => {
    for (let i = 0; i < count; i++) {
      quiz.push({
        id: `gen_q_${module.id}_${quizCount++}`,
        moduleId: module.id,
        taxonomy: tax as BloomLevel,
        question: `[${tax}] Sample scenario question ${i + 1} regarding ${module.title}?`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 0,
        explanation: `Explanation for ${tax} level.`
      });
    }
  });

  return { cards, quiz };
};

// --- DATA SERVICE API ---

export const dataService = {
  getFlashcards: async (module: Module): Promise<Flashcard[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));

    const dbCards = SAMPLE_FLASHCARDS_DB.filter(f => f.moduleId === module.id);
    
    // STRICT MODE: If we have ANY real content in DB (like IAS 1), return ONLY that.
    // Do NOT generate placeholders for modules that have manually authored content.
    if (dbCards.length > 0) {
      return dbCards;
    }

    // Fallback: Only generate placeholders for empty modules
    const { cards: genCards } = generateFullModuleContent(module);
    return genCards.slice(0, 18);
  },

  getQuiz: async (module: Module): Promise<QuizQuestion[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const dbQuiz = SAMPLE_QUIZ_DB.filter(q => q.moduleId === module.id);
    
    // STRICT MODE: If we have ANY real content in DB (like IAS 1), return ONLY that.
    if (dbQuiz.length > 0) {
      return dbQuiz;
    }

    // Fallback: Only generate placeholders for empty modules
    const { quiz: genQuiz } = generateFullModuleContent(module);
    return genQuiz.slice(0, 28);
  },

  getPracticeQuestions: async (): Promise<PracticeQuestion[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return PRACTICE_DB;
  },

  getMockExams: async (): Promise<MockExamDef[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return MOCKS_DB;
  }
};