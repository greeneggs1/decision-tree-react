class DecisionTree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStep: 0,
            answers: [],
            projectName: ''
        };
    }

    handleInputChange = (event) => {
        this.setState({ projectName: event.target.value });
    };

    handleAnswer = (answer) => {
        this.setState((prevState) => ({
            currentStep: prevState.currentStep + 1,
            answers: [...prevState.answers, answer]
        }));
    };

    sendResultsToBackend = () => {
        const unfavorableAnswers = this.state.answers.filter(answer => answer === "No").length;
        const result = unfavorableAnswers > 2 ? "Decline or refer" : (unfavorableAnswers > 0 ? "Proceed with caution" : "Accept the client");
        
        const resultData = {
            projectName: this.state.projectName,
            answers: this.state.answers,
            result: result
        };

        fetch('/api/results', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(resultData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    render() {
        const steps = [
            { question: "Does the client's mission align with your CDFI expertise and values?", yes: 1, no: -1 },
            { question: "Does the project fit within your service offerings?", yes: 2, no: -1 },
            { question: "Will this project help you achieve your long-term goals?", yes: 3, no: 0 },
            { question: "Do you have the time and resources to take on this project?", yes: 4, no: 0 },
            { question: "Can you meet the client's deadlines without overextending yourself?", yes: 5, no: 0 },
            { question: "Will this project require subcontractors or additional help?", yes: 6, no: 6 },
            { question: "Is the client or lead contractor reputable and trustworthy?", yes: 7, no: 0 },
            { question: "Does the client have a history of timely payments?", yes: 8, no: 0 },
            { question: "Is this a one-time project or a potential long-term relationship?", yes: 9, no: 9 },
            { question: "Is the client or project connected to a personal relationship?", yes: 10, no: 11 },
            { question: "Will working with this client strengthen or strain your personal relationships?", yes: 12, no: 0 },
            { question: "Is the client's budget aligned with your rates?", yes: 13, no: 0 },
            { question: "Are you comfortable with the payment terms?", yes: 14, no: 0 },
            { question: "Will this project provide sufficient cash flow to cover your expenses?", yes: 15, no: 0 },
            { question: "Are all answers favorable?", yes: 16, no: 0 },
        ];

        const currentStep = steps[this.state.currentStep];

        if (this.state.currentStep === steps.length) {
            const unfavorableAnswers = this.state.answers.filter(answer => answer === "No").length;
            const result = unfavorableAnswers > 2 ? "Decline or refer" : (unfavorableAnswers > 0 ? "Proceed with caution" : "Accept the client");
            return (
                <div className="decision-result">
                    <h2>Final Decision: {result}</h2>
                    <p>Project Name: {this.state.projectName}</p>
                    <button onClick={() => {
                        this.sendResultsToBackend();
                        this.setState({ currentStep: 0, answers: [], projectName: '' });
                    }}>Save & Restart</button>
                </div>
            );
        }

        if (currentStep === -1) {
            return (
                <div className="decision-result">
                    <h2>Final Decision: Decline or refer</h2>
                    <p>Project Name: {this.state.projectName}</p>
                    <button onClick={() => {
                        this.sendResultsToBackend();
                        this.setState({ currentStep: 0, answers: [], projectName: '' });
                    }}>Save & Restart</button>
                </div>
            );
        }

        return (
            <div className="decision-tree">
                <h2>Decision Tree</h2>
                <div className="input-section">
                    <input
                        type="text"
                        placeholder="Enter Project Name"
                        value={this.state.projectName}
                        onChange={this.handleInputChange}
                    />
                </div>
                <div className="question-section">
                    <p>{currentStep.question}</p>
                    <div className="button-group">
                        <button onClick={() => this.handleAnswer("Yes")}>Yes</button>
                        <button onClick={() => this.handleAnswer("No")}>No</button>
                    </div>
                </div>
            </div>
        );
    }
}

// Initialize the button click handler
document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('decision-tree-button');
    if (button) {
        button.addEventListener('click', () => {
            const root = document.getElementById('root');
            ReactDOM.render(<DecisionTree />, root);
            button.style.display = 'none'; // Hide the button after clicking
        });
    }
});
