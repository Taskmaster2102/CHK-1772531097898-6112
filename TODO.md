# TODO: Fix Pot Realism Issues

## Task: Make pot patterns visible and realistic (not animated)

### Issues:
1. Patterns are not visible on the pot surface
2. Pot looks very animated - should look realistic

### Completed Changes:

#### 1. ✅ Fixed Pattern Visibility in RealisticPot Component:
- Increased pattern opacity and contrast (from 10-30% to 30-60%)
- Added mixBlendMode: 'multiply' for better pattern integration
- Added more pattern elements for each pattern type
- Made patterns more visible and distinguishable

#### 2. ✅ Reduced Animation Effects:
- Removed entrance animations from the pot preview container
- Changed comment to indicate static product preview
- Added subtle background environment for product photo realism
- Pot now displays like a static product photo

#### 3. ✅ Added Product Photo Environment:
- Added gradient background (from-gray-50 to-gray-100) to simulate product photography lighting

### Files Edited:
- `src/components/ProductCustomizer.tsx`

### Follow-up Steps:
- Test the changes in browser to verify patterns are visible and pot looks realistic

