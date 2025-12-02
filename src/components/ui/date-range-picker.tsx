"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { format, startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear, subDays, subMonths } from "date-fns"
import { th } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps {
  date?: DateRange
  onDateChange?: (date: DateRange | undefined) => void
  className?: string
}

export function DateRangePicker({
  date,
  onDateChange,
  className,
}: DateRangePickerProps) {
  const [selectedRange, setSelectedRange] = React.useState<DateRange | undefined>(date)
  const [isOpen, setIsOpen] = React.useState(false)
  const [tempRange, setTempRange] = React.useState<DateRange | undefined>(date)

  // Update internal state when prop changes
  React.useEffect(() => {
    if (date) {
      setSelectedRange(date)
      setTempRange(date)
    }
  }, [date])

  const handleSelect = (range: DateRange | undefined) => {
    setTempRange(range)
  }

  const handleConfirm = () => {
    setSelectedRange(tempRange)
    onDateChange?.(tempRange)
    setIsOpen(false)
  }

  const setQuickRange = (range: DateRange) => {
    setSelectedRange(range)
    onDateChange?.(range)
    setTempRange(range)
    setIsOpen(false)
  }

  const today = new Date()

  const quickRanges = [
    {
      label: "วันนี้",
      range: {
        from: startOfDay(today),
        to: endOfDay(today),
      },
    },
    {
      label: "เมื่อวาน",
      range: {
        from: startOfDay(subDays(today, 1)),
        to: endOfDay(subDays(today, 1)),
      },
    },
    {
      label: "เดือนนี้",
      range: {
        from: startOfMonth(today),
        to: endOfMonth(today),
      },
    },
    {
      label: "เดือนที่แล้ว",
      range: {
        from: startOfMonth(subMonths(today, 1)),
        to: endOfMonth(subMonths(today, 1)),
      },
    },
    {
      label: "ปีนี้",
      range: {
        from: startOfYear(today),
        to: endOfYear(today),
      },
    },
  ]

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left text-sm font-normal bg-white/10 dark:bg-white/5 backdrop-blur-xl border-white/20 hover:bg-white/20 dark:hover:bg-white/10 h-9",
              !selectedRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedRange?.from ? (
              selectedRange.to ? (
                <>
                  {format(selectedRange.from, "dd MMM yy", { locale: th })} -{" "}
                  {format(selectedRange.to, "dd MMM yy", { locale: th })}
                </>
              ) : (
                format(selectedRange.from, "dd MMM yy", { locale: th })
              )
            ) : (
              <span>เลือกช่วงวันที่</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0 bg-white dark:bg-gray-950 border shadow-lg" 
          align="start"
          sideOffset={8}
        >
          <div className="flex">
            {/* Quick Select Menu */}
            {/* w-[85px] = ความกว้างเมนูตัวเลือกด่วน */}
            <div className="border-r border-gray-200 dark:border-gray-800 p-2 space-y-0.5 w-[150px]">
              <div className="text-xs font-semibold mb-1.5 text-gray-700 dark:text-gray-300">ตัวเลือกด่วน</div>
              {quickRanges.map((quick) => (
                <Button
                  key={quick.label}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-left text-sm font-normal h-7 px-2"
                  onClick={() => setQuickRange(quick.range)}
                >
                  {quick.label}
                </Button>
              ))}
            </div>
            
            {/* Calendar */}
            <div className="flex flex-col">
              <div>
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={tempRange?.from || selectedRange?.from}
                  selected={tempRange}
                  onSelect={handleSelect}
                  numberOfMonths={2}
                  locale={th}
                />
              </div>
              
              {/* Confirm Button */}
              <div className="border-t border-gray-200 dark:border-gray-800 p-3 flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={() => {
                    setTempRange(selectedRange)
                    setIsOpen(false)
                  }}
                >
                  ยกเลิก
                </Button>
                <Button
                  size="sm"
                  className="h-8"
                  onClick={handleConfirm}
                  disabled={!tempRange?.from}
                >
                  ตกลง
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
