import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";
 
function Login() {
   const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const navigate = useNavigate();
 const dispatch=useDispatch()
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    // console.log(formData);

    try {
      setLoading(true);
      const res = await axios.post(
        'http://localhost:8000/api/v1/user/login',
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );  


      if (res.data.success) {
        toast.success(res.data.message);
        localStorage.setItem("accessToken", res.data.accessToken);
        dispatch(setUser(res.data.user));
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-300 to-indigo-300 opacity-10 blur-3xl rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-r from-purple-300 to-pink-300 opacity-10 blur-3xl rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>

        <Card className="w-full shadow-2xl border-2 border-blue-200 hover:border-blue-300 transition-all relative z-10">
          <CardHeader className="space-y-3 bg-gradient-to-br from-blue-50 to-indigo-50 border-b-2 border-blue-100">
            <div className="flex items-center justify-center mb-2">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-full">
                <span className="text-2xl">🔐</span>
              </div>
            </div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent text-center">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-base text-center text-slate-600">
              Login to access exclusive deals and manage your orders
            </CardDescription>
          </CardHeader>

          <form onSubmit={submitHandler}>
            <CardContent className="pt-8">
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email" className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <span className="text-lg">📧</span> Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="h-12 rounded-xl border-2 border-blue-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 text-base transition-all"
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="password" className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <span className="text-lg">🔑</span> Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      className="h-12 rounded-xl border-2 border-blue-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 text-base pr-12 transition-all"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <Link to="#" className="text-sm text-blue-600 hover:text-blue-700 font-semibold text-right hover:underline transition-colors">
                  Forgot password?
                </Link>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-5 pb-8">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl text-white font-bold text-lg rounded-xl transition-all transform hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Logging in...</span>
                  </div>
                ) : (
                  <span>🚀 Login</span>
                )}
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-sm text-gray-500">OR</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              {/* Sign Up Link */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-100 text-center">
                <p className="text-sm text-gray-700">
                  New to EKART?
                  <Link
                    to="/signup"
                    className="font-bold text-blue-600 hover:text-blue-700 ml-1 hover:underline transition-colors"
                  >
                    Create Account
                  </Link>
                </p>
              </div>

              {/* Trust Badge */}
              <div className="text-center text-xs text-gray-500 flex items-center justify-center gap-2">
                <span>🔒 Secure Login</span>
                <span>|</span>
                <span>✅ SSL Encrypted</span>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default Login
