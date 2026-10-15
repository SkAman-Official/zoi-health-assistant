const RightOverlayContent = ({
  isAnimated,
  setIsAnimated
}) => {
  return <div className="text-center text-white p-8">
    <h1 className="text-4xl font-bold mb-4">Don’t have an account?</h1>
    <p>Start your journey in one click</p>
    <button className="mt-6 py-2 px-4 border border-white rounded-full hover:bg-white hover:text-indigo-600 transition" onClick={() => setIsAnimated(true)}>
      Sign Up
    </button>
  </div>;
};
export default RightOverlayContent;
