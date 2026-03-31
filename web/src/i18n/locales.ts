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
  | 'toolbarInterface'
  | 'labelTheme'
  | 'sectionSummaryTitle'
  | 'sectionSummaryDesc'
  | 'dashboardOverBudgetBanner'
  | 'dashboardOverBudgetLink'
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
  | 'operationsFilterType'
  | 'operationsFilterTypeAll'
  | 'operationsFilterTypeIncome'
  | 'operationsFilterTypeExpense'
  | 'operationsFilterCategory'
  | 'operationsFilterCategoryAll'
  | 'operationsSearchLabel'
  | 'operationsSearchPlaceholder'
  | 'operationsSortLabel'
  | 'operationsSortDateDesc'
  | 'operationsSortDateAsc'
  | 'operationsSortAmountDesc'
  | 'operationsSortAmountAsc'
  | 'operationsNoMatches'
  | 'navDashboard'
  | 'navOperations'
  | 'navBudgets'
  | 'navAnalytics'
  | 'navAccount'
  | 'navAria'
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
  | 'category_bonus'
  | 'category_business'
  | 'category_investments'
  | 'category_gifts'
  | 'category_refunds'
  | 'category_subscriptions'
  | 'detailIncomeTitle'
  | 'detailIncomeDesc'
  | 'detailExpenseTitle'
  | 'detailExpenseDesc'
  | 'detailBalanceTitle'
  | 'detailBalanceDesc'
  | 'breakdownIncome'
  | 'breakdownExpense'
  | 'emptyIncomeMonth'
  | 'emptyExpenseMonth'
  | 'edit'
  | 'saveEdit'
  | 'cancelEdit'
  | 'analyticsIntro'
  | 'authLoginTitle'
  | 'authRegisterTitle'
  | 'authSubtitle'
  | 'authEmail'
  | 'authPassword'
  | 'authPasswordShow'
  | 'authPasswordHide'
  | 'authUsername'
  | 'authUsernameInvalid'
  | 'authSubmitSignIn'
  | 'authSubmitSignUp'
  | 'authSubmitLoadingSignIn'
  | 'authSubmitLoadingSignUp'
  | 'authToggleSignUp'
  | 'authToggleSignIn'
  | 'authContinueWithoutLogin'
  | 'authErrorGeneric'
  | 'authErrorEmailNotConfirmed'
  | 'authErrorInvalidCredentials'
  | 'authErrorWeakPassword'
  | 'authErrorCloudUnavailable'
  | 'authSignOut'
  | 'authCloudSync'
  | 'authLocalOnly'
  | 'accountTitle'
  | 'accountProfileSection'
  | 'accountDesc'
  | 'accountEmailLabel'
  | 'accountSave'
  | 'accountSaved'
  | 'accountCloudOnly'
  | 'authEmailInvalid'
  | 'authEmailRequired'
  | 'authPasswordRequired'
  | 'authPasswordHintList'
  | 'authPwdErrShort'
  | 'authPwdErrAscii'
  | 'authPwdErrUpper'
  | 'authPwdErrLower'
  | 'authPwdErrDigit'
  | 'accountSaveErrorAuth'
  | 'accountSaveErrorProfile'
  | 'subscriptionHeading'
  | 'subscriptionCurrentLabel'
  | 'subscriptionPlanFree'
  | 'subscriptionPlanPremium'
  | 'subscriptionCompareTitle'
  | 'subscriptionFreeCardTitle'
  | 'subscriptionFreeCardBody'
  | 'subscriptionPremiumCardTitle'
  | 'subscriptionPremiumCardBody'
  | 'subscriptionFeature1'
  | 'subscriptionFeature2'
  | 'subscriptionFeature3'
  | 'subscriptionFeature4'
  | 'subscriptionBuy'
  | 'subscriptionAlreadyPremium'
  | 'subscriptionBuySoon'
  | 'subscriptionFreeBullet1'
  | 'subscriptionFreeBullet2'
  | 'subscriptionFreeBullet3'
  | 'subscriptionFreeBullet4'
  | 'subscriptionHubTitle'
  | 'subscriptionHubDesc'
  | 'subscriptionLockedLabel'
  | 'subscriptionHubItem1'
  | 'subscriptionHubItem2'
  | 'subscriptionHubItem3'
  | 'subscriptionHubItem4'
  | 'subscriptionHubItem5'
  | 'subscriptionHubInviteLabel'
  | 'subscriptionHubInvitePlaceholder'
  | 'subscriptionHubInviteButton'
  | 'subscriptionHubInviteSoon'
  | 'accountAgeLabel'
  | 'accountAgeHint'
  | 'accountAgeInvalid'
  | 'recurringTitle'
  | 'recurringDesc'
  | 'recurringAmount'
  | 'recurringDay'
  | 'recurringNote'
  | 'recurringCategory'
  | 'recurringAdd'
  | 'recurringDelete'
  | 'recurringEmpty'
  | MonthKey

