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
        "1-bit": 1,
        "2-bit": 2,
        "3-bit": 3,
        "4-bit": 4,
        "5-bit": 5,
        "6-bit": 6,
        "8-bit": 8,
        "fp16": 16,
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

    st.sidebar.title('Quantization Levels Explanation')
    st.sidebar.write('Quantization is a technique used to reduce the memory footprint and computational cost of LLMs by representing the model parameters with fewer bits.')
    st.sidebar.write('Lower bit precisions result in smaller model sizes and faster inference but may impact accuracy. Higher bit precisions retain more information but require more memory and computation.')
    st.sidebar.write('- 1-bit to 6-bit: Low-precision quantization levels. These offer the smallest model sizes but may have a more significant impact on accuracy. 1-bit quantization (binary weights) is an extreme case that can greatly reduce memory usage but may only be suitable for certain types of models or applications.')
    st.sidebar.write('- 8-bit: Common quantization level for many LLMs. It provides a good balance between model size reduction and preserving accuracy. Many hardware platforms have native support for 8-bit arithmetic, making it efficient for inference.')
    st.sidebar.write('- fp16: Half-precision floating-point format. It offers higher precision than the quantized options but still reduces the memory footprint compared to full-precision floating-point (fp32). fp16 is commonly used for training and can be used for inference on GPUs with native fp16 support.')

if __name__ == '__main__':
    main()