import { useState } from "react";

// Converts a date to datetime-local input format
function toInputValue(date) {
	const d = new Date(date);
	d.setMinutes(d.getMinutes() - d.getTimezoneOffset());

	return d.toISOString().slice(0, 16);
}

function TaskForm({ task, onSave, onClose }) {
	const [title, setTitle] = useState(task?.title || "");
	const [description, setDescription] = useState(task?.description || "");

	const [dateTime, setDateTime] = useState(
		task ? toInputValue(task.dateTime) : "",
	);

	const [priority, setPriority] = useState(task?.priority || "");

	const [error, setError] = useState("");
	const [saving, setSaving] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!title.trim()) {
			setError("Title is required");
			return;
		}

		if (!dateTime) {
			setError("Date and time is required");
			return;
		}

		setSaving(true);

		try {
			await onSave({
				title,
				description,
				dateTime: new Date(dateTime).toISOString(),
				priority,
			});
		} catch (err) {
			setError(err.message);
			setSaving(false);
		}
	};

	return (
		<div className="task-modal-overlay">
			<form
				onSubmit={handleSubmit}
				className="task-modal"
			>
				{/* Header */}
				<div className="task-modal-header">
					<h2>{task ? "Edit Task" : "Add New Task"}</h2>

					<button
						type="button"
						onClick={onClose}
						className="task-close-button"
						aria-label="Close"
					>
						×
					</button>
				</div>

				{/* Task Title */}
				<div className="task-form-group">
					<label>Task title</label>

					<input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="Doing Homework"
					/>
				</div>

				{/* Time */}
				<div className="task-form-group">
					<label>Set Time</label>

					<div className="time-row">
						<button
							type="button"
							className="time-button"
						>
							<span className="clock-icon">◷</span>

							<span>Start</span>
						</button>

						<button
							type="button"
							className="time-button"
						>
							<span className="clock-icon">◷</span>

							<span>Ends</span>
						</button>
					</div>
				</div>

				{/* Date */}
				<div className="task-form-group">
					<label>Set Date</label>

					<div className="date-input-wrapper">
						<input
							type="date"
							value={dateTime ? dateTime.slice(0, 10) : ""}
							onChange={(e) => {
								if (!e.target.value) {
									setDateTime("");
									return;
								}

								const selected = e.target.value;

								const timeValue =
									dateTime && dateTime.length > 10
										? dateTime.slice(11, 16)
										: "09:00";

								setDateTime(`${selected}T${timeValue}`);
							}}
						/>
					</div>
				</div>

				{/* Description */}
				<div className="task-form-group">
					<label>Description</label>

					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Add Description"
					/>
				</div>

				{/* Error */}
				{error && <p className="task-form-error">{error}</p>}

				{/* Submit */}
				<button
					type="submit"
					disabled={saving}
					className="create-task-button"
				>
					{saving
						? "Saving..."
						: task
							? "Update task"
							: "Create task"}
				</button>
			</form>
		</div>
	);
}

export default TaskForm;
