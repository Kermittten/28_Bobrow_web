import "./Loading.css";

const Loading = ({ fullScreen = true, size = "medium" }) => {
  const sizeClasses = {
    small: "loading-spinner small",
    medium: "loading-spinner medium",
    large: "loading-spinner large"
  };

  return (
    <div className={`loading-container ${fullScreen ? "full-screen" : ""}`}>
      <div className={sizeClasses[size] || sizeClasses.medium}>
        <div className="loading-spinner-inner"></div>
      </div>
      <div className="loading-text">Loading...</div>
    </div>
  );
};

export default Loading;