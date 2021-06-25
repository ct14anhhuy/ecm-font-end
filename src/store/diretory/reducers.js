import * as types from "./types";

const initState = {
  data: [],
  loading: false,
  done: false,
  error: ""
};

const directoryReducers = (state = initState, action) => {
  switch (action.type) {
    case types.GET_DIRECTORIES:
      return { ...state, data: action.payload.directories };
    case types.DELETE_DIRECTORY: {
      const deleteIds = action.payload.id;
      const newState = state.data.filter(f => f.id !== deleteIds);
      return { ...state, data: newState };
    }
    case types.BEGIN_UPDATE_DIRECTORY:
      return { ...state, loading: true, done: false, error: "" };
    case types.UPDATE_DIRECTORY_SUCCESS:
      return {
        ...state,
        loading: false,
        done: true,
        error: "",
        data: [...state.data, action.payload.directory]
      };
    case types.UPDATE_DIRECTORY_FAILURE:
      return {
        ...state,
        loading: false,
        done: true,
        error: action.payload.error
      };
    default:
      return state;
  }
};

export default directoryReducers;
