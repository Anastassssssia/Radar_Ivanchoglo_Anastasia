<h3>Розробка додатку для візуалізації вимірювань радару</h3>

<b>1. Створення початкових налаштувань радара</b><br> 
Встановлено початкові налаштування радара в об'єкті <code>config</code>, що включає кількість вимірювань на оберт (<code>measurementsPerRotation</code>), швидкість обертання (<code>rotationSpeed</code>) та швидкість цілей (<code>targetSpeed</code>). Це дозволяє симулювати різні сценарії роботи радара, відстежуючи цілі з різними параметрами.<br>

<b>2. Підключення до WebSocket сервера</b><br> 
Написана функція <code>connectToWebSocket</code>, яка підключається до сервера за адресою <code>ws://localhost:4000</code>. Під час отримання даних через WebSocket обробляються відповіді та додаються нові цілі до масиву цілей для подальшої візуалізації на графіку.<br>

<b>3. Обробка даних</b><br> 
Для кожної отриманої відповіді обчислюється відстань до цілі за допомогою формули для обчислення часу сигналу: <code>distance = (time * 300000) / 2</code>, де <code>time</code> —  час поширення сигналу до цілі і назад. <br>

<b>4. Візуалізація на полярному графіку</b><br> 
Для візуалізації використана бібліотека <code>Plotly</code>. Дані про цілі відображаються на графіку у вигляді точок з відповідними координатами: <code>кут</code> та <code>відстань</code> (полярні координати). Кольори точок визначаються потужністю сигналу, а кольорова шкала "Viridis" допомагає відобразити рівень потужності для кожної цілі.<br>

<b>5. Оновлення налаштувань радара</b><br> 
Створено форму для зміни параметрів радара, яка дозволяє оновлювати кількість вимірювань на оберт, швидкість обертання радара та швидкість цілей. Після введення нових значень дані відправляються на сервер через <code>PUT</code> запит, що дозволяє змінювати поведінку радара в реальному часі.<br>

<b>Результат:</b><br>
<img src='./radar.png' style='width : 80%;'>
