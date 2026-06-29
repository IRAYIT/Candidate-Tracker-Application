import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
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
import ApplicationPage from './pages/ApplicationPage';
import AppliedCandidates from './AppliedCandidates';
import CandidateView from './CandidateView';
import TrackApplication from "./pages/Track/TrackApplication";
import SetNewPassword from './Setnewpassword';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/manageresources' element={<ManageResources />} />
        <Route path='/forgotpassword' element={<Forgotpassword />} />
        <Route path='/header' element={<Header />} />
        <Route path='/resource_view' element={<Resource_view />} />
        <Route path='/resource_edit' element={<Resource_edit />} />
        <Route path='/current_openings' element={<Current_openings />} />
        <Route path='/manageprojects' element={<ManageProjects />} />
        <Route path='/view_project' element={<View_project />} />
        <Route path='/edit_project' element={<Edit_project />} />
        <Route path='/addproject' element={<Addproject />} />
        <Route path='/addopening' element={<Addopening />} />
        <Route path='/addresource' element={<Addresource />} />
        <Route path='/view_opening' element={<View_opening />} />
        <Route path='/edit_opening' element={<Edit_opening />} />
        <Route path='/myprofile' element={<MyProfile />} />
        <Route path='/editprofile' element={<EditProfile />} />
        <Route path='/sendemail' element={<SendEmail />} />
        <Route path='/emailall' element={<EmailAll />} />
        <Route path='/attachments' element={<Attachments />} />

        {/* Public job application routes — both paths supported */}
        <Route path='/apply/:publicUrlKey' element={<ApplicationPage />} />
        <Route path='/jobs/apply/:publicUrlKey' element={<ApplicationPage />} />

        <Route path="/candidate-view" element={<CandidateView />} />
        <Route path="/applied-candidates" element={<AppliedCandidates />} />
        <Route path="/track" element={<TrackApplication />} />
        <Route path='/setnewpassword' element={<SetNewPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;