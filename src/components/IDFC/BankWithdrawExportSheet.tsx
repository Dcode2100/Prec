import React from 'react'
import * as XLSX from 'xlsx'
import { Button } from '@/components/ui/button'

interface DataItem {
  'Beneficiary Name': number
  'Beneficiary Account Number': string
  IFSC: string
  'Transaction Type': string
  'Debit Account Number': string
  'Transaction Date': string
  Amount: string
  Currency: string
  'Beneficiary Email ID': string
  Remarks: string
  'Custom Header – 1': string
  'Custom Header – 2'?: string
  'Custom Header – 3'?: string
  'Custom Header – 4'?: string
  'Custom Header – 5'?: string
}

interface ExportButtonProps {
  data: DataItem[]
}

const BankWithdrawExportSheet: React.FC<ExportButtonProps> = ({ data }) => {
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')
    XLSX.writeFile(workbook, `axis_withdrawal.xlsx`)
  }

  return (
    <Button
      variant="outline"
      className=""
      disabled={data.length === 0}
      onClick={exportToExcel}
    >
      AXIS
    </Button>
  )
}

export default BankWithdrawExportSheet
