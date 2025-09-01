import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface TimePickerProps {
  value?: string;
  onChange?: (time: string) => void;
}

export const TimePicker = ({ value = "12:00", onChange }: TimePickerProps) => {
  const [hours, setHours] = useState(12);
  const [minutes, setMinutes] = useState(0);
  
  const hoursRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);

  // Generate arrays for hours (0-23) and minutes (0-59)
  const hoursArray = Array.from({ length: 24 }, (_, i) => i);
  const minutesArray = Array.from({ length: 60 }, (_, i) => i);

  useEffect(() => {
    const [h, m] = value.split(':').map(Number);
    setHours(h);
    setMinutes(m);
  }, [value]);

  const scrollToItem = (container: HTMLDivElement | null, index: number) => {
    if (!container) return;
    const itemHeight = 60; // var(--wheel-item-height)
    const containerHeight = container.clientHeight;
    const scrollTop = index * itemHeight - containerHeight / 2 + itemHeight / 2;
    container.scrollTo({ top: scrollTop, behavior: 'smooth' });
  };

  const handleHourScroll = () => {
    if (!hoursRef.current) return;
    const container = hoursRef.current;
    const itemHeight = 60;
    const scrollTop = container.scrollTop;
    const newHour = Math.round((scrollTop + container.clientHeight / 2 - itemHeight / 2) / itemHeight);
    const clampedHour = Math.max(0, Math.min(23, newHour));
    
    if (clampedHour !== hours) {
      setHours(clampedHour);
      onChange?.(`${String(clampedHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
    }
  };

  const handleMinuteScroll = () => {
    if (!minutesRef.current) return;
    const container = minutesRef.current;
    const itemHeight = 60;
    const scrollTop = container.scrollTop;
    const newMinute = Math.round((scrollTop + container.clientHeight / 2 - itemHeight / 2) / itemHeight);
    const clampedMinute = Math.max(0, Math.min(59, newMinute));
    
    if (clampedMinute !== minutes) {
      setMinutes(clampedMinute);
      onChange?.(`${String(hours).padStart(2, '0')}:${String(clampedMinute).padStart(2, '0')}`);
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
    <div className="space-y-8">
      <Card className="p-8 shadow-luxe border-border/50 bg-card/50 backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold bg-gradient-luxe bg-clip-text text-transparent">
              Select Time
            </h2>
          </div>
          <div className="text-4xl font-mono font-bold text-primary shadow-glow">
            {formatTime(hours, minutes)}
          </div>
        </div>

        <div className="flex items-center justify-center gap-8">
          {/* Hours Wheel */}
          <div className="relative">
            <div className="text-center mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Hours
            </div>
            <div 
              ref={hoursRef}
              className="wheel-container h-[300px] w-24 overflow-y-auto scroll-smooth"
              onScroll={handleHourScroll}
              style={{ 
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              <div className="h-[120px]" />
              {hoursArray.map((hour) => (
                <div
                  key={hour}
                  className={`${getItemClasses(hour, hours)} flex items-center justify-center text-2xl font-mono font-bold cursor-pointer select-none`}
                  onClick={() => {
                    setHours(hour);
                    scrollToItem(hoursRef.current, hour);
                    onChange?.(formatTime(hour, minutes));
                  }}
                >
                  {String(hour).padStart(2, '0')}
                </div>
              ))}
              <div className="h-[120px]" />
            </div>
            <div className="absolute inset-x-0 top-1/2 h-[60px] -translate-y-1/2 border-y-2 border-primary/20 pointer-events-none" />
          </div>

          {/* Separator */}
          <div className="text-4xl font-mono font-bold text-primary animate-pulse">:</div>

          {/* Minutes Wheel */}
          <div className="relative">
            <div className="text-center mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Minutes
            </div>
            <div 
              ref={minutesRef}
              className="wheel-container h-[300px] w-24 overflow-y-auto scroll-smooth"
              onScroll={handleMinuteScroll}
              style={{ 
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              <div className="h-[120px]" />
              {minutesArray.map((minute) => (
                <div
                  key={minute}
                  className={`${getItemClasses(minute, minutes)} flex items-center justify-center text-2xl font-mono font-bold cursor-pointer select-none`}
                  onClick={() => {
                    setMinutes(minute);
                    scrollToItem(minutesRef.current, minute);
                    onChange?.(formatTime(hours, minute));
                  }}
                >
                  {String(minute).padStart(2, '0')}
                </div>
              ))}
              <div className="h-[120px]" />
            </div>
            <div className="absolute inset-x-0 top-1/2 h-[60px] -translate-y-1/2 border-y-2 border-primary/20 pointer-events-none" />
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => {
              const now = new Date();
              const currentHour = now.getHours();
              const currentMinute = now.getMinutes();
              setHours(currentHour);
              setMinutes(currentMinute);
              scrollToItem(hoursRef.current, currentHour);
              scrollToItem(minutesRef.current, currentMinute);
              onChange?.(formatTime(currentHour, currentMinute));
            }}
            className="border-primary/30 hover:bg-primary/10"
          >
            Now
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              setHours(12);
              setMinutes(0);
              scrollToItem(hoursRef.current, 12);
              scrollToItem(minutesRef.current, 0);
              onChange?.(formatTime(12, 0));
            }}
            className="border-primary/30 hover:bg-primary/10"
          >
            Reset
          </Button>
        </div>
      </Card>
    </div>
  );
};