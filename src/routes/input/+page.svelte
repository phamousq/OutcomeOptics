<script>
    let files = $state(''); 

    $effect(() => {
		if (files) {
			// Note that `files` is of type `FileList`, not an Array:
			// https://developer.mozilla.org/en-US/docs/Web/API/FileList
			console.log(files);

			for (const file of files) {
				console.log(`${file.name}: ${file.size} bytes`);
			}
		}
	});

	let diagnosis = $state('');
    let religion = $state(''); 
    let insurance = $state(''); 
    let family_caregiver = $state(''); 
</script>

<label for = "health records">Upload multiple pdf files:</label>
<input bind:files id = "health records" multiple type="file" />

{#if files}
    <h2>Selected files:</h2>
    {#each Array.from(files) as file}
        <p>{file.name}({file.size} bytes)</p>
    {/each}
{/if}

<br>
<input bind:value={diagnosis} placeholder="enter your diagnosis"/>
<br>
<input bind:value={religion} placeholder = "enter religious background"/>
<br>
<input bind:value={insurance} placeholder = "enter insurance provider and plan"/>
<br>
<input bind:value={family_caregiver} placeholder = "Do you have a family member who can provide care?"/>

<br>
<button>Enter</button>