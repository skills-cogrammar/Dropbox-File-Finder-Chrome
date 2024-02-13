This readme file was last updated *2024-03-13*

## General Information 
- Project Name: `Dropbox File Finder`
- Path: `/scripts`
- Description: Contains all of the JavaScript files for the project

## Folders 

### SDKS

Contains code files for external services used to access the dropbox client.

## Files 

### authSearch.js

Contains the code that will automatically take the user to the dropbox folder if the user has selected the auto search feature on the settings dialog.

The file also contains the code that will create the dialog option.

### background.js (MV3 file)

Contains the code that will listen for a message containing a link and creates a chrome tab that redirects to the specified link.

### content.js (MV3 file)

This file contains the bulk of the applications code, all of the main features are contained within this file.

- Contains the code for the different UI components that are shown throughout the extension. 
- Contains the code for performing authentication and reseting the token if the users session has expired 
- Contains the code for creating and showing the left side pop up
- Contains the code for finding the task files and loading them to the list in the left side pop up 

### dashboardScropts.js

Contains the code for performing the operations when the user is at the dashboard

- Sorting the reviews 
- Showing the review counter 
- Highlighting resub tasks 
- Highlighting capstone
- stores a review as a resubmission in the local memory 

### feedbackFields.js

Contains the code that will handle the reviewers past reviews and provide suggestions if the review history is on.

- Contains the code to create the UI components that will be used on the page 
- Checks if the review is a resubmission based in the local memory 
- Adds the feature for pasting reviews from the clipboard
- Gets details from the last review if rememberReview is set true 
- Includes the code for showing the word counter 

### hide-mouse.js

Contains the code to hide the mouse when the user is typing in the review blocks 

### MentorRubrick.js

- Contains the pop-up that shows the descriptions for the different weightings for the review score card.
- Contains the UI code for creating and displaying the popup


### moreOptions.js

Contains the code for creating the UI components for the settings pop-up and updates the users preference

### reviewed_reviews.js

Perform operations on the styling for the reviewed reviews tab

### scrollToResubTask.js

Contains the code that takes the user to a past review of the same task that is being reviewed (if the task is a resub)

### scrollToTop.js

Creates a button that will take the user back to the top of the page.

### versionReminder.js

Shows a pop up message telling the user to update the application.