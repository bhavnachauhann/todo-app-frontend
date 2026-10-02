import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCheck,
	faMagnifyingGlass,
	faPenToSquare,
	faTrashCan,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { getTasks, createTask, updateTask, deleteTask } from "./api";
import TaskForm from "./components/TaskForm";
import SearchScreen from "./components/SearchScreen";
import OnboardingScreen from "./components/OnboardingScreen";
import "./App.css";

function App() {
	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [showForm, setShowForm] = useState(false);
	const [editingTask, setEditingTask] = useState(null);
	const [showSearch, setShowSearch] = useState(false);

	const [showOnboarding, setShowOnboarding] = useState(() => {
		try {
			return localStorage.getItem("todo-onboarding-seen") !== "true";
		} catch {
			return true;
		}
	});

	const loadTasks = async () => {
		try {
			const data = await getTasks();
			setTasks(data);
			setError("");
		} catch (err) {
			setError(
				"Could not load tasks. Please check that the server is running.",
			);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadTasks();
	}, []);

	useEffect(() => {
		try {
			if (!showOnboarding) {
				localStorage.setItem("todo-onboarding-seen", "true");
			}
		} catch {
			// Ignore storage errors
		}
	}, [showOnboarding]);

	const openAddForm = () => {
		setEditingTask(null);
		setShowForm(true);
	};

	const openEditForm = (task) => {
		setEditingTask(task);
		setShowForm(true);
	};

	const handleSave = async (formData) => {
		try {
			if (editingTask) {
				await updateTask(editingTask._id, formData);
			} else {
				await createTask(formData);
			}

			setShowForm(false);
			loadTasks();
		} catch (err) {
			setError("Could not save the task.");
		}
	};

	const handleDelete = async (id) => {
		try {
			await deleteTask(id);
			loadTasks();
		} catch (err) {
			setError("Could not delete the task.");
		}
	};

	const handleToggleStatus = async (task) => {
		const status =
			task.status === "Completed" ? "In Progress" : "Completed";

		try {
			await updateTask(task._id, { status });
			loadTasks();
		} catch (err) {
			setError("Could not update the task.");
		}
	};

	if (showOnboarding) {
		return (
			<OnboardingScreen onGetStarted={() => setShowOnboarding(false)} />
		);
	}

	const completedTasks = tasks.filter((task) => task.status === "Completed");

	const pendingTasks = tasks.filter((task) => task.status !== "Completed");

	const progress =
		tasks.length > 0
			? Math.round((completedTasks.length / tasks.length) * 100)
			: 0;

	const today = new Date();

	const weekDays = Array.from({ length: 7 }, (_, index) => {
		const date = new Date(today);
		date.setDate(today.getDate() - today.getDay() + index);

		return {
			day: date.toLocaleDateString("en-US", {
				weekday: "short",
			}),
			date: date.getDate(),
			active: date.toDateString() === today.toDateString(),
		};
	});

	return (
		<div className="app-page">
			<main className="todo-app">
				{/* Search */}
				<button
					className="search-box"
					onClick={() => setShowSearch(true)}
					aria-label="Search tasks"
				>
					<span>Search for a task</span>

					<FontAwesomeIcon
						icon={faMagnifyingGlass}
						style={{ fontSize: 16 }}
					/>
				</button>

				{/* Week Days */}
				<div className="week-days">
					{weekDays.map((item) => (
						<div
							key={item.date}
							className={`day-item ${
								item.active ? "active" : ""
							}`}
						>
							<span className="day-name">{item.day}</span>

							<span className="day-number">{item.date}</span>
						</div>
					))}
				</div>

				{/* Error */}
				{error && <div className="app-error">{error}</div>}

				{/* Summary Cards */}
				<div className="summary-row">
					<div className="summary-card completed-card">
						<div className="summary-icon">
							<span className="summary-icon-mark">
								<FontAwesomeIcon icon={faCheck} />
							</span>
						</div>

						<div className="summary-info">
							<span>Task Complete</span>

							<strong>{completedTasks.length}</strong>

							<small>This Week</small>
						</div>
					</div>

					<div className="summary-card pending-card">
						<div className="summary-icon pending-icon">
							<span className="summary-icon-mark">
								<FontAwesomeIcon icon={faXmark} />
							</span>
						</div>

						<div className="summary-info">
							<span>Task Pending</span>

							<strong>
								{pendingTasks.length
									.toString()
									.padStart(2, "0")}
							</strong>

							<small>This Week</small>
						</div>
					</div>
				</div>

				{/* Weekly Progress */}
				<section className="progress-section">
					<h2>Weekly Progress</h2>

					<div className="progress-bar">
						<div
							className="progress-fill"
							style={{
								width: `${progress}%`,
							}}
						/>
					</div>
				</section>

				{/* Tasks */}
				<section className="tasks-section">
					<div className="section-header">
						<h2>Tasks Today</h2>

						<button
							className="view-all"
							onClick={() => setShowSearch(true)}
						>
							View All
						</button>
					</div>

					{loading ? (
						<p className="loading-text">Loading tasks...</p>
					) : tasks.length === 0 ? (
						<p className="empty-text">No tasks yet.</p>
					) : (
						<div className="task-list">
							{tasks.slice(0, 6).map((task) => {
								const completed = task.status === "Completed";

								return (
									<div
										className="task-item"
										key={task._id}
									>
										<button
											className={`task-checkbox ${
												completed ? "checked" : ""
											}`}
											onClick={() =>
												handleToggleStatus(task)
											}
											aria-label="Toggle task"
										>
											{completed && (
												<FontAwesomeIcon
													icon={faCheck}
												/>
											)}
										</button>

										<span
											className={`task-name ${
												completed
													? "task-completed"
													: ""
											}`}
										>
											{task.title ||
												task.name ||
												"Untitled Task"}
										</span>

										<div className="task-actions">
											{/* Delete */}
											<button
												onClick={() =>
													handleDelete(task._id)
												}
												aria-label="Delete task"
											>
												<FontAwesomeIcon
													icon={faTrashCan}
													style={{ fontSize: 14 }}
												/>
											</button>

											{/* Edit */}
											<button
												onClick={() =>
													openEditForm(task)
												}
												aria-label="Edit task"
											>
												<FontAwesomeIcon
													icon={faPenToSquare}
													style={{ fontSize: 14 }}
												/>
											</button>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</section>

				{/* Add Button */}
				<button
					className="add-task-button"
					onClick={openAddForm}
					aria-label="Add Task"
				>
					+
				</button>

				{/* Search */}
				{showSearch && (
					<SearchScreen
						tasks={tasks}
						onClose={() => setShowSearch(false)}
						onEdit={openEditForm}
						onDelete={handleDelete}
						onToggle={handleToggleStatus}
					/>
				)}

				{/* Form */}
				{showForm && (
					<TaskForm
						key={editingTask?._id || "new"}
						task={editingTask}
						onSave={handleSave}
						onClose={() => setShowForm(false)}
					/>
				)}
			</main>
		</div>
	);
}

export default App;
