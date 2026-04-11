## Layout & Scroll Behavior (Sticky Shrinking Header)

### Global Scroll Behavior

* The application must use **full-page scrolling**
* The **browser scroll** should control the entire page
* Avoid nested scroll containers (no internal scrolling inside components)

---

### Sticky Header

* The header must be **sticky** and always visible at the top of the viewport
* It should remain above all content (proper layering/z-index)

---

### Dynamic Resizing Behavior

The header must have **two visual states**:

#### 1. Top of Page (Default State)

* Larger height
* More vertical spacing (padding)
* Larger title/logo
* Clean appearance (no shadow or minimal elevation)

#### 2. Scrolled State

Triggered once the user scrolls past a small vertical threshold.

* Reduced height (more compact)
* Smaller title/logo
* Tighter spacing
* Subtle shadow or elevation to separate it from content
* Optional: slightly opaque or blurred background for better readability

---

### Transition Requirements

* The transition between states must be **smooth and animated**
* Avoid abrupt jumps in size or layout
* Ensure content does not shift unexpectedly during the transition

---

### Layout Considerations

* Content below the header must **never be hidden underneath it**
* Proper spacing must be maintained regardless of header size
* The layout should feel stable during scroll

---

### UX Expectations

* The header should feel **prominent and branded at the top**, but **efficient and unobtrusive while scrolling**
* The behavior should enhance usability without distracting the user

---

### Enhancements (Bonus)

* Add subtle background blur or translucency when in the scrolled state
* Adjust visual density (e.g., tighter spacing, smaller elements) consistently across the header
