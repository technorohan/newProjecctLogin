import { combineReducers } from 'redux'
import UploadFile from './uploadFile/uploadFile.reducer'
import user from './slice/user';
const rootReducer = combineReducers({
  UploadFile,
  user,
})

export default rootReducer
