# City Activity Ranking

This is a monorepo for a website that provides rankings for activities in cities based on the weather.

This project has two parts, a react website located in apps/city-activity-ranking and a node server with a graphql interface located in services/activity-ranking

## Getting started

1. Install node version manager

    https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating

2. Use nvm to install the specified node version

    `nvm use`

2. Install corepack to enable package manager installs

    `npm install -g corepack`

3. Run yarn to make sure it is installed and install dependencies

    `yarn`

4. Start the activity-ranking server

    `yarn start-server`

5. Start the react app

    `yarn start-react-app`

## Architectue

### Repo

- yarn workspace

    Since the requirment was to have the server and react app in the same repo I decided to make use of yarn workspaces which can make it easy to work with multiple packages. Especially when it comes to dependency management. While not as necessary at this stage, as the project increases in size and scope this will allow the repo to keep up with the scale.

### Frontend

- React Router (formerly known as Remix)

    The first choice to make was selecting a framework to create the react app with. I chose React Router due to it being lightweight and having prior experience. I knew the FE would be a simple single page with basic functionality so did not want to use a framework such as Next which would include so many unnecessary extras.

- Tailwind

    For styling I chose tailwind for its simplicity and fast iteration. If I were to scale this project up with many more components I would like to create a component library using styled components instead.

### Backend

- Microservice

    I created the backend server as a microservice, enabling us to scale its deployment appropriately if required. When adding new features, additional microservices could be created and combined using an API gateway. 

- Axios

    I started out using fetch for making API requests but found that the code was hard to read and not as modular for future changes.
    
    Instead I implemented axios which provides a clean API with automatic JSON data handling.

- TypeScript

    I have implemented the project in typescript, though most types are omitted for the sake of time. This enables types to be easily added in future if wanting to add better maintainability, team collaboration and scalability.

## AI

I used AI in multiple way during this project


1. Grok
    
    I used Grok for initial exploration of the problem and suggestions to being. Uploaded the problem statement.

    Later I used Grok to generate boilerplate functions and suggestions for the scoring functionality. With this inspiration I modified the provider code to be more to my liking.

    I asked Grok to consider which wether elements would be ideal for each of the given activities - this helped to provide context.

2. Autocomplete using Copilot inside VS Code

    This helped to speed up manual code writing

## Other omissions and trade-offs

- Tests

    I started implementing jest tests for the mateo service but ran into complications with using jest with typescript and ESM - in the end I decided to skip this as I started to run out of time trying to debug the issue.

    As part of testing it would be good to create mocked responses for the Mateo API endpoints being used.

- Logger

    While not necessary for this proof of concept, a dedicated logger would be helpful as the project scales up and is deployed to production. Allowing us to configure which logs to display depending on environment.

- Linting

    Linting would be helpful to catch errors early and enforce code consistency and maintainability. This was skipped for time.

- CI/CD

    As a sole developer creating a proof of concept that runs locally, there was not a need for CI/CD on this project. This should be added if the project were to be deployed to cloud environments and worked on by a larger team. This would automatically run linting, tests and builds before code can be merged to the main branch. Once merged the updated code would be automatically deployed to the desired environment.

- Scoring algorithm

    This implemented scoring algorithm is extremely simple, with some additional research this could be modified 

- Parallel computation

    When calculating the activities score we calculate each score for each day synchronously. This could be improved by calculating each activity and each day in parralel to improve score calculation times.

    Since we only have 4 activity with 7 days each, this does not take long to compute now - however in future this could be extended with hundreds of activities over a larger or more fine range of time which could greatly increase the compute time.

- Cache

    Say we were to deploy this service in production which started to receive thousands of visitors. Many of these visitors will be making requests for the same activities on the same days. Instead of making API requests to Mateo for every single user, a cache could be put in place to store requests and serve those instead. This would reduce the amount of time required to calculate scores after 1 calculation has taken place and reduce the number of API requests made to the 3rd party API, which could save cost.