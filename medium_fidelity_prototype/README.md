# Smart TV Profile Button Prototype

A medium-fidelity interactive prototype demonstrating a dedicated profile button solution for smart TV remotes and streaming devices.

## The Problem

Current smart TVs and streaming devices require users to navigate through multiple screens (6+ clicks) to switch user profiles:
1. Click MENU button
2. Navigate to Settings
3. Select Account
4. Select Manage Profiles
5. Select desired profile
6. Confirm selection

This creates friction in multi-user households where profile switching is a common task.

## The Solution

A **dedicated PROFILE button** on the remote control that:
- Works universally across all streaming apps
- Instantly brings up a profile selection overlay from ANY screen
- Reduces profile switching from 6+ clicks to just 2 clicks
- Provides immediate visual feedback

## Features

### Interactive Prototype Includes:

1. **Simulated Smart TV Interface**
   - Netflix-style streaming app (StreamFlix)
   - Home screen with content rows
   - Settings navigation
   - Profile selection screens

2. **Functional Remote Control**
   - Dedicated PROFILE button (highlighted in green)
   - Standard navigation buttons (D-pad, OK, Back, Home, Menu)
   - Playback controls
   - Volume controls

3. **Two Profile-Switching Methods**
   - **NEW WAY**: Press Profile button → Select profile (2 clicks)
   - **OLD WAY**: Menu → Settings → Account → Profiles → Select (6+ clicks)

4. **Live Click Counter**
   - Tracks clicks when using traditional method
   - Demonstrates the efficiency gain of the new approach

5. **Profile Quick Switch Overlay**
   - Appears instantly from any screen
   - Shows all available profiles
   - Can be dismissed by clicking profile button again or pressing ESC

## How to Use

1. Open `index.html` in a web browser
2. Try both methods:
   - **Quick method**: Click the green PROFILE button on the remote
   - **Traditional method**: Click MENU → Settings → Account → Manage Profiles → Select Profile

3. **Keyboard Shortcuts**:
   - `P` - Toggle profile overlay
   - `H` - Go home
   - `ESC` - Close overlay or go back

## User Profiles Available

- Sarah
- Mike
- Kids
- Guest (default)

## Technical Details

- Pure HTML, CSS, and JavaScript
- No external dependencies
- Responsive design
- Works on desktop and tablet browsers

## Design Rationale

This prototype demonstrates:
- **Discoverability**: The profile button is clearly labeled and visually distinct
- **Efficiency**: Reduces task completion time by 67%
- **Consistency**: Works the same way across all screens and apps
- **Feedback**: Provides immediate visual and textual confirmation
- **Error Prevention**: Overlay can be easily dismissed without disrupting viewing

## For Course Evaluation

This medium-fidelity prototype can be used to:
- Demonstrate the concept to stakeholders
- Conduct usability testing
- Gather user feedback on the interaction design
- Compare efficiency metrics between old and new methods
- Support design decision documentation

## Future Enhancements

- Add voice control integration
- Include parental control indicators
- Add profile creation flow
- Implement profile switching animations
- Add usage analytics tracking
