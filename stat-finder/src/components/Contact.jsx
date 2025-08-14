import '../styles/contact-about.css'

export default function Contact() {
    return (
        <div className="contact-page">
            <h1>Get in Touch</h1>
            
            <section className="contact-info">
                <h2>Contact Information</h2>
                <p>Email: <a href="overUnderApp@gmail.com">overUnderApp@gmail.com</a></p>
                <p>GitHub: <a href="https://github.com/anthony-gudiel">@anthony-gudiel</a></p>
                <p>LinkedIn: <a href="https://linkedin.com/in/anthony-gudiel">Anthony Gudiel</a></p>
            </section>

            <section className="feedback">
                <h2>Feedback & Support</h2>
                <p>Found a bug? Have a feature request? We'd love to hear from you!</p>
                <ul>
                    <li><strong>Bug Reports:</strong> Email us with details about any issues</li>
                    <li><strong>Feature Ideas:</strong> Suggest new stats or filtering options</li>
                    <li><strong>Data Questions:</strong> Ask about our data sources or methodology</li>
                </ul>
            </section>

            <section className="data-info">
                <h2>Data & Updates</h2>
                <p>Player statistics are sourced from Basketball-Reference.com</p>
                <p>Data is updated daily during the NBA season</p>
            </section>
        </div>
    )
}