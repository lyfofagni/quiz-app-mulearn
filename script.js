// script.js
const correctIdx = q.answer;
const selectedCorrect = idx === correctIdx;


buttons.forEach(b => {
const i = Number(b.getAttribute('data-index'));
if (i === correctIdx) b.classList.add('correct');
if (i === idx && i !== correctIdx) b.classList.add('wrong');
});


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
left.innerHTML = `<div style="font-weight:700">Q${idx+1}: ${a.question}</div><div style="color:var(--muted);margin-top:6px">Your answer: ${a.choices[a.selected] ?? '—'}</div><div style="color:var(--muted);margin-top:4px">Correct: ${a.choices[a.correct]}</div>`;


const tag = document.createElement('div');
tag.className = 'tag ' + (a.selected === a.correct ? 'correct' : 'wrong');
tag.textContent = a.selected === a.correct ? 'Correct' : 'Wrong';


item.appendChild(left);
item.appendChild(tag);
finalSummary.appendChild(item);
});


resultsPanel.style.display = 'block';
progressBar.style.width = '100%';
}


restartBtn.addEventListener('click', ()=>{
current = 0; score = 0; answers.length = 0; nextBtn.textContent = 'Next'; renderQuestion();
});


// init
(function init(){
renderQuestion();
})();
