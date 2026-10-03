import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useTaskContext } from '../../context/TaskContext';
import { Status, Task } from '../../types';
import { Column } from './Column';
import { TaskCard } from './TaskCard';

export const KanbanBoard: React.FC = () => {
  const { columns, filteredTasks, moveTask, openCreateModal } = useTaskContext();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = filteredTasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    // Check if dragging over a column directly
    const isOverAColumn = columns.some((col) => col.id === overId);
    if (isOverAColumn) {
      const activeTaskItem = filteredTasks.find((t) => t.id === activeId);
      if (activeTaskItem && activeTaskItem.status !== overId) {
        moveTask(activeId, overId as Status);
      }
      return;
    }

    // Check if dragging over another task
    const overTask = filteredTasks.find((t) => t.id === overId);
    const activeTaskItem = filteredTasks.find((t) => t.id === activeId);

    if (activeTaskItem && overTask && activeTaskItem.status !== overTask.status) {
      moveTask(activeId, overTask.status);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const isOverAColumn = columns.some((col) => col.id === overId);
    if (isOverAColumn) {
      moveTask(activeId, overId as Status);
      return;
    }

    const overTask = filteredTasks.find((t) => t.id === overId);
    if (overTask) {
      moveTask(activeId, overTask.status);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start pb-8">
        {columns.map((column) => {
          const columnTasks = filteredTasks.filter((task) => task.status === column.id);
          return (
            <Column
              key={column.id}
              column={column}
              tasks={columnTasks}
              onAddTask={() => openCreateModal(column.id)}
            />
          );
        })}
      </div>

      <DragOverlay dropAnimation={{
        duration: 200,
        easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
      }}>
        {activeTask ? (
          <div className="rotate-2 scale-105 opacity-90 shadow-2xl transition-transform">
            <TaskCard task={activeTask} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;