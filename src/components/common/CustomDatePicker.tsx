import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';

interface CustomDatePickerProps {
  value: string; // 'YYYY-MM-DD' format
  onChange: (value: string) => void;
  label?: string;
  icon?: React.ReactNode;
  placeholder?: string;
  required?: boolean;
  minYear?: number;
  maxYear?: number;
  align?: 'left' | 'right' | 'auto';
  className?: string;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  label = 'Date of Birth',
  icon,
  placeholder = 'Select Date of Birth',
  required = false,
  minYear = 1990,
  maxYear = 2012,
  align = 'right',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial date or default to year 2003 (typical college student)
  const initialDate = value ? new Date(value) : new Date(2003, 0, 15);
  const [viewYear, setViewYear] = useState<number>(
    isNaN(initialDate.getFullYear()) ? 2003 : initialDate.getFullYear()
  );
  const [viewMonth, setViewMonth] = useState<number>(
    isNaN(initialDate.getMonth()) ? 0 : initialDate.getMonth()
  );

  // Sync view when value changes from outside
  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    }
  }, [value]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format display string (e.g. 14 May 2003)
  const formatDisplay = (val: string) => {
    if (!val) return '';
    try {
      const parts = val.split('-');
      if (parts.length === 3) {
        const year = parts[0];
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        return `${day.toString().padStart(2, '0')} ${MONTH_NAMES[month]?.slice(0, 3)} ${year}`;
      }
      return val;
    } catch {
      return val;
    }
  };

  // Generate days in current month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => Math.max(minYear, prev - 1));
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => Math.min(maxYear, prev + 1));
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const monthStr = (viewMonth + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    const formatted = `${viewYear}-${monthStr}-${dayStr}`;
    onChange(formatted);
    setIsOpen(false);
  };

  // Generate Year options
  const years: number[] = [];
  for (let y = maxYear; y >= minYear; y--) {
    years.push(y);
  }

  // Selected date parts
  const isSelectedDay = (day: number) => {
    if (!value) return false;
    const parts = value.split('-');
    return (
      parts.length === 3 &&
      parseInt(parts[0], 10) === viewYear &&
      parseInt(parts[1], 10) - 1 === viewMonth &&
      parseInt(parts[2], 10) === day
    );
  };

  return (
    <div className={`relative w-full space-y-1 ${className}`} ref={containerRef}>
      {label && (
        <label className="text-xs font-bold text-[#002b66] flex items-center gap-1.5">
          {icon || <CalendarIcon className="w-3.5 h-3.5 text-[#0077c8]" />}
          <span>{label}</span>
          {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      {/* Trigger Box */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-left text-sm flex items-center justify-between transition-all duration-200 cursor-pointer ${
          isOpen
            ? 'border-[#0077c8] ring-2 ring-[#0077c8]/20 shadow-md'
            : 'border-[#d4e8f5] hover:border-[#0077c8]/60 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          <CalendarIcon className="w-4 h-4 text-[#0077c8] shrink-0" />
          <span className={`font-medium ${value ? 'text-[#002b66]' : 'text-slate-400'}`}>
            {value ? formatDisplay(value) : placeholder}
          </span>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-[#0077c8] transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Modern Popover Calendar with Right-Anchoring to Never Overflow */}
      {isOpen && (
        <div
          className={`absolute z-50 mt-1.5 w-[285px] sm:w-[295px] max-w-[calc(100vw-24px)] bg-white rounded-2xl border border-[#d4e8f5] shadow-2xl p-3.5 space-y-3 animate-in fade-in zoom-in-95 duration-150 ${
            align === 'right' ? 'right-0' : align === 'left' ? 'left-0' : 'left-0 sm:left-auto sm:right-0'
          }`}
        >
          {/* Header Controls (Month & Year Selectors) */}
          <div className="flex items-center justify-between pb-2 border-b border-[#e8f5fb]">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="w-7 h-7 rounded-lg bg-[#f0f8fc] hover:bg-[#e8f5fb] text-[#0077c8] flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5">
              <select
                value={viewMonth}
                onChange={(e) => setViewMonth(parseInt(e.target.value, 10))}
                className="bg-[#f0f8fc] text-[#002b66] text-xs font-bold py-1 px-2 rounded-lg border border-[#d4e8f5] focus:outline-none focus:border-[#0077c8] cursor-pointer"
              >
                {MONTH_NAMES.map((m, idx) => (
                  <option key={m} value={idx}>
                    {m}
                  </option>
                ))}
              </select>

              <select
                value={viewYear}
                onChange={(e) => setViewYear(parseInt(e.target.value, 10))}
                className="bg-[#f0f8fc] text-[#002b66] text-xs font-bold py-1 px-2 rounded-lg border border-[#d4e8f5] focus:outline-none focus:border-[#0077c8] cursor-pointer"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="w-7 h-7 rounded-lg bg-[#f0f8fc] hover:bg-[#e8f5fb] text-[#0077c8] flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Days of Week Row */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {DAYS_OF_WEEK.map((d) => (
              <span key={d} className="text-[10px] font-bold text-slate-400">
                {d}
              </span>
            ))}
          </div>

          {/* Calendar Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Empty slots for month offset */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="w-7 h-7" />
            ))}

            {/* Days in Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isSelected = isSelectedDay(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`w-7 h-7 mx-auto rounded-lg text-xs font-medium flex items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0077c8] text-white font-bold shadow-md'
                      : 'text-slate-700 hover:bg-[#e8f5fb] hover:text-[#002b66]'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Quick Year Shortcuts (Clean wrap with no overflow) */}
          <div className="pt-2 border-t border-[#e8f5fb] flex items-center justify-between text-[11px] gap-1">
            <span className="text-slate-400 font-medium shrink-0 text-[10px]">Quick:</span>
            <div className="flex flex-wrap gap-1 justify-end">
              {[2001, 2002, 2003, 2004, 2005].map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setViewYear(y)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    viewYear === y
                      ? 'bg-[#0077c8] text-white shadow-xs'
                      : 'bg-[#f0f8fc] text-slate-600 hover:bg-[#e8f5fb]'
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
