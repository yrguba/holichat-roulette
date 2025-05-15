import Cookies from "universal-cookie";
import { useLayoutEffect, useState } from "react";
import { v4 } from "uuid";

const cookies = new Cookies();

export const saveTokenToCookie = (token: string) => {
  cookies.set("token", token, {
    path: "/",
    domain: window.location.hostname,
  });
};

export const _getUuid = () => {
  const currentUuid = cookies.get("hc_uuid");

  if (!currentUuid) {
    const newUuid = v4();
    cookies.set("hc_uuid", newUuid);

    return newUuid;
  }

  return currentUuid;
};

export const _getToken = () => {
  return cookies.get("token");
};

export const _isAuthenticated = () => {
  return true;
  //return cookies.get("token");
};

export const signOut = () => {
  cookies.remove("token", {
    path: "/",
    domain: window.location.hostname,
  });
  window.location.reload();
};

export function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
}

export const formatNumber = (num: number) => {
  let result: string[] = [];
  const chars = num.toString().split("").reverse();

  chars.forEach((char, index) => {
    if (index !== 0 && index % 2 === 0) {
      result.push(` ${char}`);
    } else {
      result.push(char);
    }
  });

  return result.reverse().join("");
};
