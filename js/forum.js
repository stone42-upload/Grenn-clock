(function () {
  const defaultThreads = [
    {
      id: 1, title: "How to effectively recycle electronics?", tag: "Recycling",
      author: "Alex_Eco", date: "2h ago", votes: 24, replies: [
        { author: "MarieG", text: "I recommend using specialized bins in stores.", date: "1h ago" }
      ],
      body: "Hello, I have plenty of old cables and phones. What are the best channels today?"
    },
    {
      id: 2, title: "Eco-design in textiles: myth or reality?", tag: "Eco-design",
      author: "Sarah_T", date: "5h ago", votes: 18, replies: [],
      body: "We see a lot of greenwashing. Do you have examples of true circular brands?"
    }
  ];

  let threads = JSON.parse(localStorage.getItem('gc-threads')) || defaultThreads;
  let currentThreadId = null;

  const listEl = document.getElementById('thread-list');
  const detailEl = document.getElementById('thread-detail');
  const composeEl = document.getElementById('compose-box');

  function save() { localStorage.setItem('gc-threads', JSON.stringify(threads)); }
  function getInitials(name) { return name.substring(0,2).toUpperCase(); }

  function renderList() {
    listEl.innerHTML = '';
    listEl.style.display = 'flex';
    detailEl.style.display = 'none';
    
    threads.sort((a, b) => b.votes - a.votes).forEach(t => {
      const el = document.createElement('div');
      el.className = 'thread-item reveal revealed';
      el.innerHTML = `
        <div class="thread-votes">
          <button class="vote-btn" onclick="GC_FORUM.upvote(event, ${t.id})">▲</button>
          <span class="vote-count">${t.votes}</span>
        </div>
        <div class="thread-content" onclick="GC_FORUM.openThread(${t.id})">
          <h3 class="thread-title-text">${t.title}</h3>
          <div class="thread-meta">
            <span class="thread-tag">${t.tag}</span>
            <span>by ${t.author}</span>
            <span>${t.date}</span>
          </div>
        </div>
        <div class="thread-replies">
          <strong>${t.replies.length}</strong>
          Rep.
        </div>
      `;
      listEl.appendChild(el);
    });
  }

  function renderDetail(id) {
    const t = threads.find(x => x.id === id);
    if (!t) return;
    currentThreadId = id;

    listEl.style.display = 'none';
    composeEl.style.display = 'none';
    detailEl.style.display = 'block';

    document.getElementById('detail-title').textContent = t.title;
    document.getElementById('detail-tag').textContent = t.tag;
    document.getElementById('detail-author').textContent = t.author;
    document.getElementById('detail-date').textContent = t.date;
    document.getElementById('detail-body').textContent = t.body;

    const repliesEl = document.getElementById('replies-list');
    repliesEl.innerHTML = t.replies.length ? '' : '<p style="color:var(--text3);font-size:0.9rem;">No replies yet. Be the first!</p>';
    
    t.replies.forEach(r => {
      const rel = document.createElement('div');
      rel.className = 'reply-item';
      rel.innerHTML = `
        <div style="display:flex; gap:1rem; align-items:start;">
          <div class="avatar">${getInitials(r.author)}</div>
          <div>
            <div class="reply-author">${r.author}</div>
            <div class="reply-date">${r.date}</div>
            <div class="reply-text">${r.text}</div>
          </div>
        </div>
      `;
      repliesEl.appendChild(rel);
    });
  }

  // Exposed Actions
  window.GC_FORUM = {
    upvote: (e, id) => {
      e.stopPropagation();
      const t = threads.find(x => x.id === id);
      if (t) { t.votes++; save(); renderList(); }
    },
    openThread: (id) => renderDetail(id)
  };

  // Events
  document.getElementById('btn-new-thread').addEventListener('click', () => {
    detailEl.style.display = 'none';
    listEl.style.display = 'none';
    composeEl.style.display = 'block';
  });

  document.getElementById('btn-cancel-thread').addEventListener('click', renderList);

  document.getElementById('btn-submit-thread').addEventListener('click', () => {
    const title = document.getElementById('compose-title').value.trim();
    const body = document.getElementById('compose-text').value.trim();
    if (!title || !body) return alert("Please fill all fields.");
    
    threads.push({
      id: Date.now(), title, body, tag: "General", author: "You",
      date: "Just now", votes: 0, replies: []
    });
    save();
    document.getElementById('compose-title').value = '';
    document.getElementById('compose-text').value = '';
    renderList();
  });

  document.getElementById('btn-back').addEventListener('click', renderList);

  document.getElementById('btn-submit-reply').addEventListener('click', () => {
    const text = document.getElementById('reply-text').value.trim();
    if (!text || !currentThreadId) return;
    const t = threads.find(x => x.id === currentThreadId);
    if (t) {
      t.replies.push({ author: "You", text, date: "Just now" });
      save();
      document.getElementById('reply-text').value = '';
      renderDetail(currentThreadId);
    }
  });

  renderList();
})();
