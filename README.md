# LLM RAM Requirement Calculator

This project is a React + TypeScript + Vite application that calculates the maximum number of parameters that can fit in RAM for different quantization levels of large language models (LLMs).

## Features

- Calculate maximum parameters based on available RAM, OS usage, context window size, and quantization level
- Interactive UI built with React and TypeScript
- Fast development with Vite and Hot Module Replacement (HMR)
- Styling with Tailwind CSS


## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/RayFernando1337/LLM-Calc.git
   cd LLM-Calc
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Start the development server:
   ```bash
   bun run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the port specified in the console output).

## Building for Production

To create a production build:

```bash
bun run build
```

The built files will be in the `dist` directory.

## Usage

Once the application is running, you can:

1. Enter your available RAM in GB
2. Estimate OS RAM usage in GB
3. Set the context window size (number of tokens)
4. Choose a quantization level (bits per parameter)

The app will calculate and display the maximum number of parameters your setup can handle in billions.

## Calculation Logic

The calculation logic remains the same as in the previous version:

1. Convert available RAM and OS overhead from GB to bytes
2. Calculate memory required for the context window
3. Calculate usable RAM by subtracting OS overhead and context window memory
4. Convert quantization level from bits to bytes per parameter
5. Calculate maximum number of parameters
6. Convert result to billions of parameters for display

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)

## Acknowledgements

This project was bootstrapped with Vite and uses React, TypeScript, and Tailwind CSS. It uses Bun as the JavaScript runtime and package manager.
