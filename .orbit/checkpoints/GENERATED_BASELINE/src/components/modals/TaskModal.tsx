import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { Task, Status, Priority } from '../../types';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useTaskContext } from '../../context/TaskContext';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  defaultStatus?: Status;
}

const PRIORITIES: Priority[] = ['Low', 'Medium', 'High', 'Urgent'];
const STATUSES: Status[] = ['To Do', 'In Progress', 'Review', 'Done'];

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  task,
  defaultStatus = 'To Do',
}) => {
  const { addTask, updateTask } = useTaskContext();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Status>(defaultStatus);
  const [priority, setPriority] = useState<Priority>('Medium');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<{ title?: string }>({});

  const isEditing = Boolean(task);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setPriority(task.priority);
      setTags([...task.tags]);
    } else {
      setTitle('');
      setDescription('');
      setStatus(defaultStatus);
      setPriority('Medium');
      setTags([]);
    }
    setTagInput('');
    setErrors({});
  }, [task, defaultStatus, isOpen]);

  const handleAddTag = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e && 'key' in e && e.key !== 'Enter') {
      return;
    }
    if (e) {
      e.preventDefault();
    }

    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const validate = (): boolean => {
    const newErrors: { title?: string } = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (isEditing && task) {
      updateTask(task.id, {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        tags,
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        tags,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Task' : 'Create New Task'}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div>
          <label
            htmlFor="task-title"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <Input
            id="task-title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors({});
            }}
            placeholder="Enter task title"
            hasError={Boolean(errors.title)}
            autoFocus
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {errors.title}
            </p>
          )}
        </div>

        {/* Description Input */}
        <div>
          <label
            htmlFor="task-description"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Description
          </label>
          <textarea
            id="task-description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide task details or context..."
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 dark:focus:ring-blue-500/20 dark:focus:border-blue-400 transition-colors resize-y"
          />
        </div>

        {/* Status and Priority selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="task-status"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Status
            </label>
            <select
              id="task-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
              className="w-full h-10 px-3 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors"
            >
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="task-priority"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Priority
            </label>
            <select
              id="task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full h-10 px-3 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors"
            >
              {PRIORITIES.map((pr) => (
                <option key={pr} value={pr}>
                  {pr}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label
            htmlFor="task-tag-input"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Tags
          </label>
          <div className="flex gap-2">
            <Input
              id="task-tag-input"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddTag(e);
                }
              }}
              placeholder="Add a tag and press Enter"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddTag}
              disabled={!tagInput.trim()}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add
            </Button>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-500 dark:hover:text-red-400 focus:outline-none transition-colors"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {isEditing ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskModal;