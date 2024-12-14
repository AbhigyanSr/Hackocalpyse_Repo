import React from 'react';

const survivalContent = {
  title: "VaultNet Survival Guide: Your Digital Lifeline in the Wasteland",
  sections: [
    {
      title: "Welcome, Survivors",
      content: "In the harsh aftermath of civilization's collapse, information is as critical as food and water. VaultNet is more than just a network—it's your digital thread of survival, connection, and hope in a world torn apart by devastation."
    },
    {
      title: "Registration and Authentication: Your Digital Identity",
      subsections: [
        {
          subtitle: "Why Registration Matters",
          content: "In a world where trust is scarce and survival depends on verified connections, your VaultNet registration is your passport to community and resources."
        },
        {
          subtitle: "Registration Process",
          list: [
            "Secure an operational communication device",
            "Locate a VaultNet access point",
            "Use a salvaged or functioning email address",
            "Complete the authentication protocol",
            "Receive your unique Survivor Identification Code (SIC)"
          ]
        },
        {
          subtitle: "WARNING",
          content: "Your registration is your lifeline. Guard your credentials with the same vigilance you would a loaded weapon.",
          isWarning: true
        }
      ]
    },
    {
      title: "Emergency Alert Notification System: Survival Intelligence",
      content: "VaultNet's color-coded alert system transforms raw information into immediate survival strategy:",
      alerts: [
        { level: "Green Alert", desc: "Standard community updates, resource availability, minor territorial shifts" },
        { level: "Yellow Alert", desc: "Potential danger, increased threat levels, recommended caution" },
        { level: "Red Alert", desc: "Imminent extreme danger - immediate protective action required" }
      ]
    },
    {
      title: "Resource Trading Platform: The Digital Marketplace of Survival",
      subsections: [
        {
          subtitle: "The New Economy of Exchange",
          content: "VaultNet's trading platform isn't just a marketplace—it's the circulatory system of post-apocalyptic society. Here, survivors transform their scavenged goods into lifelines."
        },
        {
          subtitle: "Tradeable Resources",
          list: [
            "Food Supplies",
            "Purified Water",
            "Ammunition",
            "Medical Supplies",
            "Repair Components",
            "Survival Gear"
          ]
        }
      ]
    },
    {
      title: "Final Directive: Adapt, Connect, Survive",
      content: "VaultNet is more than technology—it's your community's nervous system. Use it wisely, protect your access, and remember: in this new world, information is the most valuable currency.",
      footer: "Stay vigilant. Stay connected. Survive.",
      signature: "- VaultNet Administration"
    }
  ]
};

function SurvivalGuide() {
  return (
    <div className="terminal-dashboard">
      <div className="survival-guide">
        <h1 className="guide-title">{survivalContent.title}</h1>
        
        {survivalContent.sections.map((section, index) => (
          <div key={index} className="guide-section">
            <h2 className="section-title">{section.title}</h2>
            
            {section.content && <p className="section-content">{section.content}</p>}
            
            {section.subsections?.map((subsection, subIndex) => (
              <div key={subIndex} className={`subsection ${subsection.isWarning ? 'warning' : ''}`}>
                {subsection.subtitle && (
                  <h3 className="subsection-title">{subsection.subtitle}</h3>
                )}
                {subsection.content && (
                  <p className="subsection-content">{subsection.content}</p>
                )}
                {subsection.list && (
                  <ul className="guide-list">
                    {subsection.list.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            
            {section.alerts && (
              <div className="alerts-grid">
                {section.alerts.map((alert, alertIndex) => (
                  <div key={alertIndex} className={`alert-type ${alert.level.split(' ')[0].toLowerCase()}`}>
                    <h4>{alert.level}</h4>
                    <p>{alert.desc}</p>
                  </div>
                ))}
              </div>
            )}
            
            {section.footer && (
              <div className="guide-footer">
                <p className="footer-text">{section.footer}</p>
                <p className="signature">{section.signature}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SurvivalGuide;