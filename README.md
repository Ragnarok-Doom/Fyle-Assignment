*************Angular User Workout Tracking Application****************
> This project is an Angular application designed to track user workouts. It includes functionalities for user management, workout tracking, and data visualization using charts.

> Table of Contents
1. Features
2. Installation
3. Usage
4. Unit Tests
5. Code Coverage Report

> Features

1. User Management
Add new users with workout details
View, search, and filter users by username and workout type
Delete users with confirmation dialog

2. Workout Tracking
Track various workout types (Running, Cycling, Swimming, Yoga)
Calculate total workout minutes and count unique workouts

3. Data Visualization
Display workout progress using bar charts
Select a user to view their workout chart
Show appropriate messages if data is not available

> Installation
1. Clone the repository:
git clone https://github.com/yourusername/your-repo.git
cd your-repo

2. npm install

3. ng serve

4. Open your browser and navigate to http://localhost:4200.

> Usage

1. Adding a New User
- Fill in the username, workout type, and workout minutes in the form.
- Click the "Submit" button to add the user.
- If the user is successfully added, a success message will be displayed. If not, an appropriate error message will be shown.
- Viewing and Managing Users
- Use the search input to filter users by username.
- Use the workout type filter to filter users by workout type.
- Click the delete button next to a user to delete their record after confirmation.
- Click on a username to view the user's workout chart.

2. Refreshing the User List
- Click the refresh button next to the user list heading to reload the user data.

3. Unit Tests
- Unit tests have been written for one component and one service, ensuring 100% code coverage. The tests validate the core functionalities and business logic of the application.

4. Running Unit Tests
- To execute the unit tests, run the following command: ng test

5. Code Coverage Report
-To generate the code coverage report, run the following command:ng test --code-coverage
- The code coverage report will be generated in the coverage directory. To view the report, open the index.html file in a browser.

