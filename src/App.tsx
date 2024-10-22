import * as React from "react";
import { ChevronDown, Settings, Github, Twitter, Youtube, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import HyperText from "./components/ui/hyper-text";
import confetti from "canvas-confetti";

const quantizationOptions = {
  "1-bit": 1,
  "2-bit": 2,
  "3-bit": 3,
  "4-bit": 4,
  "5-bit": 5,
  "6-bit": 6,
  "8-bit": 8,
  fp16: 16,
  fp32: 32,
} as const;

type QuantizationOption = keyof typeof quantizationOptions;

const ramOptions = [8, 16, 32, 64, 128, 256];

function calculateMaxParameters(
  availableRamGb: number,
  bitsPerParameter: number,
  osOverheadGb: number,
  contextWindow: number
) {
  const bytesPerParameter = bitsPerParameter / 8;
  const totalRamBytes = availableRamGb * 1e9;
  const contextMemoryBytes = contextWindow * 0.5 * 1e6;
  const usableRamBytes = totalRamBytes - osOverheadGb * 1e9 - contextMemoryBytes;
  const maxParameters = usableRamBytes / bytesPerParameter;
  return maxParameters / 1e9;
}

function handleClick() {
  const defaults = {
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    colors: ["#FFE400", "#FFBD00", "#E89400", "#FFCA6C", "#FDFFB8"],
  };

  const shoot = () => {
    confetti({
      ...defaults,
      particleCount: 40,
      scalar: 1.2,
      shapes: ["star"],
    });

    confetti({
      ...defaults,
      particleCount: 10,
      scalar: 0.75,
      shapes: ["circle"],
    });
  };

  setTimeout(shoot, 0);
  setTimeout(shoot, 100);
  setTimeout(shoot, 200);
}

export default function LlmRamCalculator() {
  const [availableRam, setAvailableRam] = React.useState(16);
  const [customRam, setCustomRam] = React.useState(16);
  const [useCustomRam, setUseCustomRam] = React.useState(false);
  const [osOverhead, setOsOverhead] = React.useState(2);
  const [contextWindow, setContextWindow] = React.useState(2048);
  const [quantization, setQuantization] = React.useState<QuantizationOption>("4-bit");

  const effectiveRam = useCustomRam ? customRam : availableRam;
  const maxParameters = calculateMaxParameters(
    effectiveRam,
    quantizationOptions[quantization],
    osOverhead,
    contextWindow
  );

  const handleRamChange = (value: number[]) => {
    setAvailableRam(ramOptions[value[0]]);
    setUseCustomRam(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 bg-background z-10 shadow-md">
        <div className="container mx-auto py-4 flex justify-center">
          <HyperText className="text-3xl font-bold text-center block" text="LLM RAM Calculator" />
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-2">
            <p className="text-5xl font-bold tabular-nums text-green-600">
              {maxParameters.toFixed(2)}
            </p>
            <p className="text-2xl">billion parameters</p>
          </div>
          <div className="text-center space-y-2">
            <p className="text-4xl font-bold tabular-nums">{effectiveRam}</p>
            <p className="text-xl">GB RAM</p>
          </div>
          <div className="text-center space-y-2">
            <p className="text-4xl font-bold">{quantization}</p>
            <p className="text-xl">Quantization</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ram-slider" className="text-lg font-semibold">
                Available RAM (GB)
              </Label>
              <div className="px-2">
                <Slider
                  id="ram-slider"
                  min={0}
                  max={ramOptions.length - 1}
                  step={1}
                  value={[ramOptions.indexOf(availableRam)]}
                  onValueChange={handleRamChange}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground px-2">
                {ramOptions.map((value) => (
                  <span key={value} className="w-8 text-center">
                    {value}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="quantization" className="text-lg font-semibold">
                Quantization Level
              </Label>
              <Select
                value={quantization}
                onValueChange={(value) => setQuantization(value as QuantizationOption)}
              >
                <SelectTrigger id="quantization" className="w-full text-xl">
                  <SelectValue placeholder="Select quantization" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(quantizationOptions).map((option) => (
                    <SelectItem key={option} value={option} className="text-lg">
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full text-lg">
                  <Settings className="mr-2 h-5 w-5" />
                  Advanced Settings
                  <ChevronDown className="ml-auto h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="custom-ram" className="font-semibold">
                      Custom RAM (GB)
                    </Label>
                    <Input
                      id="custom-ram"
                      type="number"
                      value={customRam}
                      onChange={(e) => {
                        setCustomRam(Number(e.target.value));
                        setUseCustomRam(true);
                      }}
                      min={1}
                      step={1}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="os-overhead" className="font-semibold">
                      OS Overhead (GB)
                    </Label>
                    <Slider
                      id="os-overhead"
                      min={1}
                      max={8}
                      step={0.5}
                      value={[osOverhead]}
                      onValueChange={(value) => setOsOverhead(value[0])}
                    />
                    <p className="text-sm text-right">{osOverhead} GB</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="context-window" className="font-semibold">
                      Context Window (Tokens)
                    </Label>
                    <Input
                      id="context-window"
                      type="number"
                      value={contextWindow}
                      onChange={(e) => setContextWindow(Number(e.target.value))}
                      min={1}
                      step={1}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </main>

      <footer className="sticky bottom-0 bg-background shadow-md mt-8">
        <div className="container mx-auto py-4">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              {/* Empty div to balance the layout */}
            </div>
            <div className="flex justify-center space-x-6 flex-1">
              <a
                href="https://x.com/RayFernando1337"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-foreground transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="https://youtube.com/@RayFernando1337"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-foreground transition-colors"
              >
                <span className="sr-only">YouTube</span>
                <Youtube className="h-6 w-6" />
              </a>
            </div>
            <div className="flex-1 flex justify-end">
              <a
                href="https://github.com/RayFernando1337/LLM-Calc"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  handleClick();
                  setTimeout(() => {
                    window.open("https://github.com/RayFernando1337/LLM-Calc", "_blank", "noopener,noreferrer");
                  }, 500); // 500 milliseconds = 0.5 seconds
                }}
              >
                <Button className="flex items-center space-x-2">
                  <Star className="h-5 w-5" />
                  <span>Star Me</span>
                </Button>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
