import Link from 'next/link'

interface BreadcrumbItem {
  href: string
  label: string
}

interface BreadCrumbsProps {
  items: BreadcrumbItem[]
}

export default function BreadCrumbs({ items }: BreadCrumbsProps) {
  return (
    <nav className="flex px-4 " aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => (
          <li key={item.href} className="inline-flex items-center">
            {index > 0 && (
              <svg
                className="w-3 h-3 text-gray-400 mx-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
            )}
            <Link
              href={item.href}
              className={`text-sm ${
                index === items.length - 1
                  ? 'text-gray-500 font-medium'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}
