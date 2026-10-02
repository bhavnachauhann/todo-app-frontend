import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const priorityColors = {
	High: "bg-red-100 text-red-700",
	Medium: "bg-amber-100 text-amber-700",
	Low: "bg-green-100 text-green-700",
};

const DELETE_WIDTH = 80;

function TaskCard({ task, onEdit, onDelete, onToggle }) {
	const [offset, setOffset] = useState(0);
	const [dragging, setDragging] = useState(false);
	const startX = useRef(0);
	const moved = useRef(false);

	const isCompleted = task.status === "Completed";

	const handlePointerDown = (e) => {
		startX.current = e.clientX - offset;
		moved.current = false;
		setDragging(true);
	};

	const handlePointerMove = (e) => {
		if (!dragging) return;
		const distance = e.clientX - startX.current;
		if (Math.abs(distance - offset) > 5) moved.current = true;
		// only allow swiping to the left
		setOffset(Math.min(0, Math.max(distance, -DELETE_WIDTH)));
	};

	const handlePointerUp = () => {
		setDragging(false);
		setOffset(offset < -DELETE_WIDTH / 2 ? -DELETE_WIDTH : 0);
	};

	const handleClick = () => {
		if (moved.current) return;
		if (offset !== 0) {
			setOffset(0);
		} else {
			onEdit(task);
		}
	};

	const dateText = new Date(task.dateTime).toLocaleString("en-IN", {
		weekday: "short",
		day: "numeric",
		month: "short",
		hour: "numeric",
		minute: "2-digit",
	});

	return (
		<div className="relative overflow-hidden rounded-xl">
			<button
				onClick={() => onDelete(task._id)}
				className="absolute right-0 top-0 h-full bg-red-500 text-sm font-semibold text-white"
				style={{ width: DELETE_WIDTH }}
			>
				Delete
			</button>

			<div
				className="relative flex cursor-pointer touch-pan-y select-none items-start gap-3 rounded-xl border border-gray-100 bg-white p-4"
				style={{
					transform: `translateX(${offset}px)`,
					transition: dragging ? "none" : "transform 0.2s",
				}}
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
				onPointerLeave={() => dragging && handlePointerUp()}
				onClick={handleClick}
			>
				<button
					onClick={(e) => {
						e.stopPropagation();
						onToggle(task);
					}}
					aria-label={
						isCompleted
							? "Mark as in progress"
							: "Mark as completed"
					}
					className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
						isCompleted
							? "border-brand bg-brand text-white"
							: "border-gray-300"
					}`}
				>
					{isCompleted && (
						<FontAwesomeIcon
							icon={faCheck}
							style={{ fontSize: 12 }}
						/>
					)}
				</button>

				<div className="min-w-0 flex-1">
					<p
						className={`font-semibold ${isCompleted ? "text-gray-400 line-through" : ""}`}
					>
						{task.title}
					</p>
					{task.description && (
						<p className="mt-0.5 truncate text-sm text-gray-500">
							{task.description}
						</p>
					)}
					<div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
						<span>{dateText}</span>
						{task.priority && (
							<span
								className={`rounded-full px-2 py-0.5 font-medium ${priorityColors[task.priority]}`}
							>
								{task.priority}
							</span>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default TaskCard;
