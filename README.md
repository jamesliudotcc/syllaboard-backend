# Syllaboard Backend

## Things to add
Create a .env file in your src entity that has MONGO_PORT with your database URI and a JWT_SECRET with some sweet secret.

## Schemas

| Assignment    | type     |
| ------------- | -------- |
| \_id          | ObjectId |
| student       | ObjectID |
| instructor    | ObjectID |
| instructions  | String   |
| resourcesUrls | String[] |
| deadline      | Date     |
| turnedIn      | Date     |
| completed     | Date     |
| deliverable   | String   |
| number        | String   |

| Cohort      | type       |
| ----------- | ---------- |
| \_id        | ObjectId   |
| name        | String     |
| campus      | String     |
| students    | ObjectID[] |
| instructors | ObjectID[] |
| startDate   | Date       |
| endDate     | Date       |

| User      | type     |
| --------- | -------- |
| \_id      | ObjectId |
| firstName | String   |
| lastName  | String   |
| email     | String   |
| password  | String   |
| role      | String   |

## Routes

| Route               | REST Verb | Description                          |
| ------------------- | --------- | ------------------------------------ |
| /                   | GET       | Landing page, has login and signup   |
| /auth/signup        | POST      | Collects signup info                 |
| /auth/login         | POST      | Collects login info                  |
| /admin              | GET       | Main admin                           |
| /instructor         | GET       | Main Instructor                      |
| /instructor/cohort/ |           |                                      |
| /student            | GET       | Main student dashboard               |
| /student/turnin     | GET       | Shows form for turn in of assignment |
| /student/turnin     | POST      |                                      |
