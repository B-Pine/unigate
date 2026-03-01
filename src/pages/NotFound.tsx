import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { PublicLayout } from "@/components/PublicLayout";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <PublicLayout>
      <div className="uni-page-header">
        <div className="uni-container">
          <h1>Page Not Found</h1>
        </div>
      </div>
      <div className="uni-page-content">
        <div className="uni-container">
          <div className="uni-empty-state">
            <div className="uni-empty-state-code">404</div>
            <p>The page you are looking for does not exist or has been moved.</p>
            <Link to="/" className="uni-btn-primary">
              <Home size={14} />
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default NotFound;
