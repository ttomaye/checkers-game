import './App.css';

const ActionButtons = ({ revertLastMove, restartGame }) => {
    return (
        <div className="flex-row width-400">
            <button
                onClick={revertLastMove}
                className="button button-revert"
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#45a049"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#4CAF50"}
            >
                Revert Last Move
            </button>
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
