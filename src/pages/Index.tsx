import { useState } from "react";
import { TimePicker } from "@/components/TimePicker";
import { Card } from "@/components/ui/card";
import { Clock, Sparkles } from "lucide-react";

const Index = () => {
  const [selectedTime, setSelectedTime] = useState("12:00");

  return (
    <div className="min-h-screen p-4 bg-gradient-dark">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-luxe bg-clip-text text-transparent">
              Chrono Luxe Pick
            </h1>
            <Clock className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience premium time selection with our elegant 24-hour scrollable wheel interface
          </p>
        </div>

        {/* Time Picker */}
        <div className="mb-8">
          <TimePicker value={selectedTime} onChange={setSelectedTime} />
        </div>

        {/* Selected Time Display */}
        <Card className="p-6 text-center shadow-luxe border-border/50 bg-card/30 backdrop-blur-xl">
          <h3 className="text-lg font-semibold mb-2 text-muted-foreground">Selected Time</h3>
          <div className="text-6xl font-mono font-bold text-primary shadow-glow">
            {selectedTime}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            24-hour format • Scroll or tap to select
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Index;
