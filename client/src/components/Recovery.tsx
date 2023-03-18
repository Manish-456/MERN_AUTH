import styles from "../style/username.module.css";

import { toast, Toaster } from "react-hot-toast";
import { useAuthStore } from "../store/store";
import { FormEvent, useEffect, useState } from "react";
import { generateOTP, verifyOTP, Data } from "../Helper/helper";
import { useNavigate } from "react-router-dom";

const Recovery = () => {
  const username = useAuthStore((state) => state.auth.username);
  const navigate = useNavigate();
  const [OTP, setOTP] = useState<number>();
  useEffect(() => {
   if(username){
     const sendPromise =  generateOTP(username);
     toast.promise(sendPromise, {
       loading : "Sending...",
       success : <b>OTP has been sent to your email.</b>,
       error : <b>Could not send it!</b>
     })
   }else{
    toast.error("Could not send OTP")
   }
  }, [username]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (username && OTP) {
      try {
        const data = await verifyOTP({ username, code: OTP } as Data["data"]);
        if ("error" in data) {
          toast.error("Can't verify OTP!");
        } else {
          const { status } = data;
          if (status === 200) {
            toast.success("Verify Successfully!");
            navigate("/reset");
          } 
        }
      } catch (error) {
        toast.error("Wrong OTP! Check email again");
      }
    }
  };

  const resendOTP =  () => {
    if(username){
      const sendPromise =  generateOTP(username);
      toast.promise(sendPromise, {
        loading : "Sending...",
        success : <b>OTP has been sent to your email.</b>,
        error : <b>Could not send it!</b>
      })
    }else{
      toast.error("Couldn't Send OTP")
    }

  }
  return (
    <main className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center  items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col  items-center">
            <h4 className="text-5xl font-bold">Recovery</h4>
            <span className="py-4 text-xl text-center w-2/3 text-gray-500">
              Enter OTP to recover recovery
            </span>
          </div>
          <form className="pt-20" onSubmit={handleSubmit}>
            <div className={` flex flex-col items-center gap-6`}>
              <div className="input text-center">
                <span className="py-4 text-sm text-left text-gray-500">
                  Enter 6 digit OTP sent to your email address
                </span>
              </div>

              <input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setOTP(parseInt(e.target.value))
                }
                type="text"
                className={styles.textbox}
                placeholder="Please enter 6 digits OTP"
              />
              <button
                className={`${styles.btn} bg-indigo-500 hover:bg-[#ff6a6a]`}
                type="submit"
              >
               Recover
              </button>
            </div>
            <div className="text-center py-4">
              <span className="text-gray-500">
                Didn't get OTP ?{" "}
                <button onClick={resendOTP} className="text-red-500 font-semibold outline-none border-none">Resend</button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Recovery;
