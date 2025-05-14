import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Spin } from "antd";
import "./styles.less";
import { JitsiMeeting } from "@jitsi/react-sdk";

import { useSocket } from "socket";

export const CONFERENCE_CONFIG_OVERWRITE = {
  startWithAudioMuted: true,
  startWithVideoMuted: true,
  disableModeratorIndicator: true,
  startScreenSharing: false,
  enableEmailInStats: false,
  toolbarButtons: ["camera", "microphone", "hangup", "tileview"],
  toolbarConfig: {
    alwaysVisible: window.innerWidth <= 1024,
  },
};

export const INTERFACE_CONFIG_OVERWRITE = {
  DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
};

export const CONFERENCE_CONFIG_TOOLBAR_BUTTONS = ["microphone"];

export const getIframeRef = (parentNode: HTMLDivElement) => {
  let vh = window.innerHeight * 0.01;
  // document.documentElement.style.setProperty("--vh", `${vh}px`);
  // parentNode.style.height = "calc(var(--vh, 1vh) * 100 - 65px)";
  //parentNode.style.height = "calc(100vh - 65px)";
  parentNode.style.width = "100%";
  //parentNode.style.height = "height: calc(100% - 400px)";
  //parentNode.style.height = "600px";
};

const Main = () => {
  const { socket, isConnected } = useSocket();
  const [roomUuid, setRoomUuid] = useState<string | null>(null);
  const [isWaitingParticipant, setIsWaitingParticipant] = useState(false);
  const [name, setName] = useState<string>("");

  console.log(socket);
  const handleStart = () => {
    setIsWaitingParticipant(true);
    console.log(isConnected);
    socket.emit("createConnection", { uuid: "test_uuid" });
  };

  return (
    <div className="main-container">
      <div className="main-container__video">
        {roomUuid ? (
          <JitsiMeeting
            domain={"video.confee.ru"}
            roomName={"123"}
            configOverwrite={{
              ...CONFERENCE_CONFIG_OVERWRITE,
              toolbarButtons: CONFERENCE_CONFIG_TOOLBAR_BUTTONS,
            }}
            interfaceConfigOverwrite={INTERFACE_CONFIG_OVERWRITE}
            userInfo={{ displayName: name, email: "" }}
            onApiReady={(externalApi: any) => {
              //apiRef.current = externalApi;
              //externalApi.executeCommand("avatarUrl", getAvatarUrl());
              // externalApi.addListener("readyToClose", (event) => {
              //   setConferenceFeedback();
              //   //onGoBack(false);
              //   const participantsCount = externalApi.getNumberOfParticipants();
              //
              //   if (participantsCount === 0) {
              //     deleteConferenceQuests && deleteConferenceQuests();
              //   }
              // });
              //
              // audioInput &&
              // externalApi.setAudioInputDevice(
              //   audioInput.label,
              //   audioInput.deviceId
              // );
              // audioOutput &&
              // externalApi.setAudioOutputDevice(
              //   audioOutput.label,
              //   audioOutput.deviceId
              // );
              // videoInput &&
              // externalApi.setVideoInputDevice(
              //   videoInput.label,
              //   videoInput.deviceId
              // );
              externalApi.addListener(
                "participantJoined",
                (participant: any) => {
                  console.log("participantJoined");
                }
              );
              externalApi.addListener("participantLeft", (participant: any) => {
                console.log("participantLeft");
                // const participants = externalApi.getParticipantsInfo();
                // const botIndex = participants.findIndex(
                //   (participant: any) =>
                //     participant.displayName === BOT_RECORD_DISPLAY_NAME
                // );
                //
                // if (botIndex === -1) {
                //   setRecording && setRecording(false);
                // }
              });
            }}
            getIFrameRef={getIframeRef}
          />
        ) : (
          <div className="waiting-block">
            {isWaitingParticipant ? (
              <div className="waiting-block__content">
                <Spin />
                <span>Ожидаем собеседника</span>
              </div>
            ) : (
              <div className="waiting-block__content">
                <Input
                  placeholder="Ваше имя"
                  size="large"
                  onChange={(e) => setName(e.target.value)}
                />
                <Button
                  size="large"
                  type="primary"
                  className="main-container__start-button"
                  disabled={!name}
                  onClick={handleStart}
                >
                  Начать
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      <div>
        <Button
          size="large"
          type="primary"
          className="main-container__next-button"
        >
          Следующий
        </Button>
      </div>
    </div>
  );
};

export default Main;
