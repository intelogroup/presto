## `python-pptx` Learnings

This document provides a summary of the key technical learnings from the initial attempt to replicate a complex slide design using `python-pptx`.

### Key Challenges

The primary challenges encountered with `python-pptx` were related to its high-level API, which abstracts away the direct control needed for precise design replication.

### Explanation

*   **Limited Positional Control:** `python-pptx` primarily relies on predefined layouts and placeholders, making it difficult to specify the exact coordinates and dimensions of elements. This limitation was the main reason for the inaccurate layout in the initial attempt.
*   **Styling Constraints:** While `python-pptx` supports basic styling, it was challenging to achieve the specific fonts, colors, and shapes required by the target design. The library's styling capabilities are not as extensive as those of `pptxgenjs`.
*   **Complexity for Custom Designs:** For designs that deviate from standard layouts, `python-pptx` can become cumbersome. The code required to work around the library's limitations can be more complex and less maintainable than the equivalent code in `pptxgenjs`.

### Recommendation

For projects that require a high degree of design fidelity and precise control over slide elements, `pptxgenjs` is the recommended library. `python-pptx` is better suited for projects that can leverage standard slide layouts and require less customization.