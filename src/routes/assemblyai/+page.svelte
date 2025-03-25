<script lang="ts">
    import { AssemblyAI } from 'assemblyai';
  
    let transcriptionText: string = '';
    let speakerUtterances: string[] = [];
    let loading: boolean = false;
    let error: string | null = null;
    let audioUrl: string = '';
    let audioFile: File | null = null;
    let audioSrc: string | null = null;
    let geminiResponse: string = '';

    function handleFileChange(event: Event) {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files[0]) {
        audioFile = input.files[0];
        audioSrc = URL.createObjectURL(audioFile);
      }
    }
  
    async function transcribeAudio() {
      loading = true;
      error = null;
      transcriptionText = '';
      speakerUtterances = [];
  
      try {
        if (!import.meta.env.VITE_ASSEMBLYAI_API_KEY) {
          throw new Error('AssemblyAI API key not provided in .env');
        }
  
        const client = new AssemblyAI({
          apiKey: import.meta.env.VITE_ASSEMBLYAI_API_KEY,
        });
  
        let audioSource: string;
  
        if (audioFile) {
          audioSource = audioFile; // Use local file if available
        } else if (audioUrl) {
          audioSource = audioUrl; // Use URL if provided
        } else {
          throw new Error('Please provide an audio file or URL.');
        }
  
        const data = {
          audio: audioSource,
          speaker_labels: true,
        };
  
        const transcript = await client.transcripts.transcribe(data);
        transcriptionText = transcript.text || '';
  
        if (transcript.utterances) {
          speakerUtterances = transcript.utterances.map(
            (utterance) => `Speaker ${utterance.speaker}: ${utterance.text}`
          );
        }
      } catch (e) {
        if (e instanceof Error) {
          error = e.message;
        } else {
          error = 'An unknown error occurred.';
        }
      } finally {
        loading = false;
      }
    }
    
    async function generateGeminiResponse() {
    
</script>
  
<main>
    <div>
        <h1 class="text-2xl underline">Upload</h1>
        <label for="audioFile">Upload Audio File:</label>
        <input type="file" id="audioFile" accept="audio/*" onchange={handleFileChange} />

        {#if audioSrc}
            <audio src={audioSrc} controls></audio>
        {/if}
    </div>

    <div>
        <!-- <label for="audioUrl">Or Enter Audio URL:</label>
        <input type="text" id="audioUrl" bind:value={audioUrl} /> -->

        <button onclick={transcribeAudio} disabled={loading}>
        {loading ? 'Transcribing...' : 'Transcribe Button'}
        </button>
    
        {#if error}
        <p style="color: red;">Error: {error}</p>
        {/if}

        <h1 class="text-2xl underline">Transcription</h1>
    
        <!-- {#if transcriptionText}
            <p>{transcriptionText}</p>
        {/if} -->
    
        {#if speakerUtterances.length}
            <h2>Speakers:</h2>
            <ul>
                {#each speakerUtterances as utterance}
                <li>{utterance}</li>
                {/each}
            </ul>
        {/if}
    </div>
    <dir>
        <h1 class="text-2xl underline">Gemini</h1>
        {#if geminiResponse.length}
            <p>{geminiResponse}</p>
        {/if}
    </dir>
</main>