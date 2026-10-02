import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import TaskCard from "./TaskCard";
import { getWeekStart } from "../utils/weeks";

function WeekCard({ week, onEdit, onDelete, onToggle }) {
	const [isOpen, setIsOpen] = useState(false);

	const isThisWeek = week.key === getWeekStart(new Date()).getTime();
	const total = week.openCount + week.completedCount;
	const progress = Math.round((week.completedCount / total) * 100);

	return (
		<div className="rounded-2xl bg-white p-4 shadow-sm">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="w-full text-left"
			>
				<div className="flex items-center justify-between">
					<div>
						<p className="font-bold">{week.label}</p>
						{isThisWeek && (
							<p className="text-xs font-medium text-brand">
								This week
							</p>
						)}
					</div>
					<FontAwesomeIcon
						icon={faChevronDown}
						className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
						style={{ fontSize: 20 }}
					/>
				</div>

				<div className="mt-3 flex gap-6 text-sm">
					<p>
						<span className="text-lg font-bold">
							{week.openCount}
						</span>{" "}
						<span className="text-gray-500">Open</span>
					</p>
					<p>
						<span className="text-lg font-bold text-brand">
							{week.completedCount}
						</span>{" "}
						<span className="text-gray-500">Completed</span>
					</p>
				</div>

				<div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
					<div
						className="h-full rounded-full bg-brand"
						style={{ width: `${progress}%` }}
					/>
				</div>
			</button>

			{isOpen && (
				<div className="mt-4 space-y-2">
					{week.tasks.map((task) => (
						<TaskCard
							key={task._id}
							task={task}
							onEdit={onEdit}
							onDelete={onDelete}
							onToggle={onToggle}
						/>
					))}
				</div>
			)}
		</div>
	);
}

export default WeekCard;
