<script lang="ts">
	let expandedTaskId: number | null = null;

	const tasks = [
		{ id: 1, title: "Schedule follow up with Pain Medicine Clinic", completed: false, priority: true, formType: "schedule" },
		{ id: 2, title: "Complete Advance Care Directive Planning", completed: false, priority: true, formType: "advanced" },
		{ id: 3, title: "Financial Advisors", completed: false, priority: true, formType: "financial" },
		{ id: 4, title: "Medical Power of Attorney", completed: false, priority: false, formType: "attorney" },
		{ id: 5, title: "Insurance Policies", completed: true, priority: false, formType: "insurance" },
		{ id: 6, title: "Beneficiaries", completed: false, priority: false, formType: "beneficiaries" },
		{ id: 7, title: "Discuss Treatment Options", completed: false, priority: false, formType: "treatments" }
	];

	function toggleExpand(id: number) {
		expandedTaskId = expandedTaskId === id ? null : id;
	}
    import './styles.css';

</script>



<div class = "page-container">
  <!-- <header>
    <div><strong>OutcomeOptics</strong></div>
    <nav>
      <a href="#">My Visits</a>
      <a href="#">Explore My Diagnosis</a>
      <a href="#">Treatment Options</a>
    </nav>
  </header> -->

  <main class="page-container">
    <div class="grid">
      <div class="card left">
        <h2>Hello, Mike!</h2>
        <p>Today is Friday, April 4th, you are scheduled to meet with <strong>Dr. Nieman in 2 weeks.</strong></p>
        <p>You have <strong>2 priority tasks</strong> to complete.</p>
      </div>
      <div class="card right">
        <h3>Reminders</h3>
        <p>Austin Pain Support Group<br><small>April 5th, 2025</small></p>
        <p>Physical Therapy Appointment<br><small>April 10th, 2025</small></p>
      </div>
    </div>

    <div class="task top">
        <span>Help us personalize your care</span>
        <button class="button">Start</button>
      </div>

    <div class="checklist">
        <h3>Your Checklist:</h3>
        {#each tasks as task (task.id)}
        <div class="task {task.completed ? 'completed' : ''} {task.priority ? 'priority' : ''}">
            <span>{task.title}</span>
    
            {#if task.completed}
                <span class="status">Completed <span class="checkmark">✔️</span></span>
            {:else}
                <button class="button" on:click={() => toggleExpand(task.id)}>
                    {expandedTaskId === task.id ? 'Close' : 'Open'}
                </button>
            {/if}
    
            {#if expandedTaskId === task.id}
              <div class="task-details">
                {#if task.formType === 'schedule'}
                  <!-- Clinic form -->
                  <form>
                    <input type="text" placeholder="Preferred Clinic" class="small-input"/>
                    <input type="date" placeholder="Appointment Date" class="small-input"/>
                    <input type="time" placeholder="Appointment Time" class="small-input"/>
                  </form>
                  <div class="task-buttons">
                    <button class="save-button" type="button">Save</button>
                    <button class="button close-button" type="button" on:click={() => toggleExpand(task.id)}>Close</button>
                  </div>
                {:else if task.formType === 'advanced'}
                  <!-- Advance directive form -->
                  <form>
                    <input type="text" placeholder="First Name" class="small-input"/>
                    <input type="text" placeholder="Last Name" class="small-input"/>
                    <input type="text" placeholder="Email" class="small-input"/>
                    <input type="text" placeholder="Phone" class="small-input"/>
                  </form>
                {:else if task.formType === 'financial'}
                  <!-- financial advisors form -->
                  <form>
                    <input type="text" placeholder="First Name" class="small-input"/>
                    <input type="text" placeholder="Last Name" class="small-input"/>
                    <input type="text" placeholder="Email" class="small-input"/>
                    <input type="text" placeholder="Phone" class="small-input"/>
                  </form>
                {:else if task.formType === 'attorney'}
                  <!-- medical power of attorney form -->
                  <form>
                    <input type="text" placeholder="First Name" class="small-input"/>
                    <input type="text" placeholder="Last Name" class="small-input"/>
                    <input type="text" placeholder="Email" class="small-input"/>
                    <input type="text" placeholder="Phone" class="small-input"/>
                  </form>
                {:else if task.formType === 'insurance'}
                  <!-- insurance policies form -->
                  <form>
                    <input type="text" placeholder="First Name" class="small-input"/>
                    <input type="text" placeholder="Last Name" class="small-input"/>
                    <input type="text" placeholder="Email" class="small-input"/>
                    <input type="text" placeholder="Phone" class="small-input"/>
                  </form>
                {:else if task.formType === 'beneficiaries'}
                  <!-- beneficiaries form -->
                  <form>
                    <p id = "question">You can choose to add people who matter most to you — whether it’s a family member, trusted friend, or legal beneficiary — so they can stay informed and support you in your care.</p>
                    <h4>New Beneficiary / Emergency Contact</h4>
                    <input type="text" placeholder="First Name" class="small-input"/>
                    <input type="text" placeholder="Last Name" class="small-input"/>
                    <input type="text" placeholder="Email" class="small-input"/>
                    <input type="text" placeholder="Phone" class="small-input"/>
                    <p>Would you like to authorize this person to:</p>
                    <label>Receive important medical updates?</label>
                    <div class="radio-group">
                      <label><input type="radio" name="pain" value="yes" /> Yes</label>
                      <label><input type="radio" name="pain" value="no" /> No</label>
                    </div>
                    <label>Access your treatment information?</label>
                    <div class="radio-group">
                      <label><input type="radio" name="pain" value="yes" /> Yes</label>
                      <label><input type="radio" name="pain" value="no" /> No</label>
                    </div>
                    <label>Make healthcare decisions on your behalf if you are unable to?</label>
                    <div class="radio-group">
                      <label><input type="radio" name="pain" value="yes" /> Yes</label>
                      <label><input type="radio" name="pain" value="no" /> No</label>
                    </div>
                    <label>Be contacted in case of an emergency?</label>
                    <div class="radio-group">
                      <label><input type="radio" name="pain" value="yes" /> Yes</label>
                      <label><input type="radio" name="pain" value="no" /> No</label>
                    </div>
                  </form>
                  <div class="task-buttons">
                    <button class="save-button" type="button"on:click={() => toggleExpand(task.id)}>Save</button>
                    <button class="button close-button" type="button" on:click={() => toggleExpand(task.id)}>Cancel</button>
                  </div>
                {:else if task.formType === 'treatments'}
                  <!-- treatments form -->
                  <form>
                    <input type="text" placeholder="First Name" class="small-input"/>
                    <input type="text" placeholder="Last Name" class="small-input"/>
                    <input type="text" placeholder="Email" class="small-input"/>
                    <input type="text" placeholder="Phone" class="small-input"/>
                  </form>
                {:else}
                  <!-- Default fallback -->
                  <form>
                    <input type="text" placeholder="First Name" class="small-input"/>
                    <input type="text" placeholder="Last Name" class="small-input"/>
                    <input type="text" placeholder="Email" class="small-input"/>
                    <input type="text" placeholder="Phone" class="small-input"/>
                  </form>
                {/if}
              </div>
            {/if}
        </div>
        {/each}
    </div>
  </main>

  <!-- <footer>
    <div>
      <a href="#">Support</a>
      <a href="#">Privacy Policy</a>
      <a href="#">Contact</a>
    </div>
    <div>© 2025 OutcomeOptics</div>
  </footer> -->
</div>

