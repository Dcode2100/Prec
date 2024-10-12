'use client'
import React, { useState, useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { getAssetsForPC, getTokens } from '@/lib/api/ordersApi'
import { AssetsForPC, TokenResponse } from '@/lib/types/types'

interface FilterTokenProps {
  tab: 'PE' | 'PC'
  open: boolean
  onOpenChange: (value: boolean) => void
  header: string
  onTokenSelect: (token: string | null) => void
  disabled?: boolean
}

const FilterToken = ({
  tab,
  open,
  onOpenChange,
  header,
  onTokenSelect,
  disabled,
}: FilterTokenProps) => {
  const [selected, setSelected] = useState('All')

  const { data: tokens } = useQuery({
    queryKey: ['tokens', tab],
    queryFn: async () => {
      return tab === 'PE'
        ? (getTokens() as Promise<TokenResponse[]>)
        : getAssetsForPC().then((response) => response.assets as AssetsForPC[])
    },
    enabled: open,
  })

  const applyFilter = useCallback(() => {
    onTokenSelect(selected === 'All' ? null : selected)
    onOpenChange(false)
  }, [selected, onTokenSelect, onOpenChange])

  const renderTokenItems = useMemo(() => {
    return tokens?.map((token) => (
      <SelectItem
        key={tab === 'PE' ? token.asset_id : token.id}
        value={tab === 'PE' ? token.token : token.id}
      >
        {tab === 'PE' ? token.symbol : token.name}
      </SelectItem>
    ))
  }, [tokens, tab])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>{header}</Label>
          </div>
          <Select
            disabled={disabled}
            value={selected}
            onValueChange={setSelected}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {renderTokenItems}
            </SelectContent>
          </Select>
          <Button onClick={applyFilter} className="w-full">
            Apply Filter
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default FilterToken
