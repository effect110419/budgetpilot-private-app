export type Locale = 'en' | 'ru'

export const LOCALE_STORAGE_KEY = 'budgetpilot_locale'

export const LOCALE_OPTIONS: { value: Locale; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Русский' },
]

export type MonthKey =
  | 'month_1'
  | 'month_2'
  | 'month_3'
  | 'month_4'
  | 'month_5'
  | 'month_6'
  | 'month_7'
  | 'month_8'
  | 'month_9'
  | 'month_10'
  | 'month_11'
  | 'month_12'

export type MessageKey =
  | 'appTitle'
  | 'appTagline'
  | 'heroLead'
  | 'toolbarPeriod'
  | 'toolbarDisplay'
  | 'sectionSummaryTitle'
  | 'sectionSummaryDesc'
  | 'kpiCardIncomeSub'
  | 'kpiCardExpenseSub'
  | 'kpiCardBalanceSub'
  | 'sectionEntryTitle'
  | 'sectionEntryDesc'
  | 'hintAmount'
  | 'hintDate'
  | 'hintCategory'
  | 'sectionBudgetTitle'
  | 'sectionBudgetDesc'
  | 'sectionInsightsTitle'
  | 'sectionAnalyticsDesc'
  | 'sectionTransactionsDesc'
  | 'emptyAnalyticsLong'
  | 'emptyTransactionsLong'
  | 'monthLabel'
  | 'yearLabel'
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
  | 'themeLight'
  | 'themeDark'
  | 'themeToggle'
  | 'category_salary'
  | 'category_freelance'
  | 'category_food'
  | 'category_transport'
  | 'category_housing'
  | 'category_health'
  | 'category_entertainment'
  | 'category_shopping'
  | 'category_other'
  | MonthKey

const en: Record<MessageKey, string> = {
  appTitle: 'BudgetPilot',
  appTagline: 'Track income, expenses, and monthly limits in one place.',
  heroLead:
    'See what you earned and spent each month, set limits per category, and keep a clear history — without spreadsheets.',
  toolbarPeriod: 'Reporting period',
  toolbarDisplay: 'Display',
  sectionSummaryTitle: 'This month at a glance',
  sectionSummaryDesc:
    'These three numbers include only operations whose date falls in the month you selected in the bar above.',
  kpiCardIncomeSub: 'Total money received this month',
  kpiCardExpenseSub: 'Total money spent this month',
  kpiCardBalanceSub: 'What is left after expenses',
  sectionEntryTitle: 'Add an income or expense',
  sectionEntryDesc:
    'Each line is one movement of money. Fill in the form and save — the summary and reports below update automatically.',
  hintAmount: 'In rubles, whole numbers.',
  hintDate: 'Use the day the payment actually happened.',
  hintCategory: 'Used for budgets and the spending chart.',
  sectionBudgetTitle: 'Monthly limits by category',
  sectionBudgetDesc:
    'For spending categories only: set how much you are willing to spend this month. We compare it to your actual expenses and show progress.',
  sectionInsightsTitle: 'Analysis and history',
  sectionAnalyticsDesc: 'Share of spending by category for the selected month.',
  sectionTransactionsDesc: 'Every entry you saved for this month, newest first.',
  emptyAnalyticsLong:
    'There are no expenses for this month yet. Add expenses in the form above — the chart will appear here.',
  emptyTransactionsLong:
    'No entries for this month. Add your first income or expense — it will show up in this list.',
  monthLabel: 'Month',
  yearLabel: 'Year',
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
  themeLight: 'Light theme',
  themeDark: 'Dark theme',
  themeToggle: 'Toggle color theme',
  category_salary: 'Salary',
  category_freelance: 'Freelance',
  category_food: 'Food',
  category_transport: 'Transport',
  category_housing: 'Housing',
  category_health: 'Health',
  category_entertainment: 'Entertainment',
  category_shopping: 'Shopping',
  category_other: 'Other',
  month_1: 'January',
  month_2: 'February',
  month_3: 'March',
  month_4: 'April',
  month_5: 'May',
  month_6: 'June',
  month_7: 'July',
  month_8: 'August',
  month_9: 'September',
  month_10: 'October',
  month_11: 'November',
  month_12: 'December',
}

const ru: Record<MessageKey, string> = {
  appTitle: 'BudgetPilot',
  appTagline: 'Доходы, расходы и месячные лимиты в одном месте.',
  heroLead:
    'Понимайте, сколько пришло и ушло за месяц, задавайте лимиты по категориям и ведите историю — без таблиц и формул.',
  toolbarPeriod: 'Период отчёта',
  toolbarDisplay: 'Оформление',
  sectionSummaryTitle: 'Сводка за выбранный месяц',
  sectionSummaryDesc:
    'Эти три цифры считаются только по операциям, у которых дата попадает в месяц, выбранный в панели выше.',
  kpiCardIncomeSub: 'Всего поступило за месяц',
  kpiCardExpenseSub: 'Всего потрачено за месяц',
  kpiCardBalanceSub: 'Остаток после расходов',
  sectionEntryTitle: 'Добавить доход или расход',
  sectionEntryDesc:
    'Одна строка — одно движение денег. Заполните поля и сохраните: сводка и отчёты ниже обновятся сами.',
  hintAmount: 'Сумма в рублях, без копеек.',
  hintDate: 'День, когда платёж реально прошёл.',
  hintCategory: 'Нужна для бюджетов и диаграммы расходов.',
  sectionBudgetTitle: 'Лимиты по категориям расходов',
  sectionBudgetDesc:
    'Только для категорий расходов: задайте потолок на месяц. Мы сравним его с фактом и покажем прогресс.',
  sectionInsightsTitle: 'Аналитика и список',
  sectionAnalyticsDesc: 'Доля расходов по категориям за выбранный месяц.',
  sectionTransactionsDesc: 'Все сохранённые операции за этот месяц, сначала новые.',
  emptyAnalyticsLong:
    'За этот месяц ещё нет расходов. Добавьте расходы в форме выше — здесь появится диаграмма.',
  emptyTransactionsLong:
    'За этот месяц пока пусто. Добавьте первую операцию — она появится в этом списке.',
  monthLabel: 'Месяц',
  yearLabel: 'Год',
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
  themeLight: 'Светлая тема',
  themeDark: 'Тёмная тема',
  themeToggle: 'Переключить тему',
  category_salary: 'Зарплата',
  category_freelance: 'Фриланс',
  category_food: 'Еда',
  category_transport: 'Транспорт',
  category_housing: 'Жильё',
  category_health: 'Здоровье',
  category_entertainment: 'Развлечения',
  category_shopping: 'Покупки',
  category_other: 'Другое',
  month_1: 'Январь',
  month_2: 'Февраль',
  month_3: 'Март',
  month_4: 'Апрель',
  month_5: 'Май',
  month_6: 'Июнь',
  month_7: 'Июль',
  month_8: 'Август',
  month_9: 'Сентябрь',
  month_10: 'Октябрь',
  month_11: 'Ноябрь',
  month_12: 'Декабрь',
}

export const messages: Record<Locale, Record<MessageKey, string>> = { en, ru }

export function monthMessageKey(monthIndex1to12: number): MonthKey {
  const n = Math.floor(monthIndex1to12)
  if (n >= 1 && n <= 12) return `month_${n}` as MonthKey
  return 'month_1'
}

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
