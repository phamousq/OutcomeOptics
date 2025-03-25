<script lang="ts">
    import { AssemblyAI } from 'assemblyai';
    import { GoogleGenerativeAI } from '@google/generative-ai';
  
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
        const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `Summerize the following transcript: ${transcriptionText}`;

        const result = await model.generateContent(prompt);
        geminiResponse = result.response.text();
    }
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

        

        <h1 class="text-2xl underline">Transcription</h1>
        <button onclick={transcribeAudio} disabled={loading}>
        {loading ? 'Transcribing...' : 'Transcribe Button'}
        </button>
    
        {#if error}
        <p style="color: red;">Error: {error}</p>
        {/if}
    
        <!-- {#if transcriptionText}
            <p>{transcriptionText}</p>
        {/if} -->
    
        {#if speakerUtterances.length}
            <ul>
                {#each speakerUtterances as utterance}
                <li>{utterance}</li>
                {/each}
            </ul>
        {:else}
            <p>No transcript found.</p>
        {/if}
    </div>
    <dir>
        <h1 class="text-2xl underline">Gemini</h1>
        <button onclick={generateGeminiResponse}>Generate Gemini Response</button>
        {#if !geminiResponse.length}
            <p>No response generated yet.</p>
        {:else}
            <p>{geminiResponse}</p>
        {/if}
    </dir>
</main>

<style>

</style>