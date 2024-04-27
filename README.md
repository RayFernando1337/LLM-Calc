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

Once the Streamlit app is running, it should be accessible via a web browser. For local setups, the default URL is usually http://localhost:8501. The app will prompt you to enter your available RAM in GB and choose a quantization level. After making your selections, the app will calculate and display the maximum number of parameters your setup can handle in billions.

## Contributing

Contributions to the project are welcome! If you have suggestions or improvements, please feel free to fork the repository, make your changes, and submit a pull request.