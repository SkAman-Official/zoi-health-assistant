const LeftOverlayContent = ({
  isAnimated,
  setIsAnimated
}) => {
  return <div className="text-center text-white p-8">
    <h1 className="text-4xl font-bold mb-4">Already have an account?</h1>
    <p>Sign in with your email and password</p>
    <button className="mt-6 py-2 px-4 border border-white rounded-full hover:bg-white hover:text-indigo-600 transition" onClick={() => setIsAnimated(false)}>
      Sign In
    </button>
  </div>;
};
export default LeftOverlayContent;
