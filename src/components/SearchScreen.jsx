import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCheck,
	faChevronLeft,
	faMagnifyingGlass,
	faPenToSquare,
	faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { getTasks } from "../api";

function SearchScreen({ tasks, onClose, onEdit, onDelete, onToggle }) {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);

	useEffect(() => {
		if (!query.trim()) {
			setResults([]);
			return;
		}

		const timer = setTimeout(() => {
			getTasks(query.trim())
				.then(setResults)
				.catch(() => setResults([]));
		}, 300);

		return () => clearTimeout(timer);
	}, [query, tasks]);

	const displayResults = query.trim() ? results : tasks;

	const visibleTasks = query.trim() ? results : displayResults;

	return (
		<div className="search-page">
			<div className="search-screen">
				{/* Search Header */}
				<div className="search-header">
					<button
						type="button"
						onClick={onClose}
						className="search-back-button"
						aria-label="Back"
					>
						<FontAwesomeIcon
							icon={faChevronLeft}
							style={{ fontSize: 16 }}
						/>
					</button>

					<div className="search-input-wrapper">
						<input
							autoFocus
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Finish"
							className="search-input"
						/>

						<span className="search-icon">
							<FontAwesomeIcon
								icon={faMagnifyingGlass}
								style={{ fontSize: 14 }}
							/>
						</span>
					</div>
				</div>

				{/* Results */}
				<div className="search-results">
					{query.trim() && results.length === 0 && (
						<p className="search-empty">
							No tasks found for "{query}"
						</p>
					)}

					{!query.trim() && displayResults.length === 0 && (
						<p className="search-empty">No tasks yet</p>
					)}

					{visibleTasks.map((task) => {
						const completed = task.status === "Completed";

						return (
							<div
								key={task._id}
								className="search-task-row"
							>
								{/* Checkbox */}
								<button
									type="button"
									onClick={() => onToggle(task)}
									className={`search-checkbox ${
										completed ? "completed" : ""
									}`}
									aria-label="Toggle task"
								>
									{completed && (
										<FontAwesomeIcon
											icon={faCheck}
											style={{ fontSize: 9 }}
										/>
									)}
								</button>

								{/* Task name */}
								<span
									className={`search-task-name ${
										completed ? "completed" : ""
									}`}
								>
									{task.title}
								</span>

								{/* Actions */}
								<div className="search-task-actions">
									<button
										type="button"
										onClick={() => onDelete(task._id)}
										aria-label="Delete task"
									>
										<FontAwesomeIcon
											icon={faTrashCan}
											style={{ fontSize: 12 }}
										/>
									</button>

									<button
										type="button"
										onClick={() => onEdit(task)}
										aria-label="Edit task"
									>
										<FontAwesomeIcon
											icon={faPenToSquare}
											style={{ fontSize: 12 }}
										/>
									</button>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default SearchScreen;
