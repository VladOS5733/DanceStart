const trainers = [
  { id: 1, name: 'Анна Смирнова',   direction: 'Классическая хореография', img: 'https://i.pravatar.cc/400?img=47' },
  { id: 2, name: 'Дмитрий Козлов',  direction: 'ОФП и функциональная подготовка', img: 'https://i.pravatar.cc/400?img=12' },
  { id: 3, name: 'Елена Волкова',   direction: 'Технические прогоны', img: 'https://i.pravatar.cc/400?img=32' },
  { id: 4, name: 'Максим Петров',   direction: 'Современная хореография', img: 'https://i.pravatar.cc/400?img=13' },
  { id: 5, name: 'Ольга Новикова',  direction: 'Теоретическая подготовка', img: 'https://i.pravatar.cc/400?img=45' },
  { id: 6, name: 'Сергей Морозов',  direction: 'Брейк-данс', img: 'https://i.pravatar.cc/400?img=59' },
  { id: 7, name: 'Ирина Соколова',  direction: 'Латиноамериканская программа', img: 'https://i.pravatar.cc/400?img=48' },
  { id: 8, name: 'Алексей Лебедев', direction: 'Hip-Hop', img: 'https://i.pravatar.cc/400?img=15' },
];

const grid = document.getElementById('booking-trainers');

if (grid) {
  grid.innerHTML = trainers.map((t) => `
    <article class="trainer-card bookable">
      <img class="trainer-photo" src="${t.img}" alt="${t.name}">
      <div class="trainer-info">
        <h3 class="trainer-name">${t.name}</h3>
        <p class="trainer-direction">${t.direction}</p>
      </div>
      <!-- Теперь это ссылка, которая передает ID тренера в URL -->
      <a href="checkout.html?trainer=${t.id}" class="btn btn-coral book-btn" style="text-align:center;">Записаться</a>
    </article>
  `).join('');
}

const form = document.getElementById('checkout-form');

if (form) {
  const selectTrainer = document.getElementById('select-trainer');
  const selectDate = document.getElementById('select-date');
  const selectTime = document.getElementById('select-time');
  const formMessage = document.getElementById('form-message');

  // 1. Заполняем выпадающий список тренеров
  selectTrainer.innerHTML += trainers.map(t => 
    `<option value="${t.id}">${t.name} (${t.direction})</option>`
  ).join('');

  // 2. Проверяем URL: если есть ?trainer=1, выбираем этого тренера
  const urlParams = new URLSearchParams(window.location.search);
  const trainerId = urlParams.get('trainer');
  
  if (trainerId) {
    selectTrainer.value = trainerId; // Автоматически выбираем тренера
  }

  // 3. Заполняем даты (на 14 дней вперед)
  const WEEKDAYS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const MONTHS = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
  const today = new Date();
  
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const value = d.toISOString().slice(0, 10);
    const label = `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
    const opt = document.createElement('option');
    opt.value = value;
    opt.textContent = label;
    selectDate.appendChild(opt);
  }

  // 4. Заполняем время
  for (let h = 9; h <= 21; h++) {
    for (const m of [0, 15, 30, 45]) {
      if (h === 21 && m > 0) continue;
      const value = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      const opt = document.createElement('option');
      opt.value = value;
      opt.textContent = value;
      selectTime.appendChild(opt);
    }
  }

  // 5. Обработка отправки формы
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fio = form.fio.value.trim();
    const phone = form.phone.value.trim();
    const trainerId = form.trainer.value;
    const date = form.date.value;
    const time = form.time.value;

    // Валидация
    if (!trainerId) {
      formMessage.textContent = 'Пожалуйста, выберите тренера';
      formMessage.className = 'form-message error';
      return;
    }
    if (fio.length < 5) {
      formMessage.textContent = 'Введите корректное ФИО';
      formMessage.className = 'form-message error';
      return;
    }
    if (!/^[\+0-9\s\(\)\-]{10,20}$/.test(phone)) {
      formMessage.textContent = 'Введите корректный номер телефона';
      formMessage.className = 'form-message error';
      return;
    }

    // Ищем имя тренера для сообщения
    const trainerName = trainers.find(t => t.id == trainerId)?.name || 'тренеру';
    const [y, m, d] = date.split('-');

    formMessage.textContent = `Готово! Вы записаны на ${d}.${m}.${y} в ${time} к тренеру ${trainerName}.`;
    formMessage.className = 'form-message success';

    // Очистка полей
    form.fio.value = '';
    form.phone.value = '';
  });
}