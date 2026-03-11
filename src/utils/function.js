export const callbacks = {
    onTranscription: (transcription) => {
        // console.log("Transcription received:", transcription.message);
    },
    onAgentConnectionState: (connectionState) => {
        console.log("Agent connection state:", connectionState);
    },
    onError: (error) => {
        console.error("Error occurred:", error);
    },
    onRoomStatus: (status) => {
        if (status?.callDuration) {
            console.log("Call Duration in seconds:", status.callDuration);
        }
        console.log("Room status:", status);
    },
    onHumanAgentStatus: (status) => {
        console.log("Human agent status:", status);
    },
    onCancelBtnTrigger: (status) => {
        console.log("Human agent Status", status);
    }
}

export const getSdkOptions = () => {
    return {
        formEnable: false,
        transcriptionEnable: true,
        transcriptionInUi: true,
        endUi: true,
        agent_name: "68db8fea7a5b5621a363e118", // custom key, will be ignored unless used manually
        title: "Healthcare Agent",
        callbacks: callbacks,
        agentConnectionTimeout: 500,
        chatEnable: false,
        triggerStartCall: false,
        theme: "dark",
    };
};