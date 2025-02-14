import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';
import { TaxCount } from "./pages/TaxCount";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/manageProducts" element={<ManageProducts/>} /> */}
        <Route path="taxCount" element={<TaxCount/>}/>
        {/* <Route path="profile" element={<Profile/>}/> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
