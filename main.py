import streamlit as st

def calculate_max_parameters(available_ram_gb, bits_per_parameter, os_overhead_gb=2):
    """
    Calculate the maximum number of parameters that can fit in the available RAM.

    :param available_ram_gb: Available RAM in gigabytes.
    :param bits_per_parameter: Number of bits per parameter based on the quantization level.
    :param os_overhead_gb: Estimated RAM used by the operating system in gigabytes (default is 2 GB).
    :return: Maximum number of parameters in billions.
    """
    bytes_per_parameter = bits_per_parameter / 8  # Convert bits to bytes
    total_ram_bytes = available_ram_gb * 1e9  # Convert GB to bytes
    usable_ram_bytes = total_ram_bytes - (os_overhead_gb * 1e9)  # Subtract OS overhead
    max_parameters = usable_ram_bytes / bytes_per_parameter  # Calculate number of parameters
    return max_parameters / 1e9  # Convert back to billions for display

def quantization_options():
    """
    Return a dictionary of quantization options and their corresponding bits per parameter.
    """
    return {
        "q4": 4,
        "q5": 5,
        "q8": 8,
        "fp16": 16,
        "q2_K": 2,
        "q3_K_S": 3.5,  # Example value, adjust as needed
        "q3_K_M": 3.75,  # Example value, adjust as needed
        "q3_K_L": 4,  # Example value, adjust as needed
        "q4_K_S": 4.5,  # Example value, adjust as needed
        "q4_K_M": 4.75,  # Example value, adjust as needed
        "q5_K_S": 5.5,  # Example value, adjust as needed
        "q5_K_M": 5.75,  # Example value, adjust as needed
        "q6_K": 6,
    }

def main():
    """
    Main function to run the Streamlit app.
    """
    st.title('LLM RAM Calculator')

    st.sidebar.title('Settings')
    available_ram = st.sidebar.number_input('Enter your available RAM in GB:', min_value=1.0, value=16.0, step=8.0)
    os_overhead_gb = st.sidebar.slider('Estimated OS RAM Usage (GB):', min_value=1.0, max_value=8.0, value=2.0, step=0.5,
                                       help='Estimate of the RAM used by the operating system (OS). Adjust this value based on your system.')

    st.markdown(f'<p style="font-size: 20px;"><strong>Available RAM:</strong> {available_ram} GB</p>', unsafe_allow_html=True)
    st.write('You can update the available RAM and estimated OS RAM usage in the sidebar.')

    quantizations = quantization_options()
    quantization_selected = st.selectbox('Select a quantization level:', list(quantizations.keys()))

    if quantization_selected in quantizations:
        max_parameters = calculate_max_parameters(available_ram, quantizations[quantization_selected], os_overhead_gb)
        st.markdown(f'<h3 style="font-size: 24px; color: green;">With <strong>{quantization_selected}</strong> quantization, you can run a model with up to <strong>{max_parameters:.2f} billion parameters</strong>.</h3>', unsafe_allow_html=True)
    else:
        st.write('Please select a valid quantization level.')

    st.sidebar.write('Quantization levels explanation:')
    st.sidebar.write('- q2_K, q3_K_S, q3_K_M, q3_K_L, q4_K_S, q4_K_M, q5_K_S, q5_K_M, q6_K: Quantization levels for different model sizes (S, M, L)')
    st.sidebar.write('- q4, q5, q8: General quantization levels')
    st.sidebar.write('- fp16: Half-precision floating point')

if __name__ == '__main__':
    main()