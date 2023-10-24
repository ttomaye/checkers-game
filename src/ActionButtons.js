import './App.css';

const ActionButtons = ({ restartGame }) => {
    return (
        <div className="flex-row width-400">
            <button
                onClick={restartGame}
                className="button button-restart"
            >
                Restart Game
            </button>

        </div>
    );
};

export default ActionButtons;
