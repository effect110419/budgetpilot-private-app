# Product Requirements Document (PRD): BudgetPilot

## 1. Problem Statement

Users lose control of personal finances because expenses are scattered and hard to review.

## 2. Product Goal

Provide a simple and reliable finance tracker that helps users:

- capture income/expenses in under 10 seconds
- monitor monthly spending against budgets
- identify overspending categories early

## 3. Target Users

- Young professionals
- Families managing shared expenses
- Freelancers with irregular income

## 4. MVP Scope

### Must Have

- Email/social login
- Add, edit, delete transactions
- Income vs expense transaction types
- Categories (default + custom)
- Monthly budget limits by category
- Dashboard (month summary, top categories, trend)
- Basic reminders

### Nice to Have (Post-MVP)

- Shared household wallet
- Recurring transactions
- CSV export
- Receipt scan OCR

## 5. Non-Functional Requirements

- Mobile-first UX
- 99.5% monthly availability target
- P95 API response under 600ms
- Secure auth and encrypted transport

## 6. Success Metrics

- D7 retention > 25%
- At least 5 transactions/week per active user
- Budget setup rate > 40% of new users
- Month-1 churn < 15% on paid users

## 7. Risks

- User drop after onboarding
- High support load from import edge cases
- Notification fatigue

## 8. Open Questions

- Which payment provider for subscriptions first?
- Which analytics stack for privacy-safe tracking?
- Should shared wallets be in MVP or V2?
