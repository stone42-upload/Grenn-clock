(function () {
  const defaultSuggestions = [
    { id: 1, title: "Mandatory European reparability index", text: "Extend the French reparability index to all of Europe and mandate it on clothing.", votes: 45 },
    { id: 2, title: "Reduced VAT on repairs", text: "Lower VAT to 5.5% for all repair services (electronics, shoes, clothing).", votes: 32 }
  ];

  let suggestions = JSON.parse(localStorage.getItem('gc-suggestions')) || defaultSuggestions;
  const listEl = document.getElementById('suggestions-list');

  function save() { localStorage.setItem('gc-suggestions', JSON.stringify(suggestions)); }

  function renderList() {
    listEl.innerHTML = '';
    suggestions.sort((a, b) => b.votes - a.votes).forEach(s => {
      const el = document.createElement('div');
      el.className = 'suggestion-item reveal revealed';
      el.innerHTML = `
        <div class="suggestion-votes">
          <button class="vote-btn" onclick="GC_FEEDBACK.upvote(event, ${s.id})">▲</button>
          <span class="vote-count" style="font-size:0.8rem;">${s.votes}</span>
        </div>
        <div>
          <h4 class="suggestion-title">${s.title}</h4>
          <p class="suggestion-text">${s.text}</p>
          <div class="suggestion-tag-row">
            <span class="thread-tag">Solution</span>
          </div>
        </div>
      `;
      listEl.appendChild(el);
    });
  }

  window.GC_FEEDBACK = {
    upvote: (e, id) => {
      e.stopPropagation();
      const s = suggestions.find(x => x.id === id);
      if (s) { s.votes++; save(); renderList(); }
    }
  };

  document.getElementById('btn-submit-sugg').addEventListener('click', () => {
    const title = document.getElementById('sugg-title').value.trim();
    const text = document.getElementById('sugg-text').value.trim();
    if (!title || !text) return alert("Please fill all fields.");
    
    suggestions.push({ id: Date.now(), title, text, votes: 1 });
    save();
    document.getElementById('sugg-title').value = '';
    document.getElementById('sugg-text').value = '';
    renderList();
  });

  renderList();
})();
