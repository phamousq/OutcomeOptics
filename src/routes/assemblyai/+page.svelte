<script lang="ts">
    import { AssemblyAI } from 'assemblyai';
    import { GoogleGenerativeAI } from '@google/generative-ai';

    let transcriptionText: string = $state('');
    let transcriptUtterances: string[] = $state([]);
    let assemblyaiLoading: boolean = $state(false);
    let geminiLoading: boolean = $state(false);
    let error: string | null = $state(null);
    let audioUrl: string = '';
    let audioFile: File | null = null;
    let audioSrc: string | null = $state(null);
    let geminiResponse: string = $state('');
    interface Bookmark { time: number, type: 'question' | 'starred', text: string };
    let bookmarks: Bookmark[] = $state([]);
    let promptText: string = $state('Summarize the following transcript:');
    let currentTime: number | null = $state(null); // seconds
    let duration: number | null = $state(null);
    let paused: boolean = $state(true);
    let jumpTime: number | null = $state(null);
    interface Chapter { startTime: number; endTime: number; text: string };
    const structuredChapters: Chapter[] = $state([]);
    let questionText: string = $state('');
    let questionTextEmpty: boolean = $derived(questionText.length === 0);

    function handleFileChange(event: Event) {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files[0]) {
        audioFile = input.files[0];
        audioSrc = URL.createObjectURL(audioFile);
      }
    }
  
    async function transcribeAudio() {
      assemblyaiLoading = true;
      error = null;
      transcriptionText = '';
      transcriptUtterances = [];
  
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
          auto_chapters: true
        };
  
        const transcript = await client.transcripts.transcribe(data);
        transcriptionText = transcript.text || '';
  
        if (transcript.utterances) {
          transcriptUtterances = transcript.utterances.map(
            (utterance) => `Speaker ${utterance.speaker}: ${utterance.text}`
          );
        }
        if (transcript.chapters) {
          transcript.chapters.map(
            (chapter) => {
              const newChapter: Chapter = { startTime: Number((chapter.start/1000).toFixed(2)), endTime: Number((chapter.end/1000).toFixed(2)), text: chapter.headline };
              structuredChapters.push(newChapter);
            }
          );
        }
        console.log(structuredChapters);
      } catch (e) {
        if (e instanceof Error) {
          error = e.message;
        } else {
          error = 'An unknown error occurred.';
        }
      } finally {
        assemblyaiLoading = false;
      }
    }
    
    async function generateGeminiResponse() {
        geminiLoading = true;
        const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `${promptText}: ${transcriptionText}`;
        const result = await model.generateContent(prompt);
        geminiResponse = result.response.text();
        geminiLoading = false;
    }
    function handleEnter(event: KeyboardEvent) {
        if (event.key === 'Enter') {
          if(questionText.length > 0){
            bookmarks = [...bookmarks, { time: +currentTime?.toFixed(2) || 0, type: 'question', text: questionText }];
            questionText = '';
          }
          paused = false;
        }
    }
            
</script>
  
<main>
    <div id="audio">
        <h1 class="text-2xl underline">Upload</h1>
        <label for="audioFile">Upload Audio File:</label>
        <input type="file" id="audioFile" accept="audio/*" onchange={handleFileChange} />

        {#if audioSrc}
            <audio 
                id="audioPlayer" 
                src={audioSrc} 
                controls
                bind:currentTime
                bind:duration
                bind:paused
            ></audio>
        {/if}
    </div>
    <div id="transcription">
        <!-- <label for="audioUrl">Or Enter Audio URL:</label>
        <input type="text" id="audioUrl" bind:value={audioUrl} /> -->
        <h1 class="text-2xl underline">Transcription</h1>
        <button onclick={transcribeAudio} disabled={assemblyaiLoading}>
            {assemblyaiLoading ? 'Transcribing...' : 'Transcribe Button'}
        </button>
    
        {#if error}
        <p style="color: red;">Error: {error}</p>
        {/if}
    
        <!-- {#if transcriptionText}
            <p>{transcriptionText}</p>
        {/if} -->
    
        {#if transcriptUtterances.length}
            <ul>
                {#each transcriptUtterances as utterance}
                    <li>{utterance}</li>
                {/each}
            </ul>
        {:else}
            <p>No transcript found yet.</p>
        {/if}
    </div>
    <div id="chapters">
        <h1 class="text-2xl underline">Chapters</h1>
        {#if structuredChapters.length}
            <ol>
                {#each structuredChapters as chapter}
                  <li>
                    <button aria-label="Go to chapter" onclick={() => {
                      currentTime = chapter.startTime
                      paused = false
                    }}>{chapter.startTime}: {chapter.text}</button>
                  </li>
                  <!-- TODO: add functionality for adding chapter transcript location -->
                {/each}
            </ol>
        {:else}
            <p>No chapters found.</p>
        {/if}
    </div>
    <div id="bookmarks">
        <h1 class="text-2xl underline">Bookmarks</h1>
        <button 
            onclick={() => bookmarks = [...bookmarks, { time: +currentTime?.toFixed(2) || 0, type: 'starred', text: '' }]}
            disabled={!audioSrc}
        >
            Important
        </button>
        <button 
            onclick={() => bookmarks = [...bookmarks, { time: +currentTime?.toFixed(2) || 0, type: 'question', text:'' }]}
            disabled={!audioSrc}
        >
            Question
        </button>
        <input 
            type="text" 
            bind:value={questionText}
            oninput={() => {
              // todo implement functionality for pausing and playing with quetsion text 
              if(questionText.length -1 <= 0){
                jumpTime = currentTime
                paused = !paused
              }
            }} 
            onkeydown={handleEnter}
        />
        
        <!-- TODO: add funcionality for adding quetsion text -->
        {#if bookmarks.length}
            <!-- TODO: filter by important or question -->
            <ol>
                {#each bookmarks as bookmark}
                    <li>
                        <button aria-label="Go to bookmark" onclick={() => {
                          currentTime = bookmark.time
                          paused = false
                          }}>
                            {bookmark.time}: {bookmark.type == 'question' ? `${bookmark.type}: ${bookmark.text}` : `${bookmark.type}`}
                        </button>
                    </li>
                {/each}
            </ol>
        {/if}
        <div id="jumpto">
            <p>Jump to:</p>
            <input type="number" bind:value={jumpTime}/>
            <button onclick={() => {
              currentTime = Number(jumpTime)
              paused = false
              }}>Go</button>
        </div>
        <!-- ! add buttons for question vs important notes to the bookmarks -->


    <div id="gemini">
      <h1 class="text-2xl underline">Gemini</h1>
      <input class="w-2xl h-10" type="text" bind:value={promptText} />
      <button onclick={generateGeminiResponse} disabled={geminiLoading} >
          {geminiLoading ? 'Generating...' : 'Generate Gemini Response'}
      </button>
      {#if geminiResponse.length}
          <p>{geminiResponse}</p>
      {:else}
          <p>No response generated yet.</p>
      {/if}
    </div>
    <div id="Test Output">
        <h1 class="text-2xl underline">Test Output</h1>
        {transcriptionText}
        <p></p>
        {transcriptUtterances}
        <p></p>
        {structuredChapters}
    </div>
</main>

<style>

</style>