const en: Record<MessageKey, string> = {
  appTitle: 'Moneta',
  appTagline: 'Your income, spending, and limits — together in one clear picture.',
  heroLead:
    'See your money for the month you choose: what came in, what went out, and what is left — without spreadsheets.',
  toolbarPeriod: 'Reporting period',
  toolbarInterface: 'Interface',
  labelTheme: 'Theme',
  sectionSummaryTitle: 'Your month in numbers',
  sectionSummaryDesc:
    'These three figures are yours for the month and year selected above — only operations whose date falls in that month.',
  dashboardOverBudgetBanner:
    'Some expense categories are over their monthly limits — check budgets to adjust or spending.',
  dashboardOverBudgetLink: 'Open budgets',
  kpiCardIncomeSub: 'Everything that came into your accounts this month',
  kpiCardExpenseSub: 'Everything you spent this month',
  kpiCardBalanceSub: 'What remains in your pocket after expenses',
  sectionEntryTitle: 'Add to your ledger',
  sectionEntryDesc:
    'One row — one movement of your money. Save it below: your summary and lists update on their own.',
  hintAmount: 'In rubles, whole numbers.',
  hintDate: 'Use the day the payment actually happened.',
  hintCategory:
    'Income and expenses use separate categories. Your expense categories feed budgets and charts.',
  sectionBudgetTitle: 'Your spending limits by category',
  sectionBudgetDesc:
    'Set a monthly cap per expense category that feels right for you. We compare it to your actual spending and show how close you are.',
  sectionInsightsTitle: 'Your analysis & history',
  sectionAnalyticsDesc: 'How your spending splits across categories this month.',
  sectionTransactionsDesc: 'Your saved entries for this month — newest first.',
  emptyAnalyticsLong:
    'You have no expenses logged for this month yet. Add one above — your breakdown will appear here.',
  emptyTransactionsLong:
    'Your list for this month is empty. Add your first income or expense — it will land here instantly.',
  operationsFilterType: 'Filter by type',
  operationsFilterTypeAll: 'All',
  operationsFilterTypeIncome: 'Income only',
  operationsFilterTypeExpense: 'Expenses only',
  operationsFilterCategory: 'Category',
  operationsFilterCategoryAll: 'All categories',
  operationsSearchLabel: 'Search',
  operationsSearchPlaceholder: 'Search note, category, amount…',
  operationsSortLabel: 'Sort',
  operationsSortDateDesc: 'Date — newest first',
  operationsSortDateAsc: 'Date — oldest first',
  operationsSortAmountDesc: 'Amount — largest first',
  operationsSortAmountAsc: 'Amount — smallest first',
  operationsNoMatches: 'No entries match your filters.',
  navDashboard: 'Overview',
  navOperations: 'Operations',
  navBudgets: 'Budgets',
  navAnalytics: 'Analytics',
  navAccount: 'Account',
  navAria: 'Main sections',
  monthLabel: 'Month',
  yearLabel: 'Year',
  summaryIncome: 'Your income',
  summaryExpenses: 'Your spending',
  summaryBalance: 'Your balance',
  addTransaction: 'Save to your ledger',
  type: 'Type',
  typeExpense: 'Expense',
  typeIncome: 'Income',
  amount: 'Amount',
  category: 'Category',
  date: 'Date',
  note: 'Note',
  optional: 'Optional',
  saveTransaction: 'Save to your ledger',
  categoryBudgets: 'Your category budgets',
  categoryBudgetsHint: 'Give each expense category a monthly limit that fits your plan.',
  noLimit: 'No limit',
  setLimit: 'Set limit',
  expenseAnalytics: 'Your spending by category',
  noExpensesMonth: 'No expenses in your ledger for this month.',
  transactions: 'Your entries',
  noTransactionsMonth: 'Nothing in your ledger for this month yet.',
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
  category_bonus: 'Bonus',
  category_business: 'Business & self-employed',
  category_investments: 'Investments & interest',
  category_gifts: 'Gifts received',
  category_refunds: 'Purchase refunds',
  category_subscriptions: 'Subscriptions',
  detailIncomeTitle: 'Your income this month',
  detailIncomeDesc:
    'Your inflows by category and line by line. Add, edit, or remove anything that does not belong.',
  detailExpenseTitle: 'Your spending this month',
  detailExpenseDesc:
    'Your outflows by category and line by line. Add, edit, or remove entries anytime.',
  detailBalanceTitle: 'Your full picture this month',
  detailBalanceDesc:
    'Your income and spending side by side: breakdowns plus a single list you can edit or extend.',
  breakdownIncome: 'Your income by category',
  breakdownExpense: 'Your spending by category',
  emptyIncomeMonth: 'No income entries in your ledger for this month.',
  emptyExpenseMonth: 'No expense entries in your ledger for this month.',
  edit: 'Edit',
  saveEdit: 'Save',
  cancelEdit: 'Cancel',
  analyticsIntro:
    'Everything below reflects your chosen month and year in the header. First your totals, then how your income and spending split by category.',
  authLoginTitle: 'Sign in',
  authRegisterTitle: 'Create account',
  authSubtitle: 'Sync your budget across devices with one login.',
  authEmail: 'Email',
  authPassword: 'Password',
  authPasswordShow: 'Show password',
  authPasswordHide: 'Hide password',
  authUsername: 'Display name',
  authUsernameInvalid: 'Use 2–40 characters (letters, numbers, spaces).',
  authSubmitSignIn: 'Sign in',
  authSubmitSignUp: 'Create account',
  authSubmitLoadingSignIn: 'Signing in…',
  authSubmitLoadingSignUp: 'Creating account…',
  authToggleSignUp: 'Need an account? Sign up',
  authToggleSignIn: 'Already have an account? Sign in',
  authContinueWithoutLogin: 'Continue without signing in',
  authErrorGeneric: 'Something went wrong. Check your email and password.',
  authErrorEmailNotConfirmed:
    'Confirm your email first: open the message from the app and tap the link, then sign in.',
  authErrorInvalidCredentials: 'Wrong email or password.',
  authErrorWeakPassword: 'Password is too weak. Use a longer or more complex password.',
  authErrorCloudUnavailable: 'Cloud sync is not configured on this build.',
  authSignOut: 'Sign out',
  authCloudSync: 'Data protected',
  authLocalOnly: 'Local only',
  accountTitle: 'Account',
  accountProfileSection: 'Profile',
  accountDesc: 'Your sign-in email and the name shown in the app header.',
  accountEmailLabel: 'Email',
  accountSave: 'Save',
  accountSaved: 'Saved.',
  accountCloudOnly: 'Account settings need cloud sync (API not configured).',
  authEmailInvalid: 'Enter a valid email address.',
  authEmailRequired: 'Enter your email address.',
  authPasswordRequired: 'Enter your password.',
  authPasswordHintList:
    'At least 8 characters, English letters and digits only, one uppercase, one lowercase, one digit.',
  authPwdErrShort: 'Use at least 8 characters.',
  authPwdErrAscii: 'Use only English letters, digits, and common symbols (ASCII).',
  authPwdErrUpper: 'Add at least one uppercase letter (A–Z).',
  authPwdErrLower: 'Add at least one lowercase letter (a–z).',
  authPwdErrDigit: 'Add at least one digit (0–9).',
  accountSaveErrorAuth: 'Could not update your session. Try signing in again.',
  accountSaveErrorProfile: 'Could not save your profile in the database. Check that migrations are applied.',
  subscriptionHeading: 'Subscription',
  subscriptionCurrentLabel: 'Your current plan',
  subscriptionPlanFree: 'Free',
  subscriptionPlanPremium: 'Premium',
  subscriptionCompareTitle: 'Plans',
  subscriptionFreeCardTitle: 'Free',
  subscriptionFreeCardBody:
    'Personal budget, categories, analytics, cloud sync, and one device experience you already use.',
  subscriptionPremiumCardTitle: 'Premium',
  subscriptionPremiumCardBody:
    'Everything in Free, plus features for households and shared money.',
  subscriptionFeature1: 'Shared budgets with family or partner (invite by email).',
  subscriptionFeature2: 'Joint categories and real-time sync for shared expenses.',
  subscriptionFeature3: 'Export and extended history (as we roll them out).',
  subscriptionFeature4: 'Priority support and early access to new tools.',
  subscriptionBuy: 'Upgrade to Premium',
  subscriptionAlreadyPremium: 'You already have Premium.',
  subscriptionBuySoon:
    'Online payment is not connected yet. We will add card checkout here soon.',
  subscriptionFreeBullet1: 'Income, expenses, and monthly balance on one screen.',
  subscriptionFreeBullet2: 'Category budgets, analytics, and transaction history.',
  subscriptionFreeBullet3: 'Cloud sync and secure sign-in across devices.',
  subscriptionFreeBullet4: 'Recurring income reminders and a clear, calm UI.',
  subscriptionHubTitle: 'Premium tools',
  subscriptionHubDesc:
    'Household finance features unlock here when you have Premium — invite people, share budgets, and more.',
  subscriptionLockedLabel: 'Available with Premium',
  subscriptionHubItem1: 'Invite a partner or family member by email to a shared space.',
  subscriptionHubItem2: 'Joint budgets: see household spending without double entry.',
  subscriptionHubItem3: 'Shared categories and tags synced in real time.',
  subscriptionHubItem4: 'Export to CSV and deeper history (as we ship it).',
  subscriptionHubItem5: 'Smart alerts for limits, bills, and unusual spending (coming).',
  subscriptionHubInviteLabel: 'Invite by email',
  subscriptionHubInvitePlaceholder: 'name@example.com',
  subscriptionHubInviteButton: 'Send invite',
  subscriptionHubInviteSoon: 'Invites will be sent from here once the feature is live.',
  accountAgeLabel: 'Age',
  accountAgeHint: 'Optional. Used only to tailor hints in the app.',
  accountAgeInvalid: 'Enter an age between 13 and 120, or leave empty.',
  recurringTitle: 'Recurring income',
  recurringDesc:
    'We add this income on the chosen day each month (when the day has arrived). You can edit or delete the generated entry like any other.',
  recurringAmount: 'Amount (₽)',
  recurringDay: 'Day of month (1–31)',
  recurringNote: 'Note',
  recurringCategory: 'Category',
  recurringAdd: 'Add recurring income',
  recurringDelete: 'Remove',
  recurringEmpty: 'No recurring income yet.',
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
  appTitle: 'Монета',
  appTagline: 'Ваши доходы, расходы и лимиты — в одной понятной картине.',
  heroLead:
    'Смотрите свои деньги за выбранный месяц: что пришло, что ушло и что осталось — без таблиц и лишнего шума.',
  toolbarPeriod: 'Период отчёта',
  toolbarInterface: 'Интерфейс',
  labelTheme: 'Тема',
  sectionSummaryTitle: 'Ваш месяц в цифрах',
  sectionSummaryDesc:
    'Эти три показателя — про ваши операции за месяц и год, которые выбраны выше: учитываются только даты из этого периода.',
  dashboardOverBudgetBanner:
    'По некоторым категориям расходов превышен месячный лимит — загляните в бюджеты.',
  dashboardOverBudgetLink: 'Открыть бюджеты',
  kpiCardIncomeSub: 'Всё, что поступило к вам за этот месяц',
  kpiCardExpenseSub: 'Всё, что вы потратили за этот месяц',
  kpiCardBalanceSub: 'Что остаётся у вас после расходов',
  sectionEntryTitle: 'Добавить в вашу книгу',
  sectionEntryDesc:
    'Одна строка — одно ваше движение денег. Сохраните ниже: сводка и списки обновятся сами.',
  hintAmount: 'Сумма в рублях, без копеек.',
  hintDate: 'День, когда платёж реально прошёл.',
  hintCategory:
    'У доходов и расходов — разные категории. По расходам считаются ваши лимиты и диаграммы.',
  sectionBudgetTitle: 'Ваши лимиты по категориям расходов',
  sectionBudgetDesc:
    'Задайте для себя комфортный потолок по каждой категории расходов за месяц. Мы сравним его с фактом и покажем, как вы укладываетесь.',
  sectionInsightsTitle: 'Ваша аналитика и история',
  sectionAnalyticsDesc: 'Как делятся ваши расходы по категориям в выбранном месяце.',
  sectionTransactionsDesc: 'Ваши сохранённые операции за этот месяц — сначала новые.',
  emptyAnalyticsLong:
    'Пока нет расходов за этот месяц. Добавьте операцию выше — здесь появится ваша разбивка.',
  emptyTransactionsLong:
    'Ваш список за этот месяц пока пуст. Добавьте первую операцию — она сразу появится здесь.',
  operationsFilterType: 'Тип операций',
  operationsFilterTypeAll: 'Все',
  operationsFilterTypeIncome: 'Только доходы',
  operationsFilterTypeExpense: 'Только расходы',
  operationsFilterCategory: 'Категория',
  operationsFilterCategoryAll: 'Все категории',
  operationsSearchLabel: 'Поиск',
  operationsSearchPlaceholder: 'Поиск по заметке, категории, сумме…',
  operationsSortLabel: 'Сортировка',
  operationsSortDateDesc: 'Дата — сначала новые',
  operationsSortDateAsc: 'Дата — сначала старые',
  operationsSortAmountDesc: 'Сумма — по убыванию',
  operationsSortAmountAsc: 'Сумма — по возрастанию',
  operationsNoMatches: 'Нет операций по заданным условиям.',
  navDashboard: 'Сводка',
  navOperations: 'Операции',
  navBudgets: 'Бюджеты',
  navAnalytics: 'Аналитика',
  navAccount: 'Кабинет',
  navAria: 'Разделы вашего кабинета',
  monthLabel: 'Месяц',
  yearLabel: 'Год',
  summaryIncome: 'Ваш доход',
  summaryExpenses: 'Ваши расходы',
  summaryBalance: 'Ваш баланс',
  addTransaction: 'Добавить в книгу',
  type: 'Тип',
  typeExpense: 'Расход',
  typeIncome: 'Доход',
  amount: 'Сумма',
  category: 'Категория',
  date: 'Дата',
  note: 'Заметка',
  optional: 'Необязательно',
  saveTransaction: 'Сохранить в книгу',
  categoryBudgets: 'Ваши бюджеты по категориям',
  categoryBudgetsHint: 'Задайте месячный лимит там, где он вам нужен.',
  noLimit: 'Без лимита',
  setLimit: 'Лимит',
  expenseAnalytics: 'Ваши расходы по категориям',
  noExpensesMonth: 'В вашей книге нет расходов за этот месяц.',
  transactions: 'Ваши операции',
  noTransactionsMonth: 'В вашей книге пока пусто за этот месяц.',
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
  category_bonus: 'Премия',
  category_business: 'Бизнес и ИП',
  category_investments: 'Инвестиции и проценты',
  category_gifts: 'Подарки',
  category_refunds: 'Возвраты от покупок',
  category_subscriptions: 'Подписки',
  detailIncomeTitle: 'Ваши доходы за месяц',
  detailIncomeDesc:
    'Ваши поступления по категориям и построчно. Добавляйте, правьте или убирайте лишнее.',
  detailExpenseTitle: 'Ваши расходы за месяц',
  detailExpenseDesc:
    'Ваши траты по категориям и построчно. Всё можно менять в любой момент.',
  detailBalanceTitle: 'Вся картина за месяц',
  detailBalanceDesc:
    'Ваши доходы и расходы рядом: разбивки и один общий список — с добавлением и правкой.',
  breakdownIncome: 'Ваши доходы по категориям',
  breakdownExpense: 'Ваши расходы по категориям',
  emptyIncomeMonth: 'За этот месяц у вас нет записей о доходах.',
  emptyExpenseMonth: 'За этот месяц у вас нет записей о расходах.',
  edit: 'Изменить',
  saveEdit: 'Сохранить',
  cancelEdit: 'Отмена',
  analyticsIntro:
    'Ниже — только ваш выбранный в шапке месяц и год. Сначала итоги, затем как у вас делятся доходы и расходы по категориям.',
  authLoginTitle: 'Вход',
  authRegisterTitle: 'Регистрация',
  authSubtitle: 'Один вход — ваша книга синхронизируется между устройствами.',
  authEmail: 'Электронная почта',
  authPassword: 'Пароль',
  authPasswordShow: 'Показать пароль',
  authPasswordHide: 'Скрыть пароль',
  authUsername: 'Имя пользователя',
  authUsernameInvalid: 'От 2 до 40 символов: буквы, цифры, пробелы.',
  authSubmitSignIn: 'Войти',
  authSubmitSignUp: 'Создать аккаунт',
  authSubmitLoadingSignIn: 'Входим…',
  authSubmitLoadingSignUp: 'Создаём аккаунт…',
  authToggleSignUp: 'Нет аккаунта? Зарегистрироваться',
  authToggleSignIn: 'Уже есть аккаунт? Войти',
  authContinueWithoutLogin: 'Продолжить без регистрации',
  authErrorGeneric: 'Не получилось. Проверьте почту и пароль.',
  authErrorEmailNotConfirmed:
    'Сначала подтвердите почту: откройте письмо от сервиса и перейдите по ссылке, затем войдите снова.',
  authErrorInvalidCredentials: 'Неверная почта или пароль.',
  authErrorWeakPassword: 'Пароль слишком слабый. Удлините или усложните пароль.',
  authErrorCloudUnavailable: 'Облако не настроено в этой сборке.',
  authSignOut: 'Выйти',
  authCloudSync: 'Данные защищены',
  authLocalOnly: 'Только на устройстве',
  accountTitle: 'Личный кабинет',
  accountProfileSection: 'Профиль',
  accountDesc: 'Почта для входа и имя, которое показывается в шапке.',
  accountEmailLabel: 'Электронная почта',
  accountSave: 'Сохранить',
  accountSaved: 'Сохранено.',
  accountCloudOnly: 'Настройки аккаунта недоступны: облако не настроено.',
  authEmailInvalid: 'Введите корректный адрес почты.',
  authEmailRequired: 'Укажите адрес электронной почты.',
  authPasswordRequired: 'Введите пароль.',
  authPasswordHintList:
    'Не меньше 8 символов, только латиница, цифры и типичные знаки; одна заглавная, одна строчная буква и одна цифра.',
  authPwdErrShort: 'Минимум 8 символов.',
  authPwdErrAscii: 'Только латиница, цифры и обычные символы (ASCII).',
  authPwdErrUpper: 'Нужна хотя бы одна заглавная буква (A–Z).',
  authPwdErrLower: 'Нужна хотя бы одна строчная буква (a–z).',
  authPwdErrDigit: 'Нужна хотя бы одна цифра (0–9).',
  accountSaveErrorAuth: 'Не удалось обновить сессию. Выйдите и войдите снова.',
  accountSaveErrorProfile:
    'Не удалось сохранить профиль в базе. Проверьте, что SQL-миграции применены в Supabase.',
  subscriptionHeading: 'Подписка',
  subscriptionCurrentLabel: 'Текущий тариф',
  subscriptionPlanFree: 'Бесплатный',
  subscriptionPlanPremium: 'Премиум',
  subscriptionCompareTitle: 'Тарифы',
  subscriptionFreeCardTitle: 'Бесплатно',
  subscriptionFreeCardBody:
    'Личный бюджет, категории, аналитика и синхронизация — то, чем вы уже пользуетесь.',
  subscriptionPremiumCardTitle: 'Премиум',
  subscriptionPremiumCardBody:
    'Всё из бесплатного плюс функции для семьи и совместных финансов.',
  subscriptionFeature1: 'Совместные бюджеты с близкими (приглашение по почте).',
  subscriptionFeature2: 'Общие категории и синхронизация совместных трат.',
  subscriptionFeature3: 'Экспорт и расширенная история (по мере появления).',
  subscriptionFeature4: 'Приоритетная поддержка и ранний доступ к новинкам.',
  subscriptionBuy: 'Оформить Премиум',
  subscriptionAlreadyPremium: 'У вас уже тариф Премиум.',
  subscriptionBuySoon:
    'Оплата картой пока не подключена — скоро добавим оформление здесь.',
  subscriptionFreeBullet1: 'Доходы, расходы и баланс месяца на одном экране.',
  subscriptionFreeBullet2: 'Лимиты по категориям, аналитика и история операций.',
  subscriptionFreeBullet3: 'Облачная синхронизация и безопасный вход с разных устройств.',
  subscriptionFreeBullet4: 'Постоянные доходы и спокойный понятный интерфейс.',
  subscriptionHubTitle: 'Возможности Премиум',
  subscriptionHubDesc:
    'Здесь появятся инструменты для совместных финансов — после оформления Премиум.',
  subscriptionLockedLabel: 'Доступно с Премиум',
  subscriptionHubItem1: 'Пригласить близкого по почте в общее пространство.',
  subscriptionHubItem2: 'Совместные бюджеты: видеть семейные траты без двойного ввода.',
  subscriptionHubItem3: 'Общие категории и метки с синхронизацией в реальном времени.',
  subscriptionHubItem4: 'Экспорт в CSV и более глубокая история (по мере запуска).',
  subscriptionHubItem5: 'Умные уведомления о лимитах, счетах и необычных тратах (скоро).',
  subscriptionHubInviteLabel: 'Пригласить по email',
  subscriptionHubInvitePlaceholder: 'имя@пример.ru',
  subscriptionHubInviteButton: 'Отправить приглашение',
  subscriptionHubInviteSoon: 'Отправка приглашений заработает, когда функция будет готова.',
  accountAgeLabel: 'Возраст',
  accountAgeHint: 'Необязательно. Только для подсказок в интерфейсе.',
  accountAgeInvalid: 'Укажите возраст от 13 до 120 или оставьте пустым.',
  recurringTitle: 'Постоянные доходы',
  recurringDesc:
    'Указанная сумма будет добавляться в доход в выбранный день каждого месяца (когда этот день наступил). Запись можно править или удалить как обычную операцию.',
  recurringAmount: 'Сумма (₽)',
  recurringDay: 'День месяца (1–31)',
  recurringNote: 'Заметка',
  recurringCategory: 'Категория',
  recurringAdd: 'Добавить постоянный доход',
  recurringDelete: 'Удалить',
  recurringEmpty: 'Пока нет постоянных доходов.',
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
  Bonus: 'category_bonus',
  Freelance: 'category_freelance',
  Business: 'category_business',
  Investments: 'category_investments',
  Gifts: 'category_gifts',
  Refunds: 'category_refunds',
  Food: 'category_food',
  Transport: 'category_transport',
  Housing: 'category_housing',
  Health: 'category_health',
  Entertainment: 'category_entertainment',
  Shopping: 'category_shopping',
  Subscriptions: 'category_subscriptions',
  Other: 'category_other',
}

export function categoryLabel(
  stored: string,
  t: (key: MessageKey) => string,
): string {
  const key = CATEGORY_TO_KEY[stored]
  return key ? t(key) : stored
}
