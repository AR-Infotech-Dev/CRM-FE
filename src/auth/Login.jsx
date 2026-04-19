import LoginForm from "../auth/LoginForm";

const Login = () => {

  const slides = [
    { image: "/img1.png", title: "Welcome", description: "CRM System" },
  ];

  return (
    // <div className="flex flex-col md:flex-row h-screen" style={{ "background-image": "url(/images/auth-bg.jpeg)", "background-Position": 'center' }}>
    <div className="flex flex-col md:flex-row h-screen">
      <div className="hidden md:flex md:w-[42%] items-center justify-center p-10 bg-brand-primary text-white">
        {/* <LoginCarousel slideList={slides} /> */}
      </div>
      <div className="w-full md:w-[58%] flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="align-center flex item-center justify-center mb-3">
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Sign in to your account to continue.
          </p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;


