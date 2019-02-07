# Syllaboard Backend

## Things to add

Turn the .env.example into a .env. The random looking strings are random nonsense we pulled from a [random string generator service](https://www.grc.com/passwords.htm). They are different from what we are using for the project. .env.example is an example. You should generate similarly long random strings!

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

## API Routes

| Routes                             | REST Verb | Description                               |
| ---------------------------------- | --------- | ----------------------------------------- |
| **Instructor Routes**              |           |                                           |
| /instructor/assignment             | POST      | Create assignment                         |
| /instructor/assignment             | GET       |                                           |
| /instructor/assignment/:id         | PUT       | Edit assignment                           |
| /instructor/assignment/:id         | DELETE    | Delete assignment                         |
| /instructor/deliverable/cohort/:id | POST      | Assign deliverable to cohort              |
| /instructor/deliverable/cohort/:id | GET       | Summary of cohort progress on deliverable |
| /instructor/deliverable/cohort/:id | PUT       | Edit all of a deliverable on a cohort     |
| /instructor/deliverable/cohort/:id | DELETE    | Delete all of a deliverable on a cohort   |
| /instructor/deliverable/grade/:id  | POST      | Set grade to a deliverable                |
|                                    | POST      | Bulk grade deliverables                   |
| **Admin Routes**                   |           |                                           |
| /admin/users                       | POST      | Create user                               |
| /admin/users                       | GET       | Show all users {filter}                   |
| /admin/users/:id                   | GET       | Show particular user                      |
| /admin/users/:id                   | PUT       | Edit a user                               |
| /admin/users/:id                   | DELETE    | Delete a user                             |
| /admin/cohort                      | POST      | Create a cohort                           |
| /admin/cohort                      | GET       | Show chorts, filter by ...                |
| /admin/cohort/:id                  | PUT       | Edit a cohort                             |
| /admin/cohort/:id                  | DELETE    | Delete a cohort                           |
| **User Routes**                    |           |                                           |
| /user/:id                          | GET       | User info                                 |
| /user/deliverable/:id              | GET       | Show page, as required for submit form    |
| /user/deliverable/:id              | PUT       | Update deliverable                        |
| /user/deliverable/pending          | GET       | Sends pending deliverables                |
