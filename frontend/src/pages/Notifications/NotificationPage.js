/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const styles = {
  section: {
    margin: '2rem 0',
  },
  notification: {
    margin: '1rem 0',
    fontSize: '1rem',
    lineHeight: '1.5',
  },
  table: {
    width: '30%', 
    borderCollapse: 'collapse',
    fontSize: '2 rem', 
    margin: '0 auto', 
  },
  th: {
    border: '1px solid #999',
    padding: '0.1rem', 
    textAlign: 'left',
  },
  td: {
    border: '1px solid #999',
    padding: '0.1rem', 
    textAlign: 'left',
  },
};

const NotificationsPage = () => {
  const [gameNotifications, setGameNotifications] = useState([]);
  const [scoreNotifications, setScoreNotifications] = useState([]);
  const [teamNotifications, setTeamNotifications] = useState([]);
  const [topScorers, setTopScorers] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const gameRes = await axios.get('https://07c4hsswo7.execute-api.us-east-1.amazonaws.com/default/notifications');
        setGameNotifications(gameRes.data);

        const scoreRes = await axios.get('https://wdwj0buap7.execute-api.us-east-1.amazonaws.com/default/scorenotifications');
        setScoreNotifications(scoreRes.data);


        const sortedScores = [...scoreRes.data].sort((a, b) => b.score - a.score);
        setTopScorers(sortedScores.slice(0, 3));

        const teamRes = await axios.get('https://k0wkpv52re.execute-api.us-east-1.amazonaws.com/default/teamnotifications');
        setTeamNotifications(teamRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotifications();
  }, []);

  const getLevelUnlockMessage = (score) => {
    if (score >= 1000) return 'Platinum level unlocked!';
    if (score >= 500) return 'Silver level unlocked!';
    if (score >= 200) return 'Gold level unlocked!';
    return '';
  };

  return (
    <div>
      <section style={styles.section}>
        <h2>Game Notifications</h2>
        {gameNotifications.map((notification, index) => (
          <p style={styles.notification} key={index}>
            {`Check this out! There is a new game called ${notification} available.`}
          </p>
        ))}
      </section>

      <section style={styles.section}>
        <h2>Score Notifications</h2>
        {scoreNotifications.map((notification, index) => (
          <p style={styles.notification} key={index}>
            {`${notification.name} has scored ${notification.score}. ${getLevelUnlockMessage(notification.score)}`}
          </p>
        ))}
      </section>

      <section style={styles.section}>
        <h2>Top Scorers</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Score</th>
            </tr>
          </thead>
          <tbody>
            {topScorers.map((scorer, index) => (
              <tr key={index}>
                <td style={styles.td}>{scorer.name}</td>
                <td style={styles.td}>{scorer.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={styles.section}>
        <h2>Team Notifications</h2>
        {teamNotifications.map((notification, index) => (
          <p style={styles.notification} key={index}>
            {`${notification.member} is added to team ${notification.teamName}`}
          </p>
        ))}
      </section>
    </div>
  );
};

export default NotificationsPage;
