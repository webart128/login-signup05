// Stepها
const phoneForm = document.querySelector('.step-phone');
const codeForm = document.querySelector('.step-code');
const successStep = document.querySelector('.step-success');

const phoneInput = document.getElementById('phone');
const sendPhoneBtn = document.getElementById('sendPhone');

const otpInputs = document.querySelectorAll('.otp-group input');
const verifyBtn = document.getElementById('verifyOtp');

const timerEl = document.getElementById('timer');
const resendBtn = document.getElementById('resend');
let timerInterval;

// Progress bar
const progressSteps = document.querySelectorAll('.progress-step');

// اعتبارسنجی شماره ایران
function isValidIranPhone(number){ return /^09\d{9}$/.test(number); }

// فعال/غیرفعال دکمه شماره موبایل
phoneInput.addEventListener('input', ()=>{
  phoneInput.value = phoneInput.value.replace(/[^0-9]/g,'');
  sendPhoneBtn.disabled = !isValidIranPhone(phoneInput.value);
});

// Enter فعال
phoneInput.addEventListener('keydown', e=>{
  if(e.key==='Enter' && !sendPhoneBtn.disabled) sendPhoneBtn.click();
});

// ارسال شماره → Step بعد + تایمر + progress
phoneForm.addEventListener('submit', e=>{
  e.preventDefault();
  phoneForm.classList.remove('step-active');
  codeForm.classList.add('step-active');
  otpInputs[0].focus();
  startOtpTimer();
  progressSteps[1].classList.add('active');
});

// تایمر OTP
function startOtpTimer(duration=120){
  let time = duration;
  resendBtn.disabled = true;
  updateTimer(time);
  clearInterval(timerInterval);
  timerInterval = setInterval(()=>{
    time--;
    updateTimer(time);
    if(time<0){
      clearInterval(timerInterval);
      resendBtn.disabled = false;
    }
  },1000);
}

function updateTimer(time){
  const m = String(Math.floor(time/60)).padStart(2,'0');
  const s = String(time%60).padStart(2,'0');
  timerEl.textContent = `${m}:${s}`;
}

// دکمه resend
resendBtn.addEventListener('click', ()=>{
  otpInputs.forEach(i=>i.value='');
  otpInputs[0].focus();
  verifyBtn.disabled = true;
  startOtpTimer();
});

// OTP حرکت خودکار و فعال کردن دکمه
otpInputs.forEach((input, idx)=>{
  input.addEventListener('input', ()=>{
    input.value = input.value.replace(/[^0-9]/g,'');
    if(input.value && idx<otpInputs.length-1) otpInputs[idx+1].focus();
    verifyBtn.disabled = ![...otpInputs].every(i=>i.value.length===1);
  });
  input.addEventListener('keydown', e=>{
    if(e.key==='Backspace' && !input.value && idx>0) otpInputs[idx-1].focus();
    if(e.key==='Enter' && !verifyBtn.disabled) verifyBtn.click();
  });
});

// ارسال OTP → موفقیت + progress
codeForm.addEventListener('submit', e=>{
  e.preventDefault();
  codeForm.classList.remove('step-active');
  successStep.classList.add('step-active');
  progressSteps[2].classList.add('active');
});

// Social Login شبیه‌سازی
const googleBtn = document.querySelector('.btn-social.google');
const appleBtn = document.querySelector('.btn-social.apple');
const emailBtn = document.querySelector('.btn-social.email');

[googleBtn, appleBtn, emailBtn].forEach(btn=>{
  btn.addEventListener('click', ()=>{
    alert(`${btn.textContent} شبیه‌سازی ورود انجام شد!`);
    phoneForm.classList.remove('step-active');
    codeForm.classList.remove('step-active');
    successStep.classList.add('step-active');
    progressSteps.forEach((p, idx)=>{ if(idx>0) p.classList.add('active'); });
  });
});
