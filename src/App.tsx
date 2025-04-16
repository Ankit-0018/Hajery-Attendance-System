
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';

import Employee from './pages/dashboard/Employee';




function App() {
  return (

<Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/Edashboard" element={<Employee />} />
       
      </Routes>
    </Router>

    
  );
}

export default App;
