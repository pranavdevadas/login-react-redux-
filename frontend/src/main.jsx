import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, createRoutesFromElements,Route,RouterProvider} from 'react-router-dom'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import PrivateRoute from './components/PrivateRoute.jsx'
import AdminPrivateRoute from './components/adminComponents/AdminPrivateRoute.jsx'
import HomeScreen from './screens/HomeScreen.jsx'
import LoginScreen from './screens/LoginScreen.jsx'
import RegisterScreen from './screens/RegisterScreen.jsx'
import ProfileScreen from './screens/ProfileScreen.jsx'
import AdminHomeScreen from './screens/adminScreens/AdminHomeScreen.jsx'
import AdminLoginScreen from './screens/adminScreens/AdminLoginScreen.jsx'
import { UserManagementScreen } from './screens/adminScreens/UserManagementScreen.jsx'
import store from './store.js'
import {Provider} from 'react-redux'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App></App>}>
      <Route index path="/" element={<HomeScreen></HomeScreen>}></Route>
      <Route
        path="/login"
        element={<LoginScreen></LoginScreen>}
      ></Route>
      <Route
        path="/register"
        element={<RegisterScreen></RegisterScreen>}
      ></Route>

      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<ProfileScreen />} />
      </Route>
    

      {/* **************admin*************************** */}

      <Route path="/admin" element={<AdminPrivateRoute />}>
        <Route index element={<AdminHomeScreen />} />
        <Route path="get-user" element={<UserManagementScreen />} />
      </Route>
      <Route path="/admin/login" element={<AdminLoginScreen />} />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <React.StrictMode>
   <RouterProvider router = {router}/>
  </React.StrictMode>
  </Provider>
)
