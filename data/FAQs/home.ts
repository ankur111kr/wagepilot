import type { FAQItem } from '@/types'

export const homeFAQs: FAQItem[] = [
  {
    question: 'How accurate are WagePilot\'s tax calculations?',
    answer:
      'WagePilot uses official IRS and HMRC tax data updated for each tax year. Our calculations account for federal brackets, all 50 state income tax rates, FICA taxes, and UK PAYE bands. While highly accurate, we recommend consulting a qualified tax professional for your specific situation.',
  },
  {
    question: 'Which tax year does WagePilot use?',
    answer:
      'By default, WagePilot uses 2025 tax data for US calculations and the 2025/26 tax year for UK calculations. You can select historical years for comparisons.',
  },
  {
    question: 'Is WagePilot free to use?',
    answer:
      'Yes, all calculators on WagePilot are completely free to use with no registration required. We are supported by non-intrusive advertising.',
  },
  {
    question: 'Can I calculate my UK take-home pay?',
    answer:
      'Yes. WagePilot supports full UK PAYE calculations including income tax (with Scottish rates), National Insurance, pension auto-enrollment, and all five student loan plan types.',
  },
  {
    question: 'Do you support self-employed / contractor calculations?',
    answer:
      'Yes. Our Contractor Calculator handles self-employment tax (15.3%), quarterly estimated tax payments, business expense deductions, and retirement contributions for sole proprietors and single-member LLCs.',
  },
  {
    question: 'Can I export or share my results?',
    answer:
      'Yes. Each calculator has Copy, Share, and Print buttons so you can save or share your results. Sharing creates a URL with your inputs pre-filled.',
  },
]
