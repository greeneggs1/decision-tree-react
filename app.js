import { DecisionTreeVisual } from './components/DecisionTreeVisual';
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
        // your existing steps array stays the same
    ];

    const currentStep = steps[this.state.currentStep];

    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left side: Question Panel */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2>Decision Tree</h2>
                    <input
                        type="text"
                        placeholder="Enter Project Name"
                        value={this.state.projectName}
                        onChange={this.handleInputChange}
                    />
                    {currentStep && (
                        <>
                            <p>{currentStep.question}</p>
                            <div>
                                <button onClick={() => this.handleAnswer("Yes")}>Yes</button>
                                <button onClick={() => this.handleAnswer("No")}>No</button>
                            </div>
                        </>
                    )}
                </div>

                {/* Right side: Visual Tree */}
                <DecisionTreeVisual 
                    steps={steps}
                    currentStep={this.state.currentStep}
                    answers={this.state.answers}
                />
            </div>
        </div>
    );
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
