# Authentication Endpoints

- **Register**

  - Method: POST
  - Endpoint: `/api/auth/register`
  - Description: Register a new user.

- **Login**
  - Method: POST
  - Endpoint: `/api/auth/login`
  - Description: Log in a user.

# List Endpoints

**Note**: All these endpoints require JWT authentication.

- **Get All Lists**

  - Method: GET
  - Endpoint: `/api/list`
  - Description: Get all lists for the current user.

- **Create List**

  - Method: POST
  - Endpoint: `/api/list`
  - Description: Create a new list.

- **Delete List**

  - Method: DELETE
  - Endpoint: `/api/list/<int:list_id>`
  - Description: Delete a list and all associated tasks.

- **Update List Title**

  - Method: PUT
  - Endpoint: `/api/list/<int:list_id>`
  - Description: Update a list's title.

- **Get Tasks**
  - Method: GET
  - Endpoint: `/api/list/<int:list_id>/task`
  - Description: Get all tasks for a specific list.

# Task Endpoints

**Note**: All these endpoints require JWT authentication.

- **Get Subtasks**

  - Method: GET
  - Endpoint: `/api/task/<int:task_id>/subtasks`
  - Description: Get all subtasks for a specific task.

- **Create Task**

  - Method: POST
  - Endpoint: `/api/task/add/<int:list_id>`
  - Description: Create a new task, in the specified list and with an optional parent task.

- **Update Task**

  - Method: PUT
  - Endpoint: `/api/task/<int:task_id>`
  - Description: Update a task's title or status.

- **Move Task**

  - Method: PUT
  - Endpoint: `/api/task/<int:task_id>/move/<int:new_list_id>`
  - Description: Move a task from one list to another list.

- **Delete Task**
  - Method: DELETE
  - Endpoint: `/api/task/<int:task_id>`
  - Description: Delete a task and all associated subtasks.

>
