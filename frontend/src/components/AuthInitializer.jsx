import useAuthInit from "@hooks/useAuthInit";

// Component to initialize authentication on any page
const AuthInitializer = () => {
    useAuthInit();
    return null; // This component doesn't render anything
};

export default AuthInitializer; 