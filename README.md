# Syllaboard Backend

Since this is a decoupled MERN app, the backend has one basic job, data persistence in the database. The database is MongoDB. After discussing the problem domain, we concluded that the data would be better modeled in a relational database, but that we are in the Mongo unit, so we decided to just use Mongo anyway.

## Technology choices

Since we decided to use Typescript and Redux on the front end, we decided to use Typescript on the backend as well. That way, we could be fairly certain that the data being passed back and forth have a consistent structure.

Typescript is not particularly well supported in MongoDB land. One project called Typegoose translates from types to Mongoose schemas. There is a library called Typeswan, which purports to be Typegoose, but better. Instead, we chose to use Typeorm, which has Mongo support because one team member has experience with it as a ORM for SQL databases.

## Models

Typeorm allows schemas to be defined very declaratively. We defined the following schemas:

#### Schemas

| Assignment    | type                        |
| ------------- | --------------------------- |
| \_id          | ObjectID                    |
| student       | Student's ID (reference)    |
| instructor    | Instructor's ID (reference) |
| instructions  | String                      |
| resourcesUrls | Array of strings            |
| deadline      | Date                        |
| turnedIn      | Date                        |
| completed     | Date                        |
| deliverable   | String                      |
| number        | String                      |

| Cohort      | type                        |
| ----------- | --------------------------- |
| \_id        | ObjectId                    |
| name        | String                      |
| campus      | String                      |
| students    | Student's ID (reference)    |
| instructors | Instructor's ID (reference) |
| startDate   | Date                        |
| endDate     | Date                        |

| User      | type     |
| --------- | -------- |
| \_id      | ObjectId |
| firstName | String   |
| lastName  | String   |
| email     | String   |
| password  | String   |
| role      | String   |

Notice that the code for the entities (models) are not so different. We made a list of what data should be in the database, and in what format, and that is all there is.



## Controllers

## Usability considerations

One aspect of usability that we considered, but decided not to implement, regards legacy browsers and slow internet connections. However, consider our target audience: coding school instructors, administrators, and students. The schools are located in metropolitan areas where fast internet is readily available, and any remote students require fast internet connections to be able to consume the course content. Administrators and instructors will often be working at school facilities on recent hardware with good WiFi. Even our larger JSON data payloads are not particularly big: so far it is mostly assignment metadata.

We did design for mobile first.

## Things to add

Turn the .env.example into a .env. The random looking strings are random nonsense we pulled from a [random string generator service](https://www.grc.com/passwords.htm). They are different from what we are using for the project. .env.example is an example. You should generate similarly long random strings!

## 

|      |      |
| ---- | ---- |
|      |      |
|      |      |
|      |      |
|      |      |
|      |      |
|      |      |

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

| Routes                      | REST Verb | Description                               |
| --------------------------- | --------- | ----------------------------------------- |
| **Instructor Routes**       |           |                                           |
| /instructor/assignments     | POST      | Create assignment                         |
| /instructor/assignments     | GET       |                                           |
| /instructor/assignments/:id | PUT       | Edit assignment                           |
| /instructor/assignments/:id | DELETE    | Delete assignment                         |
| /instructor/cohort/:id      | POST      | Assign deliverable to cohort              |
| /instructor/cohort/:id      | GET       | Summary of cohort progress on deliverable |
| /instructor/cohort/:id      | PUT       | Edit all of a deliverable on a cohort     |
| /instructor/cohort/:id      | DELETE    | Delete all of a deliverable on a cohort   |
| /instructor/deliverable/:id | PUT       | Set grade to a deliverable                |
| (wishlist)                  | POST      | Bulk grade deliverables                   |
| **Admin Routes**            |           |                                           |
| /admin/users                | POST ??   | Create user                               |
| /admin/users                | GET       | Show all users {filter} 1                 |
| /admin/users/:id            | GET       | Show particular user                      |
| /admin/users/:id            | PUT       | Edit a user 6                             |
| /admin/users/:id            | DELETE    | Delete a user 3                           |
| /admin/cohort               | POST      | Create a cohort 7                         |
| /admin/cohort               | GET       | Show chorts, filter by ... 2              |
| /admin/cohort/:id           | PUT       | Edit a cohort 5                           |
| /admin/cohort/:id           | DELETE    | Delete a cohort 4                         |
| **User Routes**             |           |                                           |
| /user/:id                   | GET       | User info                                 |
| /user/deliverable/          | GET       | Gets all deliverables                     |
| /user/deliverable/:id       | PUT       | Update deliverable                        |
| /user/deliverable/pending   | GET       | Sends pending deliverables (wishlist)     |
