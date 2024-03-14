API_ENDPOINT = "/api"

### AUTH ENDPOINTS
AUTH_ENDPOINT = API_ENDPOINT + "/auth"
LOGIN_ENDPOINT = "/login"
LOGOUT_ENDPOINT = "/logout"
REGISTER_ENDPOINT = "/register"

### LISTS ENDPOINTS (Prepend with LISTS_ENDPOINT)
LISTS_ENDPOINT = API_ENDPOINT + "/list"

GET_ALL_LISTS_ENDPOINT = ""

CREATE_LIST_ENDPOINT = ""
DELETE_LIST_ENDPOINT = "/<int:list_id>"
EDIT_LIST_ENDPOINT = "/<int:list_id>"

GET_TASKS_ENDPOINT = "/<int:list_id>/task"

### TASKS ENDPOINTS
TASKS_ENDPOINT = API_ENDPOINT + "/task"

CREATE_TASK_ENDPOINT = "/add/<int:list_id>"
EDIT_TASK_ENDPOINT = "/<int:task_id>"
DELETE_TASK_ENDPOINT = "/<int:task_id>"

TASK_MOVE_LIST_ENDPOINT = "/<int:task_id>/move/<int:new_list_id>"

GET_SUBTASKS_ENDPOINT = "/<int:task_id>/subtasks"
