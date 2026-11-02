export default function BudgetStep() {
    return (
        <div className="location-step-section">
            <div className="location-form">
                <div className="single-field">
                    <label htmlFor="">Enter your age</label>
                    <input type="text" placeholder="Enter your age" />
                </div>
                <div className="single-field">
                    <label htmlFor="">Enter the language you prefer</label>
                    <input type="text" placeholder="Enter your language" />
                </div>
                <div className="single-field">
                    <label htmlFor="">Enter your desired budget($)</label>
                    <input type="number" placeholder="Enter your budget" />
                </div>
            </div>
        </div>
    )
}