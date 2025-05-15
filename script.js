const TOTAL_QUESTIONS = 10;
let currentQuestion = null;
let score = 0;
let questionIndex = 0;
let askedQuestions = new Set();
let questions = [];  // เก็บคำถามทั้งหมดที่โหลดมาแล้ว

const questionText = document.getElementById('questionText');
const btnA = document.getElementById('btnA');
const btnB = document.getElementById('btnB');
const btnC = document.getElementById('btnC');
const explanation = document.getElementById('explanation');
const scoreDiv = document.getElementById('score');
const progressDiv = document.getElementById('progress');
const nextBtn = document.getElementById('nextBtn');

function resetButtons() {
  [btnA, btnB, btnC].forEach(btn => {
    btn.disabled = false;
    btn.classList.remove('correct');
    btn.classList.remove('ripple');
    btn.style.backgroundColor = '#6c63ff';
    btn.style.boxShadow = '0 6px 12px rgba(108, 99, 255, 0.5)';
    btn.style.color = '#fff';
  });
}

function highlightCorrectAnswer() {
  const correct = currentQuestion.correctAnswer.toUpperCase();
  if (correct === 'A') btnA.classList.add('correct');
  else if (correct === 'B') btnB.classList.add('correct');
  else if (correct === 'C') btnC.classList.add('correct');
}

function updateProgress() {
  progressDiv.textContent = `คำถามที่ ${questionIndex} จาก ${TOTAL_QUESTIONS}`;
}

function checkAnswer(choice) {
  [btnA, btnB, btnC].forEach(btn => btn.disabled = true);

  // Ripple effect
  [btnA, btnB, btnC].forEach(btn => btn.classList.remove('ripple'));
  const clickedBtn = choice === 'A' ? btnA : choice === 'B' ? btnB : btnC;
  clickedBtn.classList.add('ripple');
  setTimeout(() => clickedBtn.classList.remove('ripple'), 600);

  const isCorrect = choice === currentQuestion.correctAnswer.toUpperCase();
  if (isCorrect) {
    score++;
    scoreDiv.textContent = `คะแนนรวม: ${score}`;
  }

  explanation.textContent = (isCorrect ? 'ถูกต้อง! ' : 'ผิด! ') + currentQuestion.explanation;
  explanation.classList.add('show');

  highlightCorrectAnswer();
  nextBtn.style.display = 'inline-block';
}

function showFinalScore() {
  questionText.textContent = `จบเกม! คะแนนรวมของคุณคือ ${score} จาก ${TOTAL_QUESTIONS}`;
  [btnA, btnB, btnC].forEach(btn => {
    btn.style.display = 'none';
  });
  explanation.classList.remove('show');
  explanation.textContent = '';

  nextBtn.textContent = 'เล่นอีกครั้ง';
  nextBtn.style.display = 'inline-block';

  // บันทึก high score ใน localStorage
  const highScore = localStorage.getItem('ppeHighScore') || 0;
  if (score > highScore) {
    localStorage.setItem('ppeHighScore', score);
    explanation.textContent = '🎉 คะแนนสูงสุดใหม่! 🎉';
  } else {
    explanation.textContent = `คะแนนสูงสุด: ${highScore}`;
  }
  explanation.classList.add('show');

  nextBtn.onclick = () => {
    // รีเซ็ตเกม
    score = 0;
    scoreDiv.textContent = `คะแนนรวม: ${score}`;
    questionIndex = 0;
    askedQuestions.clear();
    [btnA, btnB, btnC].forEach(btn => {
      btn.style.display = 'block';
    });
    nextBtn.textContent = 'คำถามถัดไป';
    nextBtn.style.display = 'none';
    explanation.classList.remove('show');
    explanation.textContent = '';
    nextBtn.onclick = () => loadQuestion();
    loadQuestion();
  };
}

function loadQuestion() {
  explanation.classList.remove('show');
  explanation.textContent = '';
  nextBtn.style.display = 'none';

  if (questionIndex >= TOTAL_QUESTIONS) {
    showFinalScore();
    return;
  }

  questionText.textContent = 'กำลังโหลดคำถาม...';
  resetButtons();

  if (questions.length === 0) {
    // URL Google Apps Script Web App ของคุณ (แก้เป็น URL จริงของคุณ)
    const url = 'https://script.google.com/macros/s/AKfycbzCpJJNVOdsRVUtHAZjRbC59gvavFDDf8mQod2U5Mn2K_512W_p7Zzndn1y8GqB2LU0/exec';

    fetch(url)
      .then(response => response.json())
      .then(data => {
        questions = data; // เก็บข้อมูลคำถามทั้งหมด
        pickQuestion();
      })
      .catch(err => {
        questionText.textContent = 'โหลดคำถามไม่สำเร็จ กรุณาลองใหม่';
        console.error(err);
      });
  } else {
    pickQuestion();
  }

  function pickQuestion() {
    let question;
    do {
      const idx = Math.floor(Math.random() * questions.length);
      question = questions[idx];
    } while (askedQuestions.has(question.id));

    askedQuestions.add(question.id);
    currentQuestion = question;
    questionIndex++;
    updateProgress();

    questionText.textContent = `[${question.situation}] ${question.question}`;
    btnA.textContent = 'A. ' + question.choiceA;
    btnB.textContent = 'B. ' + question.choiceB;
    btnC.textContent = 'C. ' + question.choiceC;
  }
}

btnA.onclick = () => checkAnswer('A');
btnB.onclick = () => checkAnswer('B');
btnC.onclick = () => checkAnswer('C');
nextBtn.onclick = () => loadQuestion();

window.onload = loadQuestion;
