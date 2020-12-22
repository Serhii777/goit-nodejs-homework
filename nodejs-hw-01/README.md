Запускаем команды в терминале и делаем отдельные скриншоты результата выполнения каждой команды.

# Получаем и выводим весь список контакстов в виде таблицы (console.table)

node index.js --action="list"
https://ibb.co/KrR5Y27

# Получаем контакт по id

node index.js --action="get" --id=5
https://ibb.co/4sTt3vj

# Добавялем контакт

node index.js --action="add" --name="Mango" --email="mango@gmail.com" --phone="322-22-22"
https://ibb.co/C5Nsz4R

# Удаляем контакт

node index.js --action="remove" --id=3
https://ibb.co/VgGnJMj
