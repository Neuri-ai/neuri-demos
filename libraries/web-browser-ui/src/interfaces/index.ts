export {};

declare global {
    interface Window {
        localStream: any;
        localAudio: any;
        webkitSpeechRecognition: any;
        SpeechRecognition: any;
    }
}