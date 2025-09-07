import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';
import '../style/Layout.css'; // 引入我們將要建立的佈局樣式

export default function Layout() {
    return (
        <div className="site-container">
            <NavBar />
            <main className="main-content">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}