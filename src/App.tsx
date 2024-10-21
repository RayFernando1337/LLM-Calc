import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"

const quantizationOptions = {
  "1-bit": 1,
  "2-bit": 2,
  "3-bit": 3,
  "4-bit": 4,
  "5-bit": 5,
  "6-bit": 6,
  "8-bit": 8,
  "fp16": 16,
  "bfloat16": 16,
  "fp32": 32
}

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
  const [quantization, setQuantization] = useState("4-bit")

  const maxParameters = calculateMaxParameters(availableRam, quantizationOptions[quantization], osOverhead, contextWindow)

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>LLM RAM Calculator</CardTitle>
          <CardDescription>Calculate the maximum number of parameters for your LLM based on available RAM</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <label htmlFor="context-window" className="block text-sm font-medium text-gray-700">Context Window (Number of Tokens)</label>
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
              <div>
                <label htmlFor="quantization" className="block text-sm font-medium text-gray-700">Quantization Level</label>
                <Select value={quantization} onValueChange={setQuantization}>
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
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Results</h3>
              {maxParameters >= 0 ? (
                <p className="text-2xl font-bold text-green-600">
                  With <span className="text-blue-600">{quantization}</span> quantization and a context window of <span className="text-blue-600">{contextWindow}</span> tokens, you can run a model with up to <span className="text-blue-600">{maxParameters.toFixed(2)} billion parameters</span>.
                </p>
              ) : (
                <p className="text-2xl font-bold text-red-600">
                  The selected context window size of <span className="text-blue-600">{contextWindow}</span> tokens is too large for the available RAM. Please reduce the context window size or increase the available RAM.
                </p>
              )}
              <div className="mt-4">
                <h4 className="text-md font-semibold">Quantization Levels Explanation</h4>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li><strong>1-bit to 6-bit:</strong> Extremely low precision, major impact on accuracy. Best for specific applications where memory and speed are critical.</li>
                  <li><strong>8-bit:</strong> Standard in many LLM deployments. Good balance of size, speed, and accuracy.</li>
                  <li><strong>fp16, bfloat16:</strong> Half-precision formats offering significant reduction in size with less impact on accuracy than integer quantization. Widely supported on modern GPUs.</li>
                  <li><strong>fp32:</strong> Full precision used during model training, rarely used in deployment due to high computational costs.</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}