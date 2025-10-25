import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';
import DraggableAIContainer from './AIAssistant/DraggableAIContainer';
import '../style/Layout.css'; // 引入我們將要建立的佈局樣式

export default function Layout() {
    return (
        <div className="site-container">
            <DraggableAIContainer />
            <NavBar />
            <main className="main-content">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}