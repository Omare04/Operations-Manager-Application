import axios from "axios";
import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";

const fetchJWT = () => {
  axios
    .get("http://localhost:3331/users/getJWT")
    .then((result) => {
      return result.data.JWT;
    })
    .catch((e) => {
      throw new e();
    });
};

export const CheckLogin = () => {
  const [loading, setLoading] = useState(false);

  return {
    loadingState: loading,
    promise: new Promise((resolve, reject) => {
      setLoading(true);
      axios
        .get("http://localhost:3331/users/login", { withCredentials: true })
        .then((res) => {
          if (res.data.loggedIn) {
            setLoading(false);
            resolve({ user: res.data.user[0], loggedIn: true });
          } else {
            setLoading(false);
            resolve({ loggedIn: false });
          }
        })
        .catch((err) => {
          reject(err);
        });
    }),
  };
};

export const useAuthWrapper = () => {
  const [users, setUsers] = useState({});

  const nav = useNavigate();

  //ok the problem is the state is being set here and not even returned.
  //Must find a way to transfer state globally
  const Login = ({ email, pass }) => {
    axios.defaults.withCredentials = true;
    axios
      .post("http://localhost:3331/users/login", {
        email: email,
        password: pass,
      })
      .then((res) => {
        //This returns the boolean from the backend which is the object sent from the backend.
        if (res.data.loggedIn) {
          console.log(res.data.message);
          nav("/");
        } else {
          return "error message";
        }
      })
      .catch((e) => {})
      .finally(() => {
        //this will terminate the loading page of the page or the button when the request has been received.
        //you can set a state in context to false here to terminate the loading.
      });
  };

  //must navigate to the sign in page if there is no session that is set.
  const CheckLogin = () => {
    return new Promise((resolve, reject) => {
      axios
        .get("http://localhost:3331/users/login", { withCredentials: true })
        .then((res) => {
          if (res.data.loggedIn) {
            resolve({ user: res.data.user[0], loggedIn: true });
          } else {
            resolve({ loggedIn: false });
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  //This function is only fired when the user chooses to logout, so it must be associated with an onClick function
  const Logout = () => {
    // dispatch the "false" action to update the state
  };

  return { CheckLogin, Login, Logout, users };
};
