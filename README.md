# Syllaboard Backend

Since this is a decoupled MERN app, the backend has one basic job, data persistence in the database. The database is MongoDB. After discussing the problem domain, we concluded that the data would be better modeled in a relational database, but that we are in the Mongo unit, so we decided to just use Mongo anyway.

## Technology choices

Since we decided to use Typescript and Redux on the front end, we decided to use Typescript on the backend as well. That way, we could be fairly certain that the data being passed back and forth have a consistent structure.

Typescript is not particularly well supported in MongoDB land. One project called Typegoose translates from types to Mongoose schemas. There is a library called Typeswan, which purports to be Typegoose, but better. Instead, we chose to use Typeorm, which has Mongo support because one team member has experience with it as a ORM for SQL databases.

## Models

We defined the following schemas:

#### Schemas

| Assignment    | type                        |
| ------------- | --------------------------- |
| \_id          | ObjectID                    |
| Name          | String                      |
| Version       | Number                      |
| instructor    | Instructor's ID (reference) |
| instructions  | String                      |
| resourcesUrls | Array of strings            |
| cohotTYpe     | Array of strings            |
| cohorrtWeek   | String                      |

| Deliverable   | type                        |
| ------------- | --------------------------- |
| \_id          | ObjectID                    |
| instructor    | Instructor's ID (reference) |
| student       | Student's ID (reference)    |
| cohort        | Cohort's ID (reference)     |
| instructions  | String                      |
| resourcesUrls | Array of strings            |
| deadline      | Date                        |
| deliverable   | String                      |
| turnedIn      | Date                        |
| completed     | Date                        |
| grade         | Number                      |

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

Notice that the code for the entities (models) are not so different from the descritpions. We made a list of what data should be in the database, and in what format, and that is all there is. Typeorm allows schemas to be defined very declaratively: say what data to persist, what type, and add a decorator to turn the type into a column.

We went back and forth on embedding deliverables within student. There was also some consideration of embedding student within deliverable, but in the end we decided to keep separate collections. The one-to-many relationship for deliverables and students suggested embedding, but it became difficult to reach in from the instrutor's side to see all deliverables that matched certain criteria, and to edit them.

## Controllers

The controllers are where most of the backend app logic lives. The initial development took place in a couple of example files, populateDB and assignmentExample. The assignment flow is where the heart of the application logic. An instructor has access to assignments, which are descriptions of what should be accomplished as homeworks. They can be assigned to a cohort as a deliverable, so that each member of the cohort has an individual deliverable. Once the deliverable is completed, it is turned in with a URL to the work product (for example, a github repo, a Google Doc, a PDF hosted on Dropbox, whatever). When it is turned in, it is timestamped as completed. The instructor can then mark them as completed, and if the assignment should be graded, with a grade.

Once that logic could be persisted in the database, the routes mostly wrote themselves. Well, we still had to write them and test them but it was just a matter of getting JSON in, JSON out, and making sure the correct type of user had access to the routes.

#### API Routes

| Routes                         | REST Verb | Description                                               |
| ------------------------------ | --------- | --------------------------------------------------------- |
| **Instructor Routes**          |           |                                                           |
| /instructor/assignments        | POST      | Create assignment                                         |
| /instructor/assignments        | GET       |                                                           |
| /instructor/assignments/:id    | PUT       | Edit assignment                                           |
| /instructor/assignments/:id    | DELETE    | Delete assignment (not implemented)                       |
| /instructor/cohorts/           | GET       | Get a list of all cohorts                                 |
| /instructor/cohort/:id         | POST      | Assign deliverable to cohort                              |
| /instructor/cohort/:id         | GET       | Summary of cohort progress on deliverable                 |
| /instructor/cohort/:id         | PUT       | Edit all of a deliverable on a cohort                     |
| /instructor/cohort/:id         | DELETE    | Delete all of a deliverable on a cohort (Not implemented) |
| /instructor/deliverable/:id    | GET       | Get info for a particular deliverable                     |
| /instructor/deliverable/:id    | PUT       | Set grade to a deliverable                                |
| (wishlist)                     | POST      | Bulk grade deliverables                                   |
| **Admin Routes**               |           |                                                           |
| /admin/users                   | POST ??   | Create user                                               |
| /admin/users                   | GET       | Show all users {filter}                                   |
| /admin/users/:id               | GET       | Show particular user                                      |
| /admin/users/:id               | PUT       | Edit a user                                               |
| /admin/users/:id               | DELETE    | Delete a user                                             |
| /admin/cohorts                 | POST      | Create a cohort                                           |
| /admin/cohorts                 | GET       | Show chorts, filter by ...                                |
| /admin/cohorts/:id             | PUT       | Edit a cohort                                             |
| /admin/cohorts/:id             | DELETE    | Delete a cohort                                           |
| /admin/cohorts/instructors/:id | PUT       | Add an instructor to a cohort                             |
| **User Routes**                |           |                                                           |
| /user/:id                      | GET       | User info                                                 |
| /user/deliverable/             | GET       | Gets all deliverables                                     |
| /user/deliverable/:id          | PUT       | Update deliverable                                        |
| /user/deliverable/pending      | GET       | Sends pending deliverables (wishlist)                     |

## Usability considerations

One aspect of usability that we considered, but decided not to implement, regards legacy browsers and slow internet connections. However, consider our target audience: coding school instructors, administrators, and students. The schools are located in metropolitan areas where fast internet is readily available, and any remote students require fast internet connections to be able to consume the course content. Administrators and instructors will often be working at school facilities on recent hardware with good WiFi. Even our larger JSON data payloads are not particularly big: so far it is mostly assignment metadata.

We did design for mobile first.

## App secrets

Turn the .env.example into a .env. The random looking string for the JWT secret is random nonsense we pulled from a [random string generator service](https://www.grc.com/passwords.htm). We never used that particular string for the project. .env.example is an example. You should generate similarly long random strings!

## Nice to have

There are some routes that were not implemented because they are not required for MVP that we should implement.
In addition, the authorization for each type of user should be refactored into middlewares. Also, while writing the mock data generation, it would have been good to write tests alongside. The mocks and testing serve the same purpose and accomplish the same goals: make sure that the app logic does what it should do.
