# Initial Attempt with python-pptx

This document outlines the initial attempt to replicate the methodology slide using the `python-pptx` library and the reasons for its failure.

## Outcome

The initial attempt with `python-pptx` resulted in a slide that did not accurately match the target design. The primary challenges were:

*   **Limited Positional Control:** `python-pptx` abstracts away the direct manipulation of element coordinates, making it difficult to achieve the precise layout required by the design.
*   **Styling Constraints:** While `python-pptx` allows for basic styling, it was challenging to replicate the exact fonts, colors, and shapes of the target design.
*   **Complexity:** The code required to generate the slide with `python-pptx` was more complex and less intuitive than the `pptxgenjs` equivalent.

## Key Failure Points

*   **Inaccurate Layout:** The generated slide had incorrect spacing and alignment of elements.
*   **Visual Mismatch:** The fonts, colors, and shapes did not match the target design.
*   **Placeholder Image:** The initial implementation used placeholder shapes instead of the actual laboratory image.