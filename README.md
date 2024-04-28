# LLM RAM Requirement Calculator

This project is a Streamlit app that calculates the maximum number of parameters that can fit in RAM for different quantization levels of large language models (LLMs).

## Requirements

- Python >= 3.10.0, < 3.11
- Streamlit

## Setup Instructions

### On Replit

1. Create a new Replit and select Python as the language.
2. Import the project files or clone the repository if the project is hosted on GitHub.
3. Install dependencies by adding them to the `pyproject.toml` or running the command `pip install streamlit`.
4. Run the Streamlit app by executing `streamlit run main.py` in the Shell.

### On Local Machine

1. Clone the project or download the files.
2. Navigate to the project directory.
3. Set up a Python virtual environment:

   ```bash
   python3 -m venv venv
   source venv/bin/activate # On Windows, use `venv\Scripts\activate`
   ```

4. Install dependencies. If you're using Poetry (recommended since the project uses a `pyproject.toml` file), run:

   ```bash
   poetry install
   ```

   Alternatively, you can manually install Streamlit using pip:

   ```bash
   pip install streamlit
   ```

5. Run the Streamlit app:

   ```bash
   streamlit run main.py
   ```

## Usage

Once the Streamlit app is running, it should be accessible via a web browser. For local setups, the default URL is usually http://localhost:8501. The app will prompt you to enter your available RAM in GB, estimated OS RAM usage, context window size, and choose a quantization level. After making your selections, the app will calculate and display the maximum number of parameters your setup can handle in billions.

## Calculations

The app calculates the maximum number of parameters that can fit in RAM based on the following inputs:

- Available RAM in GB
- Estimated OS RAM usage in GB
- Context window size (number of tokens)
- Quantization level (bits per parameter)

Here's how the calculation is performed:

1. Convert the available RAM and OS overhead from GB to bytes.
2. Calculate the memory required for the context window by multiplying the number of tokens by 0.5 MB and converting it to bytes.
3. Calculate the usable RAM in bytes by subtracting the OS overhead and context window memory from the total available RAM.
4. Convert the quantization level from bits to bytes per parameter.
5. Calculate the maximum number of parameters by dividing the usable RAM by the bytes per parameter.
6. Convert the result from parameters to billions of parameters for display.

The app also checks if the calculated maximum number of parameters is negative, which indicates that the context window size is too large for the available RAM. In such cases, an error message is displayed, suggesting the user to reduce the context window size or increase the available RAM.

## Contributing

Contributions to the project are welcome! If you have suggestions or improvements, please feel free to fork the repository, make your changes, and submit a pull request.
