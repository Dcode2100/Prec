import {
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from '@radix-ui/react-icons'

export const labels = [
  {
    value: 'bug',
    label: 'Bug',
  },
  {
    value: 'feature',
    label: 'Feature',
  },
  {
    value: 'documentation',
    label: 'Documentation',
  },
]

export const statuses = [
  {
    value: 'backlog',
    label: 'Backlog',
    icon: QuestionMarkCircledIcon,
  },
  {
    value: 'todo',
    label: 'Todo',
    icon: CircleIcon,
  },
  {
    value: 'in progress',
    label: 'In Progress',
    icon: StopwatchIcon,
  },
  {
    value: 'done',
    label: 'Done',
    icon: CheckCircledIcon,
  },
  {
    value: 'canceled',
    label: 'Canceled',
    icon: CrossCircledIcon,
  },
]

export const accountTypes = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Completed', value: 'COMPLETE' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'PC Active', value: 'true' },
  { label: 'PC Inactive', value: 'false' },
]

export const csvAccountHeaders = [
  "Account ID",
  "Name",
  "Mobile",
  "Email",
  "Registration Type" ,
  "Nominator Name" ,
  "Nominator Code" ,
  "Referral Name" ,
  "Referral Code",
  "Balance",
  "Withdraw",
  "Tracker",
  "Status",
  "Private Equity Holding",
  "Private Credit Holding",
  "Total Private Equity Holdings Value",
  "Total Private Credit Holdings Value",
  "Created At",
]