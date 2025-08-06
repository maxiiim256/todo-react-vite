import { useState } from 'react';
import './index.css';

function getDateLabel(dateStr) {
  if (!dateStr) return 'Без даты';
  const date = new Date(dateStr);
  return date.toLocaleString();
}

function isToday(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}
function isTomorrow(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  now.setDate(now.getDate() + 1);
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [inputDate, setInputDate] = useState('');
  const [editId, setEditId] = useState(null);
  const [tempDate, setTempDate] = useState('');

  // Добавить задачу
  function addTask() {
    if (!input.trim()) return;
    setTasks([
      ...tasks,
      { id: Date.now() + Math.random(), text: input, completed: false, date: inputDate }
    ]);
    setInput('');
    setInputDate('');
  }

  // Отметить задачу выполненной
  function toggleTask(id) {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }

  // Удалить задачу
  function deleteTask(id) {
    setTasks(tasks.filter(t => t.id !== id));
  }

  // Открыть редактор даты
  function openEditDate(id, date) {
    setEditId(id);
    setTempDate(date || '');
  }

  // Сохранить дату
  function saveDate(id) {
    setTasks(tasks.map(t => t.id === id ? { ...t, date: tempDate } : t));
    setEditId(null);
    setTempDate('');
  }

  // Отмена редактирования даты
  function cancelEdit() {
    setEditId(null);
    setTempDate('');
  }

  // Группировка задач
  const today = tasks.filter(t => isToday(t.date));
  const tomorrow = tasks.filter(t => isTomorrow(t.date));
  const noDate = tasks.filter(t => !t.date);
  const other = tasks.filter(t => t.date && !isToday(t.date) && !isTomorrow(t.date));

  return (
    <div className="container wide">
      <h1>TODO List</h1>
      <div className="input-group oval">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Введите задачу"
          className="oval-input"
        />
        <input
          type="datetime-local"
          value={inputDate}
          onChange={e => setInputDate(e.target.value)}
          className="date-input oval-date"
        />
        <button onClick={addTask}>Добавить</button>
      </div>
      <div className="tasks-groups">
        {[
          { label: 'Сегодня', arr: today },
          { label: 'Завтра', arr: tomorrow },
          { label: 'Без даты', arr: noDate },
          { label: 'Другие дни', arr: other }
        ].map(group => group.arr.length > 0 && (
          <div key={group.label} className="task-group-row">
            <div className="group-label">{group.label}</div>
            <div className="group-tasks-row">
              {group.arr.map(task => (
                <div
                  key={task.id}
                  className={`task-card${task.completed ? ' completed' : ''}`}
                  onClick={e => {
                    if (
                      e.target.classList.contains('delete-btn') ||
                      e.target.classList.contains('planned-date') ||
                      e.target.closest('.date-editor-group')
                    ) return;
                    toggleTask(task.id);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="task-text">{task.text}</span>
                  {editId === task.id ? (
                    <span className="date-editor-group">
                      <input
                        type="datetime-local"
                        className="date-input"
                        value={tempDate}
                        onChange={e => setTempDate(e.target.value)}
                        autoFocus
                        onKeyDown={e => {
                          if (e.key === 'Enter') saveDate(task.id);
                          if (e.key === 'Escape') cancelEdit();
                        }}
                      />
                      <button className="ok-btn" onClick={e => { e.stopPropagation(); saveDate(task.id); }}>ОК</button>
                      <button className="cancel-btn" onClick={e => { e.stopPropagation(); cancelEdit(); }}>Отмена</button>
                    </span>
                  ) : (
                    <span
                      className="planned-date"
                      onClick={e => { e.stopPropagation(); openEditDate(task.id, task.date); }}
                      title="Изменить дату"
                      style={{ cursor: 'pointer' }}
                    >
                      {getDateLabel(task.date)}
                    </span>
                  )}
                  <button
                    className="delete-btn"
                    onClick={e => { e.stopPropagation(); deleteTask(task.id); }}
                    title="Удалить"
                  >✖</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;