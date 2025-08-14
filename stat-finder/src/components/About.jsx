import '../styles/contact-about.css'

export default function About() {
    return (
        <div className="about-page">
            <h1>About OVR/UNDR</h1>
            
            <section className="mission">
                <h2>Our Mission</h2>
                <p>
                    We believe that sports betting shouldn't be based on gut feelings alone. 
                    OVR/UNDR was created to help NBA fans and bettors make more informed decisions 
                    by providing clear, visual insights into how players perform against betting lines.
                </p>
            </section>

            <section className="how-it-works">
                <h2>How It Works</h2>
                <div className="steps">
                    <div className="step">
                        <h3>1. Search</h3>
                        Enter any NBA player's name to access their recent game statistics.
                    </div>
                    <div className="step">
                        <h3>2. Filter</h3>
                        Narrow results by opponent, minutes played, home/away games, and more.
                    </div>
                    <div className="step">
                        <h3>3. Analyze</h3>
                        View interactive charts showing performance vs. betting lines with clear over/under indicators.
                    </div>
                </div>
            </section>

            <section className="about-features">
                <h2>Key Features</h2>
                <ul>
                    <li><strong>Visual Analytics:</strong> Interactive charts that make trends easy to spot</li>
                    <li><strong>Smart Filtering:</strong> Filter by opponent, minutes, home/away splits</li>
                    <li><strong>Multiple Stats:</strong> Track points, rebounds, assists, and combined stats</li>
                    <li><strong>Recent Focus:</strong> Emphasis on last 5-10 games for current form</li>
                    <li><strong>Clean Interface:</strong> No clutter, just the data you need</li>
                </ul>
            </section>

            <section className="data-source">
                <h2>Data Source</h2>
                <p>
                    All player statistics are sourced from Basketball-Reference.com, ensuring 
                    accuracy and reliability. Data is updated daily during the NBA season to 
                    provide the most current insights.
                </p>
            </section>

            <section className="disclaimer">
                <h2>Important Note</h2>
                <p>
                    This tool is designed for educational and research purposes. While we provide 
                    statistical insights to help inform decisions, past performance does not 
                    guarantee future results. Please gamble responsibly and within your means.
                </p>
            </section>

            <section className="developer">
                <h2>About the Developer</h2>
                <p>
                    My name is Anthony Gudiel, and I'm a student interested in sports 
                    and data visualization. I built this application using React, Node.js, and PostgreSQL to deliver 
                    fast, reliable NBA statistics analysis.
                </p>
            </section>
        </div>
    )
}