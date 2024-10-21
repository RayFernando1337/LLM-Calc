import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const quantizationOptions = {
  "1-bit": 1,
  "2-bit": 2,
  "3-bit": 3,
  "4-bit": 4,
  "5-bit": 5,
  "6-bit": 6,
  "8-bit": 8,
  "fp16": 16,
  "fp32": 32
} as const

type QuantizationOption = keyof typeof quantizationOptions

function calculateMaxParameters(availableRamGb: number, bitsPerParameter: number, osOverheadGb: number, contextWindow: number) {
  const bytesPerParameter = bitsPerParameter / 8
  const totalRamBytes = availableRamGb * 1e9
  const contextMemoryBytes = contextWindow * 0.5 * 1e6
  const usableRamBytes = totalRamBytes - (osOverheadGb * 1e9) - contextMemoryBytes
  const maxParameters = usableRamBytes / bytesPerParameter
  return maxParameters / 1e9
}

export default function Component() {
  const [availableRam, setAvailableRam] = useState(16)
  const [osOverhead, setOsOverhead] = useState(2)
  const [contextWindow, setContextWindow] = useState(2048)
  const [quantization, setQuantization] = useState<QuantizationOption>("4-bit")

  const maxParameters = calculateMaxParameters(availableRam, quantizationOptions[quantization], osOverhead, contextWindow)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">LLM RAM Calculator</h1>
      <p className="mb-4">Available RAM: {availableRam} GB</p>
      <p className="mb-4">You can update the available RAM, estimated OS RAM usage, and context window in the settings.</p>
      
      <div className="mb-4">
        <label htmlFor="quantization" className="block text-sm font-medium text-gray-700 mb-2">Select a quantization level:</label>
        <Select value={quantization} onValueChange={(value) => setQuantization(value as QuantizationOption)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select quantization level" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(quantizationOptions).map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {maxParameters >= 0 ? (
        <p className="text-2xl font-bold">
          With <span className="text-blue-600">{quantization}</span> quantization and a context window of <span className="text-blue-600">{contextWindow}</span> tokens, you can run a model with up to <span className="text-green-600">{maxParameters.toFixed(2)} billion parameters</span>.
        </p>
      ) : (
        <p className="text-2xl font-bold text-red-600">
          The selected context window size is too large for the available RAM. Please adjust your settings.
        </p>
      )}

      <Popover>
        <PopoverTrigger asChild>
          <Button className="mt-4">Advanced Settings</Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Adjust parameters for more precise calculations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="ram" className="block text-sm font-medium text-gray-700">Available RAM (GB)</label>
                  <Input
                    id="ram"
                    type="number"
                    value={availableRam}
                    onChange={(e) => setAvailableRam(Number(e.target.value))}
                    min={1}
                    step={8}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="os-overhead" className="block text-sm font-medium text-gray-700">Estimated OS RAM Usage (GB)</label>
                  <Slider
                    id="os-overhead"
                    value={[osOverhead]}
                    onValueChange={(value) => setOsOverhead(value[0])}
                    min={1}
                    max={8}
                    step={0.5}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-500">{osOverhead} GB</span>
                </div>
                <div>
                  <label htmlFor="context-window" className="block text-sm font-medium text-gray-700">Context Window (Tokens)</label>
                  <Input
                    id="context-window"
                    type="number"
                    value={contextWindow}
                    onChange={(e) => setContextWindow(Number(e.target.value))}
                    min={1}
                    step={1}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  )
}
