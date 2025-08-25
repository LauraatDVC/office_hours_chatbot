const chatBox = document.getElementById('chat');
const input = document.getElementById('input');

let state = 'start';
let mode = '';
let formData = {};

const botSay = (text) => {
  const p = document.createElement('p');
  p.textContent = "Bot: " + text;
  p.className = 'bot';
  chatBox.appendChild(p);
  chatBox.scrollTop = chatBox.scrollHeight;
};

const userSay = (text) => {
  const p = document.createElement('p');
  p.textContent = "You: " + text;
  p.className = 'user';
  chatBox.appendChild(p);
  chatBox.scrollTop = chatBox.scrollHeight;
};

const resetChat = () => {
  state = 'start';
  formData = {};
  botSay("Would you like to submit, search or delete the schedule of office hours?");
};

input.addEventListener('keypress', async (e) => {
  if (e.key === 'Enter') {
    const msg = input.value.trim();
    if (!msg) return;
    userSay(msg);
    input.value = '';

    if (state === 'start') {
      if (msg.toLowerCase().includes('submit')) {
        mode = 'submit';
        state = 'first_name';
        botSay("Great! What's your first name?");
      } else if (msg.toLowerCase().includes('search')) {
        mode = 'search';
        state = 'search_last_name';
        botSay("Please enter the professor's last name to search.");
      } else if (msg.toLowerCase().includes('delete')) {
        mode = 'delete';
        state = 'delete_last_name';
        botSay("Please enter your last name to delete.");
      } else {
        botSay("Please say 'submit' to add, 'search' to find, or 'delete' to remove the schedule of office hours.");
      }
    }

    // SUBMIT FLOW
    else if (mode === 'submit') {
      if (state === 'first_name') {
        formData.first_name = msg;
        state = 'last_name';
        botSay("Last name?");
      } else if (state === 'last_name') {
        formData.last_name = msg;
        state = 'department';
        botSay("Department?");
      } else if (state === 'department') {
        formData.department = msg;
        state = 'montime';
        botSay("When are your office hours on Monday? (e.g., 2-4pm)");
      } else if (state === 'montime') {
        formData.montime = msg;
        state = 'monlocation';
        botSay("Where are the Monday office hours held?");
      } else if (state === 'monlocation') {
        formData.monlocation = msg;
        state = 'tuetime';
        botSay("When are your office hours on Tuesday? (e.g., 2-4pm)");
      } else if (state === 'tuetime') {
        formData.tuetime = msg;
        state = 'tuelocation';
        botSay("Where are the Tuesday office hours held?");
      } else if (state === 'tuelocation') {
        formData.tuelocation = msg;
        state = 'wedtime';
        botSay("When are your office hours on Wednesday? (e.g., 2-4pm)");
      } else if (state === 'wedtime') {
        formData.wedtime = msg;
        state = 'wedlocation';
        botSay("Where are the Wednesday office hours held?");
      } else if (state === 'wedlocation') {
        formData.wedlocation = msg;
        state = 'thutime';
        botSay("When are your office hours on Thursday? (e.g., 2-4pm)");
      } else if (state === 'thutime') {
        formData.thutime = msg;
        state = 'thulocation';
        botSay("Where are the Thursday office hours held?");
      } else if (state === 'thulocation') {
        formData.thulocation = msg;
        state = 'fritime';
        botSay("When are your office hours on Friday? (e.g., 2-4pm)");
      } else if (state === 'fritime') {
        formData.fritime = msg;
        state = 'frilocation';
        botSay("Where are the Friday office hours held?");
      } else if (state === 'frilocation') {
        formData.frilocation = msg;
        state = 'sattime';
        botSay("When are your office hours on Saturday? (e.g., 2-4pm)");
      } else if (state === 'sattime') {
        formData.sattime = msg;
        state = 'satlocation';
        botSay("Where are the Saturday office hours held?");
      } else if (state === 'satlocation') {
        formData.satlocation = msg;
        state = 'suntime';
        botSay("When are your office hours on Sunday? (e.g., 2-4pm)");
      } else if (state === 'suntime') {
        formData.suntime = msg;
        state = 'sunlocation';
        botSay("Where are the Sunday office hours held?");
      } else if (state === 'sunlocation') {
        formData.sunlocation = msg;
        state = 'confirming';
        // Submit to backend
        const res = await fetch('/submit_office_hours', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        botSay(data.message);
        resetChat();
      }
    }

    // SEARCH FLOW
    else if (mode === 'search' && state === 'search_last_name') {
      const res = await fetch('/search_office_hours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ last_name: msg })
      });
      const data = await res.json();
      if (data.results.length === 0) {
        botSay("No results found.");
      } else {
        botSay("Here are the matching office hours:");
        data.results.forEach(r => {
          botSay(`${r['First Name']} ${r['Last Name']} (${r['Department']}) Office Hours: `)
          botSay(`Monday     - ${r['MonTime']} at ${r['MonLocation']} `)
          botSay(`Tuesday    - ${r['TueTime']} at ${r['TueLocation']} `)
          botSay(`Wednesday  - ${r['WedTime']} at ${r['WedLocation']} `) 
          botSay(`Thursday   - ${r['ThuTime']} at ${r['ThuLocation']} `) 
          botSay(`Friday     - ${r['FriTime']} at ${r['FriLocation']} `) 
          botSay(`Saturday   - ${r['SatTime']} at ${r['SatLocation']} `) 
          botSay(`Sunday     - ${r['SunTime']} at ${r['SunLocation']} `) ;
        });
      }
      resetChat();
    }
    // DELETE FLOW
    else if (mode === 'delete' && state === 'delete_last_name') {
      const res = await fetch('/delete_office_hours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ last_name: msg })
      });
      const data = await res.json();
  
      if (data.results.length === 0) {
        botSay("No results found.");
      } else {
        botSay("The following matched office hours were deleted:");
        data.results.forEach(r => {
          botSay(`${r['First Name']} ${r['Last Name']} (${r['Department']}) Office Hours: `)
          botSay(`Monday     - ${r['MonTime']} at ${r['MonLocation']} `)
          botSay(`Tuesday    - ${r['TueTime']} at ${r['TueLocation']} `)
          botSay(`Wednesday  - ${r['WedTime']} at ${r['WedLocation']} `) 
          botSay(`Thursday   - ${r['ThuTime']} at ${r['ThuLocation']} `) 
          botSay(`Friday     - ${r['FriTime']} at ${r['FriLocation']} `) 
          botSay(`Saturday   - ${r['SatTime']} at ${r['SatLocation']} `) 
          botSay(`Sunday     - ${r['SunTime']} at ${r['SunLocation']} `) ;
        });
      }
    
      resetChat();
    }

  }
});

resetChat();
