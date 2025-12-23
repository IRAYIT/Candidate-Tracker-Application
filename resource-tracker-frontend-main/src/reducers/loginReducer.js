export default function loginReducer(state = {
  currentManagerId:51,
    isLoggedIn:false,
  login_response: {},
  isFirstLoggedIn:false
}, action) {

  switch (action.type) {
    case "SAVE_USER_DETAILS_ON_LOGIN":
      {
        return {
          ...state,
          login_response: action.json
        }
      }
      break;
      case "UPDATE_MANAGER_ID":
      {
        return {
          ...state,
          currentManagerId: action.value
        }
      }
      break;
      case "SAVE_IS_LOGGED_IN":
        {
          return {
            ...state,
            isLoggedIn: action.value
          }
        }

        case "SAVE_FIRST_LOGGED_IN":
          {
            return {
              ...state,
              isFirstLoggedIn: action.value
            }
          }
  }
  return state
}
