/* eslint-disable prettier/prettier */
import React from 'react';

function LookerReport() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      
      <h1 style={{ marginBottom: '20px' }}>Team Performance</h1>
      <iframe 
        title="Team Performance"
        width="80%" 
        height="80%" 
        src="https://lookerstudio.google.com/embed/reporting/78686109-5277-4166-9173-06df02a4507c/page/Zb3YD" 
        frameBorder="0" 
        style={{ border:0 }} 
        allowFullScreen 
      />

      <h1 style={{ marginTop: '40px', marginBottom: '20px' }}>User Performance</h1>
      <iframe
        title="User Performance"
        width="80%"
        height="80%"
        src="https://lookerstudio.google.com/embed/reporting/6f71d2f2-4ac0-49d8-9564-4a47e0eb9d88/page/CA1YD"
        frameBorder="0"
        style={{ border:0 }}
        allowFullScreen
      />
    </div>
  );
}

export default LookerReport;
