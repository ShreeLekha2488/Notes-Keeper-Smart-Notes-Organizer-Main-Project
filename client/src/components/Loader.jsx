const Loader = ({
  text = "Loading...",
  fullScreen = false,
  size = "large",
}) => {
  const spinnerSize =
    size === "small"
      ? "h-6 w-6 border-2"
      : "h-12 w-12 border-4";

  const containerClass = fullScreen
    ? "fixed inset-0 bg-white flex items-center justify-center z-50"
    : "flex items-center justify-center py-12";

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center">

        <div
          className={`${spinnerSize} rounded-full border-blue-600 border-t-transparent animate-spin`}
        ></div>

        <p className="mt-4 text-gray-600 font-medium">
          {text}
        </p>

      </div>
    </div>
  );
};

export default Loader;