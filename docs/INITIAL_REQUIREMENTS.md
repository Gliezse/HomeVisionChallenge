# Assignment

HomeVision Frontend Challenge

This is a take home interview for HomeVision that focuses primarily on writing clean code that accomplishes a very practical task. The challenge is to build a simple web app that displays an infinite scrolling of house data. We'd prefer if you used React (or a React-based framework like Next.js) but feel free to use any library for the UI components.
**Note**: this is a **flaky API**! That means that it will likely fail with a non-200 response code. Your code **must** handle these errors correctly so that all photos are displayed without issues.

API Endpoint
You can request the data using the following endpoint:
`https://staging.homevision.co/api_project/houses`

This route by itself will respond with a default list of houses (or a server error!). You can use the following URL parameters:

- page: the page number you want to retrieve (default is 1).

- per_page: the number of houses per page (default is 10).

## Requirements

- Use React and TypeScript

- Design and implement a system to display the results of the API calls to a user

- Include instructions on how to run the project

## Bonus Points

- Add some additional features that require more complex interactions

- Show off your understanding of what is required to build and run a production application — through comments and/or implementation of those requirements