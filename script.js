// CineChaos - Cinema Seat Selection Chaos Engine
// Test Case Requirement: Select seat F12 from an interactive seat map grid and confirm selection.

document.addEventListener('DOMContentLoaded', () => {
  // State
  let startTime = Date.now();
  let timerInterval = null;
  let ragePercent = 12;
  let failedClickCount = 0;
  let selectedSeat = null;
  let f12DodgesLeft = 3;
  let confirmDodgesLeft = 3;
  let closeXDodgesLeft = 2;
  let declineDodgesLeft = 2;
  let isCalibrated = false;
  let isSnackHandled = false;
  let isLightsDimmed = false;
  let isAlphabeticalOrder = false;
  let isF12LockedByBot = true;
  let isLockCountdownRunning = false;

  // DOM Elements
  const liveTimer = document.getElementById('liveTimer');
  const rageIndex = document.getElementById('rageIndex');
  const failedClicks = document.getElementById('failedClicks');
  const selectedSeatDisplay = document.getElementById('selectedSeatDisplay');
  const tickerText = document.getElementById('tickerText');
  const seatGrid = document.getElementById('seatGrid');
  const lightSwitchBtn = document.getElementById('lightSwitchBtn');
  const sortModeBtn = document.getElementById('sortModeBtn');
  const summarySeatName = document.getElementById('summarySeatName');
  const confirmBtn = document.getElementById('confirmBtn');
  const confirmZone = document.getElementById('confirmZone');

  // Modals
  const snackModal = document.getElementById('snackModal');
  const fakeCloseX = document.getElementById('fakeCloseX');
  const acceptSnackBtn = document.getElementById('acceptSnackBtn');
  const declineSnackBtn = document.getElementById('declineSnackBtn');

  const calibrationModal = document.getElementById('calibrationModal');
  const evilSlider = document.getElementById('evilSlider');
  const gaugeDisplay = document.getElementById('gaugeDisplay');
  const submitCalibrationBtn = document.getElementById('submitCalibrationBtn');

  const finalConfirmationModal = document.getElementById('finalConfirmationModal');
  const btnRealConfirm = document.getElementById('btnRealConfirm');
  const btnCancelCancel = document.getElementById('btnCancelCancel');
  const btnDoNotBook = document.getElementById('btnDoNotBook');
  const btnResetEverything = document.getElementById('btnResetEverything');

  // Victory
  const victoryScreen = document.getElementById('victoryScreen');
  const vTotalTime = document.getElementById('vTotalTime');
  const vFailedClicks = document.getElementById('vFailedClicks');
  const restartBtn = document.getElementById('restartBtn');

  // Snarky messages pool
  const snarkyLines = [
    "Row F is feeling antisocial today.",
    "Did you know seat F12 has been cursed since 1997?",
    "Every misclick charges your card ₹99 in invisible convenience fees.",
    "A bot in Siberia is currently viewing F12.",
    "Pro tip: Have you tried begging the screen?",
    "The longer you take, the higher the popcorn prices surge.",
    "F12 was spotted flirting with F13.",
    "Patience is a virtue, but CineChaos is forever."
  ];

  // 1. Initialize Stopwatch
  function updateTimer() {
    const elapsed = Date.now() - startTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    const millis = Math.floor((elapsed % 1000) / 100);
    liveTimer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${millis}`;
  }
  timerInterval = setInterval(updateTimer, 80);

  function bumpRage(amount = 7) {
    ragePercent = Math.min(100, ragePercent + amount);
    rageIndex.textContent = `${ragePercent}%`;
    failedClickCount++;
    failedClicks.textContent = failedClickCount;
    if (window.soundFX) window.soundFX.playBuzzer();

    // Random snarky line
    const randomMsg = snarkyLines[Math.floor(Math.random() * snarkyLines.length)];
    tickerText.textContent = randomMsg;
  }

  // 2. Generate Interactive Cinema Seat Grid
  // Rows: A to J, Seats: 1 to 18
  const rowLettersDefault = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const rowLettersChaotic = ['Z', 'Q', 'E', 'B', 'F', 'A', 'K', 'M', 'C', 'H'];

  function buildGrid(letters) {
    seatGrid.innerHTML = '';

    letters.forEach((rowLetter) => {
      const rowEl = document.createElement('div');
      rowEl.className = 'grid-row';
      rowEl.dataset.row = rowLetter;

      // Row label left
      const labelLeft = document.createElement('span');
      labelLeft.className = 'row-label';
      labelLeft.textContent = rowLetter;
      rowEl.appendChild(labelLeft);

      // Seats wrapper
      const seatsWrap = document.createElement('div');
      seatsWrap.className = 'row-seats';

      // 18 seats per row with an aisle at seat 9
      for (let s = 1; s <= 18; s++) {
        if (s === 9) {
          const aisle = document.createElement('div');
          aisle.className = 'aisle-gap';
          seatsWrap.appendChild(aisle);
        }

        const seat = document.createElement('div');
        seat.className = 'seat';
        seat.dataset.row = rowLetter;
        seat.dataset.num = s;
        seat.textContent = s;

        // Is this the coveted target seat F12?
        if (rowLetter === 'F' && s === 12) {
          seat.classList.add('target-f12');
          seat.id = 'targetF12';
          if (selectedSeat === 'F12') {
            seat.classList.add('selected');
          }
          attachF12EvilMechanics(seat);
        } else {
          // Pre-occupy realistic scattered seats
          const isRandomOccupied = (s === 4 || s === 7 || s === 8 || s === 14 || s === 15) && rowLetter !== 'A';
          if (isRandomOccupied) {
            seat.classList.add('occupied');
            seat.title = `Seat ${rowLetter}${s} (Reserved by bot)`;
          } else {
            // Decoy / Distraction seat
            seat.addEventListener('click', () => handleDecoySeatClick(rowLetter, s));
          }
        }

        seatsWrap.appendChild(seat);
      }

      rowEl.appendChild(seatsWrap);

      // Row label right
      const labelRight = document.createElement('span');
      labelRight.className = 'row-label';
      labelRight.textContent = rowLetter;
      rowEl.appendChild(labelRight);

      seatGrid.appendChild(rowEl);
    });
  }

  // Handle clicking non-target seats
  function handleDecoySeatClick(row, num) {
    bumpRage(6);
    const seatName = `${row}${num}`;
    tickerText.textContent = `🚫 INVALID: Test case strictly assigned F12, not ${seatName}!`;
    
    // Flash warning
    const hint = document.getElementById('hintPill');
    if (hint) {
      hint.textContent = `❌ ${seatName} rejected! Target is F12!`;
      hint.style.color = '#ef4444';
      setTimeout(() => {
        hint.textContent = `💡 TIP: F12 is on row F, seat 12!`;
        hint.style.color = '#fbbf24';
      }, 2000);
    }
  }

  // 3. SEAT F12 DIABOLICAL MECHANICS
  function attachF12EvilMechanics(f12Seat) {
    // Evasive dodging on hover (first 3 times)
    f12Seat.addEventListener('mouseenter', () => {
      if (f12DodgesLeft > 0 && selectedSeat !== 'F12') {
        f12DodgesLeft--;
        if (window.soundFX) window.soundFX.playDodge();
        
        // Random dodging offset
        const offsets = [-28, 28, -22, 22];
        const randomX = offsets[Math.floor(Math.random() * offsets.length)];
        const randomY = offsets[Math.floor(Math.random() * offsets.length)];
        f12Seat.style.transform = `translate(${randomX}px, ${randomY}px) scale(0.9)`;
        f12Seat.classList.add('wobble');

        tickerText.textContent = `💨 Seat F12 dodged you! (${f12DodgesLeft} dodges remaining)`;

        setTimeout(() => {
          f12Seat.style.transform = 'translate(0, 0)';
          f12Seat.classList.remove('wobble');
        }, 320);
      }
    });

    // When clicked
    f12Seat.addEventListener('click', (e) => {
      e.stopPropagation();

      // If F12 is still under "bot hold lock"
      if (isF12LockedByBot) {
        if (isLockCountdownRunning) return; // Prevent spamming duplicate countdowns
        isLockCountdownRunning = true;

        if (window.soundFX) window.soundFX.playBuzzer();
        bumpRage(10);
        f12Seat.classList.add('locked-temp');
        tickerText.textContent = `⏳ HOLD ACTIVE: User 'CinemaGeek88' is reviewing F12! Releasing in 3s...`;
        
        // 3 second hold simulation
        let lockTime = 3;
        const lockTimer = setInterval(() => {
          lockTime--;
          if (lockTime > 0) {
            tickerText.textContent = `⏳ HOLD ACTIVE: Wait ${lockTime}s for lock release...`;
          } else {
            clearInterval(lockTimer);
            isF12LockedByBot = false;
            isLockCountdownRunning = false;
            f12Seat.classList.remove('locked-temp');
            tickerText.textContent = `⚡ LOCK RELEASED! Click F12 immediately!`;
            if (window.soundFX) window.soundFX.playClick();
          }
        }, 1000);
        return;
      }

      // If snack modal hasn't been passed yet
      if (!isSnackHandled) {
        if (window.soundFX) window.soundFX.playClick();
        snackModal.classList.remove('hidden');
        return;
      }

      // If calibration hasn't been completed yet
      if (!isCalibrated) {
        if (window.soundFX) window.soundFX.playClick();
        calibrationModal.classList.remove('hidden');
        return;
      }

      // Successfully selected F12!
      selectF12Successfully(f12Seat);
    });
  }

  function selectF12Successfully(f12Seat) {
    selectedSeat = 'F12';
    f12Seat.classList.add('selected');
    selectedSeatDisplay.textContent = 'F12';
    summarySeatName.textContent = 'Seat F12 (IMAX Curved 3D)';
    tickerText.textContent = '🎯 Seat F12 selected! Now hurry and click CONFIRM SELECTION!';
    if (window.soundFX) window.soundFX.playClick();

    // Enable confirm button
    confirmBtn.disabled = false;
    confirmBtn.classList.remove('disabled');
  }

  // 4. SNACK MODAL EVIL MECHANICS
  fakeCloseX.addEventListener('mouseenter', () => {
    if (closeXDodgesLeft > 0) {
      closeXDodgesLeft--;
      if (window.soundFX) window.soundFX.playDodge();
      const randX = (Math.random() - 0.5) * 160;
      const randY = (Math.random() - 0.5) * 80;
      fakeCloseX.style.transform = `translate(${randX}px, ${randY}px)`;
    }
  });

  fakeCloseX.addEventListener('click', () => {
    closeSnackModal();
  });

  declineSnackBtn.addEventListener('mouseenter', () => {
    if (declineDodgesLeft > 0) {
      declineDodgesLeft--;
      if (window.soundFX) window.soundFX.playDodge();
      declineSnackBtn.style.transform = `translateX(${declineDodgesLeft % 2 === 0 ? 50 : -50}px)`;
    }
  });

  declineSnackBtn.addEventListener('click', () => {
    closeSnackModal();
  });

  acceptSnackBtn.addEventListener('click', () => {
    bumpRage(5);
    tickerText.textContent = '🍿 ₹1,899 added to bill! CineChaos thanks you for your donation.';
    closeSnackModal();
  });

  function closeSnackModal() {
    snackModal.classList.add('hidden');
    isSnackHandled = true;
    setTimeout(() => {
      calibrationModal.classList.remove('hidden');
    }, 200);
  }

  // 5. OCULAR CALIBRATION MODAL MECHANICS
  evilSlider.addEventListener('input', (e) => {
    const rawVal = parseFloat(e.target.value);
    let calculatedAngle = (rawVal * 0.16);
    
    // Generous snap window near 12.0 degrees
    if (Math.abs(calculatedAngle - 12.0) <= 0.3) {
      calculatedAngle = 12.0;
    }

    const formatted = calculatedAngle.toFixed(1);
    gaugeDisplay.textContent = `${formatted}°`;

    if (formatted === '12.0') {
      gaugeDisplay.style.color = '#10b981';
      gaugeDisplay.textContent = `12.0° (ALIGNED!)`;
    } else {
      gaugeDisplay.style.color = '#38bdf8';
    }
  });

  submitCalibrationBtn.addEventListener('click', () => {
    const rawVal = parseFloat(evilSlider.value);
    let calculatedAngle = (rawVal * 0.16);
    if (Math.abs(calculatedAngle - 12.0) <= 0.3) {
      calculatedAngle = 12.0;
    }
    const formatted = calculatedAngle.toFixed(1);

    if (formatted === '12.0') {
      isCalibrated = true;
      calibrationModal.classList.add('hidden');
      if (window.soundFX) window.soundFX.playClick();
      tickerText.textContent = '✅ Calibration locked! Now click Seat F12 on the grid!';
      const f12 = document.getElementById('targetF12');
      if (f12) {
        selectF12Successfully(f12);
      }
    } else {
      bumpRage(8);
      gaugeDisplay.classList.add('wobble');
      tickerText.textContent = `❌ Angle is ${formatted}°, but must be exactly 12.0°!`;
      setTimeout(() => gaugeDisplay.classList.remove('wobble'), 400);
    }
  });

  // 6. FLEEING "CONFIRM SELECTION" BUTTON MECHANICS
  confirmZone.addEventListener('mousemove', (e) => {
    if (confirmBtn.disabled || confirmDodgesLeft <= 0) return;

    const btnRect = confirmBtn.getBoundingClientRect();
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;
    const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

    if (dist < 80) {
      confirmDodgesLeft--;
      if (window.soundFX) window.soundFX.playDodge();

      const jumpOffsets = [-100, 100, -80, 80];
      const jumpX = jumpOffsets[confirmDodgesLeft % jumpOffsets.length];
      confirmBtn.style.transform = `translateX(${jumpX}px)`;

      tickerText.textContent = `🏃 The Confirm Button ran away! (${confirmDodgesLeft} dodges left)`;

      if (confirmDodgesLeft === 0) {
        setTimeout(() => {
          confirmBtn.style.transform = 'translateX(0)';
          confirmBtn.classList.add('exhausted');
          confirmBtn.querySelector('.btn-text').textContent = '🥵 FINE, CONFIRM F12!';
          tickerText.textContent = '😅 The Confirm Button is exhausted. Catch it now!';
        }, 350);
      }
    }
  });

  confirmBtn.addEventListener('click', () => {
    if (confirmBtn.disabled) return;
    if (window.soundFX) window.soundFX.playClick();
    finalConfirmationModal.classList.remove('hidden');
  });

  // 7. FINAL CONFIRMATION MODAL TRAP
  btnCancelCancel.addEventListener('click', () => {
    bumpRage(5);
    tickerText.textContent = "🤔 You canceled the cancelation, but that didn't confirm the seat!";
  });

  btnDoNotBook.addEventListener('click', () => {
    bumpRage(5);
    tickerText.textContent = "❌ You declined to not reject! Double negatives are tricky.";
  });

  btnResetEverything.addEventListener('click', () => {
    bumpRage(15);
    tickerText.textContent = "😱 Please do not reset! You were right at the finish line!";
  });

  // The ONE true path to victory:
  btnRealConfirm.addEventListener('click', () => {
    clearInterval(timerInterval);
    finalConfirmationModal.classList.add('hidden');
    showVictoryScreen();
  });

  // 8. VICTORY SCREEN & CONFETTI CELEBRATION
  function showVictoryScreen() {
    victoryScreen.classList.remove('hidden');
    vTotalTime.textContent = liveTimer.textContent;
    vFailedClicks.textContent = failedClickCount;

    if (window.soundFX) window.soundFX.playVictory();
    spawnConfetti();
  }

  function spawnConfetti() {
    const colors = ['#f59e0b', '#10b981', '#38bdf8', '#ef4444', '#ec4899', '#ffffff'];
    for (let i = 0; i < 90; i++) {
      const conf = document.createElement('div');
      conf.className = 'confetti';
      conf.style.left = `${Math.random() * 100}vw`;
      conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      conf.style.animationDuration = `${1.8 + Math.random() * 2.5}s`;
      conf.style.animationDelay = `${Math.random() * 0.8}s`;
      document.body.appendChild(conf);

      setTimeout(() => conf.remove(), 4500);
    }
  }

  // 9. Extra Playful Controls
  lightSwitchBtn.addEventListener('click', () => {
    isLightsDimmed = !isLightsDimmed;
    document.body.classList.toggle('lights-dimmed', isLightsDimmed);
    lightSwitchBtn.textContent = isLightsDimmed ? '💡 Lights ON' : '💡 Dim Lights';
    tickerText.textContent = isLightsDimmed ? '🕶️ Cinema lights dimmed! Use your cursor flashlight!' : '💡 Lights restored!';
  });

  document.addEventListener('mousemove', (e) => {
    if (isLightsDimmed) {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    }
  });

  sortModeBtn.addEventListener('click', () => {
    isAlphabeticalOrder = !isAlphabeticalOrder;
    const activeOrder = isAlphabeticalOrder ? rowLettersChaotic : rowLettersDefault;
    buildGrid(activeOrder);
    sortModeBtn.textContent = isAlphabeticalOrder ? '🔀 Sort: Normal' : '🔀 Sort: Chaotic Alpha';
    tickerText.textContent = isAlphabeticalOrder ? '🔀 Rows re-sorted by chaos algorithm!' : '🔤 Standard row order restored!';
  });

  restartBtn.addEventListener('click', () => {
    victoryScreen.classList.add('hidden');
    startTime = Date.now();
    ragePercent = 12;
    failedClickCount = 0;
    selectedSeat = null;
    f12DodgesLeft = 3;
    confirmDodgesLeft = 3;
    closeXDodgesLeft = 2;
    declineDodgesLeft = 2;
    isCalibrated = false;
    isSnackHandled = false;
    isF12LockedByBot = true;
    isLockCountdownRunning = false;

    rageIndex.textContent = '12%';
    failedClicks.textContent = '0';
    selectedSeatDisplay.textContent = 'NONE';
    summarySeatName.textContent = 'No seat selected';
    confirmBtn.disabled = true;
    confirmBtn.classList.add('disabled');
    confirmBtn.classList.remove('exhausted');
    confirmBtn.querySelector('.btn-text').textContent = 'CONFIRM SELECTION (F12)';

    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 80);

    buildGrid(rowLettersDefault);
  });

  // Initial Grid Build
  buildGrid(rowLettersDefault);
});
