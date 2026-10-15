const DoctorLeftOverlayContent = ({
  isAnimated,
  setIsAnimated
}) => {
  return <div className="text-center text-white p-8">
    <h1 className="text-4xl font-bold mb-4">Welcome Back, Doctor!</h1>
    <p className="mb-8">Access your medical dashboard here!</p>
    <button className="py-2 px-6 border-2 border-white rounded-full hover:bg-white hover:text-teal-700 transition-colors" onClick={() => setIsAnimated(!isAnimated)}>
      Doctor Log In!
    </button>
  </div>;
};
export default DoctorLeftOverlayContent;
