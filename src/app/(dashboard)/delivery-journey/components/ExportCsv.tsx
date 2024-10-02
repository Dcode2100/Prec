import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, Loader2 } from 'lucide-react'
import { CSVLink } from 'react-csv'
import { OrderResponse, UsersPanPendingResponse } from '@/lib/types/types'
import {
  getCDSLDeliveriesAnalyticsData,
  getNSDLDeliveriesAnalyticsData,
} from '@/lib/api/deliveryApi'
import { useToast } from '@/hooks/use-toast'
import { orderDetailsHeaders } from '@/constants/headers'

interface ExportOption {
  label: string
  value: string
}

const exportOptions: ExportOption[] = [
  { label: 'ALL', value: 'All' },
  { label: 'CDSL', value: 'CDSL' },
  { label: 'NSDL', value: 'NSDL' },
]

interface ExportCsvProps {
  orderAnalytics: OrderResponse[] | UsersPanPendingResponse[]
  status: string
  limit: number
  page: number
}

export const ExportCsv: React.FC<ExportCsvProps> = ({
  orderAnalytics,
  status,
  limit,
  page,
}) => {
  const [csvData, setCsvData] = useState<
    OrderResponse[] | UsersPanPendingResponse[]
  >([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentOption, setCurrentOption] = useState<ExportOption | null>(null)
  const { toast } = useToast()

  const handleExport = async (option: ExportOption) => {
    setIsLoading(true)
    setCurrentOption(option)
    try {
      const params = {
        limit: limit,
        page: page,
        status: status,
      }
      let data: OrderResponse[] | UsersPanPendingResponse[] = []
      if (option.value === 'CDSL')
        data = await getCDSLDeliveriesAnalyticsData(params)
      else if (option.value === 'NSDL')
        data = await getNSDLDeliveriesAnalyticsData(params)
      else {
        data = orderAnalytics
      }

      setCsvData(data)

      toast({
        title: 'Export Ready',
        description: `${option.label} data is ready for download.`,
        variant: 'default',
      })
    } catch (error) {
      console.error('Error fetching CSV data:', error)
      toast({
        title: 'Export Failed',
        description: 'There was an error preparing the data for export.',
        variant: 'destructive',
      })
      setCurrentOption(null)
    } finally {
      setIsLoading(false)
    }
  }

  const resetExport = () => {
    setCurrentOption(null)
    setCsvData([])
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-8 flex items-center justify-center focus:outline-none">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Preparing...
            </>
          ) : currentOption ? (
            <CSVLink
              data={csvData}
              headers={orderDetailsHeaders}
              filename={`export_${currentOption.value}.csv`}
              className="h-8 flex items-center justify-center focus:outline-none"
              onClick={(event) => {
                event.stopPropagation() // Prevent dropdown from opening
                resetExport()
              }}
            >
              Download {currentOption.label}
            </CSVLink>
          ) : (
            <>
              Export CSV <ChevronDown className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      {!currentOption && !isLoading && (
        <DropdownMenuContent>
          {exportOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onSelect={() => handleExport(option)}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  )
}

export default ExportCsv
