const VoiceRecorder = () => {
    const [isRecording, setIsRecording] = React.useState(false);
    const [audioBlob, setAudioBlob] = React.useState(null);
    const [transcription, setTranscription] = React.useState('');
    const [response, setResponse] = React.useState('');
    const [error, setError] = React.useState('');
    const mediaRecorder = React.useRef(null);
    const audioChunks = React.useRef([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            audioChunks.current = [];

            mediaRecorder.current.ondataavailable = (event) => {
                audioChunks.current.push(event.data);
            };

            mediaRecorder.current.onstop = () => {
                const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
                setAudioBlob(audioBlob);
            };

            mediaRecorder.current.start();
            setIsRecording(true);
            setError('');
        } catch (err) {
            setError('Error accessing microphone. Please ensure you have granted microphone permissions.');
            console.error('Error accessing microphone:', err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current && isRecording) {
            mediaRecorder.current.stop();
            setIsRecording(false);
            mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold mb-4">Voice Search AI</h1>
                
                <div className="space-y-4">
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={startRecording}
                            disabled={isRecording}
                            className={`px-4 py-2 rounded ${
                                isRecording ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }`}
                        >
                            {isRecording ? 'Recording...' : 'Start Recording'}
                        </button>
                        
                        <button
                            onClick={stopRecording}
                            disabled={!isRecording}
                            className={`px-4 py-2 rounded ${
                                !isRecording ? 'bg-gray-300' : 'bg-red-500 hover:bg-red-600 text-white'
                            }`}
                        >
                            Stop Recording
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    {audioBlob && (
                        <div className="mt-4">
                            <audio
                                src={URL.createObjectURL(audioBlob)}
                                controls
                                className="w-full"
                            />
                        </div>
                    )}

                    {transcription && (
                        <div className="mt-4">
                            <h3 className="font-semibold">Transcription:</h3>
                            <p className="mt-2 p-2 bg-gray-100 rounded">{transcription}</p>
                        </div>
                    )}

                    {response && (
                        <div className="mt-4">
                            <h3 className="font-semibold">AI Response:</h3>
                            <p className="mt-2 p-2 bg-blue-50 rounded">{response}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

ReactDOM.render(<VoiceRecorder />, document.getElementById('root'));
