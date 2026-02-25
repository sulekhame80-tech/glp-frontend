import React, { Suspense ,useEffect,useState, useContext} from 'react';
import { BrowserRouter as Router, Route, Routes,useLocation, Navigate } from 'react-router-dom';
//import Content from './components/sections/prebuilt-pages/default-login/Content';
import Content from './components/sections/prebuilt-pages/default-login/loginold';
import Sidebar from './components/layouts/Sidenav';
import Topbar from './components/layouts/Topbar';
import Attendance from "./components/pages/attendance/Attendance";
import { UserContext } from "./UserContext";

import UserTable from './components/pages/users/Usertable';
import RegisterUser from './components/pages/users/RegisterUser';
import HospitalDetail from './components/sections/hospitalmatser/HospitalDetails';
import OrderStatus from './components/sections/order/order-status/OrderStatus';
import ProfilePage from './components/pages/users/profilepage';
import { UserProvider } from "./UserContext";
import Layout from './Layout';
import LabReceiptSubmit from './components/sections/order/order-status/Bill';
import Report from './components/sections/order/order-status/Orderreport';
import MasterPage from './components/sections/mastertables/MasterPage';
import SpecimenType from './components/sections/mastertables/specifimen_type';
import MonthlyInvoice from './components/sections/invoice/invoice/monthlyinvoice';
import PatientProfile from './components/sections/Routine/PatientProfile';

import RoutineProfile from './components/sections/Routine/routineForm';

const Preloader = React.lazy(() => import("./components/layouts/Preloader"));

const Home = React.lazy(() => import("./components/pages/Home"));
const Webanalytics = React.lazy(() => import("./components/pages/dashboard/Webanalytics"));
const Socialmedia = React.lazy(() => import("./components/pages/dashboard/Socialmedia"));
const Projectmanagement = React.lazy(() => import("./components/pages/dashboard/Projectmanagement"));
const Clientmanagement = React.lazy(() => import("./components/pages/dashboard/Clientmanagement"));

// Order Page
const OrderReg = React.lazy(() => import("./components/pages/order/OrderReg"));

const TestPage = React.lazy(() => import("./components/pages/test/TestPage"));
const Reviews = React.lazy(() => import("./components/pages/test/Reviews"));
// Invoice
const Invoice = React.lazy(() => import("./components/pages/invoice/Invoice"));
const Invoicelist = React.lazy(() => import("./components/pages/invoice/Invoicelist"));

const AddHospital = React.lazy(() => import("./components/pages/AddHospital"));

// Pricing
const Pricing = React.lazy(() => import("./components/pages/Pricing"));

// Shipment
const Shipment = React.lazy(() => import("./components/pages/Shipment"));

// Widgets
const Widgets = React.lazy(() => import("./components/pages/Widgets"));

// Prebuilt Pages
const Defaultlogin = React.lazy(() => import("./components/pages/prebuilt-pages/Defaultlogin"));
const Modallogin = React.lazy(() => import("./components/pages/prebuilt-pages/Modallogin"));
const Defaultregister = React.lazy(() => import("./components/pages/prebuilt-pages/Defaultregister"));
const Modalregister = React.lazy(() => import("./components/pages/prebuilt-pages/Modalregister"));
const Lockscreen = React.lazy(() => import("./components/pages/prebuilt-pages/Lockscreen"));
const Comingsoon = React.lazy(() => import("./components/pages/prebuilt-pages/Comingsoon"));
const Error = React.lazy(() => import("./components/pages/prebuilt-pages/Error"));
const Faq = React.lazy(() => import("./components/pages/prebuilt-pages/Faq"));
const Portfolio = React.lazy(() => import("./components/pages/prebuilt-pages/Portfolio"));
const Userprofile = React.lazy(() => import("./components/pages/prebuilt-pages/Userprofile"));
const Pageinvoice = React.lazy(() => import("./components/pages/prebuilt-pages/Invoice"));

