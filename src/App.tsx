function App() {
  return (
    <div className="flex items-center justify-center bg-radial-gradient w-screen h-screen">
      <form className="flex flex-col w-[26rem]">
        <div className="flex flex-col gap-y-5">
          <div className="flex flex-col gap-y-1 items-center">
            <h1 className="text-2xl text-white font-medium font-rubik">Login to existing account</h1>
            <p className="text-base text-white font-normal font-rubik">Enter your email to login for this app</p>
          </div>

          <div className="flex flex-col gap-y-3 ">
            <input
              className="bg-[#202020] border-[#895FF5] border-2 p-2 text-xl text-[#828282] font-normal font-rubik rounded-lg"
              type="email"
              id="email"
              placeholder="you@gmail.com"
              required
            />

            <input
              className="bg-[#202020] border-[#895FF5] border-2 p-2 text-xl text-[#828282] font-normal font-rubik rounded-lg"
              type="password"
              id="password"
              placeholder="********"
              required
            />
          </div>
        </div>

        <div className="flex flex-col">
          <input
            className="-mt-2 btn bg-[#895FF5] py-2 mb-6 text-base text-white font-medium rounded-lg"
            type="submit"
            value="Login with email"
          />

          <div className="flex gap-x-2 items-center justify-center">
            <div className="border-[0.1px] border-[#E6E6E6] w-1/3" />
            <p className="text-base text-white font-normal">or continue with</p>
            <div className="border-[0.1px] border-[#E6E6E6] w-1/3" />
          </div>

          <button type="button" className="btn bg-[#4B4B4B] py-2 mt-6 rounded-lg">
            <span className="text-base text-white font-medium font-rubik">Create an account</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
