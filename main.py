import streamlit as st

def calculate_max_parameters(available_ram_gb, bits_per_parameter):
    bytes_per_parameter = bits_per_parameter / 8  # Convert bits to bytes
    total_ram_bytes = available_ram_gb * 1e9  # Convert GB to bytes
    usable_ram_bytes = total_ram_bytes * 0.7  # Assuming 30% overhead
    max_parameters = usable_ram_bytes / bytes_per_parameter  # Calculate number of parameters
    return max_parameters / 1e9  # Convert back to billions for display


def quantization_options():
    return {
        "q4": 4,
        "q5": 5,
        "q8": 8,
        "fp16": 16,
        "q2_K": 2,
        "q3_K_S": 3,
        "q3_K_M": 3,
        "q3_K_L": 3,
        "q4_K_S": 4,
        "q4_K_M": 4,
        "q5_K_S": 5,
        "q5_K_M": 5,
        "q6_K": 6,
    }

# Streamlit app interface
st.title('LLM RAM Requirement Calculator for Various Quantizations')
available_ram = st.number_input('Enter your available RAM in GB:', min_value=1.0, value=16.0, step=0.5)

quantizations = quantization_options()
quantization_selected = st.selectbox('Select a quantization level:', list(quantizations.keys()))

max_parameters = calculate_max_parameters(available_ram, quantizations[quantization_selected])
st.write(f'With {quantization_selected} quantization, you can run a model with up to {max_parameters:.2f} billion parameters.')
