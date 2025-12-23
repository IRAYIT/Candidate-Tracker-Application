import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route ,Routes , Link } from 'react-router-dom';
import Login from './Login';
import ManageResources from './ManageResources';
import Forgotpassword from './Forgotpassword';
import Header from './Header';
import Resource_view from './buttonsofMR/Resource_view';
import Resource_edit from './buttonsofMR/Resource_edit';
import Current_openings from './Current_openings';
import ManageProjects from './ManageProjects';
import View_project from './buttonsofMP/View_project';
import Edit_project from './buttonsofMP/Edit_project';
import Addproject from './Addproject';
import Addopening from './Addopening';
import View_opening from './buttonsofCO/View_opening';
import Edit_opening from './buttonsofCO/Edit_opening';
import Addresource from './Addresource';
import MyProfile from './MyProfile';
import EditProfile from './EditProfile';
import SendEmail from './SendEmail';
import EmailAll from './EmailAll';
import Attachments from './Attachments';
function App() {
  return (
    
      <BrowserRouter>
      
      <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/manageresources' element={<ManageResources/>}></Route>
        <Route path='/forgotpassword' element={<Forgotpassword/>}></Route>
        <Route path='/header' element={<Header/>}></Route>
        <Route path='/resource_view' element={<Resource_view/>}></Route>
        <Route path='/resource_edit' element={<Resource_edit/>}></Route>
        <Route path='/current_openings' element={<Current_openings/>}></Route>
        <Route path='/manageprojects' element={<ManageProjects/>}></Route>
        <Route path='/view_project' element={<View_project/>}></Route>
        <Route path='/edit_project' element={<Edit_project/>}></Route>
        <Route path='/addproject' element={<Addproject/>}></Route>
        <Route path='/addopening' element={<Addopening/>}></Route>
        <Route path='/addresource' element={<Addresource/>}></Route>
        <Route path='/view_opening' element={<View_opening/>}></Route>
        <Route path='/edit_opening' element={<Edit_opening/>}></Route>
        <Route path='/myprofile' element={<MyProfile/>}></Route>
        <Route path='/editprofile' element={<EditProfile/>}></Route>
        <Route path='/sendemail' element={<SendEmail/>}></Route>
        <Route path='/emailall' element={<EmailAll/>}></Route>
        <Route path='/attachments' element={<Attachments/>}></Route>
      </Routes>
      </BrowserRouter>
  );
}

export default App;
