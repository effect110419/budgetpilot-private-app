export type Locale = 'en' | 'ru'

export const LOCALE_STORAGE_KEY = 'budgetpilot_locale'

export const LOCALE_OPTIONS: { value: Locale; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Русский' },
]

export type MessageKey =
  | 'appTitle'
  | 'appTagline'
  | 'monthLabel'
  | 'summaryIncome'
  | 'summaryExpenses'
  | 'summaryBalance'
  | 'addTransaction'
  | 'type'
  | 'typeExpense'
  | 'typeIncome'
  | 'amount'
  | 'category'
  | 'date'
  | 'note'
  | 'optional'
  | 'saveTransaction'
  | 'categoryBudgets'
  | 'categoryBudgetsHint'
  | 'noLimit'
  | 'setLimit'
  | 'expenseAnalytics'
  | 'noExpensesMonth'
  | 'transactions'
  | 'noTransactionsMonth'
  | 'delete'
  | 'language'
  | 'category_salary'
  | 'category_freelance'
  | 'category_food'
  | 'category_transport'
  | 'category_housing'
  | 'category_health'
  | 'category_entertainment'
  | 'category_shopping'
  | 'category_other'

const en: Record<MessageKey, string> = {
  appTitle: 'BudgetPilot',
  appTagline: 'Track income, expenses, and monthly limits in one place.',
  monthLabel: 'Month',
  summaryIncome: 'Income',
  summaryExpenses: 'Expenses',
  summaryBalance: 'Balance',
  addTransaction: 'Add transaction',
  type: 'Type',
  typeExpense: 'Expense',
  typeIncome: 'Income',
  amount: 'Amount',
  category: 'Category',
  date: 'Date',
  note: 'Note',
  optional: 'Optional',
  saveTransaction: 'Save transaction',
  categoryBudgets: 'Category budgets',
  categoryBudgetsHint: 'Set monthly budget per expense category.',
  noLimit: 'No limit',
  setLimit: 'Set limit',
  expenseAnalytics: 'Expense analytics',
  noExpensesMonth: 'No expenses for selected month.',
  transactions: 'Transactions',
  noTransactionsMonth: 'No transactions for selected month.',
  delete: 'Delete',
  language: 'Language',
  category_salary: 'Salary',
  category_freelance: 'Freelance',
  category_food: 'Food',
  category_transport: 'Transport',
  category_housing: 'Housing',
  category_health: 'Health',
  category_entertainment: 'Entertainment',
  category_shopping: 'Shopping',
  category_other: 'Other',
}

const ru: Record<MessageKey, string> = {
  appTitle: 'BudgetPilot',
  appTagline: 'Доходы, расходы и месячные лимиты в одном месте.',
  monthLabel: 'Месяц',
  summaryIncome: 'Доходы',
  summaryExpenses: 'Расходы',
  summaryBalance: 'Баланс',
  addTransaction: 'Добавить операцию',
  type: 'Тип',
  typeExpense: 'Расход',
  typeIncome: 'Доход',
  amount: 'Сумма',
  category: 'Категория',
  date: 'Дата',
  note: 'Заметка',
  optional: 'Необязательно',
  saveTransaction: 'Сохранить операцию',
  categoryBudgets: 'Бюджеты по категориям',
  categoryBudgetsHint: 'Задайте месячный лимит для каждой категории расходов.',
  noLimit: 'Без лимита',
  setLimit: 'Лимит',
  expenseAnalytics: 'Аналитика расходов',
  noExpensesMonth: 'Нет расходов за выбранный месяц.',
  transactions: 'Операции',
  noTransactionsMonth: 'Нет операций за выбранный месяц.',
  delete: 'Удалить',
  language: 'Язык',
  category_salary: 'Зарплата',
  category_freelance: 'Фриланс',
  category_food: 'Еда',
  category_transport: 'Транспорт',
  category_housing: 'Жильё',
  category_health: 'Здоровье',
  category_entertainment: 'Развлечения',
  category_shopping: 'Покупки',
  category_other: 'Другое',
}

export const messages: Record<Locale, Record<MessageKey, string>> = { en, ru }

/** Stored category id (English) → message key for display */
export const CATEGORY_TO_KEY: Record<string, MessageKey> = {
  Salary: 'category_salary',
  Freelance: 'category_freelance',
  Food: 'category_food',
  Transport: 'category_transport',
  Housing: 'category_housing',
  Health: 'category_health',
  Entertainment: 'category_entertainment',
  Shopping: 'category_shopping',
  Other: 'category_other',
}

export function categoryLabel(
  stored: string,
  t: (key: MessageKey) => string,
): string {
  const key = CATEGORY_TO_KEY[stored]
  return key ? t(key) : stored
}