// Apps
const Chat = React.lazy(() => import("./components/pages/apps/Chat"));
const Email = React.lazy(() => import("./components/pages/apps/Email"));
const Todolist = React.lazy(() => import("./components/pages/apps/Todolist"));

function App() {
  const { isAuthenticated, loading } = useContext(UserContext);
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  // If not authenticated and not on login page, redirect to login
  if (!isAuthenticated && location.pathname !== '/' && location.pathname !== '/login') {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Preloader />
         
        <Layout >
        <Routes>
        
          {/* Dashboard */}
           <Route path="/" element={<Content
               
              />} />
          <Route
            path="/login"
            element={
              <Content
               
              />
            }
          />
          {/*}
         <Route path="/" element={<Home />} />*/}
          <Route path="/dashboard/web-analytics" element={<Webanalytics />} />
          <Route path="/dashboard/social-media" element={<Socialmedia />} />
          <Route path="/dashboard/project-management" element={<Projectmanagement />} />
          <Route path="/dashboard/client-management" element={<Clientmanagement />} />
<Route path="/hospital/detail/:id" element={<HospitalDetail />} />
<Route path="/attendance" element={<Attendance />} />

          {/* Order Page */}
          <Route path="/order/order-status" element={<OrderStatus  />} />
 <Route path="/order/order-reg" element={<OrderReg  />} />
        <Route path="/order/order-status" element={<OrderStatus  />} />
  <Route path="/bills/" element={<LabReceiptSubmit  />} />
         {/* Order Page */}
          <Route path="/order/order-report/" element={<Report  />} />
 
          {/* Product Page */}

          <Route path="/RegisterUser/" element={<RegisterUser  />} />
          <Route path="/Usertable/" element={<UserTable  />} />
          <Route path="/profile" element={< ProfilePage/>} />
         
          {/* Customer Page */}
          <Route path="/test/master/" element={<TestPage />} />
              <Route path="/settings/account-settings" element={<MasterPage />} />
      
          <Route path="/customer/reviews" element={<Reviews />} />

          {/* Invoice */}
          <Route path="/invoice/invoice" element={<Invoice />} />
              <Route path="/invoice-monthly" element={<MonthlyInvoice />} />
      
          
          <Route path="/invoice/invoice-list" element={<Invoicelist />} />

          {/* Add product */}
          <Route path="/add-hospital/" element={<AddHospital />} />

          {/* Pricing */}
          <Route path="/pricing" element={<Pricing />} />

          {/* Shipment */}
          <Route path="/shipment" element={<Shipment />} />

          {/* Widgets */}
          <Route path="/widgets" element={<Widgets />} />

          {/* Prebuilt Pages */}
          <Route path="/prebuilt-pages/default-login" element={<Defaultlogin />} />
          <Route path="/prebuilt-pages/modal-login" element={<Modallogin />} />
          <Route path="/prebuilt-pages/default-register" element={<Defaultregister />} />
          <Route path="/prebuilt-pages/modal-register" element={<Modalregister />} />
          <Route path="/prebuilt-pages/lock-screen" element={<Lockscreen />} />
          <Route path="/prebuilt-pages/coming-soon" element={<Comingsoon />} />
          <Route path="/prebuilt-pages/error" element={<Error />} />
          <Route path="/prebuilt-pages/faq" element={<Faq />} />
          <Route path="/prebuilt-pages/portfolio" element={<Portfolio />} />
          <Route path="/prebuilt-pages/user-profile" element={<Userprofile />} />
          <Route path="/prebuilt-pages/invoice" element={<Pageinvoice />} />
<Route path='/patient-profile' element={<PatientProfile/>} />
<Route path="/routine-status" element={<RoutineProfile />} />
          {/* Apps */}
          <Route path="/apps/chat" element={<Chat />} />
          <Route path="/apps/email" element={<Email />} />
          <Route path="/apps/to-do-list" element={<Todolist />} />
        </Routes>
        
        </Layout>
       
         
      </Suspense>
    </>
  );
}

export default App;
