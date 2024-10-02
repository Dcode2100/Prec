"use client"

import * as React from "react"
import { CalendarIcon, ClockIcon } from "@radix-ui/react-icons"
import { format, parse } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  showTime?: boolean
}

export function DatePicker({ date, setDate, placeholder = "Pick a date", className, showTime = false }: DatePickerProps) {
  const [selectedTime, setSelectedTime] = React.useState<string | undefined>(
    date ? format(date, "hh:mm a") : undefined
  )

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      const hours = selectedTime ? parseInt(selectedTime.split(':')[0]) : 0
      const minutes = selectedTime ? parseInt(selectedTime.split(':')[1].split(' ')[0]) : 0
      const ampm = selectedTime ? selectedTime.split(' ')[1] : 'AM'
      
      newDate.setHours(ampm === 'PM' ? (hours % 12) + 12 : hours % 12)
      newDate.setMinutes(minutes)
    }
    setDate(newDate)
  }

  const handleTimeChange = (newTime: string) => {
    setSelectedTime(newTime)
    if (date) {
      const [hours, minutesAndAmPm] = newTime.split(':')
      const [minutes, ampm] = minutesAndAmPm.split(' ')
      const newDate = new Date(date)
      newDate.setHours(ampm === 'PM' ? (parseInt(hours) % 12) + 12 : parseInt(hours) % 12)
      newDate.setMinutes(parseInt(minutes))
      setDate(newDate)
    }
  }

  const handleNowClick = () => {
    const now = new Date()
    setDate(now)
    setSelectedTime(format(now, "hh:mm a"))
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, showTime ? "dd/MM/yyyy hh:mm a" : "dd/MM/yyyy") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
        />
        {showTime && (
          <div className="p-3 border-t">
            <Select value={selectedTime} onValueChange={handleTimeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 * 4 }).map((_, index) => {
                  const hours = Math.floor(index / 4)
                  const minutes = (index % 4) * 15
                  const time = `${hours === 0 ? 12 : hours > 12 ? hours - 12 : hours}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`
                  return <SelectItem key={index} value={time}>{time}</SelectItem>
                })}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="p-3 border-t">
          <Button onClick={handleNowClick} className="w-full">
            Use Current Date & Time
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
