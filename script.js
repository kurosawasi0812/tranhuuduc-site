const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('#main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
  });
}

document.querySelectorAll('.main-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
    navToggle?.setAttribute('aria-label', 'Mở menu');
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => revealObserver.observe(el));

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.main-nav a')];
const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => {
        a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: '-40% 0px -52% 0px', threshold: 0 }
);
sections.forEach((section) => navObserver.observe(section));

const toTop = document.querySelector('#to-top');
window.addEventListener('scroll', () => {
  toTop?.classList.toggle('show', window.scrollY > 500);
}, { passive: true });

toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

document.querySelectorAll('img').forEach((img) => {
  img.addEventListener('error', () => {
    img.closest('.gallery-card, .feature-image, .dark-photo, .book-card')?.classList.add('image-fallback');
  });
});

const quizData = [
  { q: 'Trần Hữu Dực tham gia hoạt động cách mạng khi bao nhiêu tuổi?', options: ['15 tuổi', '18 tuổi', '21 tuổi'], answer: 0, why: 'Tài liệu ghi ông sớm giác ngộ và tham gia hoạt động cách mạng khi mới 15 tuổi.' },
  { q: 'Ở tuổi 16, Trần Hữu Dực chủ trì thành lập tổ chức nào?', options: ['Ái hữu dân đoàn', 'Liên Chi ủy cơ quan Trung ương', 'Ủy ban khởi nghĩa'], answer: 0, why: 'Ngay lúc tuổi 16, ông chủ trì Hội nghị thành lập tổ chức yêu nước “Ái hữu dân đoàn”.' },
  { q: 'Trong giai đoạn 1926–1945, tài liệu ghi ông bị Pháp bắt bao nhiêu lần?', options: ['2 lần', '4 lần', '6 lần'], answer: 1, why: 'Tài liệu ghi Trần Hữu Dực bị Pháp bắt 4 lần.' },
  { q: 'Ngày 02/9/1945, ông được bầu giữ chức vụ nào?', options: ['Bí thư Khu ủy Trị Thiên', 'Chủ tịch UBND cách mạng Trung bộ', 'Phó Thủ tướng Chính phủ'], answer: 1, why: 'Ngày 02/9/1945, trong cuộc họp đại biểu các tỉnh Trung Kỳ, ông được bầu là Chủ tịch UBND cách mạng Trung bộ.' },
  { q: 'Đêm 19/8/1993, trên bàn làm việc của ông là những trang cuối của tác phẩm nào?', options: ['Bước qua đầu thù', 'Phủ Biên tạp lục', 'Hiệp kỷ'], answer: 0, why: 'Tài liệu ghi những trang cuối của tập hồi ký “Bước qua đầu thù” đang ở trên bàn làm việc của ông.' }
];

let quizIndex = 0;
let quizScore = 0;
let selected = null;
let answered = false;
const quizBox = document.querySelector('#quiz-box');
const progress = document.querySelector('#quiz-progress');
const nextBtn = document.querySelector('#quiz-next');
const restartBtn = document.querySelector('#quiz-restart');
const resultBox = document.querySelector('#quiz-result');

function renderQuestion() {
  if (!quizBox || !progress || !nextBtn) return;
  selected = null;
  answered = false;
  const item = quizData[quizIndex];
  progress.textContent = `${String(quizIndex + 1).padStart(2, '0')} / ${quizData.length}`;
  nextBtn.textContent = quizIndex === quizData.length - 1 ? 'Chấm điểm' : 'Câu tiếp theo →';
  nextBtn.classList.remove('hidden');
  restartBtn?.classList.add('hidden');
  resultBox?.classList.add('hidden');
  quizBox.innerHTML = `
    <div class="quiz-question">
      <h3>${item.q}</h3>
      <div class="quiz-options" role="radiogroup" aria-label="Các đáp án">
        ${item.options.map((opt, i) => `<button class="quiz-option" type="button" data-index="${i}" aria-pressed="false"><span class="quiz-marker">${String.fromCharCode(65 + i)}</span><span>${opt}</span></button>`).join('')}
      </div>
    </div>`;
  quizBox.querySelectorAll('.quiz-option').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (answered) return;
      quizBox.querySelectorAll('.quiz-option').forEach((b) => { b.classList.remove('selected'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('selected');
      btn.setAttribute('aria-pressed', 'true');
      selected = Number(btn.dataset.index);
    });
  });
}

nextBtn?.addEventListener('click', () => {
  if (selected === null) {
    nextBtn.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(0)' }], { duration: 280 });
    return;
  }
  if (answered) {
    if (quizIndex < quizData.length - 1) { quizIndex += 1; renderQuestion(); }
    return;
  }
  const item = quizData[quizIndex];
  const correct = selected === item.answer;
  if (correct) quizScore += 1;
  answered = true;
  quizBox.querySelectorAll('.quiz-option').forEach((btn, i) => {
    btn.disabled = true;
    if (i === item.answer) btn.classList.add('correct');
    if (i === selected && !correct) btn.classList.add('wrong');
  });
  const explanation = document.createElement('div');
  explanation.className = 'quiz-explanation';
  explanation.innerHTML = `<strong>${correct ? 'Đúng.' : 'Chưa đúng.'}</strong> ${item.why}`;
  quizBox.querySelector('.quiz-question')?.appendChild(explanation);
  if (quizIndex < quizData.length - 1) {
    nextBtn.textContent = 'Câu tiếp theo →';
    return;
  }
  const percent = Math.round((quizScore / quizData.length) * 100);
  progress.textContent = 'HOÀN TẤT';
  if (resultBox) {
    resultBox.classList.remove('hidden');
    resultBox.innerHTML = `<strong>Điểm: ${quizScore} / ${quizData.length} (${percent}%)</strong><br>Hoàn thành bài ghi nhớ dựa trên tư liệu “Đồng chí Trần Hữu Dực”.`;
  }
  nextBtn.classList.add('hidden');
  restartBtn?.classList.remove('hidden');
});

restartBtn?.addEventListener('click', () => { quizIndex = 0; quizScore = 0; selected = null; answered = false; renderQuestion(); });
renderQuestion();
