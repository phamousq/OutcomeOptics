<script lang="ts">
    import { AssemblyAI } from 'assemblyai';
  
    let transcriptionText: string|null = null;
    let speakerUtterances: string[] = [];
    let loading: boolean = false;
    let error: string | null = null;
    let fileUrl: string = 'https://assembly.ai/sports_injuries.mp3'; // Default URL, can be changed.
    // alternate audio paths: https://assembly.ai/espn.m4a
  
    async function transcribeAudio() {
      loading = true;
      error = null;
      transcriptionText = '';
      speakerUtterances = [];
  
      try {
        if (!import.meta.env.VITE_ASSEMBLYAI_API_KEY) {
          throw new Error("AssemblyAI API key not provided in .env");
        }
  
        const client = new AssemblyAI({
          apiKey: import.meta.env.VITE_ASSEMBLYAI_API_KEY,
        });
  
        const data = {
          audio: fileUrl,
          speaker_labels: true,
          speech_model: 'nano'
        };
  
        const transcript = await client.transcripts.transcribe(data);
        transcriptionText = transcript.text || null;
  
        if (transcript.utterances) {
          speakerUtterances = transcript.utterances.map(
            (utterance) => `Speaker ${utterance.speaker}: ${utterance.text}`
          );
        }
      } catch (e) {
        if (e instanceof Error) {
          error = e.message;
        } else {
          error = "An unknown error occurred.";
        }
      } finally {
        loading = false;
      }
    }
  </script>
  
  <div>
    <label for="audioUrl">Audio URL:</label>
    <input type="text" id="audioUrl" bind:value={fileUrl} />
  
    <button on:click={transcribeAudio} disabled={loading}>
      {loading ? 'Transcribing...' : 'Transcribe'}
    </button>
  
    {#if error}
      <p style="color: red;">Error: {error}</p>
    {/if}
  
    <!-- {#if transcriptionText}
      <h2>Transcription:</h2>
      <p>{transcriptionText}</p>
    {/if} -->
  
    {#if speakerUtterances.length > 0}
      <h2>Speaker Utterances:</h2>
      <ul>
        {#each speakerUtterances as utterance}
          <li>{utterance}</li>
        {/each}
      </ul>
    {/if}
  </div>