// script.js (replacement - copy this file exactly)

(() => {
  // Basic sanity logging so you can see what's happening in the console
  console.log('Quiz script starting...');

  // Wait until DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    try {
      // ===== Questions (local array). You can replace or fetch external JSON. =====
      const QUESTIONS = [
        { id: 1, text: "Which language runs in a web browser?", choices: ["Java", "C#", "JavaScript", "Python"], answer: 2 },
        { id: 2, text: "What does CSS stand for?", choices: ["Central Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Creative Style System"], answer: 1 },
        { id: 3, text: "Which HTML tag is used for the largest heading?", choices: ["< head >", "< h1 >", "< heading >", "< header >"], answer: 1 },
        { id: 4, text: "Which method can be used to find an element by its ID in JavaScript?", choices: ["document.querySelectorAll()", "document.getElementById()", "document.getElementsByClassName()", "document.find()"], answer: 1 }
      ];

      // ===== State =====
      let current = 0;
      let score = 0;
      const answers = [];

      // ===== Elements =====
      const qText = document.getElementById('questionText');
      const choicesEl = document.getElementById('choices');
      const nextBtn = document.getElementById('nextBtn');
      const restartBtn = document.getElementById('restartBtn');
      const progressBar = document.getElementById('progressBar');
      const scoreMeta = document.getElementById('scoreMeta');
      const qCount = document.getElementById('qCount');
      const resultsPanel = document.getElementById('results');
      const finalScore = document.getElementById('finalScore');
      const finalSummary = document.getElementById('finalSummary');

      // Verify DOM elements exist
      if (!qText || !choicesEl || !nextBtn) {
        console.error('One or more required DOM elements are missing. Check index.html IDs.');
        if (qText) qText.textContent = 'Error: required elements missing. Check console.';
        else alert('Critical: quiz elements not found in DOM. Open console for details.');
        return;
      }

      console.log('All DOM elements found. Initializing quiz...');

      function renderMeta(){
        scoreMeta.textContent = `Score: ${score}`;
        qCount.textContent = `Question ${Math.min(current+1, QUESTIONS.length)} / ${QUESTIONS.length}`;
        const pct = Math.round((current / QUESTIONS.length) * 100);
        if (progressBar) progressBar.style.width = pct + '%';
      }

      function renderQuestion(){
        const q = QUESTIONS[current];
        if (!q) {
          console.warn('No question found for index', current);
          return;
        }
        qText.textContent = q.text;
        choicesEl.innerHTML = '';
        q.choices.forEach((c, i) => {
          const btn = document.createElement('button');
          btn.className = 'choice';
          btn.type = 'button';
          btn.setAttribute('data-index', i);
          btn.innerHTML = `<span class="label">${String.fromCharCode(65 + i)}</span><div style="flex:1">${c}</div>`;
          btn.addEventListener('click', onSelect);
          choicesEl.appendChild(btn);
        });
        nextBtn.disabled = true;
        nextBtn.style.display = 'inline-block';
        resultsPanel.style.display = 'none';
        restartBtn.style.display = 'none';
        renderMeta();
      }

      function onSelect(e){
        const idx = Number(e.currentTarget.getAttribute('data-index'));
        const q = QUESTIONS[current];

        // disable all choices
        const buttons = choicesEl.querySelectorAll('.choice');
        buttons.forEach(b=>{ b.classList.add('disabled'); b.disabled = true; });

        const correctIdx = q.answer;
        const selectedCorrect = idx === correctIdx;

        // show feedback
        buttons.forEach(b => {
          const i = Number(b.getAttribute('data-index'));
          if (i === correctIdx) b.classList.add('correct');
          if (i === idx && i !== correctIdx) b.classList.add('wrong');
        });

        // update score and record
        if (selectedCorrect) score++;
        answers.push({questionId: q.id, question: q.text, selected: idx, correct: correctIdx, choices: q.choices});

        nextBtn.textContent = selectedCorrect ? 'Correct — Next' : 'Wrong — Next';
        nextBtn.disabled = false;
        renderMeta();
      }

      nextBtn.addEventListener('click', ()=>{
        current++;
        if (current >= QUESTIONS.length){
          showResults();
        } else {
          nextBtn.textContent = 'Next';
          renderQuestion();
        }
      });

      function showResults(){
        qText.textContent = 'Quiz complete';
        choicesEl.innerHTML = '';
        nextBtn.style.display = 'none';
        restartBtn.style.display = 'inline-block';

        finalScore.textContent = `Final score: ${score} / ${QUESTIONS.length}`;
        finalSummary.innerHTML = '';

        answers.forEach((a, idx)=>{
          const item = document.createElement('div');
          item.className = 'summary-item';

          const left = document.createElement('div');
          left.innerHTML = `<div style="font-weight:700">Q${idx+1}: ${a.question}</div>
            <div style="color:var(--muted);margin-top:6px">Your answer: ${a.choices[a.selected] ?? '—'}</div>
            <div style="color:var(--muted);margin-top:4px">Correct: ${a.choices[a.correct]}</div>`;

          const tag = document.createElement('div');
          tag.className = 'tag ' + (a.selected === a.correct ? 'correct' : 'wrong');
          tag.textContent = a.selected === a.correct ? 'Correct' : 'Wrong';

          item.appendChild(left);
          item.appendChild(tag);
          finalSummary.appendChild(item);
        });

        resultsPanel.style.display = 'block';
        if (progressBar) progressBar.style.width = '100%';
      }

      restartBtn.addEventListener('click', ()=>{
        current = 0; score = 0; answers.length = 0; nextBtn.textContent = 'Next'; renderQuestion();
      });

      // start
      renderQuestion();
      console.log('Quiz initialized successfully.');

    } catch (err) {
      console.error('Quiz init failed:', err);
      const qText = document.getElementById('questionText');
      if (qText) qText.textContent = 'An error occurred while starting the quiz. Open console for details.';
    }
  });
})();
