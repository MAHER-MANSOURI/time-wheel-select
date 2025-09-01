import { useState, useEffect, useRef } from "react";

interface TimePickerProps {
  startTime: string;
  endTime: string;
  duration: number;
  onTimeSelect: (startTime: string, endTime: string, duration: number) => void;
}

export const TimePicker = ({ startTime, endTime, duration, onTimeSelect }: TimePickerProps) => {
  const [selectedTime, setSelectedTime] = useState(startTime);
  const [hours, setHours] = useState(12);
  const [minutes, setMinutes] = useState(0);
  
  const hoursRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);

  // Generate arrays for hours (0-23) and minutes (0-59)
  const hoursArray = Array.from({ length: 24 }, (_, i) => i);
  const minutesArray = Array.from({ length: 60 }, (_, i) => i);

  useEffect(() => {
    const [h, m] = selectedTime.split(':').map(Number);
    setHours(h);
    setMinutes(m);
  }, [selectedTime]);

  useEffect(() => {
    const [h, m] = startTime.split(':').map(Number);
    setHours(h);
    setMinutes(m);
    setSelectedTime(startTime);
  }, [startTime]);

  const scrollToItem = (container: HTMLDivElement | null, index: number) => {
    if (!container) return;
    const itemHeight = 50; // Height of each wheel item
    const containerHeight = container.clientHeight;
    const scrollTop = index * itemHeight - containerHeight / 2 + itemHeight / 2;
    container.scrollTo({ top: scrollTop, behavior: 'smooth' });
  };

  const handleHourScroll = () => {
    if (!hoursRef.current) return;
    const container = hoursRef.current;
    const itemHeight = 50;
    const scrollTop = container.scrollTop;
    const newHour = Math.round((scrollTop + container.clientHeight / 2 - itemHeight / 2) / itemHeight);
    const clampedHour = Math.max(0, Math.min(23, newHour));
    
    if (clampedHour !== hours) {
      setHours(clampedHour);
      const newTime = `${String(clampedHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      setSelectedTime(newTime);
      onTimeSelect(newTime, endTime, duration);
    }
  };

  const handleMinuteScroll = () => {
    if (!minutesRef.current) return;
    const container = minutesRef.current;
    const itemHeight = 50;
    const scrollTop = container.scrollTop;
    const newMinute = Math.round((scrollTop + container.clientHeight / 2 - itemHeight / 2) / itemHeight);
    const clampedMinute = Math.max(0, Math.min(59, newMinute));
    
    if (clampedMinute !== minutes) {
      setMinutes(clampedMinute);
      const newTime = `${String(hours).padStart(2, '0')}:${String(clampedMinute).padStart(2, '0')}`;
      setSelectedTime(newTime);
      onTimeSelect(newTime, endTime, duration);
    }
  };

  useEffect(() => {
    const timeoutHours = setTimeout(() => scrollToItem(hoursRef.current, hours), 100);
    const timeoutMinutes = setTimeout(() => scrollToItem(minutesRef.current, minutes), 100);
    
    return () => {
      clearTimeout(timeoutHours);
      clearTimeout(timeoutMinutes);
    };
  }, []);

  const getItemClasses = (currentValue: number, selectedValue: number) => {
    const distance = Math.abs(currentValue - selectedValue);
    if (distance === 0) return "wheel-item selected";
    if (distance === 1) return "wheel-item near-selected";
    return "wheel-item";
  };

  const formatTime = (h: number, m: number) => {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">Select Time</h2>
        <div className="text-2xl font-mono font-bold text-primary">
          {formatTime(hours, minutes)}
        </div>
      </div>

      <div className="flex items-center justify-center gap-6">
        {/* Hours Wheel */}
        <div className="relative">
          <div className="text-center mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Hours
          </div>
          <div 
            ref={hoursRef}
            className="wheel-container h-[200px] w-20 overflow-y-auto scroll-smooth"
            onScroll={handleHourScroll}
            style={{ 
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            <div className="h-[75px]" />
            {hoursArray.map((hour) => (
              <div
                key={hour}
                className={`${getItemClasses(hour, hours)} flex items-center justify-center text-lg font-mono font-bold cursor-pointer select-none`}
                style={{ height: '50px' }}
                onClick={() => {
                  setHours(hour);
                  scrollToItem(hoursRef.current, hour);
                  const newTime = formatTime(hour, minutes);
                  setSelectedTime(newTime);
                  onTimeSelect(newTime, endTime, duration);
                }}
              >
                {String(hour).padStart(2, '0')}
              </div>
            ))}
            <div className="h-[75px]" />
          </div>
          <div className="absolute inset-x-0 top-1/2 h-[50px] -translate-y-1/2 border-y border-primary/20 pointer-events-none" />
        </div>

        {/* Separator */}
        <div className="text-2xl font-mono font-bold text-primary">:</div>

        {/* Minutes Wheel */}
        <div className="relative">
          <div className="text-center mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Minutes
          </div>
          <div 
            ref={minutesRef}
            className="wheel-container h-[200px] w-20 overflow-y-auto scroll-smooth"
            onScroll={handleMinuteScroll}
            style={{ 
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            <div className="h-[75px]" />
            {minutesArray.map((minute) => (
              <div
                key={minute}
                className={`${getItemClasses(minute, minutes)} flex items-center justify-center text-lg font-mono font-bold cursor-pointer select-none`}
                style={{ height: '50px' }}
                onClick={() => {
                  setMinutes(minute);
                  scrollToItem(minutesRef.current, minute);
                  const newTime = formatTime(hours, minute);
                  setSelectedTime(newTime);
                  onTimeSelect(newTime, endTime, duration);
                }}
              >
                {String(minute).padStart(2, '0')}
              </div>
            ))}
            <div className="h-[75px]" />
          </div>
          <div className="absolute inset-x-0 top-1/2 h-[50px] -translate-y-1/2 border-y border-primary/20 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};