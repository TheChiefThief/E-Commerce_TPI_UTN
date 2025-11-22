const Layout = ({ children }) => {
    return (
        <div>
            <main className="app-main-content">{children}</main>
            <footer>
                <p>© 2025 My E-commerce Site. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Layout;