import { DashboardProvider } from './context/DashboardContext';
import Sidebar from './components/Sidebar/Sidebar';
import MainContent from './components/MainContent/MainContent';
import RightPanel from './components/RightPanel/RightPanel';
import './App.css';

function App() {
  return (
    <DashboardProvider>
      <div className="app-container">
        <Sidebar />
        <MainContent />
        <RightPanel />
      </div>
    </DashboardProvider>
  );
}

export default App;
