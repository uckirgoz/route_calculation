# Coding Challenge:
### Missing Features and Functionality

1. **User Experience Enhancements**:
    - Add a language option to enhance accessibility for users speaking different languages.
    - Include a 'My Location' button to allow users to quickly find their current location on the map.
    - Implement a feature to reverse the route and editing routing points.
    - Offer different vehicle profiles with respective routing options (e.g., car, bike, walking).
    - Add an option to restrict user actions for a more guided experience.
    - Incorporate a map view option for different perspectives.
    - An how to guide like a tutorial on the map functionality.
    - A mix of marking and address search could also be implemented.
    - Reversed or changing the order of waypoints.
2. **User Interface Improvements**:
    - Utilise a UI package to improve the visual aspect and usability.
    - Create a more interactive save feature for routes.
    - Enable address bar and waypoints to be used in tandem for route planning.
    - Make buttons active or inactive based on context to guide user actions.
    - Improve the visibility of the itinerary, ensuring the initial steps are clearly shown.
    - Device compatibility needs to be quadruple checked.
    - Could’ve got the estimated time for the API for specific profiles and
3. **Technical Enhancements**:
    - Add testing to ensure reliability and catch potential bugs.
    - Explore and possibly use utility functions to optimise code.
    - Resolve API issues related to importing symbols, or create custom symbols as done for waypoint selection.
    - Consider saving the unit selection (e.g., kilometers, miles) with the route data.
    - Add a feature to delete saved routes.
    - Implement better error checking on route saving.
    - There is a bug to remove waypoint when route is selected, API makes marks that are giving errors in console, turns into a bug.
    - When route is finalised, removing waypoint is disabled for some reason, fix that.
4. **Documentation and Guidance**:
    - Create a README or a 'How-to' guide for users and developers.
5. **Version Control**
    1. Could not use Github like I would normally because I did not want to push any unfinished code, I was just excited. 

### Development Challenges and Lessons

1. **State Management Challenge**:
    - Initial implementation using `useEffect` to initialise buttons led to issues with stale state. Resolved by creating buttons as separate DOM elements.
2. **Post-Development Modifications**:
    - Faced complications in making adjustments after finalising CSS, highlighting the importance of planning for flexibility in design.
3. **Code Structure**:
    - Recognised the potential benefit of having more components for a clearer and more manageable code structure.

These categories and the restructured notes should provide a clear roadmap for future development and improvement of your application, addressing user experience, interface design, technical robustness, and providing valuable insights from your development challenges.
