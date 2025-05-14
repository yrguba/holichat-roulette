import React, { createContext, useEffect, useState } from "react";
//@ts-ignore
import { io } from "socket.io-client";

import { SOCKET_URL } from "constants/api";
//import { _isAuthenticated } from "service";

export const socket = io(SOCKET_URL, {
  // extraHeaders: {
  //   Authorization: `Bearer ${_isAuthenticated()}`,
  // },
  forceNew: true,
});

const Ctx = createContext<any>({});
const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("error", () => {
      //
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <Ctx.Provider
      value={{
        socket,
        isConnected,
      }}
    >
      {children}
    </Ctx.Provider>
  );
};

export default SocketProvider;

export const useSocket = () => {
  return React.useContext(Ctx);
};
