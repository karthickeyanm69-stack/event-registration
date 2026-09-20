import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
} from 'lucide-react';

export interface CustomDatePickerProps {
  value: string; // 'YYYY-MM-DD' format
  onChange: (value: string) => void;
  id?: string;
  name?: string;
  label?: string;
  icon?: React.ReactNode;
  placeholder?: string;
  required?: boolean;
  minYear?: number;
  maxYear?: number;
  align?: 'left' | 'right' | 'auto';
  className?: string;
  variant?: 'light' | 'dark';
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
  id,
  name,
  label = 'Date of Birth',
  icon,
  placeholder = 'Select Date of Birth',
  required = false,
  minYear = 1990,
  maxYear = 2012,
  align = 'right',
  className = '',
  variant = 'light',
}) => {
  const isDark = variant === 'dark';
  const autoId = React.useId ? React.useId().replace(/:/g, '') : 'dob';
  const pickerId = id || `datepicker-${autoId}`;
  const pickerName = name || 'dateOfBirth';
  const [isOpen, setIsOpen] = useState(false);
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

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

  // Calculate unclipped floating position on viewport
  const updatePosition = () => {
    if (typeof window === 'undefined') return;
    const isSmall = window.innerWidth < 640;
    setIsMobile(isSmall);

    if (!isSmall && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const popoverWidth = 310;
      const popoverHeight = 360;

      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      let top = rect.bottom + 6;
      // If bottom space is tight and more room above, flip upward
      if (spaceBelow < popoverHeight && spaceAbove > spaceBelow) {
        top = rect.top - popoverHeight - 6;
      }
      // Clamp strictly within visible viewport so it's NEVER cut off
      top = Math.max(12, Math.min(window.innerHeight - popoverHeight - 12, top));

      let left = rect.left;
      if (align === 'right') {
        left = rect.right - popoverWidth;
      } else if (align === 'auto') {
        left = rect.left + (rect.width - popoverWidth) / 2;
      }
      // Clamp horizontally within screen
      left = Math.max(12, Math.min(window.innerWidth - popoverWidth - 12, left));

      setPopoverPos({ top, left });
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      updatePosition();
    }
    setIsOpen((prev) => !prev);
  };

  // Re-calculate position on scroll / window resize while open
  useEffect(() => {
    if (!isOpen) return;
    const handleScrollOrResize = () => {
      updatePosition();
    };
    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);
    return () => {
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, [isOpen]);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        popoverRef.current &&
        !popoverRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

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

  // The inner calendar contents (Month/Year controls, days grid, shortcuts)
  const calendarInnerContent = (
    <div className="space-y-3.5">
      {/* Header Controls (Month & Year Selectors + Close Button) */}
      <div className={`flex items-center justify-between pb-2.5 border-b ${
        isDark ? 'border-[#F5B942]/20' : 'border-[#e8f5fb]'
      }`}>
        <button
          type="button"
          onClick={handlePrevMonth}
          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
            isDark 
              ? 'bg-[#020B1C] hover:bg-[#09254c] text-[#F5B942] border border-[#F5B942]/30 active:scale-95' 
              : 'bg-[#f0f8fc] hover:bg-[#e8f5fb] text-[#0077c8] active:scale-95'
          }`}
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5">
          <select
            id={`${pickerId}-month-select`}
            name={`${pickerName}Month`}
            aria-label="Select month"
            value={viewMonth}
            onChange={(e) => setViewMonth(parseInt(e.target.value, 10))}
            className={`text-xs font-bold py-1.5 px-2.5 rounded-xl border focus:outline-none cursor-pointer ${
              isDark
                ? 'bg-[#020B1C] text-[#FFF2D5] border-[#F5B942]/30 focus:border-[#F5B942]'
                : 'bg-[#f0f8fc] text-[#002b66] border-[#d4e8f5] focus:border-[#0077c8]'
            }`}
          >
            {MONTH_NAMES.map((m, idx) => (
              <option key={m} value={idx}>
                {m}
              </option>
            ))}
          </select>

          <select
            id={`${pickerId}-year-select`}
            name={`${pickerName}Year`}
            aria-label="Select year"
            value={viewYear}
            onChange={(e) => setViewYear(parseInt(e.target.value, 10))}
            className={`text-xs font-bold py-1.5 px-2.5 rounded-xl border focus:outline-none cursor-pointer ${
              isDark
                ? 'bg-[#020B1C] text-[#FFF2D5] border-[#F5B942]/30 focus:border-[#F5B942]'
                : 'bg-[#f0f8fc] text-[#002b66] border-[#d4e8f5] focus:border-[#0077c8]'
            }`}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleNextMonth}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              isDark 
                ? 'bg-[#020B1C] hover:bg-[#09254c] text-[#F5B942] border border-[#F5B942]/30 active:scale-95' 
                : 'bg-[#f0f8fc] hover:bg-[#e8f5fb] text-[#0077c8] active:scale-95'
            }`}
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {isMobile && (
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className={`w-8 h-8 ml-1 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                isDark
                  ? 'bg-[#020B1C] text-[#FFF2D5]/70 hover:text-[#F5B942] border border-[#F5B942]/30'
                  : 'bg-slate-100 text-slate-500 hover:text-slate-800'
              }`}
              aria-label="Close calendar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Days of Week Row */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {DAYS_OF_WEEK.map((d) => (
          <span key={d} className={`text-[10px] font-bold ${
            isDark ? 'text-[#FFF2D5]/50 font-mono' : 'text-slate-400'
          }`}>
            {d}
          </span>
        ))}
      </div>

      {/* Calendar Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {/* Empty slots for month offset */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="w-8 h-8" />
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
              className={`w-8 h-8 mx-auto rounded-xl text-xs font-semibold flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
                isSelected
                  ? (isDark ? 'bg-[#F5B942] text-[#020B1C] font-bold shadow-md shadow-[#F5B942]/30' : 'bg-[#0077c8] text-white font-bold shadow-md')
                  : (isDark ? 'text-[#FFF2D5] hover:bg-[#020B1C] hover:text-[#F5B942]' : 'text-slate-700 hover:bg-[#e8f5fb] hover:text-[#002b66]')
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Quick Year Shortcuts (Clean wrap with no overflow) */}
      <div className={`pt-2.5 border-t flex items-center justify-between text-[11px] gap-1.5 ${
        isDark ? 'border-[#F5B942]/20' : 'border-[#e8f5fb]'
      }`}>
        <span className={`font-medium shrink-0 text-[10px] ${
          isDark ? 'text-[#FFF2D5]/60' : 'text-slate-400'
        }`}>Quick:</span>
        <div className="flex flex-wrap gap-1 justify-end">
          {[2001, 2002, 2003, 2004, 2005].map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => setViewYear(y)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer active:scale-95 ${
                viewYear === y
                  ? (isDark ? 'bg-[#F5B942] text-[#020B1C] shadow-xs' : 'bg-[#0077c8] text-white shadow-xs')
                  : (isDark ? 'bg-[#020B1C] text-[#FFF2D5]/80 border border-[#F5B942]/20 hover:border-[#F5B942]' : 'bg-[#f0f8fc] text-slate-600 hover:bg-[#e8f5fb]')
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`relative w-full space-y-1.5 ${className}`} ref={containerRef}>
      {label && (
        <div className={`text-[11px] font-bold flex items-center gap-1.5 ${
          isDark ? 'text-[#FFF2D5]/80 font-mono uppercase tracking-wider' : 'text-[#002b66]'
        }`}>
          {icon || (
            <CalendarIcon className={`w-3.5 h-3.5 ${isDark ? 'text-[#F5B942]' : 'text-[#0077c8]'}`} />
          )}
          <span>{label}</span>
          {required && <span className={isDark ? 'text-[#F5B942]' : 'text-rose-500'}>*</span>}
        </div>
      )}

      {/* Hidden input for form submission & browser autofill compliance */}
      <input
        type="hidden"
        id={pickerId}
        name={pickerName}
        value={value}
        readOnly
      />

      {/* Trigger Box */}
      <button
        ref={triggerRef}
        id={`${pickerId}-trigger`}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={handleToggle}
        className={`w-full px-3.5 py-2.5 rounded-xl border text-left text-xs sm:text-sm flex items-center justify-between transition-all duration-200 cursor-pointer ${
          isDark
            ? `bg-[#020B1C] text-[#FFF2D5] font-mono ${
                isOpen
                  ? 'border-[#F5B942] ring-2 ring-[#F5B942]/25 shadow-md'
                  : 'border-[#F5B942]/30 hover:border-[#F5B942]/70 shadow-xs'
              }`
            : `bg-white text-[#002b66] ${
                isOpen
                  ? 'border-[#0077c8] ring-2 ring-[#0077c8]/20 shadow-md'
                  : 'border-[#d4e8f5] hover:border-[#0077c8]/60 shadow-sm'
              }`
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          <CalendarIcon className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#F5B942]' : 'text-[#0077c8]'}`} />
          <span className={`font-medium ${
            value 
              ? (isDark ? 'text-[#FFF2D5] font-bold' : 'text-[#002b66]') 
              : (isDark ? 'text-[#FFF2D5]/40' : 'text-slate-400')
          }`}>
            {value ? formatDisplay(value) : placeholder}
          </span>
        </div>

        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 shrink-0 ${
            isDark ? 'text-[#F5B942]' : 'text-[#0077c8]'
          } ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Global Viewport Portal: Mounts directly to document.body so it NEVER gets clipped by overflow-hidden */}
      {isOpen && typeof document !== 'undefined' && createPortal(
        isMobile ? (
          // Mobile Viewport: Centered Modal Dialog with backdrop
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <div
              ref={popoverRef}
              className={`w-[320px] max-w-[calc(100vw-24px)] rounded-3xl border p-4 space-y-3.5 shadow-2xl ${
                isDark
                  ? 'bg-[#061A35] border-[#F5B942]/40 shadow-[0_20px_60px_rgba(2,11,28,0.95)] text-[#FFF2D5]'
                  : 'bg-white border-[#d4e8f5] shadow-[0_20px_50px_rgba(0,43,102,0.25)] text-slate-800'
              }`}
            >
              {calendarInnerContent}
            </div>
          </div>
        ) : (
          // Desktop Viewport: Floating Anchor Dialog with Clamped Screen Bounds
          <div
            ref={popoverRef}
            style={{
              position: 'fixed',
              top: popoverPos ? `${popoverPos.top}px` : '20%',
              left: popoverPos ? `${popoverPos.left}px` : '50%',
            }}
            className={`z-[99999] w-[310px] rounded-2xl border p-3.5 space-y-3 shadow-2xl ${
              isDark
                ? 'bg-[#061A35] border-[#F5B942]/40 shadow-[0_25px_60px_rgba(2,11,28,0.95),0_0_20px_rgba(245,185,66,0.15)] text-[#FFF2D5]'
                : 'bg-white border-[#d4e8f5] shadow-[0_20px_45px_rgba(0,43,102,0.22)] text-slate-800'
            }`}
          >
            {calendarInnerContent}
          </div>
        ),
        document.body
      )}
    </div>
  );
};

export default CustomDatePicker;
