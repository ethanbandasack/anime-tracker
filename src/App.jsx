import React, { useState } from 'react';
import './style.css';
import scheduleData from './scheduleData.json';

function AnimeItem({ show, onToggleViewing }) {
  const [showFullTitle, setShowFullTitle] = useState(false);

  const getPlatformClass = (platform) => {
    if (!platform) return 'pf-default';
    const pf = platform.toLowerCase().replace(/\s+/g, '');
    return `pf-${pf}`;
  };

  const displayName = show.display || show.title;
  const itemClasses = `anime-item${show.viewing === false ? ' not-viewing' : ''}`;
  const animeNameClasses = `anime-name${show.new === false ? ' not-new-title' : ''}`;

  return (
    <li
      className={itemClasses}
      onClick={() => onToggleViewing(show)}
      onMouseEnter={() => setShowFullTitle(true)}
      onMouseLeave={() => setShowFullTitle(false)}
      title="Toggle viewing"
    >
      <span className="hour-dot-wrap">
        <span className="time">{show.time}</span>
        <span
          className={`pf-dot ${getPlatformClass(show.plateform)}`}
          title={show.plateform || ''}
        />
      </span>
      <span className={animeNameClasses}>
        <span
          className="anime-display"
          style={{ display: showFullTitle ? 'none' : 'inline' }}
        >
          {displayName}
        </span>
        <span
          className="anime-full"
          style={{ display: showFullTitle ? 'inline' : 'none' }}
        >
          {show.title}
        </span>
      </span>
    </li>
  );
}

function DayCard({ day, shows, isToday, onToggleViewing }) {
  const viewingCount = shows.filter(show => show.viewing).length;
  const totalCount = shows.length;

  return (
    <div className={`day${isToday ? ' day-current' : ''}`}>
      <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>{day}</span>
        <span style={{ fontSize: '0.85em', fontWeight: 'normal', color: '#888', marginLeft: '0.5em' }}>
          {viewingCount} / {totalCount}
        </span>
      </h2>
      <ul>
        {shows.map((show, index) => (
          <AnimeItem key={index} show={show} onToggleViewing={onToggleViewing} />
        ))}
      </ul>
    </div>
  );
}

function App() {
  const [schedule, setSchedule] = useState(scheduleData);

  // Detect current day in French
  const daysFr = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const todayIdx = new Date().getDay();
  const todayFr = daysFr[todayIdx];

  // Calculate total viewing
  const totalViewing = Object.values(schedule).reduce((acc, shows) => 
    acc + shows.filter(show => show.viewing).length, 0
  );
  const totalShows = Object.values(schedule).reduce((acc, shows) => 
    acc + shows.length, 0
  );

  const handleToggleViewing = (targetShow) => {
    setSchedule(prevSchedule => {
      const newSchedule = { ...prevSchedule };
      Object.keys(newSchedule).forEach(day => {
        newSchedule[day] = newSchedule[day].map(show => 
          show === targetShow ? { ...show, viewing: !show.viewing } : show
        );
      });
      return newSchedule;
    });
  };

  const handleResetViewing = () => {
    setSchedule(prevSchedule => {
      const newSchedule = { ...prevSchedule };
      Object.keys(newSchedule).forEach(day => {
        newSchedule[day] = newSchedule[day].map(show => ({ ...show, viewing: false }));
      });
      return newSchedule;
    });
  };

  return (
    <div>
      <h1>Anime Tracker</h1>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1em', marginBottom: '0.5em' }}>
        <div id="total-viewing" style={{ fontSize: '1em', color: '#00bcd4', textAlign: 'center' }}>
          Total viewing: {totalViewing} / {totalShows}
        </div>
        <button 
          onClick={handleResetViewing}
          style={{ 
            fontSize: '0.95em', 
            padding: '0.2em 0.7em', 
            borderRadius: '4px', 
            border: '1px solid #00bcd4', 
            background: '#e0f7fa', 
            color: '#00bcd4', 
            cursor: 'pointer' 
          }}
        >
          Reset
        </button>
      </div>
      <div className="container">
        {Object.entries(schedule).map(([day, shows]) => (
          <DayCard 
            key={day} 
            day={day} 
            shows={shows} 
            isToday={day === todayFr}
            onToggleViewing={handleToggleViewing}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
