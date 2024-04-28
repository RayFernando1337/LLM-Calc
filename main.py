import streamlit as st

st.set_page_config(
    page_title="LLM RAM Calculator by Ray Fernando",  # Set the title that will be displayed in the browser tab
    # page_icon=":brain:",  # Optional: you can set an emoji or path to an image file as the icon
    # layout="wide",  # Optional: use "wide" or "centered" to set the default layout of the app
    # initial_sidebar_state="expanded"  # Optional: use "expanded" or "collapsed" to set the sidebar state
)


def calculate_max_parameters(available_ram_gb, bits_per_parameter, os_overhead_gb=2, context_window=2048):
    """
    Calculate the maximum number of parameters that can fit in the available RAM.

    :param available_ram_gb: Available RAM in gigabytes.
    :param bits_per_parameter: Number of bits per parameter based on the quantization level.
    :param os_overhead_gb: Estimated RAM used by the operating system in gigabytes (default is 2 GB).
    :param context_window: Number of tokens in the context window (default is 2048).
    :return: Maximum number of parameters in billions.
    """
    bytes_per_parameter = bits_per_parameter / 8  # Convert bits to bytes
    total_ram_bytes = available_ram_gb * 1e9  # Convert GB to bytes
    context_memory_bytes = context_window * 0.5 * 1e6  # Convert context window to bytes
    usable_ram_bytes = total_ram_bytes - (os_overhead_gb * 1e9) - context_memory_bytes  # Subtract OS overhead and context memory
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
        "bfloat16": 16,
        "fp32": 32
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
    context_window = st.sidebar.number_input('Context Window (Number of Tokens):', min_value=1, value=2048, step=1,
                                             help='Number of tokens in the context window. Each token requires 0.5 MB of memory.')

    st.markdown(f'<p style="font-size: 20px;"><strong>Available RAM:</strong> {available_ram} GB</p>', unsafe_allow_html=True)
    st.write('You can update the available RAM, estimated OS RAM usage, and context window in the sidebar.')

    quantizations = quantization_options()
    default_quantization_index = list(quantizations.keys()).index("4-bit")  # Get the index of "4-bit"
    quantization_selected = st.selectbox('Select a quantization level:', list(quantizations.keys()), index=default_quantization_index)

    if quantization_selected in quantizations:
        max_parameters = calculate_max_parameters(available_ram, quantizations[quantization_selected], os_overhead_gb, context_window)
        if max_parameters >= 0:
            st.markdown(f'<h3 style="font-size: 24px; color: green;">With <strong>{quantization_selected}</strong> quantization and a context window of <strong>{context_window}</strong> tokens, you can run a model with up to <strong>{max_parameters:.2f} billion parameters</strong>.</h3>', unsafe_allow_html=True)
        else:
            st.markdown(f'<h3 style="font-size: 24px; color: red;">The selected context window size of <strong>{context_window}</strong> tokens is too large for the available RAM. Please reduce the context window size or increase the available RAM.</h3>', unsafe_allow_html=True)
    else:
        st.write('Please select a valid quantization level.')

    st.sidebar.title('Quantization Levels Explanation')
    st.sidebar.write('Quantization reduces the memory footprint and computational cost of LLMs. Each level has a different impact on model size, speed, and accuracy.')
    st.sidebar.write('- **1-bit to 6-bit**: Extremely low precision, major impact on accuracy. Best for specific applications where memory and speed are critical.')
    st.sidebar.write('- **8-bit**: Standard in many LLM deployments. Good balance of size, speed, and accuracy.')
    st.sidebar.write('- **fp16, bfloat16**: Half-precision formats offering significant reduction in size with less impact on accuracy than integer quantization. Widely supported on modern GPUs.')
    st.sidebar.write('- **fp32**: Full precision used during model training, rarely used in deployment due to high computational costs.')

    st.markdown("""
        <iframe src="https://embeds.beehiiv.com/b159f8b5-03b7-41b3-b454-877016993ea1" data-test-id="beehiiv-embed" width="100%" height="320" frameborder="0" scrolling="no" style="border-radius: 4px; border: 2px solid #e5e7eb; margin: 0; background-color: transparent;"></iframe>
    """, unsafe_allow_html=True)

if __name__ == '__main__':
    main()
