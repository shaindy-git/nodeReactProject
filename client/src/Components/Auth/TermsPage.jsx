const TermsPage = () => {
    return (
        <div style={{ 
            backgroundColor: "#fff", 
            color: "#000", 
            padding: "2rem", 
            fontFamily: "Arial, sans-serif", 
            direction: "ltr", 
            textAlign: "left" 
        }}>
            <h1 style={{ fontWeight: "bold", fontSize: "2rem", marginBottom: "1.5rem" }}>
                Terms of Use – Ministry of Transport Driving License System
            </h1>
            
            <p><strong>1. Definitions:</strong><br />
            This website serves to manage the driver license training process and includes three user levels:<br />
            <strong>- Regional Administrators:</strong> manage instructors and students in their region.<br />
            <strong>- Driving Instructors:</strong> register students, schedule lessons, and track progress.<br />
            <strong>- Students:</strong> enroll in lessons and view their progress and personal data.</p>

            <p><strong>2. Access and Permissions:</strong><br />
            Access requires personal identification with username and password. Users may access only information relevant to their role.</p>

            <p><strong>3. Data Security:</strong><br />
            All data is stored and processed according to Israeli privacy protection regulations. Sharing login details or personal data with third parties is strictly prohibited.</p>

            <p><strong>4. Permitted Use:</strong><br />
            The system is intended solely for official use related to the driver licensing process. Any commercial, abusive, or illegal use is strictly forbidden.</p>

            <p><strong>5. Liability:</strong><br />
            The Ministry of Transport endeavors to maintain accuracy and availability of the service, but temporary interruptions may occur. No full guarantee is provided.</p>

            <p><strong>6. Changes to the Terms:</strong><br />
            Terms may be updated periodically. Users are responsible for staying informed of any changes.</p>

            <p><strong>7. Support and Inquiries:</strong><br />
            For technical support or questions, please contact your regional support center through the contact details provided on the site.</p>
        </div>
    );
};

export default TermsPage;
