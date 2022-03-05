import Header from './Static/Header';
import Footer from './Static/Footer';
import NotFoundPage from './Static/NotFoundPage';
import LeagueList from './Leagues/LeagueList';
import LeagueDetail from './Leagues/LeagueDetail';
import TeamList from './Teams/TeamList';
import TeamDetail from './Teams/TeamDetail';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import './App.css';
import './common.css';

function App() {
  return (
    <div id="AppRoot">
      <Router>
        <Header/>
          <Routes>
            <Route path="/" element={<Navigate to="/leagues"/>}/>
            <Route path="/leagues" element={<LeagueList/>}/>
            <Route path="/leagues/show/:leagueID" element={<LeagueDetail />}/>
            <Route path="/teams" element={<TeamList/>}/>
            <Route path="/teams/show/:teamID" element={<TeamDetail />}/>
            <Route path="*" element={<NotFoundPage/>}/>
          </Routes>
          <Footer/>
      </Router>
    </div>
  );
}

export default App;
